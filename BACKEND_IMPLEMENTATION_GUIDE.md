# Backend Implementation Guide - Multi-Interviewer Scoring System

## 📋 Overview

This guide provides step-by-step instructions for implementing the multi-interviewer scoring system in the backend. The system allows multiple committee members to independently score candidates during interviews, with automatic calculation of averages and notifications.

---

## 🎯 Implementation Phases

### **Phase 1: Database Schema (Week 1)**
### **Phase 2: Core API Endpoints (Week 2)**
### **Phase 3: Notifications & Emails (Week 3)**
### **Phase 4: Testing & Optimization (Week 4)**

---

# PHASE 1: Database Schema Setup

## Step 1: Create Interview Scores Tables

### 1.1 HR Interview Scores Table

```sql
-- HR Interview Scores (7 criteria, 1-5 scale, max 35 points)
CREATE TABLE interview_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id UUID NOT NULL,
    interviewer_id UUID NOT NULL,

    -- 7 Rating Criteria (1-5 scale)
    appearance_rating INTEGER CHECK (appearance_rating BETWEEN 1 AND 5),
    appearance_comments TEXT,
    communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
    communication_comments TEXT,
    teamwork_rating INTEGER CHECK (teamwork_rating BETWEEN 1 AND 5),
    teamwork_comments TEXT,
    ethics_rating INTEGER CHECK (ethics_rating BETWEEN 1 AND 5),
    ethics_comments TEXT,
    analytical_rating INTEGER CHECK (analytical_rating BETWEEN 1 AND 5),
    analytical_comments TEXT,
    knowledge_rating INTEGER CHECK (knowledge_rating BETWEEN 1 AND 5),
    knowledge_comments TEXT,
    experience_rating INTEGER CHECK (experience_rating BETWEEN 1 AND 5),
    experience_comments TEXT,

    -- Overall Evaluation
    preferred_candidate BOOLEAN DEFAULT FALSE,
    recommendation TEXT NOT NULL,

    -- Calculated Fields (auto-computed on insert/update)
    total_score INTEGER,
    percentage_score DECIMAL(5,2),

    -- Metadata
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUBMITTED')),
    submitted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    -- Constraints
    UNIQUE(interview_id, interviewer_id), -- One score per interviewer per interview
    FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE,
    FOREIGN KEY (interviewer_id) REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX idx_interview_scores_interview ON interview_scores(interview_id);
CREATE INDEX idx_interview_scores_interviewer ON interview_scores(interviewer_id);
CREATE INDEX idx_interview_scores_status ON interview_scores(status);
```

### 1.2 Consultancy Interview Scores Table

```sql
-- Consultancy Interview Scores (10 criteria, 1-5 scale, max 50 points)
CREATE TABLE consultancy_interview_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id UUID NOT NULL,
    interviewer_id UUID NOT NULL,

    -- 10 Evaluation Criteria (1-5 scale each)
    relevant_experience INTEGER CHECK (relevant_experience BETWEEN 1 AND 5),
    project_management INTEGER CHECK (project_management BETWEEN 1 AND 5),
    recent_experience INTEGER CHECK (recent_experience BETWEEN 1 AND 5),
    comparable_projects INTEGER CHECK (comparable_projects BETWEEN 1 AND 5),
    communication_skills INTEGER CHECK (communication_skills BETWEEN 1 AND 5),
    technical_skill INTEGER CHECK (technical_skill BETWEEN 1 AND 5),
    relevant_qualification INTEGER CHECK (relevant_qualification BETWEEN 1 AND 5),
    academic_credentials INTEGER CHECK (academic_credentials BETWEEN 1 AND 5),
    timeline_management INTEGER CHECK (timeline_management BETWEEN 1 AND 5),
    toolset_framework INTEGER CHECK (toolset_framework BETWEEN 1 AND 5),

    -- Calculated Fields
    total_score INTEGER,
    percentage_score DECIMAL(5,2),

    -- Metadata
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUBMITTED')),
    submitted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    -- Constraints
    UNIQUE(interview_id, interviewer_id),
    FOREIGN KEY (interview_id) REFERENCES consultancy_applicant_interviews(id) ON DELETE CASCADE,
    FOREIGN KEY (interviewer_id) REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_consultancy_scores_interview ON consultancy_interview_scores(interview_id);
CREATE INDEX idx_consultancy_scores_interviewer ON consultancy_interview_scores(interviewer_id);
```

### 1.3 Update Existing Interviews Tables

```sql
-- Add new columns to HR interviews table
ALTER TABLE interviews
ADD COLUMN IF NOT EXISTS interview_type VARCHAR(20) DEFAULT 'NON_COMMITTEE'
    CHECK (interview_type IN ('COMMITTEE', 'NON_COMMITTEE')),
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'SCHEDULED'
    CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
ADD COLUMN IF NOT EXISTS location VARCHAR(255),
ADD COLUMN IF NOT EXISTS total_interviewers INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS completed_evaluations INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pending_evaluations INTEGER DEFAULT 1;

-- Add computed column for completion percentage
ALTER TABLE interviews
ADD COLUMN IF NOT EXISTS evaluation_completion_percentage DECIMAL(5,2)
GENERATED ALWAYS AS (
    CASE WHEN total_interviewers > 0
    THEN (completed_evaluations::DECIMAL / total_interviewers) * 100
    ELSE 0 END
) STORED;

-- Add same columns to consultancy interviews table
ALTER TABLE consultancy_applicant_interviews
ADD COLUMN IF NOT EXISTS interview_type VARCHAR(20) DEFAULT 'NON_COMMITTEE',
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'SCHEDULED',
ADD COLUMN IF NOT EXISTS location VARCHAR(255),
ADD COLUMN IF NOT EXISTS total_interviewers INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS completed_evaluations INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS pending_evaluations INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS evaluation_completion_percentage DECIMAL(5,2);
```

---

# PHASE 2: Core API Endpoints

## Step 2: Implement Score Calculation Triggers

### 2.1 Auto-Calculate Total Score (PostgreSQL Function)

```sql
-- Function to calculate HR interview score
CREATE OR REPLACE FUNCTION calculate_hr_interview_score()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate total (sum of 7 ratings, max 35)
    NEW.total_score := COALESCE(NEW.appearance_rating, 0) +
                       COALESCE(NEW.communication_rating, 0) +
                       COALESCE(NEW.teamwork_rating, 0) +
                       COALESCE(NEW.ethics_rating, 0) +
                       COALESCE(NEW.analytical_rating, 0) +
                       COALESCE(NEW.knowledge_rating, 0) +
                       COALESCE(NEW.experience_rating, 0);

    -- Calculate percentage
    NEW.percentage_score := (NEW.total_score::DECIMAL / 35) * 100;

    -- Set submitted_at if status changed to SUBMITTED
    IF NEW.status = 'SUBMITTED' AND OLD.status = 'PENDING' THEN
        NEW.submitted_at := NOW();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger
CREATE TRIGGER trg_calculate_hr_score
BEFORE INSERT OR UPDATE ON interview_scores
FOR EACH ROW
EXECUTE FUNCTION calculate_hr_interview_score();

-- Similar function for consultancy (10 criteria, max 50)
CREATE OR REPLACE FUNCTION calculate_consultancy_interview_score()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_score := COALESCE(NEW.relevant_experience, 0) +
                       COALESCE(NEW.project_management, 0) +
                       COALESCE(NEW.recent_experience, 0) +
                       COALESCE(NEW.comparable_projects, 0) +
                       COALESCE(NEW.communication_skills, 0) +
                       COALESCE(NEW.technical_skill, 0) +
                       COALESCE(NEW.relevant_qualification, 0) +
                       COALESCE(NEW.academic_credentials, 0) +
                       COALESCE(NEW.timeline_management, 0) +
                       COALESCE(NEW.toolset_framework, 0);

    NEW.percentage_score := (NEW.total_score::DECIMAL / 50) * 100;

    IF NEW.status = 'SUBMITTED' AND OLD.status = 'PENDING' THEN
        NEW.submitted_at := NOW();
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_consultancy_score
BEFORE INSERT OR UPDATE ON consultancy_interview_scores
FOR EACH ROW
EXECUTE FUNCTION calculate_consultancy_interview_score();
```

### 2.2 Update Interview Completion Trigger

```sql
-- Function to update interview completion status
CREATE OR REPLACE FUNCTION update_interview_completion()
RETURNS TRIGGER AS $$
BEGIN
    -- Count completed and pending evaluations
    UPDATE interviews
    SET completed_evaluations = (
        SELECT COUNT(*) FROM interview_scores
        WHERE interview_id = NEW.interview_id AND status = 'SUBMITTED'
    ),
    pending_evaluations = (
        SELECT COUNT(*) FROM interview_scores
        WHERE interview_id = NEW.interview_id AND status = 'PENDING'
    )
    WHERE id = NEW.interview_id;

    -- Update interview status if all completed
    UPDATE interviews
    SET status = 'COMPLETED'
    WHERE id = NEW.interview_id
      AND completed_evaluations = total_interviewers
      AND status != 'COMPLETED';

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_completion
AFTER INSERT OR UPDATE ON interview_scores
FOR EACH ROW
EXECUTE FUNCTION update_interview_completion();

-- Similar trigger for consultancy
CREATE TRIGGER trg_update_consultancy_completion
AFTER INSERT OR UPDATE ON consultancy_interview_scores
FOR EACH ROW
EXECUTE FUNCTION update_interview_completion(); -- Reuse same function
```

---

## Step 3: API Endpoint Implementation (Django/Python Example)

### 3.1 Submit Interview Score

```python
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import transaction

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_interview_score(request, interview_id):
    """
    Submit or update interview score for current user
    POST /api/v1/hr/jobs/interviews/{interview_id}/scores/
    """
    user = request.user
    data = request.data

    try:
        with transaction.atomic():
            # Get or create score record
            score, created = InterviewScore.objects.get_or_create(
                interview_id=interview_id,
                interviewer_id=user.id,
                defaults={
                    'status': 'PENDING'
                }
            )

            # Update all fields
            score.appearance_rating = data.get('appearance_rating')
            score.appearance_comments = data.get('appearance_comments', '')
            score.communication_rating = data.get('communication_rating')
            score.communication_comments = data.get('communication_comments', '')
            score.teamwork_rating = data.get('teamwork_rating')
            score.teamwork_comments = data.get('teamwork_comments', '')
            score.ethics_rating = data.get('ethics_rating')
            score.ethics_comments = data.get('ethics_comments', '')
            score.analytical_rating = data.get('analytical_rating')
            score.analytical_comments = data.get('analytical_comments', '')
            score.knowledge_rating = data.get('knowledge_rating')
            score.knowledge_comments = data.get('knowledge_comments', '')
            score.experience_rating = data.get('experience_rating')
            score.experience_comments = data.get('experience_comments', '')
            score.preferred_candidate = data.get('preferred_candidate', False)
            score.recommendation = data.get('recommendation', '')
            score.status = 'SUBMITTED'

            # Save (triggers will calculate total_score and percentage_score)
            score.save()

            # Get interview to check completion
            interview = Interview.objects.get(id=interview_id)

            # If all interviewers completed, notify creator
            if interview.completed_evaluations == interview.total_interviewers:
                send_completion_notification(interview)

            return Response({
                'status': 'success',
                'message': 'Score submitted successfully',
                'data': {
                    'id': str(score.id),
                    'interview_id': str(score.interview_id),
                    'interviewer_id': str(score.interviewer_id),
                    'total_score': score.total_score,
                    'percentage_score': float(score.percentage_score),
                    'status': score.status,
                    'submitted_at': score.submitted_at.isoformat() if score.submitted_at else None
                }
            }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)
```

### 3.2 Get All Scores for Interview

```python
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_interview_scores(request, interview_id):
    """
    Get all scores for an interview
    GET /api/v1/hr/jobs/interviews/{interview_id}/scores/
    """
    scores = InterviewScore.objects.filter(
        interview_id=interview_id
    ).select_related('interviewer')

    scores_data = []
    for score in scores:
        scores_data.append({
            'id': str(score.id),
            'interview_id': str(score.interview_id),
            'interviewer_id': str(score.interviewer_id),
            'interviewer_name': score.interviewer.get_full_name(),
            'interviewer_email': score.interviewer.email,
            'appearance_rating': score.appearance_rating,
            'appearance_comments': score.appearance_comments,
            'communication_rating': score.communication_rating,
            'communication_comments': score.communication_comments,
            'teamwork_rating': score.teamwork_rating,
            'teamwork_comments': score.teamwork_comments,
            'ethics_rating': score.ethics_rating,
            'ethics_comments': score.ethics_comments,
            'analytical_rating': score.analytical_rating,
            'analytical_comments': score.analytical_comments,
            'knowledge_rating': score.knowledge_rating,
            'knowledge_comments': score.knowledge_comments,
            'experience_rating': score.experience_rating,
            'experience_comments': score.experience_comments,
            'preferred_candidate': score.preferred_candidate,
            'recommendation': score.recommendation,
            'total_score': score.total_score,
            'percentage_score': float(score.percentage_score) if score.percentage_score else None,
            'status': score.status,
            'submitted_at': score.submitted_at.isoformat() if score.submitted_at else None
        })

    return Response({
        'status': 'success',
        'data': scores_data
    })
```

### 3.3 Get My Pending Interviews

```python
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_pending_interviews(request):
    """
    Get interviews where current user is an interviewer and hasn't submitted score
    GET /api/v1/hr/jobs/interviews/my-pending/
    """
    user = request.user

    # Find interviews where user is interviewer and score is PENDING
    pending_scores = InterviewScore.objects.filter(
        interviewer_id=user.id,
        status='PENDING'
    ).select_related('interview', 'interview__application')

    interviews_data = []
    for score in pending_scores:
        interview = score.interview
        application = interview.application

        interviews_data.append({
            'id': str(interview.id),
            'application': str(application.id),
            'application_details': {
                'id': str(application.id),
                'applicant_name': application.applicant_name,
                'position': application.position_applied,
                'email': application.applicant_email
            },
            'interview_type': interview.interview_type,
            'start_date': interview.start_date.isoformat(),
            'end_date': interview.end_date.isoformat(),
            'location': interview.location,
            'status': interview.status,
            'total_interviewers': interview.total_interviewers,
            'completed_evaluations': interview.completed_evaluations,
            'pending_evaluations': interview.pending_evaluations,
            'evaluation_completion_percentage': float(interview.evaluation_completion_percentage)
        })

    return Response({
        'status': 'success',
        'data': interviews_data
    })
```

### 3.4 Get My Score for Interview

```python
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_interview_score(request, interview_id):
    """
    Get current user's score for a specific interview
    GET /api/v1/hr/jobs/interviews/{interview_id}/my-score/
    """
    user = request.user

    try:
        score = InterviewScore.objects.get(
            interview_id=interview_id,
            interviewer_id=user.id
        )

        return Response({
            'status': 'success',
            'data': {
                'id': str(score.id),
                'interview_id': str(score.interview_id),
                # ... all score fields
                'status': score.status,
                'submitted_at': score.submitted_at.isoformat() if score.submitted_at else None
            }
        })
    except InterviewScore.DoesNotExist:
        return Response({
            'status': 'success',
            'message': 'No score yet',
            'data': None
        }, status=status.HTTP_404_NOT_FOUND)
```

### 3.5 Get Interview Summary (Averages)

```python
from django.db.models import Avg, Count

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_interview_summary(request, interview_id):
    """
    Get interview statistics with average scores
    GET /api/v1/hr/jobs/interviews/{interview_id}/summary/
    """
    interview = Interview.objects.get(id=interview_id)

    # Calculate averages from submitted scores only
    scores_stats = InterviewScore.objects.filter(
        interview_id=interview_id,
        status='SUBMITTED'
    ).aggregate(
        avg_appearance=Avg('appearance_rating'),
        avg_communication=Avg('communication_rating'),
        avg_teamwork=Avg('teamwork_rating'),
        avg_ethics=Avg('ethics_rating'),
        avg_analytical=Avg('analytical_rating'),
        avg_knowledge=Avg('knowledge_rating'),
        avg_experience=Avg('experience_rating'),
        avg_total=Avg('total_score'),
        avg_percentage=Avg('percentage_score')
    )

    return Response({
        'status': 'success',
        'data': {
            'total_interviewers': interview.total_interviewers,
            'completed_evaluations': interview.completed_evaluations,
            'pending_evaluations': interview.pending_evaluations,
            'completion_percentage': float(interview.evaluation_completion_percentage),
            'average_scores': {
                'appearance': round(scores_stats['avg_appearance'] or 0, 2),
                'communication': round(scores_stats['avg_communication'] or 0, 2),
                'teamwork': round(scores_stats['avg_teamwork'] or 0, 2),
                'ethics': round(scores_stats['avg_ethics'] or 0, 2),
                'analytical': round(scores_stats['avg_analytical'] or 0, 2),
                'knowledge': round(scores_stats['avg_knowledge'] or 0, 2),
                'experience': round(scores_stats['avg_experience'] or 0, 2),
                'total': round(scores_stats['avg_total'] or 0, 2),
                'percentage': round(scores_stats['avg_percentage'] or 0, 2)
            }
        }
    })
```

---

# PHASE 3: Notifications & Email System

## Step 4: Implement Notifications

### 4.1 Send Interview Assignment Notifications

```python
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from icalendar import Calendar, Event
from datetime import datetime

def create_interview_with_notifications(data):
    """
    Create interview and send notifications to all interviewers
    """
    with transaction.atomic():
        # 1. Create interview
        interview = Interview.objects.create(
            application_id=data['application'],
            interview_type=data['interview_type'],
            start_date=data['start_date'],
            end_date=data['end_date'],
            location=data.get('location', ''),
            total_interviewers=len(data['interviewers']),
            pending_evaluations=len(data['interviewers'])
        )

        # 2. Create score records for each interviewer
        for interviewer_id in data['interviewers']:
            InterviewScore.objects.create(
                interview_id=interview.id,
                interviewer_id=interviewer_id,
                status='PENDING'
            )

        # 3. Send notifications to each interviewer
        application = interview.application
        for interviewer_id in data['interviewers']:
            interviewer = User.objects.get(id=interviewer_id)

            # Create in-app notification
            Notification.objects.create(
                user=interviewer,
                module_type='INTERVIEW',
                title='New Interview Assignment',
                message=f'You have been assigned to interview {application.applicant_name} for {application.position_applied}',
                action_url=f'/dashboard/hr/interviews/{interview.id}/score',
                priority='high'
            )

            # Send email with calendar invite
            send_interview_email(interviewer, interview, application)

        return interview

def send_interview_email(interviewer, interview, application):
    """
    Send email with calendar invite to interviewer
    """
    # Email content
    subject = f'Interview Assignment - {application.applicant_name} - {application.position_applied}'

    context = {
        'interviewer_name': interviewer.get_full_name(),
        'candidate_name': application.applicant_name,
        'position': application.position_applied,
        'interview_date': interview.start_date.strftime('%B %d, %Y'),
        'interview_time': interview.start_date.strftime('%I:%M %p'),
        'location': interview.location,
        'interview_type': 'Committee Interview' if interview.interview_type == 'COMMITTEE' else 'Individual Interview',
        'scoring_link': f'https://ahni-erp.com/dashboard/hr/interviews/{interview.id}/score'
    }

    # HTML email template
    html_content = render_to_string('emails/interview_assignment.html', context)
    text_content = render_to_string('emails/interview_assignment.txt', context)

    # Create calendar invite (.ics)
    cal = Calendar()
    event = Event()
    event.add('summary', f'Interview - {application.applicant_name}')
    event.add('dtstart', interview.start_date)
    event.add('dtend', interview.end_date)
    event.add('location', interview.location)
    event.add('description', f'Interview for {application.position_applied} position')
    cal.add_component(event)

    # Send email
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email='noreply@ahni.org',
        to=[interviewer.email]
    )
    email.attach_alternative(html_content, "text/html")
    email.attach('interview.ics', cal.to_ical(), 'text/calendar')
    email.send()
```

### 4.2 Email Templates

Create file: `templates/emails/interview_assignment.html`

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; border-radius: 8px; margin: 20px 0; }
        .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none;
                  border-radius: 6px; display: inline-block; margin: 20px 0; }
        .details { background: white; padding: 15px; border-left: 4px solid #2563eb; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Interview Assignment</h1>
        </div>

        <div class="content">
            <p>Dear {{ interviewer_name }},</p>

            <p>You have been assigned to participate in a {{ interview_type }} for the following candidate:</p>

            <div class="details">
                <strong>Candidate:</strong> {{ candidate_name }}<br>
                <strong>Position:</strong> {{ position }}<br>
                <strong>Date:</strong> {{ interview_date }}<br>
                <strong>Time:</strong> {{ interview_time }}<br>
                <strong>Location:</strong> {{ location }}
            </div>

            <p>Please prepare for the interview and complete your evaluation form after conducting the interview.</p>

            <p style="text-align: center;">
                <a href="{{ scoring_link }}" class="button">Submit Your Evaluation</a>
            </p>

            <p>A calendar invite has been attached to this email for your convenience.</p>

            <p>If you have any questions, please contact the HR department.</p>

            <p>Best regards,<br>
            AHNI HR Team</p>
        </div>
    </div>
</body>
</html>
```

---

# PHASE 4: URL Configuration

## Step 5: Register API Routes

### Django URLs Example

```python
# urls.py
from django.urls import path
from . import views

urlpatterns = [
    # HR Interview Endpoints
    path('hr/jobs/interviews/', views.create_interview, name='create-interview'),
    path('hr/jobs/interviews/<uuid:interview_id>/scores/', views.submit_interview_score, name='submit-score'),
    path('hr/jobs/interviews/<uuid:interview_id>/scores/', views.get_interview_scores, name='get-scores'),
    path('hr/jobs/interviews/my-pending/', views.get_my_pending_interviews, name='my-pending'),
    path('hr/jobs/interviews/<uuid:interview_id>/my-score/', views.get_my_interview_score, name='my-score'),
    path('hr/jobs/interviews/<uuid:interview_id>/summary/', views.get_interview_summary, name='interview-summary'),

    # Consultancy Interview Endpoints (similar structure)
    path('contract-grants/consultancy/interviews/<uuid:interview_id>/scores/', views.submit_consultancy_score),
    path('contract-grants/consultancy/interviews/<uuid:interview_id>/scores/', views.get_consultancy_scores),
    path('contract-grants/consultancy/interviews/my-pending/', views.get_my_pending_consultancy),
    path('contract-grants/consultancy/interviews/<uuid:interview_id>/my-score/', views.get_my_consultancy_score),
    path('contract-grants/consultancy/interviews/<uuid:interview_id>/summary/', views.get_consultancy_summary),
]
```

---

# Testing Checklist

## ✅ Database Testing
- [ ] Verify interview_scores table created successfully
- [ ] Verify consultancy_interview_scores table created
- [ ] Test UNIQUE constraint (interview_id + interviewer_id)
- [ ] Test CHECK constraints on ratings (1-5 range)
- [ ] Test auto-calculation triggers for total_score
- [ ] Test auto-update of completion percentages

## ✅ API Testing
- [ ] Test submit score (create new)
- [ ] Test submit score (update existing)
- [ ] Test get all scores for interview
- [ ] Test get my pending interviews
- [ ] Test get my score for specific interview
- [ ] Test get interview summary with averages
- [ ] Test permission checks (only assigned interviewers can score)

## ✅ Notification Testing
- [ ] Test in-app notification creation
- [ ] Test email sending
- [ ] Test calendar invite attachment
- [ ] Test notification when all evaluations complete

## ✅ Edge Cases
- [ ] Test with single interviewer (NON_COMMITTEE)
- [ ] Test with multiple interviewers (COMMITTEE)
- [ ] Test partial completion (some submitted, some pending)
- [ ] Test re-submission (updating PENDING score)
- [ ] Test cannot update SUBMITTED score

---

# Performance Optimization

## Indexing Strategy
```sql
-- Already added, but verify they exist
CREATE INDEX IF NOT EXISTS idx_scores_interview_status ON interview_scores(interview_id, status);
CREATE INDEX IF NOT EXISTS idx_scores_interviewer_status ON interview_scores(interviewer_id, status);
```

## Query Optimization
- Use `select_related()` for foreign keys (interviewer, interview)
- Use `prefetch_related()` for reverse relationships
- Cache average calculations for large datasets
- Add database-level caching for frequently accessed summaries

---

# Security Considerations

## Authorization Checks
```python
# Ensure user can only access their own scores
def check_interviewer_permission(user, interview_id):
    return InterviewScore.objects.filter(
        interview_id=interview_id,
        interviewer_id=user.id
    ).exists()

# Use in views
if not check_interviewer_permission(request.user, interview_id):
    return Response({'error': 'Unauthorized'}, status=403)
```

## Data Validation
- Validate rating values (1-5 or 1-4 depending on module)
- Validate required fields (all ratings + comments)
- Prevent score modification after SUBMITTED status
- Validate interviewer is assigned to the interview

---

# Deployment Checklist

- [ ] Run database migrations
- [ ] Test triggers are working
- [ ] Verify email configuration (SMTP settings)
- [ ] Test calendar invite generation
- [ ] Set up monitoring for email delivery
- [ ] Add logging for notification failures
- [ ] Create backup strategy for scores data
- [ ] Document API endpoints for frontend team
- [ ] Set up error alerting for failed notifications

---

# Support & Documentation

For questions or issues during implementation:
1. Refer to `MULTI_INTERVIEWER_BACKEND_API_SPEC.md` for detailed API specs
2. Check frontend implementation in `/src/features/hr/components/interview/`
3. Review database schema comments
4. Contact frontend team for clarification on data structures

**Estimated Implementation Time:** 3-4 weeks (1 week per phase)
