'use client';
import React from 'react';
import { evaluateScore } from '@/utils/testEvaluation';

export interface SubmitConfirmModalProps {
  onCancel: () => void;
  onConfirm: () => void;
  onReview: () => void;
  isSubmitting: boolean;
  getAnsweredCount: () => number;
  questionsCount: number;
  unansweredQuestions: { id: string; index: number }[];
}

function SubmitConfirmModal({
  onCancel,
  onConfirm,
  onReview,
  isSubmitting,
  getAnsweredCount,
  questionsCount,
  unansweredQuestions,
}: SubmitConfirmModalProps) {
  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-sm animate-none" style={{ transform: 'none', transition: 'none' }}>
        <h3 className="font-bold text-base mb-2">Confirm Submission</h3>

        <div className="space-y-2 mb-3">
          <div className="alert alert-info text-xs py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Once submitted, you cannot return to the exam.</span>
          </div>
        </div>

        <div className="divider my-1">Summary</div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <div className="text-center">
            <div className="text-sm text-base-content/70">Total Questions</div>
            <div className="stat-value flex justify-center items-end">
              <div className="text-lg font-bold">{questionsCount}</div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm text-base-content/70">Answered</div>
            <div className="stat-value flex justify-center items-end">
              <div className="text-lg font-bold text-success">{getAnsweredCount()}</div>
              <span className="text-xs ml-1 text-base-content/70">of {questionsCount}</span>
            </div>
          </div>
        </div>

        <div className="divider my-1"></div>

        {unansweredQuestions.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-1">Unanswered Questions ({unansweredQuestions.length})</div>

            <div className="h-24 overflow-auto mb-4">
              {unansweredQuestions.length <= 10 ? (
                <div className="grid grid-cols-5 gap-1">
                  {unansweredQuestions.map((q) => (
                    <button
                      key={q.id}
                      className="btn btn-outline btn-xs btn-error"
                      onClick={() => {
                        onCancel();
                        setTimeout(() => {
                          onReview();
                        }, 100);
                      }}
                    >
                      Q{q.index + 1}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-error">
                  {unansweredQuestions.length} questions unanswered. Consider reviewing before submitting.
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between gap-2 mt-4">
          <button className="btn btn-sm" onClick={onReview}>
            Review Answers
          </button>

          <div className="flex gap-2">
            <button className="btn btn-sm btn-outline" onClick={onCancel}>
              Cancel
            </button>

            <button className="btn btn-sm btn-primary" onClick={onConfirm} disabled={isSubmitting}>
              {isSubmitting ? <span className="loading loading-spinner loading-xs"></span> : 'Submit Exam'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubmitConfirmModal;
