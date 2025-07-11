'use client';
import { useState } from 'react';
import Post from './Posts';
import QandA from './QandA';

export default function Community() {
  const [activeTab, setActiveTab] = useState('posts');

  const tabs = [
    {
      id: 'posts',
      label: 'Posts',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14"
          />
        </svg>
      ),
      description: 'Share knowledge and experiences',
    },
    {
      id: 'qanda',
      label: 'Q&A',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      description: 'Ask questions and get answers',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Learning Community
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Connect with fellow learners, share knowledge, ask questions, and grow together in our vibrant community
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stats bg-base-100 shadow-xl">
            <div className="stat">
              <div className="stat-figure text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
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
              <div className="stat-title">Active Members</div>
              <div className="stat-value text-primary">1,250</div>
              <div className="stat-desc">↗︎ 12% this month</div>
            </div>
          </div>

          <div className="stats bg-base-100 shadow-xl">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14"
                  />
                </svg>
              </div>
              <div className="stat-title">Total Posts</div>
              <div className="stat-value text-secondary">3,421</div>
              <div className="stat-desc">↗︎ 8% this week</div>
            </div>
          </div>

          <div className="stats bg-base-100 shadow-xl">
            <div className="stat">
              <div className="stat-figure text-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="stat-title">Q&A Threads</div>
              <div className="stat-value text-accent">892</div>
              <div className="stat-desc">↗︎ 15% this week</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body p-0">
            {/* Tab Headers */}
            <div className="tabs tabs-boxed bg-base-200 m-6 mb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab tab-lg flex-1 gap-2 ${activeTab === tab.id ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Description */}
            <div className="px-6 pb-4">
              <p className="text-sm text-base-content/60">{tabs.find((tab) => tab.id === activeTab)?.description}</p>
            </div>

            {/* Tab Content */}
            <div className="min-h-[600px]">
              {activeTab === 'posts' && (
                <div className="p-6 pt-0">
                  <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* Create Post Card */}
                    <div className="xl:col-span-1">
                      <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-lg sticky top-6">
                        <div className="card-body">
                          <h3 className="card-title text-lg mb-4">Share Your Knowledge</h3>
                          <textarea
                            className="textarea textarea-bordered h-24 mb-4"
                            placeholder="What would you like to share with the community?"
                          />
                          <div className="flex flex-wrap gap-2 mb-4">
                            <div className="badge badge-primary badge-outline">Tips</div>
                            <div className="badge badge-secondary badge-outline">Resources</div>
                            <div className="badge badge-accent badge-outline">Discussion</div>
                          </div>
                          <button className="btn btn-primary">
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
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            Create Post
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Posts Feed */}
                    <div className="xl:col-span-3">
                      <Post />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'qanda' && (
                <div className="p-6 pt-0">
                  <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* Ask Question Card */}
                    <div className="xl:col-span-1">
                      <div className="card bg-gradient-to-br from-info/10 to-accent/10 shadow-lg sticky top-6">
                        <div className="card-body">
                          <h3 className="card-title text-lg mb-4">Ask a Question</h3>
                          <input type="text" className="input input-bordered mb-3" placeholder="Question title..." />
                          <textarea
                            className="textarea textarea-bordered h-24 mb-4"
                            placeholder="Describe your question in detail..."
                          />
                          <select className="select select-bordered mb-4">
                            <option disabled selected>
                              Choose category
                            </option>
                            <option>Grammar</option>
                            <option>Vocabulary</option>
                            <option>Pronunciation</option>
                            <option>Writing</option>
                            <option>Speaking</option>
                          </select>
                          <button className="btn btn-info">
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
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Ask Question
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Q&A Feed */}
                    <div className="xl:col-span-3">
                      <QandA />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body text-center">
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold">Be Respectful</h3>
              <p className="text-sm text-base-content/70">Treat all community members with kindness and respect</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body text-center">
              <div className="w-12 h-12 bg-info/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-info"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold">Share Knowledge</h3>
              <p className="text-sm text-base-content/70">Help others learn by sharing your experiences and tips</p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg">
            <div className="card-body text-center">
              <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-warning"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold">Stay On Topic</h3>
              <p className="text-sm text-base-content/70">Keep discussions relevant to learning and education</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
