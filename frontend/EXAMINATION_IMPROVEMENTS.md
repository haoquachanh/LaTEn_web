# Examination Frontend Improvements - Implementation Guide

## Overview
Các cải tiến chuyên nghiệp cho module Examination trong frontend, bao gồm:
- ✅ Type Safety với proper TypeScript interfaces
- ✅ State Management với useReducer pattern
- ✅ Performance Optimization với custom hooks
- ✅ Validation với Zod schemas
- ✅ Constants và utility functions
- ✅ Memory leak prevention
- ✅ Accessibility improvements

## 📁 Files Created

### 1. Constants
**File:** `src/constants/examination.constants.ts`
- Timer intervals, exam config limits
- Score thresholds, exam types, difficulty levels
- API endpoints, storage keys
- Error và success messages

```typescript
import { EXAM_CONFIG_LIMITS, TIMER_INTERVAL_MS } from '@/constants/examination.constants';
```

### 2. Utility Functions
**File:** `src/utils/examinationHelpers.ts`
- `calculateScore()` - Tính điểm tự động
- `formatTimeRemaining()` - Format thời gian
- `isExamExpired()` - Kiểm tra hết hạn
- `getScoreGrade()` - Xác định grade
- `shuffleArray()` - Xáo trộn câu hỏi

```typescript
import { calculateScore, formatTimeRemaining } from '@/utils/examinationHelpers';

const score = calculateScore(correctAnswers, totalQuestions);
const timeDisplay = formatTimeRemaining(secondsLeft);
```

### 3. Type Definitions
**File:** `src/types/examination-api.types.ts`
- `ExaminationApiResponse` - Response từ API
- `QuestionApiResponse` - Câu hỏi từ API
- `TemplateApiResponse` - Template từ API
- `ExaminationResultApiResponse` - Kết quả từ API

```typescript
import { ExaminationApiResponse } from '@/types/examination-api.types';
```

### 4. State Management
**File:** `src/hooks/useExaminationReducer.ts`
- Centralized state với useReducer
- Type-safe actions
- Pre-defined action creators

```typescript
import { useExaminationReducer } from '@/hooks/useExaminationReducer';

function ExaminationComponent() {
  const { state, actions } = useExaminationReducer();
  
  // Use actions
  actions.setStage('inProgress');
  actions.submitAnswer(questionId, answer);
  actions.setResults(results);
}
```

### 5. Validation Schemas
**File:** `src/utils/examination-validation.ts`
- Zod schemas cho validation
- Runtime type checking
- Error handling helpers

```typescript
import { validateExamConfig } from '@/utils/examination-validation';

const { success, data, errors } = validateExamConfig(config);
if (!success) {
  showToast({ type: 'error', message: errors[0] });
  return;
}
```

### 6. Performance Hooks
**File:** `src/hooks/useExaminationOptimizations.ts`
- `useExamResultsMap()` - O(1) lookup thay vì O(n) search
- `useExamTimer()` - Timer với proper cleanup
- `useAnswerTracking()` - Optimized answer management
- `useAutoSave()` - Debounced auto-save
- `useQuestionFiltering()` - Memoized filtering

```typescript
import { useExamResultsMap, useExamTimer } from '@/hooks/useExaminationOptimizations';

// Fast lookup
const { getResult } = useExamResultsMap(detailedResults);
const result = getResult(questionId); // O(1) instead of O(n)

// Timer with cleanup
const { timeLeft, pauseTimer } = useExamTimer(
  durationSeconds,
  handleTimeExpired,
  true // autoStart
);
```

## 🔧 How to Use in Components

### Example 1: ExaminationContainer with Reducer

```typescript
import { useExaminationReducer } from '@/hooks/useExaminationReducer';
import { validateExamConfig } from '@/utils/examination-validation';
import { EXAM_STAGES } from '@/constants/examination.constants';

function ExaminationContainer() {
  const { state, actions } = useExaminationReducer();

  const handleStartExam = async () => {
    // Validate config
    const validation = validateExamConfig(state.config);
    if (!validation.success) {
      actions.setError(validation.errors[0]);
      return;
    }

    actions.setLoading(true);
    try {
      // Start exam
      const exam = await examinationService.startExamination(templateId);
      actions.startExamination(exam.id, exam.startedAt, exam.durationSeconds);
      actions.setQuestions(exam.questions);
    } catch (error) {
      actions.setError(error.message);
    } finally {
      actions.setLoading(false);
    }
  };

  return (
    <div>
      {state.stage === EXAM_STAGES.DASHBOARD && <Dashboard />}
      {state.stage === EXAM_STAGES.IN_PROGRESS && <ExamContainer />}
      {state.stage === EXAM_STAGES.RESULTS && <ExamResults />}
    </div>
  );
}
```

### Example 2: ExamResults with Performance Optimization

```typescript
import { useExamResultsMap } from '@/hooks/useExaminationOptimizations';
import { calculateScore, getScoreGrade } from '@/utils/examinationHelpers';

function ExamResults({ results, detailedResults, questions }) {
  // O(1) lookup instead of O(n) search in loop
  const { getResult } = useExamResultsMap(detailedResults);

  const score = calculateScore(results.correctAnswers, results.totalQuestions);
  const grade = getScoreGrade(score);

  return (
    <div>
      {questions.map((question) => {
        const result = getResult(question.id); // Fast lookup!
        return (
          <QuestionReview
            key={question.id}
            question={question}
            isCorrect={result?.isCorrect}
            userAnswer={result?.selectedOption}
          />
        );
      })}
    </div>
  );
}
```

### Example 3: Timer with Memory Leak Prevention

```typescript
import { useExamTimer } from '@/hooks/useExaminationOptimizations';
import { formatTimeRemaining } from '@/utils/examinationHelpers';
import { TIME_WARNING_THRESHOLD_SECONDS } from '@/constants/examination.constants';

function ExamTimer({ durationSeconds, onTimeExpired }) {
  const { timeLeft, pauseTimer, startTimer } = useExamTimer(
    durationSeconds,
    onTimeExpired,
    true // auto-start
  );

  const isWarning = timeLeft <= TIME_WARNING_THRESHOLD_SECONDS;
  const formattedTime = formatTimeRemaining(timeLeft);

  return (
    <div className={isWarning ? 'text-red-600' : ''}>
      {formattedTime}
    </div>
  );
}
```

### Example 4: Validation in Form

```typescript
import { validateExamConfig } from '@/utils/examination-validation';
import { EXAM_CONFIG_LIMITS } from '@/constants/examination.constants';

function ExamSetup({ onStartExam }) {
  const [config, setConfig] = useState({
    timeInMinutes: EXAM_CONFIG_LIMITS.DEFAULT_TIME_MINUTES,
    questionsCount: EXAM_CONFIG_LIMITS.DEFAULT_QUESTIONS,
    // ...
  });

  const handleSubmit = () => {
    const validation = validateExamConfig(config);
    
    if (!validation.success) {
      showToast({
        type: 'error',
        message: 'Invalid Configuration',
        description: validation.errors.join(', '),
      });
      return;
    }

    onStartExam(validation.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Example 5: Accessibility Improvements

```typescript
function QuestionDisplay({ question, onAnswer, userAnswer }) {
  const handleKeyDown = (e: React.KeyboardEvent, option: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onAnswer(question.id, option);
    }
  };

  return (
    <fieldset 
      aria-labelledby="question-title"
      className="space-y-3"
    >
      <legend id="question-title" className="font-bold">
        {question.content}
      </legend>

      {question.options.map((option, index) => (
        <label
          key={option.id}
          className="cursor-pointer flex items-center gap-2"
          onKeyDown={(e) => handleKeyDown(e, option.text)}
          tabIndex={0}
        >
          <input
            type="radio"
            name={`question-${question.id}`}
            value={option.text}
            checked={userAnswer === option.text}
            onChange={() => onAnswer(question.id, option.text)}
            aria-label={`Option ${index + 1}: ${option.text}`}
          />
          <span>{option.text}</span>
        </label>
      ))}
    </fieldset>
  );
}
```

## 🎯 Key Benefits

### 1. Type Safety
- Loại bỏ `any` types
- Compile-time error detection
- Better IDE autocomplete

### 2. Performance
- O(1) lookup với Map
- Memoization với useMemo
- Stable callbacks với useCallback
- No unnecessary re-renders

### 3. Maintainability
- Centralized constants
- Reusable utility functions
- Single source of truth for state
- Easy to test

### 4. Reliability
- Input validation
- Proper error handling
- Memory leak prevention
- Consistent behavior

### 5. User Experience
- Better accessibility
- Smoother interactions
- Clear error messages
- Responsive UI

## 📝 Migration Guide

### Step 1: Replace magic numbers
```typescript
// Before
setInterval(() => {}, 1000);

// After
import { TIMER_INTERVAL_MS } from '@/constants/examination.constants';
setInterval(() => {}, TIMER_INTERVAL_MS);
```

### Step 2: Use utility functions
```typescript
// Before
const score = Math.round((correctAnswers / totalQuestions) * 100);

// After
import { calculateScore } from '@/utils/examinationHelpers';
const score = calculateScore(correctAnswers, totalQuestions);
```

### Step 3: Add validation
```typescript
// Before
if (config.timeInMinutes < 5 || config.timeInMinutes > 180) {
  alert('Invalid time');
}

// After
import { validateExamConfig } from '@/utils/examination-validation';
const { success, errors } = validateExamConfig(config);
if (!success) {
  showToast({ type: 'error', message: errors[0] });
}
```

### Step 4: Replace useState with useReducer
```typescript
// Before
const [stage, setStage] = useState('dashboard');
const [questions, setQuestions] = useState([]);
const [answers, setAnswers] = useState({});
// ... 10+ more states

// After
import { useExaminationReducer } from '@/hooks/useExaminationReducer';
const { state, actions } = useExaminationReducer();
```

### Step 5: Optimize performance
```typescript
// Before
const result = detailedResults.find(r => r.questionId === questionId); // O(n)

// After
import { useExamResultsMap } from '@/hooks/useExaminationOptimizations';
const { getResult } = useExamResultsMap(detailedResults);
const result = getResult(questionId); // O(1)
```

## 🚀 Next Steps

1. Install Zod dependency: `npm install zod` ✅
2. Apply improvements to existing components
3. Write unit tests for utilities
4. Update documentation
5. Monitor performance improvements

## 📚 References

- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Zod Documentation](https://zod.dev/)
- [React Hooks Best Practices](https://react.dev/reference/react)
