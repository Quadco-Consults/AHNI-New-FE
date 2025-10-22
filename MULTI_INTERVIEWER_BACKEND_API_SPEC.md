# Multi-Interviewer Scoring System - Backend API Specification

## Overview
This document specifies the backend API requirements for implementing a multi-interviewer scoring system with notifications and email functionality across all interview modules (HR Recruitment, Consultancy, AdHoc Staff).

## Database Schema Changes

### 1. Interview Scores Table
```sql
CREATE TABLE interview_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id UUID REFERENCES interviews(id) ON DELETE CASCADE,
    interviewer_id UUID REFERENCES users(id),

    -- Rating Scores (1-5 scale for HR, 1-4 for Consultancy)
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
    recommendation TEXT,
    total_score INTEGER, -- Calculated: sum of all ratings
    percentage_score DECIMAL(5,2), -- Calculated: (total_score / max_possible) * 100

    -- Metadata
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUBMITTED')),
    submitted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(interview_id, interviewer_id) -- One score per interviewer per interview
);

CREATE INDEX idx_interview_scores_interview ON interview_scores(interview_id);
CREATE INDEX idx_interview_scores_interviewer ON interview_scores(interviewer_id);
CREATE INDEX idx_interview_scores_status ON interview_scores(status);
```

### 2. Update Interviews Table
```sql
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS interview_type VARCHAR(20) DEFAULT 'NON_COMMITTEE' CHECK (interview_type IN ('COMMITTEE', 'NON_COMMITTEE'));
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'));
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS total_interviewers INTEGER DEFAULT 1;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS completed_evaluations INTEGER DEFAULT 0;
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS pending_evaluations INTEGER DEFAULT 1;

-- Add computed column for completion percentage
ALTER TABLE interviews ADD COLUMN IF NOT EXISTS evaluation_completion_percentage DECIMAL(5,2)
    GENERATED ALWAYS AS (
        CASE WHEN total_interviewers > 0
        THEN (completed_evaluations::DECIMAL / total_interviewers) * 100
        ELSE 0 END
    ) STORED;
```

### 3. Consultancy Interview Scores Table
```sql
CREATE TABLE consultancy_interview_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id UUID REFERENCES consultancy_applicant_interviews(id) ON DELETE CASCADE,
    interviewer_id UUID REFERENCES users(id),

    -- 10 Evaluation Criteria (1-4 scale, max 50 points)
    similar_work_experience INTEGER CHECK (similar_work_experience BETWEEN 1 AND 4),
    project_management_knowledge INTEGER CHECK (project_management_knowledge BETWEEN 1 AND 4),
    recent_experience INTEGER CHECK (recent_experience BETWEEN 1 AND 4),
    comparable_project_experience INTEGER CHECK (comparable_project_experience BETWEEN 1 AND 4),
    communication_skills INTEGER CHECK (communication_skills BETWEEN 1 AND 4),
    technical_skill INTEGER CHECK (technical_skill BETWEEN 1 AND 4),
    relevant_qualifications INTEGER CHECK (relevant_qualifications BETWEEN 1 AND 4),
    academic_credentials INTEGER CHECK (academic_credentials BETWEEN 1 AND 4),
    timeline_management INTEGER CHECK (timeline_management BETWEEN 1 AND 4),
    toolset_framework INTEGER CHECK (toolset_framework BETWEEN 1 AND 4),

    -- Calculated fields
    total_score INTEGER, -- Sum of all 10 criteria (max 50)
    percentage_score DECIMAL(5,2), -- (total_score / 50) * 100

    -- Metadata
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUBMITTED')),
    submitted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(interview_id, interviewer_id)
);

CREATE INDEX idx_consultancy_scores_interview ON consultancy_interview_scores(interview_id);
CREATE INDEX idx_consultancy_scores_interviewer ON consultancy_interview_scores(interviewer_id);
```

## API Endpoints

### 1. HR Recruitment Interviews

#### 1.1 Create Interview with Notifications
```
POST /api/v1/hr/jobs/interviews/

Request Body:
{
  "application": "uuid",
  "interview_type": "COMMITTEE" | "NON_COMMITTEE",
  "interviewers": ["user_id_1", "user_id_2", "user_id_3"],
  "start_date": "2025-10-21T10:00:00Z",
  "end_date": "2025-10-21T11:00:00Z",
  "location": "Conference Room A"
}

Backend Actions:
1. Create interview record
2. Create interview_scores records with status='PENDING' for each interviewer
3. For EACH interviewer:
   a. Create notification:
      - module_type: "INTERVIEW"
      - title: "New Interview Assignment"
      - message: "You have been assigned to interview {candidate_name} for {position} on {date}"
      - action_url: "/dashboard/hr/interviews/{interview_id}/score"
      - priority: "high"
   b. Send email with:
      - Subject: "Interview Assignment - {Candidate Name} - {Position}"
      - Body: Professional email template with interview details
      - CTA button: Link to scoring form
   c. Attach calendar invite (.ics file):
      - Event: Interview - {Candidate Name}
      - Time: {start_date} to {end_date}
      - Location: {location}
      - Attendees: All committee members
4. Return success response

Response:
{
  "status": "success",
  "message": "Interview created and notifications sent",
  "data": {
    "id": "interview_uuid",
    "application": "app_uuid",
    "interview_type": "COMMITTEE",
    "interviewers": [...],
    "total_interviewers": 3,
    "completed_evaluations": 0,
    "pending_evaluations": 3,
    "notifications_sent": 3,
    "emails_sent": 3
  }
}
```

#### 1.2 Submit Interview Score
```
POST /api/v1/hr/jobs/interviews/{interview_id}/scores/

Request Body:
{
  "appearance_rating": 4,
  "appearance_comments": "Professional appearance",
  "communication_rating": 5,
  "communication_comments": "Excellent communication skills",
  // ... all other ratings and comments
  "preferred_candidate": true,
  "recommendation": "Highly recommended for the position"
}

Backend Actions:
1. Get current user ID
2. Find existing score record (interview_id + interviewer_id)
3. If exists: Update, else: Create new
4. Calculate total_score = sum of all ratings
5. Calculate percentage_score = (total_score / 35) * 100
6. Set status = 'SUBMITTED'
7. Set submitted_at = NOW()
8. Update interview.completed_evaluations += 1
9. Update interview.pending_evaluations -= 1
10. If all interviewers completed:
    a. Calculate average scores across all interviewers
    b. Update interview status = 'COMPLETED'
    c. Notify interview creator: "All evaluations completed for {candidate_name}"
11. Return score with calculated fields

Response:
{
  "status": "success",
  "message": "Score submitted successfully",
  "data": {
    "id": "score_uuid",
    "interview_id": "interview_uuid",
    "interviewer_id": "user_uuid",
    "total_score": 32,
    "percentage_score": 91.43,
    "status": "SUBMITTED",
    "submitted_at": "2025-10-21T14:30:00Z"
  }
}
```

#### 1.3 Get All Scores for an Interview
```
GET /api/v1/hr/jobs/interviews/{interview_id}/scores/

Response:
{
  "status": "success",
  "data": [
    {
      "id": "score_uuid_1",
      "interviewer_id": "user_uuid_1",
      "interviewer_name": "John Doe",
      "interviewer_email": "john@ahni.org",
      "appearance_rating": 4,
      "appearance_comments": "...",
      // ... all ratings
      "total_score": 32,
      "percentage_score": 91.43,
      "status": "SUBMITTED",
      "submitted_at": "2025-10-21T14:30:00Z"
    },
    {
      "id": "score_uuid_2",
      "interviewer_id": "user_uuid_2",
      "interviewer_name": "Jane Smith",
      "interviewer_email": "jane@ahni.org",
      "status": "PENDING", // Not yet submitted
      "submitted_at": null
    }
  ]
}
```

#### 1.4 Get My Pending Interviews
```
GET /api/v1/hr/jobs/interviews/my-pending/

Backend Logic:
1. Get current user ID
2. Find all interviews where:
   - User is in interviewers array
   - interview_scores.status = 'PENDING' for this user
   - interview.start_date >= NOW() - 7 days (show recent + upcoming)
3. Return with application and candidate details

Response:
{
  "status": "success",
  "data": [
    {
      "id": "interview_uuid",
      "application_details": {
        "id": "app_uuid",
        "applicant_name": "Candidate Name",
        "position": "Software Engineer",
        "email": "candidate@email.com"
      },
      "interview_type": "COMMITTEE",
      "start_date": "2025-10-21T10:00:00Z",
      "end_date": "2025-10-21T11:00:00Z",
      "location": "Conference Room A",
      "total_interviewers": 3,
      "completed_evaluations": 1,
      "pending_evaluations": 2,
      "my_score_status": "PENDING"
    }
  ]
}
```

#### 1.5 Get My Score for an Interview
```
GET /api/v1/hr/jobs/interviews/{interview_id}/my-score/

Backend Logic:
1. Get current user ID
2. Find score where interview_id AND interviewer_id = current_user
3. Return score if exists, 404 if not

Response (if exists):
{
  "status": "success",
  "data": {
    "id": "score_uuid",
    "interview_id": "interview_uuid",
    "appearance_rating": 4,
    // ... all fields
    "status": "SUBMITTED"
  }
}

Response (if not found):
{
  "status": "error",
  "message": "Score not found",
  "code": 404
}
```

#### 1.6 Get Interview Summary/Statistics
```
GET /api/v1/hr/jobs/interviews/{interview_id}/summary/

Backend Logic:
1. Get interview details
2. Get all scores for this interview
3. Calculate averages for each criteria
4. Return summary

Response:
{
  "status": "success",
  "data": {
    "interview_id": "interview_uuid",
    "total_interviewers": 3,
    "completed_evaluations": 2,
    "pending_evaluations": 1,
    "completion_percentage": 66.67,
    "average_scores": {
      "appearance": 4.5,
      "communication": 4.0,
      "teamwork": 3.5,
      "ethics": 4.5,
      "analytical": 4.0,
      "knowledge": 3.5,
      "experience": 4.0,
      "total": 28.0,
      "percentage": 80.0
    },
    "individual_scores": [
      {
        "interviewer_name": "John Doe",
        "total_score": 32,
        "percentage": 91.43,
        "status": "SUBMITTED"
      },
      {
        "interviewer_name": "Jane Smith",
        "total_score": 24,
        "percentage": 68.57,
        "status": "SUBMITTED"
      },
      {
        "interviewer_name": "Bob Wilson",
        "status": "PENDING"
      }
    ]
  }
}
```

### 2. Consultancy/AdHoc Interviews

#### 2.1 Create Consultancy Interview
```
POST /api/v1/contract-grants/consultancy/applicant-interviews/bulk-create/

Request Body:
{
  "applicant": "uuid",
  "interview_type": "COMMITTEE",
  "interviewers": ["user_id_1", "user_id_2"],
  "interview_date": "2025-10-21",
  "location": "Virtual Meeting"
}

Backend Actions: (Same as HR interviews)
1. Create interview
2. Create score records for each interviewer
3. Send notifications
4. Send emails
5. Send calendar invites
```

#### 2.2 Submit Consultancy Interview Score
```
POST /api/v1/contract-grants/consultancy/applicants/{applicant_id}/interviews/

Request Body:
{
  "similar_work_experience": 4,
  "project_management_knowledge": 3,
  "recent_experience": 4,
  // ... all 10 criteria
}

Backend Actions:
1. Calculate total_score (sum of 10 criteria, max 50)
2. Calculate percentage
3. Save score
4. Update completion tracking
5. If all complete: Calculate average and notify
```

## Email Templates

### Interview Assignment Email
```html
Subject: Interview Assignment - [Candidate Name] - [Position]

Dear [Interviewer Name],

You have been assigned as an interviewer for the following candidate:

Candidate: [Candidate Name]
Position: [Position Title]
Interview Date: [Date and Time]
Location: [Location/Meeting Link]

Interview Committee:
- [Interviewer 1]
- [Interviewer 2]
- [Interviewer 3]

Please review the candidate's application and submit your evaluation after the interview.

[Button: View Application] [Button: Submit Evaluation]

A calendar invitation has been attached to this email.

Best regards,
AHNI HR System

---
This is an automated message from the AHNI ERP System.
```

### All Evaluations Complete Email (to Interview Creator)
```html
Subject: Interview Completed - [Candidate Name]

Dear [Creator Name],

All committee members have completed their evaluations for:

Candidate: [Candidate Name]
Position: [Position Title]
Interview Date: [Date]

Summary:
- Total Evaluators: [Number]
- Average Score: [Score]/35 ([Percentage]%)
- Preferred by: [Number] evaluator(s)

[Button: View Full Results]

Best regards,
AHNI HR System
```

## Notification Examples

### Interview Assignment Notification
```json
{
  "user": "interviewer_user_id",
  "module_type": "INTERVIEW",
  "title": "New Interview Assignment",
  "message": "You have been assigned to interview Jane Doe for Software Engineer position on Oct 21, 2025 at 10:00 AM",
  "priority": "high",
  "category": "info",
  "action_url": "/dashboard/hr/interviews/uuid/score",
  "metadata": {
    "interview_id": "uuid",
    "candidate_name": "Jane Doe",
    "position": "Software Engineer",
    "interview_date": "2025-10-21T10:00:00Z"
  }
}
```

### Interview Reminder Notification (24 hours before)
```json
{
  "user": "interviewer_user_id",
  "module_type": "INTERVIEW",
  "title": "Interview Reminder",
  "message": "Reminder: You have an interview with Jane Doe tomorrow at 10:00 AM",
  "priority": "medium",
  "category": "warning",
  "action_url": "/dashboard/hr/interviews/uuid/score"
}
```

### Evaluation Completed Notification (to creator)
```json
{
  "user": "creator_user_id",
  "module_type": "INTERVIEW",
  "title": "Interview Evaluations Complete",
  "message": "All committee members have completed evaluations for Jane Doe. Average score: 85%",
  "priority": "medium",
  "category": "success",
  "action_url": "/dashboard/hr/interviews/uuid/results"
}
```

## Implementation Priority

### Phase 1: Database & Core API (Week 1)
- [ ] Create database tables and indexes
- [ ] Implement POST /interviews/ with notification logic
- [ ] Implement POST /interviews/{id}/scores/
- [ ] Implement GET /interviews/{id}/scores/
- [ ] Implement GET /interviews/my-pending/

### Phase 2: Notifications & Emails (Week 2)
- [ ] Set up email service integration
- [ ] Create email templates
- [ ] Implement notification creation logic
- [ ] Implement calendar invite generation (.ics files)
- [ ] Test email delivery

### Phase 3: Advanced Features (Week 3)
- [ ] Implement GET /interviews/{id}/summary/
- [ ] Add automatic reminders (24hrs before)
- [ ] Add automatic completion notifications
- [ ] Implement score update/edit functionality
- [ ] Add bulk operations support

### Phase 4: Consultancy Integration (Week 4)
- [ ] Apply same logic to consultancy interviews
- [ ] Apply same logic to adhoc staff interviews
- [ ] Cross-module testing
- [ ] Performance optimization

## Testing Checklist

### Unit Tests
- [ ] Score calculation accuracy
- [ ] Average calculation with different committee sizes
- [ ] Notification creation logic
- [ ] Email template rendering

### Integration Tests
- [ ] Interview creation → Notifications sent
- [ ] Score submission → Completion tracking
- [ ] All scores complete → Average calculation
- [ ] Email delivery confirmation

### E2E Tests
- [ ] Create committee interview
- [ ] Verify all members receive notifications
- [ ] Verify all members receive emails
- [ ] Submit scores from multiple members
- [ ] Verify average calculation
- [ ] Verify completion notification

## Performance Considerations

1. **Batch Operations**: When creating interviews with large committees, batch notification/email creation
2. **Async Processing**: Send emails asynchronously using background jobs (Celery/RQ)
3. **Caching**: Cache interview summaries to avoid recalculation
4. **Indexes**: Ensure proper database indexes for quick lookups
5. **Rate Limiting**: Implement rate limiting on notification endpoints

## Security Considerations

1. **Authorization**: Only assigned interviewers can submit scores
2. **Score Immutability**: Once submitted, scores should only be editable within a time window
3. **Privacy**: Interviewers cannot see each other's scores until all are submitted
4. **Audit Trail**: Log all score submissions and modifications

## Migration Strategy

1. **Backward Compatibility**: Keep existing single-interviewer workflow functional
2. **Gradual Rollout**: Enable multi-interviewer for new interviews only
3. **Data Migration**: No migration needed for existing data
4. **Feature Flag**: Add feature flag to toggle multi-interviewer mode

---

**Document Version**: 1.0
**Last Updated**: 2025-10-20
**Author**: Frontend Team
**Status**: Ready for Backend Implementation
