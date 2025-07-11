'use client';
import { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AuthContext } from '@/contexts/AuthContext';

export default function HomeContent() {
  const { loggedIn } = useContext(AuthContext);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <div className="mb-8">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome to LaTEn
              </h1>
              <h2 className="text-2xl font-semibold mt-4 text-base-content/80">
                Language & Technology Enhanced Learning
              </h2>
            </div>

            <p className="py-6 text-lg max-w-2xl mx-auto text-base-content/70">
              Revolutionize your learning experience with our interactive platform. Master new skills, track your
              progress, and join a community of passionate learners.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              {loggedIn ? (
                <>
                  <Link href="/course" className="btn btn-primary btn-lg">
                    Continue Learning
                  </Link>
                  <Link href="/profile" className="btn btn-outline btn-lg">
                    View Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/register" className="btn btn-primary btn-lg">
                    Get Started Free
                  </Link>
                  <Link href="/login" className="btn btn-outline btn-lg">
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="stats shadow-lg mt-12 bg-base-100">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-8 h-8 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title">Courses</div>
                <div className="stat-value text-primary">50+</div>
                <div className="stat-desc">Available courses</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-8 h-8 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title">Students</div>
                <div className="stat-value text-secondary">10K+</div>
                <div className="stat-desc">Active learners</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-accent">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-8 h-8 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    ></path>
                  </svg>
                </div>
                <div className="stat-title">Completion</div>
                <div className="stat-value text-accent">95%</div>
                <div className="stat-desc">Success rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Dashboard (only shown when logged in) */}
      {loggedIn && (
        <div className="py-16 bg-base-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Your Learning Dashboard</h2>
              <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
                Track your progress, find recommended exams, and see your recent activities
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-1">
                {/* User Progress */}
                <div className="bg-base-100 rounded-box p-6 shadow-lg mb-8">
                  <h2 className="text-xl font-bold mb-4">Your Progress</h2>
                  <div className="stats stats-vertical shadow w-full">
                    <div className="stat">
                      <div className="stat-figure text-primary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="inline-block w-8 h-8 stroke-current"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          ></path>
                        </svg>
                      </div>
                      <div className="stat-title">Completed Exams</div>
                      <div className="stat-value text-primary">25</div>
                      <div className="stat-desc">12% more than last month</div>
                    </div>

                    <div className="stat">
                      <div className="stat-figure text-secondary">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="inline-block w-8 h-8 stroke-current"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          ></path>
                        </svg>
                      </div>
                      <div className="stat-title">Average Score</div>
                      <div className="stat-value text-secondary">85%</div>
                      <div className="stat-desc">5% improvement</div>
                    </div>

                    <div className="stat">
                      <div className="stat-figure text-secondary">
                        <div className="avatar">
                          <div className="w-16 rounded-full">
                            <Image
                              src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                              alt="User avatar"
                              width={64}
                              height={64}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="stat-value">7</div>
                      <div className="stat-title">Days Streak</div>
                      <div className="stat-desc text-secondary">Keep it up!</div>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="bg-base-100 rounded-box p-6 shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Quick Links</h2>
                  <div className="flex flex-col gap-3">
                    <Link href="/examination" className="btn btn-primary">
                      Take a Practice Exam
                    </Link>
                    <Link href="/profile" className="btn btn-outline">
                      View Certificates
                    </Link>
                    <Link href="/community" className="btn btn-outline">
                      Join Discussion
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-2">
                {/* Recommended Exams */}
                <div className="bg-base-100 rounded-box p-6 shadow-lg mb-8">
                  <h2 className="text-xl font-bold mb-4">Recommended for You</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="card bg-base-200">
                      <div className="card-body p-4">
                        <h3 className="card-title text-base">Advanced Grammar Test</h3>
                        <div className="flex flex-wrap items-center gap-1 mb-2">
                          <span className="badge badge-primary">Grammar</span>
                          <span className="badge badge-outline">45 min</span>
                          <span className="badge badge-secondary badge-sm">Intermediate</span>
                        </div>
                        <p className="text-sm">
                          Test your knowledge of complex grammar structures and advanced tenses.
                        </p>
                        <div className="card-actions justify-end mt-2">
                          <Link href="/examination" className="btn btn-primary btn-sm">
                            Start Now
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="card bg-base-200">
                      <div className="card-body p-4">
                        <h3 className="card-title text-base">Vocabulary Builder</h3>
                        <div className="flex flex-wrap items-center gap-1 mb-2">
                          <span className="badge badge-secondary">Vocabulary</span>
                          <span className="badge badge-outline">30 min</span>
                          <span className="badge badge-primary badge-sm">Beginner</span>
                        </div>
                        <p className="text-sm">Expand your vocabulary with this comprehensive word quiz.</p>
                        <div className="card-actions justify-end mt-2">
                          <Link href="/examination" className="btn btn-primary btn-sm">
                            Start Now
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="card bg-base-200">
                      <div className="card-body p-4">
                        <h3 className="card-title text-base">Reading Comprehension</h3>
                        <div className="flex flex-wrap items-center gap-1 mb-2">
                          <span className="badge badge-accent">Reading</span>
                          <span className="badge badge-outline">60 min</span>
                          <span className="badge badge-secondary badge-sm">Advanced</span>
                        </div>
                        <p className="text-sm">
                          Improve your reading skills with complex texts and analysis questions.
                        </p>
                        <div className="card-actions justify-end mt-2">
                          <Link href="/examination" className="btn btn-primary btn-sm">
                            Start Now
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="card bg-base-200">
                      <div className="card-body p-4">
                        <h3 className="card-title text-base">Listening Practice</h3>
                        <div className="flex flex-wrap items-center gap-1 mb-2">
                          <span className="badge badge-info">Listening</span>
                          <span className="badge badge-outline">40 min</span>
                          <span className="badge badge-primary badge-sm">Intermediate</span>
                        </div>
                        <p className="text-sm">Test your listening comprehension with diverse audio samples.</p>
                        <div className="card-actions justify-end mt-2">
                          <Link href="/examination" className="btn btn-primary btn-sm">
                            Start Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-base-100 rounded-box p-6 shadow-lg">
                  <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th>Exam</th>
                          <th>Date</th>
                          <th>Score</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Reading Comprehension</td>
                          <td>June 28, 2025</td>
                          <td>92%</td>
                          <td>
                            <span className="badge badge-success">Passed</span>
                          </td>
                        </tr>
                        <tr>
                          <td>TOEFL Preparation</td>
                          <td>June 24, 2025</td>
                          <td>78%</td>
                          <td>
                            <span className="badge badge-success">Passed</span>
                          </td>
                        </tr>
                        <tr>
                          <td>Grammar Challenge</td>
                          <td>June 19, 2025</td>
                          <td>65%</td>
                          <td>
                            <span className="badge badge-warning">Practice needed</span>
                          </td>
                        </tr>
                        <tr>
                          <td>Vocabulary Test</td>
                          <td>June 15, 2025</td>
                          <td>88%</td>
                          <td>
                            <span className="badge badge-success">Passed</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 text-right">
                    <Link href="/profile" className="btn btn-sm btn-outline">
                      View All History
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="py-20 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose LaTEn?</h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Discover the features that make our platform the perfect choice for your learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="card-title justify-center mb-2">Interactive Learning</h3>
                <p className="text-base-content/70">
                  Engage with dynamic content, quizzes, and hands-on exercises that make learning fun and effective.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-secondary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="card-title justify-center mb-2">Progress Tracking</h3>
                <p className="text-base-content/70">
                  Monitor your learning journey with detailed analytics and personalized insights.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="card-title justify-center mb-2">Community Support</h3>
                <p className="text-base-content/70">
                  Connect with fellow learners, share knowledge, and get help from our community.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-info/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-info"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="card-title justify-center mb-2">Expert Content</h3>
                <p className="text-base-content/70">
                  Learn from industry experts with carefully crafted courses and up-to-date content.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-success"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="card-title justify-center mb-2">Certification</h3>
                <p className="text-base-content/70">
                  Earn recognized certificates upon course completion to showcase your achievements.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-warning"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="card-title justify-center mb-2">Flexible Schedule</h3>
                <p className="text-base-content/70">
                  Learn at your own pace with 24/7 access to all course materials and resources.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary to-secondary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Learning Journey?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already transforming their careers with LaTEn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!loggedIn && (
              <>
                <Link href="/register" className="btn btn-accent btn-lg">
                  Start Learning Today
                </Link>
                <Link
                  href="/about"
                  className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary"
                >
                  Learn More
                </Link>
              </>
            )}
            {loggedIn && (
              <Link href="/examination" className="btn btn-accent btn-lg">
                Take an Exam
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
