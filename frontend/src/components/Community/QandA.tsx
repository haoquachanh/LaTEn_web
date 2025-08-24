'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { qandaService, type Question as QuestionType } from '@/services/api/qanda.service';
import { useAuth } from '@/contexts/AuthContext';
import { TeacherDashboard } from './QandA/TeacherDashboard';
import { AnswerForm } from './QandA/AnswerForm';

interface QuestionUI {
  id: number;
  title: string;
  content: string;
  category: string;
  created: Date;
  authorName: string;
  authorAvatar: string;
  answers: number;
  tags: string[];
  isAnswered: boolean;
  topAnswer?: {
    content: string;
    authorName: string;
    isAccepted: boolean;
  } | null;
}

interface QandAProps {
  onRefresh?: () => void;
}

export default function QandA({ onRefresh }: QandAProps = {}) {
  const router = useRouter();
  const locale = useLocale();
  const { user } = useAuth();

  const [questions, setQuestions] = useState<QuestionUI[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'answered' | 'unanswered'>('all');

  // Teacher-specific states
  const [answerFormOpen, setAnswerFormOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionUI | null>(null);
  const [teacherStats, setTeacherStats] = useState({
    totalQuestions: 0,
    unansweredCount: 0,
    answeredToday: 0,
  });

  const observerTarget = useRef<HTMLDivElement>(null);

  // Check if user is teacher or admin
  const isTeacher = user?.role === 'admin' || user?.role === 'root' || user?.role === 'teacher';

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  const fetchQuestions = useCallback(
    async (pageNumber: number, isInitial = false, status = filterStatus) => {
      if (loading || (!hasMore && !isInitial)) return;

      try {
        if (isInitial) {
          setInitialLoading(true);
        } else {
          setLoading(true);
        }

        const response = await qandaService.getQuestions({
          page: pageNumber,
          limit: 10,
          status: status === 'all' ? undefined : status,
        });

        const uiQuestions: QuestionUI[] = response.items.map((question) => ({
          id: question.id,
          title: question.title,
          content: question.content,
          category: question.category,
          created: new Date(question.createdAt),
          authorName: question.author.fullname || question.author.username,
          authorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(question.author.fullname || question.author.username)}&background=random`,
          answers: question.answerCount,
          tags: question.tags.map((tag) => tag.name),
          isAnswered: question.isAnswered,
          topAnswer: question.topAnswer
            ? {
                content: question.topAnswer.content,
                authorName: question.topAnswer.author.fullname || question.topAnswer.author.username,
                isAccepted: question.topAnswer.isAccepted,
              }
            : null,
        }));

        if (isInitial) {
          setQuestions(uiQuestions);

          // Calculate teacher stats
          if (isTeacher) {
            const unansweredCount = uiQuestions.filter((q) => !q.isAnswered).length;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const answeredToday = uiQuestions.filter((q) => {
              return q.isAnswered && new Date(q.created).getTime() >= today.getTime();
            }).length;

            setTeacherStats({
              totalQuestions: response.total,
              unansweredCount,
              answeredToday,
            });
          }
        } else {
          setQuestions((prev) => [...prev, ...uiQuestions]);
        }

        setHasMore(pageNumber < response.totalPages);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch questions:', err);
        setError('Failed to load questions. Please try again later.');
        if (isInitial) {
          setQuestions([]);
        }
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [loading, hasMore, filterStatus, isTeacher],
  );

  useEffect(() => {
    checkAuth();
    fetchQuestions(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchQuestions(nextPage);
            return nextPage;
          });
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, fetchQuestions]);

  function handleFilterChange(status: 'all' | 'answered' | 'unanswered') {
    setFilterStatus(status);
    setPage(1);
    setHasMore(true);
    fetchQuestions(1, true, status);
  }

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      general: 'badge-info',
      technical: 'badge-primary',
      learning: 'badge-secondary',
      exam: 'badge-accent',
      other: 'badge-ghost',
    };
    return colors[category] || 'badge-ghost';
  };

  const handleOpenAnswerForm = (question: QuestionUI) => {
    setSelectedQuestion(question);
    setAnswerFormOpen(true);
  };

  const handleCloseAnswerForm = () => {
    setAnswerFormOpen(false);
    setSelectedQuestion(null);
  };

  const handleAnswerSuccess = () => {
    // Refresh questions list
    setPage(1);
    setHasMore(true);
    fetchQuestions(1, true, filterStatus);
  };

  return (
    <div className="flex flex-col w-full gap-4">
      {/* Teacher Dashboard */}
      {isTeacher && <TeacherDashboard stats={teacherStats} />}

      {/* Filter tabs */}
      <div className="tabs tabs-boxed bg-base-100 shadow-lg p-2">
        <a className={`tab ${filterStatus === 'all' ? 'tab-active' : ''}`} onClick={() => handleFilterChange('all')}>
          All Questions
        </a>
        <a
          className={`tab ${filterStatus === 'unanswered' ? 'tab-active' : ''}`}
          onClick={() => handleFilterChange('unanswered')}
        >
          Unanswered
        </a>
        <a
          className={`tab ${filterStatus === 'answered' ? 'tab-active' : ''}`}
          onClick={() => handleFilterChange('answered')}
        >
          Answered
        </a>
      </div>

      {initialLoading ? (
        // Loading skeleton
        Array(5)
          .fill(0)
          .map((_, i) => (
            <div className="card bg-base-100 shadow-lg overflow-hidden animate-pulse" key={`loading-${i}`}>
              <div className="card-body p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-base-300"></div>
                  <div className="h-3 bg-base-300 rounded w-24"></div>
                  <div className="h-3 bg-base-300 rounded w-16"></div>
                </div>
                <div className="h-5 bg-base-300 rounded w-3/4 mb-2"></div>
                <div className="flex gap-1 mb-3">
                  <div className="h-4 bg-base-300 rounded w-16"></div>
                  <div className="h-4 bg-base-300 rounded w-16"></div>
                </div>
                <div className="h-3 bg-base-300 rounded w-full mb-1"></div>
                <div className="h-3 bg-base-300 rounded w-2/3"></div>
              </div>
            </div>
          ))
      ) : error ? (
        // Error state
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="font-bold">Error</h3>
            <div className="text-sm">{error}</div>
          </div>
        </div>
      ) : questions.length === 0 ? (
        // Empty state
        <div className="alert">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-info shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div>
            <h3 className="font-bold">No questions found</h3>
            <div className="text-sm">Be the first to ask a question!</div>
          </div>
        </div>
      ) : (
        // Questions list
        questions.map((question: QuestionUI) => (
          <div
            className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-base-300"
            key={`question-${question.id}`}
          >
            <div className="card-body p-4 lg:p-5">
              {/* Header with author, date, and category */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="avatar">
                    <div className="w-6 h-6 rounded-full">
                      <Image
                        src={question.authorAvatar}
                        alt={question.authorName}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-base-content/70">{question.authorName}</span>
                  <span className="text-xs text-base-content/50">• {formatDate(question.created)}</span>
                </div>
                <span className={`badge badge-xs ${getCategoryColor(question.category)}`}>{question.category}</span>
              </div>

              {/* Title */}
              <Link href={`/${locale}/community/qanda/${question.id}`}>
                <h2 className="font-bold text-base mb-2 hover:text-primary transition-colors cursor-pointer line-clamp-2">
                  {question.title}
                </h2>
              </Link>

              {/* Tags */}
              {question.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {question.tags.slice(0, 4).map((tag: string) => (
                    <div key={tag} className="badge badge-outline badge-xs">
                      {tag}
                    </div>
                  ))}
                  {question.tags.length > 4 && (
                    <div className="badge badge-outline badge-xs">+{question.tags.length - 4}</div>
                  )}
                </div>
              )}

              {/* Top Answer Preview */}
              {question.topAnswer && (
                <div className="bg-base-200/50 rounded-lg p-3 mb-3 border-l-2 border-success">
                  <div className="flex items-start gap-2">
                    {question.topAnswer.isAccepted && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-success flex-shrink-0 mt-0.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-base-content/80 line-clamp-2">{question.topAnswer.content}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-base-content/60">— {question.topAnswer.authorName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats and actions */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex items-center gap-1 text-xs ${question.isAnswered ? 'text-success' : 'text-base-content/60'}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    {question.answers}
                  </span>
                </div>

                <div className="flex gap-2">
                  {/* Teacher Answer Button */}
                  {isTeacher && !question.isAnswered && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenAnswerForm(question);
                      }}
                      className="btn btn-success btn-xs"
                    >
                      Trả lời
                    </button>
                  )}

                  <Link href={`/${locale}/community/qanda/${question.id}`} className="btn btn-primary btn-xs">
                    {question.topAnswer ? 'View All' : 'Answer'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Intersection Observer Target - Always show for smooth infinite scroll */}
      <div ref={observerTarget} className="flex justify-center py-8">
        {loading && <span className="loading loading-spinner loading-lg text-primary"></span>}
      </div>

      {/* Answer Form Modal */}
      {selectedQuestion && (
        <AnswerForm
          questionId={selectedQuestion.id}
          questionTitle={selectedQuestion.title}
          isOpen={answerFormOpen}
          onClose={handleCloseAnswerForm}
          onSuccess={handleAnswerSuccess}
        />
      )}
    </div>
  );
}
