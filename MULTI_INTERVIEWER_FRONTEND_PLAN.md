# Multi-Interviewer Scoring System - Frontend Implementation Plan

## Status: Ready for Implementation (Pending Backend Completion)

### ✅ **Already Completed:**

1. **Type Definitions** - `/src/features/hr/types/interview.ts`
   - `InterviewScore` - Individual interviewer scores
   - `InterviewSchedule` - Interview appointments
   - Enhanced `Interview` interface with multi-scorer support
   - `InterviewNotification` - Notification payloads

2. **API Hooks** - `/src/features/hr/controllers/hrInterviewController.ts`
   - `useSubmitInterviewScore(interviewId)` - Submit score
   - `useGetInterviewScores(interviewId)` - Get all scores
   - `useGetMyPendingInterviews()` - My pending interviews
   - `useGetMyInterviewScore(interviewId)` - My score
   - `useUpdateInterviewScore(interviewId, scoreId)` - Update score
   - `useGetInterviewSummary(interviewId)` - Get statistics

3. **Backend Specification** - `/MULTI_INTERVIEWER_BACKEND_API_SPEC.md`
   - Complete API documentation for backend team

---

## 📋 **Remaining Frontend Work**

### Phase 1: Core Components (Priority: HIGH)

#### 1.1 InterviewScoreCard Component
**Location:** `/src/features/hr/components/interview/InterviewScoreCard.tsx`

**Purpose:** Individual score submission form for committee members

**Features:**
- Display candidate information (name, position, date)
- 7 rating criteria (1-5 scale with color coding)
  - Appearance/Corporate Poise
  - Oral Communication
  - Supervisory Experience/Teamwork
  - Work Ethics
  - Analytical Thinking
  - Knowledge of NGO Issues
  - Quality/Relevance of Experience
- Comment box for each criterion
- Overall recommendation textarea
- Preferred candidate checkbox
- Real-time score calculation (total/35 and percentage)
- Submit button (creates or updates score)
- Visual feedback: Pending vs Submitted status

**Props:**
```typescript
interface InterviewScoreCardProps {
  interviewId: string;
  candidateName: string;
  position: string;
  interviewDate: string;
  onScoreSubmitted?: () => void;
}
```

**Component Structure:**
```tsx
export function InterviewScoreCard({ interviewId, candidateName, position, interviewDate }: InterviewScoreCardProps) {
  const { data: myScore } = useGetMyInterviewScore(interviewId);
  const { submitScore, isLoading } = useSubmitInterviewScore(interviewId);
  const { updateScore } = useUpdateInterviewScore(interviewId, myScore?.data?.id);

  // State for all ratings and comments
  const [scores, setScores] = useState({...});

  // Auto-calculate total
  const totalScore = scores.appearance + scores.communication + ... // sum all 7
  const percentage = (totalScore / 35) * 100;

  const handleSubmit = async () => {
    const scoreData = { ...scores, total_score: totalScore, percentage_score: percentage };
    if (myScore?.data) {
      await updateScore(scoreData);
    } else {
      await submitScore(scoreData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2>Interview Evaluation</h2>
        <p>Candidate: {candidateName} - {position}</p>
        <Badge>{myScore?.data?.status || 'PENDING'}</Badge>
      </CardHeader>
      <CardContent>
        {/* Rating sections */}
        <RatingSection label="Appearance/Corporate Poise" ... />
        {/* ... 6 more sections */}

        {/* Score Summary */}
        <div>
          <p>Total Score: {totalScore}/35 ({percentage.toFixed(2)}%)</p>
        </div>

        {/* Actions */}
        <Button onClick={handleSubmit} disabled={isLoading}>
          {myScore?.data ? 'Update Score' : 'Submit Score'}
        </Button>
      </CardContent>
    </Card>
  );
}
```

---

#### 1.2 InterviewScoreSummary Component
**Location:** `/src/features/hr/components/interview/InterviewScoreSummary.tsx`

**Purpose:** Display all scores and average for an interview

**Features:**
- Show completion status (e.g., "2/3 evaluations completed")
- Progress bar for completion percentage
- Average scores for each criterion
- Table showing individual scores by interviewer
- Expandable rows to see individual comments
- Overall average score and percentage
- Status badges (Pending/Submitted) for each interviewer

**Props:**
```typescript
interface InterviewScoreSummaryProps {
  interviewId: string;
  showIndividualScores?: boolean; // Hide until all complete
}
```

**Component Structure:**
```tsx
export function InterviewScoreSummary({ interviewId, showIndividualScores = true }: InterviewScoreSummaryProps) {
  const { data: summary } = useGetInterviewSummary(interviewId);
  const { data: scores } = useGetInterviewScores(interviewId);

  const allCompleted = summary?.data?.completion_percentage === 100;

  return (
    <Card>
      <CardHeader>
        <h3>Evaluation Summary</h3>
        <div>
          <Progress value={summary?.data?.completion_percentage} />
          <p>{summary?.data?.completed_evaluations}/{summary?.data?.total_interviewers} Completed</p>
        </div>
      </CardHeader>
      <CardContent>
        {/* Average Scores Table */}
        {allCompleted && (
          <div>
            <h4>Average Scores</h4>
            <Table>
              <thead>
                <tr>
                  <th>Criterion</th>
                  <th>Average</th>
                  <th>Max</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Appearance</td>
                  <td>{summary?.data?.average_scores?.appearance}</td>
                  <td>5</td>
                </tr>
                {/* ... other criteria */}
                <tr className="font-bold">
                  <td>Total</td>
                  <td>{summary?.data?.average_scores?.total}</td>
                  <td>35</td>
                </tr>
                <tr className="font-bold">
                  <td>Percentage</td>
                  <td colSpan={2}>{summary?.data?.average_scores?.percentage}%</td>
                </tr>
              </tbody>
            </Table>
          </div>
        )}

        {/* Individual Scores Table */}
        {showIndividualScores && scores?.data && (
          <div className="mt-6">
            <h4>Individual Evaluations</h4>
            <Table>
              <thead>
                <tr>
                  <th>Interviewer</th>
                  <th>Total Score</th>
                  <th>Percentage</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {scores.data.map(score => (
                  <tr key={score.id}>
                    <td>{score.interviewer_name}</td>
                    <td>{score.total_score}/35</td>
                    <td>{score.percentage_score}%</td>
                    <td>
                      <Badge variant={score.status === 'SUBMITTED' ? 'success' : 'warning'}>
                        {score.status}
                      </Badge>
                    </td>
                    <td>
                      {score.status === 'SUBMITTED' && (
                        <Button size="sm" variant="ghost">View Details</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

---

#### 1.3 PendingInterviewsBanner Component
**Location:** `/src/features/hr/components/interview/PendingInterviewsBanner.tsx`

**Purpose:** Dashboard widget showing pending interviews for logged-in user

**Features:**
- Display count of pending interviews
- List upcoming interviews (next 3)
- Quick action button to submit score
- Auto-refresh every 5 minutes
- Click to expand/collapse full list
- Color-coded by urgency (red if < 24hrs, yellow if < 48hrs)

**Component Structure:**
```tsx
export function PendingInterviewsBanner() {
  const { data: pendingInterviews } = useGetMyPendingInterviews();
  const interviews = pendingInterviews?.data || [];
  const [expanded, setExpanded] = useState(false);

  if (interviews.length === 0) return null;

  const urgent = interviews.filter(i =>
    differenceInHours(new Date(i.start_date), new Date()) < 24
  );

  return (
    <Alert variant={urgent.length > 0 ? 'destructive' : 'warning'}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>
        You have {interviews.length} pending interview{interviews.length > 1 ? 's' : ''}
        {urgent.length > 0 && ` (${urgent.length} urgent)`}
      </AlertTitle>
      <AlertDescription>
        <div className="mt-2 space-y-2">
          {(expanded ? interviews : interviews.slice(0, 3)).map(interview => (
            <div key={interview.id} className="flex items-center justify-between p-2 bg-white rounded">
              <div>
                <p className="font-medium">{interview.application_details?.applicant_name}</p>
                <p className="text-sm text-gray-600">
                  {interview.application_details?.position} • {format(new Date(interview.start_date), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              <Link href={`/dashboard/hr/interviews/${interview.id}/score`}>
                <Button size="sm">Submit Score</Button>
              </Link>
            </div>
          ))}
        </div>
        {interviews.length > 3 && (
          <Button
            variant="link"
            onClick={() => setExpanded(!expanded)}
            className="mt-2"
          >
            {expanded ? 'Show Less' : `Show ${interviews.length - 3} More`}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
```

---

### Phase 2: Update Existing Components

#### 2.1 Update HR InterviewForm Component
**File:** `/src/features/hr/components/advertisement/id/InterviewForm.tsx`

**Changes Needed:**
1. Check if interview has multi-scorer mode enabled
2. If YES:
   - Use `InterviewScoreCard` component instead of current form
   - Show "Your Score" vs "All Scores" tabs
   - Display `InterviewScoreSummary` in separate tab
3. If NO (legacy):
   - Keep existing single-interviewer form as fallback

**Code Structure:**
```tsx
export function InterviewForm() {
  const { id } = useParams(); // interview ID
  const { data: interview } = useGetInterview(id);

  const isMultiScorer = interview?.data?.interview_type === 'COMMITTEE';

  if (isMultiScorer) {
    return (
      <Tabs defaultValue="my-score">
        <TabsList>
          <TabsTrigger value="my-score">My Score</TabsTrigger>
          <TabsTrigger value="all-scores">All Scores</TabsTrigger>
        </TabsList>
        <TabsContent value="my-score">
          <InterviewScoreCard
            interviewId={id}
            candidateName={interview.data.candidate_name}
            position={interview.data.position_applied}
            interviewDate={interview.data.date_of_interview}
          />
        </TabsContent>
        <TabsContent value="all-scores">
          <InterviewScoreSummary interviewId={id} />
        </TabsContent>
      </Tabs>
    );
  }

  // Legacy single-interviewer form
  return <OriginalInterviewForm />;
}
```

---

#### 2.2 Update InterviewTable Component
**File:** `/src/features/hr/components/advertisement/table/InterviewTable.tsx`

**Changes Needed:**
1. Add new columns:
   - "Committee Size" (if COMMITTEE type)
   - "Completed Evaluations" (e.g., "2/3")
   - "Avg Score" instead of single score
2. Add expand/collapse row to show individual scores
3. Update score calculation to use average_scores
4. Add status badge for completion percentage

**Enhanced Table Structure:**
```tsx
const columns = [
  { header: "Candidate", accessorKey: "candidate_name" },
  { header: "Position", accessorKey: "position_applied" },
  { header: "Date", accessorKey: "date_of_interview" },
  {
    header: "Type",
    cell: ({ row }) => row.interview_type === 'COMMITTEE' ? 'Committee' : 'Single'
  },
  {
    header: "Progress",
    cell: ({ row }) =>
      row.interview_type === 'COMMITTEE'
        ? `${row.completed_evaluations}/${row.total_interviewers}`
        : '1/1'
  },
  {
    header: "Avg Score",
    cell: ({ row }) =>
      row.average_scores
        ? `${row.average_scores.percentage}%`
        : `${((row.appearance_rating + ... ) / 35 * 100).toFixed(1)}%`
  },
  { header: "Status", cell: ({ row }) => <StatusBadge status={row.status} /> },
  { header: "Actions", cell: ({ row }) => <ActionsMenu interview={row} /> }
];
```

---

### Phase 3: Dashboard Integration

#### 3.1 Add Pending Interviews Widget to Dashboard
**File:** `/src/app/dashboard/Dashboard.tsx`

**Integration:**
```tsx
import { PendingInterviewsBanner } from "@/features/hr/components/interview/PendingInterviewsBanner";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Add at top of dashboard */}
      <PendingInterviewsBanner />

      {/* Existing dashboard content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ... existing widgets */}
      </div>
    </div>
  );
}
```

---

### Phase 4: Consultancy & AdHoc Interviews

#### 4.1 Update Consultancy Interview Types
**File:** `/src/features/contracts-grants/types/consultant-interview.ts` (NEW)

**Create Similar Structure:**
```typescript
export interface ConsultancyInterviewScore {
  id: string;
  interview_id: string;
  interviewer_id: string;
  interviewer_name?: string;

  // 10 criteria (1-4 scale)
  similar_work_experience: number;
  project_management_knowledge: number;
  recent_experience: number;
  comparable_project_experience: number;
  communication_skills: number;
  technical_skill: number;
  relevant_qualifications: number;
  academic_credentials: number;
  timeline_management: number;
  toolset_framework: number;

  total_score: number; // Max 50
  percentage_score: number;
  status: 'PENDING' | 'SUBMITTED';
  submitted_at?: string;
}
```

#### 4.2 Create Consultancy Score Card
**File:** `/src/features/contracts-grants/components/interview/ConsultancyScoreCard.tsx`

**Similar to HR but with 10 criteria (1-4 scale)**

#### 4.3 Update ApplicantInterview Component
**File:** `/src/features/contracts-grants/components/contract-management/consultant-management/id/ApplicantInterview.tsx`

**Add Multi-Scorer Support:**
```tsx
export function ApplicantInterview() {
  const isMultiScorer = // check interview type

  if (isMultiScorer) {
    return (
      <Tabs>
        <TabsContent value="my-score">
          <ConsultancyScoreCard ... />
        </TabsContent>
        <TabsContent value="all-scores">
          <ConsultancyScoreSummary ... />
        </TabsContent>
      </Tabs>
    );
  }

  return <OriginalApplicantInterviewForm />;
}
```

---

## 🎨 UI/UX Guidelines

### Color Coding for Scores
```tsx
const getScoreColor = (score: number, max: number) => {
  const percentage = (score / max) * 100;
  if (percentage >= 80) return 'text-green-600 bg-green-50';
  if (percentage >= 60) return 'text-yellow-600 bg-yellow-50';
  if (percentage >= 40) return 'text-orange-600 bg-orange-50';
  return 'text-red-600 bg-red-50';
};
```

### Status Badges
- **PENDING**: Yellow badge with clock icon
- **SUBMITTED**: Green badge with checkmark icon
- **IN_PROGRESS**: Blue badge with spinner icon
- **COMPLETED**: Dark green badge with double checkmark

### Notification Styling
- **Urgent** (< 24hrs): Red background with alert icon
- **Warning** (< 48hrs): Yellow background with warning icon
- **Info**: Blue background with info icon

---

## 📱 Responsive Design

### Mobile Considerations
- Stack criteria vertically on mobile
- Use accordion for individual scores
- Fixed header for score card
- Bottom sheet for actions
- Swipe to navigate between tabs

### Desktop Features
- Side-by-side comparison of scores
- Expandable details inline
- Hover tooltips for comments
- Keyboard navigation support

---

## 🔄 State Management

### Local State (useState)
- Form inputs (ratings, comments)
- Expanded/collapsed states
- Tab selection

### Server State (React Query)
- Interview data
- Scores data
- Pending interviews
- Summary statistics

### Optimistic Updates
```tsx
const { submitScore } = useSubmitInterviewScore(interviewId);
const queryClient = useQueryClient();

const handleSubmit = async (data) => {
  // Optimistic update
  queryClient.setQueryData(['my-interview-score', interviewId], data);

  try {
    await submitScore(data);
  } catch (error) {
    // Revert on error
    queryClient.invalidateQueries(['my-interview-score', interviewId]);
  }
};
```

---

## 🧪 Testing Strategy

### Unit Tests
```tsx
// InterviewScoreCard.test.tsx
describe('InterviewScoreCard', () => {
  it('calculates total score correctly', () => {});
  it('calculates percentage correctly', () => {});
  it('validates required fields', () => {});
  it('submits score successfully', () => {});
  it('updates existing score', () => {});
});
```

### Integration Tests
```tsx
// Interview workflow test
describe('Multi-Interviewer Workflow', () => {
  it('shows pending interviews banner', () => {});
  it('allows interviewer to submit score', () => {});
  it('updates completion status', () => {});
  it('calculates average when all complete', () => {});
  it('sends completion notification', () => {});
});
```

---

## 📦 Component File Structure

```
src/features/hr/components/interview/
├── InterviewScoreCard.tsx          (NEW)
├── InterviewScoreSummary.tsx       (NEW)
├── PendingInterviewsBanner.tsx     (NEW)
├── InterviewNotificationCard.tsx   (NEW)
└── components/
    ├── RatingSection.tsx           (NEW - Reusable rating input)
    ├── ScoreProgressBar.tsx        (NEW - Visual progress)
    └── InterviewerScoreRow.tsx     (NEW - Individual score display)

src/features/contracts-grants/components/interview/
├── ConsultancyScoreCard.tsx        (NEW)
├── ConsultancyScoreSummary.tsx     (NEW)
└── components/
    └── ConsultancyRatingSection.tsx (NEW - 1-4 scale)

src/features/hr/components/advertisement/
├── id/
│   └── InterviewForm.tsx           (UPDATE - Add multi-scorer mode)
└── table/
    └── InterviewTable.tsx          (UPDATE - Add average scores)
```

---

## 🚀 Implementation Order

### Week 1: Core Components
1. Day 1-2: `InterviewScoreCard` component
2. Day 3: `InterviewScoreSummary` component
3. Day 4: `PendingInterviewsBanner` component
4. Day 5: Testing and refinement

### Week 2: Integration
1. Day 1-2: Update `InterviewForm` component
2. Day 3: Update `InterviewTable` component
3. Day 4: Dashboard integration
4. Day 5: Testing

### Week 3: Consultancy & AdHoc
1. Day 1-2: Consultancy interview types and hooks
2. Day 3-4: Consultancy score components
3. Day 5: Testing

### Week 4: Polish & Launch
1. Day 1-2: Responsive design refinements
2. Day 3: Accessibility improvements
3. Day 4: Performance optimization
4. Day 5: Documentation and deployment

---

## ✅ Definition of Done

### Component Checklist
- [ ] Component renders without errors
- [ ] All props are type-safe
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Accessibility (ARIA labels, keyboard navigation)
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] Code reviewed
- [ ] Documentation updated

### Feature Checklist
- [ ] Backend APIs are implemented and tested
- [ ] Frontend components are complete
- [ ] Notifications are sent correctly
- [ ] Emails are sent with correct content
- [ ] Calendar invites are attached
- [ ] Scores calculate correctly
- [ ] Averages calculate correctly
- [ ] Dashboard shows pending interviews
- [ ] Works across all interview modules (HR, Consultancy, AdHoc)
- [ ] Backward compatibility maintained
- [ ] E2E tests passing
- [ ] User acceptance testing complete

---

## 📚 Additional Resources

### Useful Links
- React Query Docs: https://tanstack.com/query/latest
- Shadcn UI Components: https://ui.shadcn.com
- Tailwind CSS: https://tailwindcss.com
- Date-fns: https://date-fns.org

### Code Examples
- See existing `InterviewForm.tsx` for current implementation
- See `LeaveApprovalForm.tsx` for multi-step form pattern
- See `NotificationDropdown.tsx` for notification display pattern

---

**Document Version**: 1.0
**Created**: 2025-10-20
**Status**: Ready for Implementation
**Prerequisites**: Backend APIs must be completed first
**Estimated Effort**: 3-4 weeks for full implementation

**Next Steps:**
1. ✅ Share backend spec with backend team
2. ⏳ Wait for backend API implementation
3. ⏳ Begin frontend component development
4. ⏳ Integration testing
5. ⏳ User acceptance testing
6. ⏳ Production deployment
