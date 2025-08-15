'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExaminationsApi } from '@/hooks/useExaminationApi';
import LoadingState from '@/components/Common/LoadingState';
import ErrorState from '@/components/Common/ErrorState';
import { formatDuration } from '@/utils/dataTransformers';
import { Examination, ExaminationType, ExaminationLevel } from '@/services/types/examination.types';

const PAGE_SIZE = 9; // Show 9 examinations per page

const ExaminationListPage: React.FC = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    type: '' as '' | ExaminationType,
    level: '' as '' | ExaminationLevel,
    searchTerm: '',
  });

  // Convert filter values to proper types for API query
  const queryParams = {
    ...(filters.type ? { type: filters.type } : {}),
    ...(filters.level ? { level: filters.level } : {}),
    ...(filters.searchTerm ? { searchTerm: filters.searchTerm } : {}),
  };

  const { data, error, isLoading, isValidating, mutate } = useExaminationsApi(queryParams, page, PAGE_SIZE);

  const examinations = data?.data || [];
  const loading = isLoading || isValidating;
  const totalPages = data?.totalPages || 1;

  const handleFilter = (filter: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filter]: value }));
    setPage(1); // Reset to first page when filter changes
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filters are already applied via the filters state
    // This is just to handle the form submission
  };

  if (loading && !examinations.length) {
    return (
      <div className="min-h-[40%] flex items-center justify-center">
        <LoadingState message="Loading examinations..." size="lg" variant="default" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        message={(error as Error).message || 'Failed to load examinations.'}
        error={error}
        onRetry={() => mutate()}
        variant="default"
      />
    );
  }

  return (
    <div>
      {/* Filters */}
      <div className="bg-base-200 p-4 rounded-lg mb-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search examinations..."
                className="input input-bordered w-full"
                value={filters.searchTerm}
                onChange={(e) => handleFilter('searchTerm', e.target.value)}
              />
              <button className="btn btn-square btn-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="form-control">
            <select
              className="select select-bordered w-full"
              value={filters.type}
              onChange={(e) => handleFilter('type', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="grammar">Grammar</option>
              <option value="vocabulary">Vocabulary</option>
              <option value="reading">Reading</option>
              <option value="listening">Listening</option>
              <option value="comprehensive">Comprehensive</option>
            </select>
          </div>

          <div className="form-control">
            <select
              className="select select-bordered w-full"
              value={filters.level}
              onChange={(e) => handleFilter('level', e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div className="form-control">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setFilters({
                  type: '',
                  level: '',
                  searchTerm: '',
                });
                setPage(1);
              }}
            >
              Reset Filters
            </button>
          </div>
        </form>
      </div>

      {/* Results count */}
      <div className="mb-4">
        <p className="text-base-content/70">
          {data?.total ? (
            <>
              Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, data.total)} of {data.total} examinations
            </>
          ) : (
            'No examinations found'
          )}
        </p>
      </div>

      {/* Examinations grid */}
      {examinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examinations.map((exam: Examination) => (
            <div key={exam.id} className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body">
                <h3 className="card-title text-xl">{exam.title}</h3>
                <p className="text-base-content/80 line-clamp-2">{exam.description}</p>

                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  <span className="badge badge-primary">{exam.type}</span>
                  <span className="badge">{exam.level}</span>
                  <span className="badge badge-outline">{formatDuration(exam.duration || 0)}</span>
                  <span className="badge badge-outline">{exam.questions?.length || 0} questions</span>
                </div>

                <div className="card-actions justify-end mt-auto">
                  <button className="btn btn-primary" onClick={() => router.push(`/examination/${exam.id}`)}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-base-200 rounded-lg">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">No Examinations Found</h2>
          <p className="mb-6">Try adjusting your filters or search terms.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="join">
            <button className="join-item btn" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              «
            </button>

            {/* Show pagination buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                // Show first page, last page, and pages around current page
                return p === 1 || p === totalPages || Math.abs(p - page) <= 1;
              })
              .reduce(
                (acc, p, i, filtered) => {
                  // Add ellipsis between non-consecutive page numbers
                  if (i > 0 && filtered[i - 1] !== p - 1) {
                    acc.push('ellipsis-' + p);
                  }
                  acc.push(p);
                  return acc;
                },
                [] as (number | string)[],
              )
              .map((p) =>
                typeof p === 'number' ? (
                  <button
                    key={p}
                    className={`join-item btn ${p === page ? 'btn-active' : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ) : (
                  <button key={p} className="join-item btn btn-disabled">
                    ...
                  </button>
                ),
              )}

            <button
              className="join-item btn"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              »
            </button>
          </div>
        </div>
      )}

      {/* Loading indicator for pagination */}
      {loading && examinations.length > 0 && (
        <div className="mt-4 text-center">
          <LoadingState size="sm" variant="default" message="" />
        </div>
      )}
    </div>
  );
};

export default ExaminationListPage;
