export default async function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      {/* Header */}
      <div className="bg-base-100 shadow-sm">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <a>Home</a>
              </li>
              <li>Documentation</li>
            </ul>
          </div>
          <h1 className="text-5xl font-bold mt-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Documentation
          </h1>
          <p className="text-lg text-base-content/70 mt-2 max-w-2xl">
            Everything you need to know about using LaTEn platform
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl sticky top-8">
              <div className="card-body">
                <h2 className="card-title text-lg mb-4">Table of Contents</h2>
                <ul className="menu menu-sm">
                  <li>
                    <a href="#getting-started">Getting Started</a>
                  </li>
                  <li>
                    <a href="#features">Features</a>
                  </li>
                  <li>
                    <a href="#courses">Courses</a>
                  </li>
                  <li>
                    <a href="#community">Community</a>
                  </li>
                  <li>
                    <a href="#examinations">Examinations</a>
                  </li>
                  <li>
                    <a href="#troubleshooting">Troubleshooting</a>
                  </li>
                  <li>
                    <a href="#api">API Reference</a>
                  </li>
                  <li>
                    <a href="#support">Support</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            <div className="space-y-8">
              {/* Getting Started */}
              <div id="getting-started" className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-primary">Getting Started</h2>
                  <div className="divider"></div>
                  <p className="text-base-content/70 mb-4">
                    Welcome to LaTEn! Follow these simple steps to get started with your learning journey.
                  </p>
                  <div className="steps steps-vertical lg:steps-horizontal">
                    <div className="step step-primary">Create Account</div>
                    <div className="step step-primary">Choose Course</div>
                    <div className="step">Start Learning</div>
                    <div className="step">Take Exams</div>
                  </div>
                  <div className="alert alert-info mt-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="stroke-current shrink-0 w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>Registration is free and takes less than 2 minutes!</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div id="features" className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-secondary">Platform Features</h2>
                  <div className="divider"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 border-base-300">
                      <h3 className="font-bold text-lg mb-2">Interactive Learning</h3>
                      <p className="text-sm text-base-content/70">
                        Engage with interactive content, quizzes, and hands-on exercises.
                      </p>
                    </div>
                    <div className="border rounded-lg p-4 border-base-300">
                      <h3 className="font-bold text-lg mb-2">Progress Tracking</h3>
                      <p className="text-sm text-base-content/70">
                        Monitor your learning progress with detailed analytics and insights.
                      </p>
                    </div>
                    <div className="border rounded-lg p-4 border-base-300">
                      <h3 className="font-bold text-lg mb-2">Community Support</h3>
                      <p className="text-sm text-base-content/70">
                        Connect with fellow learners and get help from our community.
                      </p>
                    </div>
                    <div className="border rounded-lg p-4 border-base-300">
                      <h3 className="font-bold text-lg mb-2">Expert Instructors</h3>
                      <p className="text-sm text-base-content/70">
                        Learn from industry experts and experienced educators.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Courses */}
              <div id="courses" className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-accent">Course Management</h2>
                  <div className="divider"></div>
                  <div className="mockup-code">
                    <pre data-prefix="1">
                      <code>Navigate to Courses section</code>
                    </pre>
                    <pre data-prefix="2">
                      <code>Browse available courses</code>
                    </pre>
                    <pre data-prefix="3">
                      <code>Select a pricing plan</code>
                    </pre>
                    <pre data-prefix="4">
                      <code>Complete payment (if required)</code>
                    </pre>
                    <pre data-prefix="5">
                      <code>Start learning immediately</code>
                    </pre>
                  </div>
                  <div className="collapse collapse-plus bg-base-200 mt-4">
                    <input type="radio" name="course-accordion" />
                    <div className="collapse-title text-xl font-medium">How to enroll in a course?</div>
                    <div className="collapse-content">
                      <p>
                        Course enrollment is straightforward. Simply browse our course catalog, select your preferred
                        plan, and complete the registration process.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Community */}
              <div id="community" className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-primary">Community Guidelines</h2>
                  <div className="divider"></div>
                  <div className="space-y-4">
                    <div className="alert alert-success">
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Be respectful and supportive to fellow learners</span>
                    </div>
                    <div className="alert alert-warning">
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
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      <span>No spam or promotional content without permission</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Examinations */}
              <div id="examinations" className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-secondary">Examination System</h2>
                  <div className="divider"></div>
                  <div className="tabs tabs-lifted">
                    <input type="radio" name="exam_tabs" className="tab" aria-label="How it works" defaultChecked />
                    <div className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                      <h3 className="font-bold mb-2">How Examinations Work</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Choose your exam subject and difficulty level</li>
                        <li>Set time duration and question count</li>
                        <li>Take the exam in a distraction-free environment</li>
                        <li>Get instant results and detailed feedback</li>
                      </ul>
                    </div>

                    <input type="radio" name="exam_tabs" className="tab" aria-label="Rules" />
                    <div className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                      <h3 className="font-bold mb-2">Examination Rules</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Each question must be answered within the time limit</li>
                        <li>No external resources are allowed during exams</li>
                        <li>Switching tabs or windows may result in exam termination</li>
                        <li>Results are final and cannot be changed</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* API Reference */}
              <div id="api" className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-accent">API Reference</h2>
                  <div className="divider"></div>
                  <p className="text-base-content/70 mb-4">For developers who want to integrate with LaTEn platform.</p>
                  <div className="mockup-code">
                    <pre data-prefix="$">
                      <code>curl -X GET "https://api.laten.com/v1/courses"</code>
                    </pre>
                    <pre data-prefix=">" className="text-warning">
                      <code>Fetching courses...</code>
                    </pre>
                    <pre data-prefix=">" className="text-success">
                      <code>200 OK</code>
                    </pre>
                  </div>
                  <div className="alert alert-info mt-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="stroke-current shrink-0 w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>API documentation is available for registered developers.</span>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div id="support" className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-2xl text-primary">Need Help?</h2>
                  <div className="divider"></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="btn btn-circle btn-primary btn-lg mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          ></path>
                        </svg>
                      </div>
                      <h3 className="font-bold">Live Chat</h3>
                      <p className="text-sm text-base-content/70">Get instant help from our support team</p>
                    </div>
                    <div className="text-center">
                      <div className="btn btn-circle btn-secondary btn-lg mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          ></path>
                        </svg>
                      </div>
                      <h3 className="font-bold">Email Support</h3>
                      <p className="text-sm text-base-content/70">Send us your questions anytime</p>
                    </div>
                    <div className="text-center">
                      <div className="btn btn-circle btn-accent btn-lg mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          ></path>
                        </svg>
                      </div>
                      <h3 className="font-bold">Knowledge Base</h3>
                      <p className="text-sm text-base-content/70">Browse our comprehensive guides</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
