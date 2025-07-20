/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
'use client';
import { AuthContext } from '@/contexts/AuthContext';
import { useContext, useEffect, useState } from 'react';
import { getApi } from '@/utils/axiosCofig.ts';
import { formatDate } from '@/utils/formatters';

interface UserData {
  fullname?: string;
  email?: string;
  avatar?: string;
  role?: string;
  id?: string;
  created?: string;
  updated?: string;
  birth?: string;
  phone?: string;
  status?: string;
}

export default function ProfileContent() {
  const [userData, setData] = useState<UserData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const access_token = user?.token;

  useEffect(() => {
    async function getInfo() {
      if (!access_token) return;
      try {
        setIsLoading(true);
        const data = await getApi('user/profile', access_token);
        setData(data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    getInfo();
  }, [access_token]);

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Profile Header */}
        <div className="card bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 shadow-2xl mb-8">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="avatar">
                  <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
                    <img
                      src={userData.avatar || 'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg'}
                      alt="Profile"
                      className="object-cover"
                    />
                  </div>
                </div>
                <button className="btn btn-outline btn-sm">
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
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Change Photo
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl font-bold mb-2">{userData.fullname || 'User Name'}</h1>
                <p className="text-lg text-base-content/70 mb-4">{userData.role || 'Student'}</p>

                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <div className="badge badge-primary badge-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                    {userData.email}
                  </div>
                  <div className="badge badge-secondary badge-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3a4 4 0 118 0v4m-4 12c-4.418 0-8-1.79-8-4s3.582-4 8-4 8 1.79 8 4-3.582 4-8 4z"
                      />
                    </svg>
                    Active
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
                  <button className="btn btn-primary" onClick={() => setIsEditing(!isEditing)}>
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Profile
                  </button>
                  <button className="btn btn-outline">
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    View Progress
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div className="stat-title">Courses Enrolled</div>
              <div className="stat-value text-primary">5</div>
              <div className="stat-desc">↗︎ 2 this month</div>
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="stat-title">Tests Completed</div>
              <div className="stat-value text-secondary">12</div>
              <div className="stat-desc">↗︎ 3 this week</div>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="stat-title">Study Streak</div>
              <div className="stat-value text-accent">7</div>
              <div className="stat-desc">days in a row</div>
            </div>
          </div>

          <div className="stats bg-base-100 shadow-xl">
            <div className="stat">
              <div className="stat-figure text-success">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="stat-title">Achievements</div>
              <div className="stat-value text-success">8</div>
              <div className="stat-desc">↗︎ 2 this week</div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">Profile Information</h2>

            {isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={userData.fullname || ''}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      className="input input-bordered"
                      value={userData.email || ''}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      className="input input-bordered"
                      value={userData.phone || ''}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Date of Birth</span>
                    </label>
                    <input type="date" className="input input-bordered" value={userData.birth || ''} />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Bio</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered h-24"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>

                <div className="flex gap-4 justify-end">
                  <button className="btn btn-outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary">Save Changes</button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <div className="input input-bordered bg-base-200">{userData.fullname || 'Not provided'}</div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <div className="input input-bordered bg-base-200">{userData.email || 'Not provided'}</div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Phone Number</span>
                    </label>
                    <div className="input input-bordered bg-base-200">{userData.phone || 'Not provided'}</div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Date of Birth</span>
                    </label>
                    <div className="input input-bordered bg-base-200">
                      {userData.birth ? formatDate(userData.birth) : 'Not provided'}
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Account Created</span>
                    </label>
                    <div className="input input-bordered bg-base-200">
                      {userData.created ? formatDate(userData.created) : 'Not available'}
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Last Updated</span>
                    </label>
                    <div className="input input-bordered bg-base-200">
                      {userData.updated ? formatDate(userData.updated) : 'Not available'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Settings */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6 text-warning">Account Settings</h2>
            <div className="flex flex-wrap gap-4">
              <button className="btn btn-outline">
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Change Password
              </button>
              <button className="btn btn-error" onClick={handleLogout}>
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
              <button className="btn btn-error btn-outline">
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
