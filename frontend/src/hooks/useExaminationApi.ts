/**
 * Examination API Hooks
 *
 * Custom hooks for accessing examination-related API endpoints
 * using the SWR data fetching pattern.
 */
import { useApiQuery, usePaginatedQuery, useApiMutation } from '@/hooks/useApiQuery';
import {
  Examination,
  ExaminationQueryParams,
  ExaminationResult,
  ExaminationSubmission,
  Question,
} from '@/services/types/examination.types';
import { PaginatedResponse } from '@/services/types/api.types';

// Base API endpoint
const EXAMINATIONS_API = '/examinations';

/**
 * Hook to fetch a list of examinations with pagination and filtering
 */
export function useExaminationsApi(params: ExaminationQueryParams = {}, page: number = 1, limit: number = 10) {
  // Convert params to a format expected by API
  const filters = { ...params };

  return usePaginatedQuery<Examination>(EXAMINATIONS_API, page, limit, filters);
}

/**
 * Hook to fetch a single examination by ID
 */
export function useExaminationApi(id: string | number | null) {
  return useApiQuery<Examination>(id ? `${EXAMINATIONS_API}/${id}` : null);
}

/**
 * Hook to start an examination
 */
export function useStartExaminationApi() {
  // Không có URL cụ thể vì sẽ tạo URL động dựa trên examinationId
  const { trigger: triggerMutation } = useApiMutation<any, Examination>(`${EXAMINATIONS_API}/dummy-url`);

  const startExam = async (
    templateId: string | number,
    examParams?: {
      questionsCount?: number;
      type?: string;
      content?: string;
      duration?: number;
      level?: string;
    },
  ) => {
    try {
      // Sử dụng service mới
      const examinationAttemptService = (await import('@/services/examination-attempt.service')).default;
      return await examinationAttemptService.startExamination(templateId);
    } catch (error) {
      throw error;
    }
  };

  return { startExam };
}

/**
 * Hook to submit examination answers
 */
export function useSubmitExaminationApi(examinationId?: string | number) {
  // Create a URL based on the examinationId if provided
  const url = examinationId ? `${EXAMINATIONS_API}/${examinationId}/submit` : `${EXAMINATIONS_API}/submit`;

  const { trigger } = useApiMutation<ExaminationSubmission, ExaminationResult>(url);

  const submit = async (submissionData: ExaminationSubmission, id?: string | number) => {
    try {
      // If id is provided in the call, it takes precedence over the one in the hook
      const finalId = id || examinationId;

      return await trigger(submissionData);
    } catch (error) {
      throw error;
    }
  };

  return { submit };
}

/**
 * Hook to fetch examination questions
 */
export function useExaminationQuestionsApi(examinationId: string | number | null) {
  return useApiQuery<Question[]>(examinationId ? `${EXAMINATIONS_API}/${examinationId}/questions` : null);
}

/**
 * Hook to fetch examination results
 */
export function useExaminationResultsApi(userId?: string | number) {
  const url = userId ? `${EXAMINATIONS_API}/results?userId=${userId}` : `${EXAMINATIONS_API}/results`;

  return useApiQuery<PaginatedResponse<ExaminationResult>>(url);
}

/**
 * Hook to fetch a specific examination result
 */
export function useExaminationResultApi(resultId: string | number | null) {
  return useApiQuery<ExaminationResult>(resultId ? `${EXAMINATIONS_API}/results/${resultId}` : null);
}
