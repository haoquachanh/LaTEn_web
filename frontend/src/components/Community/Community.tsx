'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Post from './Posts';
import QandA from './QandA';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { postService } from '@/services/api/post.service';
import { qandaService } from '@/services/api/qanda.service';

export default function Community() {
  const router = useRouter();
  const locale = useLocale();
  const { showToast } = useToast();
  // Disable body scroll when component mounts
  useEffect(() => {
    // Disable scrolling on body
    document.body.classList.add('overflow-hidden');

    // Re-enable scrolling when component unmounts
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);
  const [activeTab, setActiveTab] = useState('posts');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Post states
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postImage, setPostImage] = useState('');
  const [postImageFile, setPostImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [postTags, setPostTags] = useState('');

  // Question states
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionContent, setQuestionContent] = useState('');
  const [questionCategory, setQuestionCategory] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const modalRef = useRef(null);
  const { user, loggedIn } = useAuth();

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
    },
  ];

  const handleCreatePost = async () => {
    const hasSession = typeof window !== 'undefined' && localStorage.getItem('laten_session');

    if (!loggedIn && !hasSession) {
      router.push(`/${locale}/login?returnUrl=${encodeURIComponent(`/${locale}/community`)}`);
      return;
    }

    if (!postTitle.trim() || !postContent.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      let imageUrl = postImage;

      if (postImageFile) {
        const formData = new FormData();
        formData.append('file', postImageFile);

        try {
          const uploadResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/upload`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              },
              body: formData,
            },
          );

          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            imageUrl = uploadData.url || uploadData.data?.url;
          } else {
            console.warn('Image upload failed, proceeding without image');
          }
        } catch (uploadErr) {
          console.warn('Image upload error:', uploadErr);
        }
      }

      await postService.createPost({
        title: postTitle,
        content: postContent.substring(0, 300),
        fullContent: postContent,
        imageUrl: imageUrl || undefined,
      });

      setPostTitle('');
      setPostContent('');
      setPostImage('');
      setPostImageFile(null);
      setImagePreview(null);
      setPostTags('');
      setIsModalOpen(false);

      showToast('Post created successfully! 🎉', 'success', 3000);

      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err instanceof Error ? err.message : 'Failed to create post');
      showToast('Failed to create post. Please try again.', 'error', 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateQuestion = async () => {
    const hasSession = typeof window !== 'undefined' && localStorage.getItem('laten_session');

    if (!loggedIn && !hasSession) {
      router.push(`/${locale}/login?returnUrl=${encodeURIComponent(`/${locale}/community`)}`);
      return;
    }

    if (!questionTitle.trim() || !questionContent.trim() || !questionCategory) {
      setError('Title, content, and category are required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await qandaService.createQuestion({
        title: questionTitle,
        content: questionContent,
        category: questionCategory,
      });

      setQuestionTitle('');
      setQuestionContent('');
      setQuestionCategory('');
      setIsModalOpen(false);

      showToast('Question submitted successfully! 🎉', 'success', 3000);

      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      console.error('Error creating question:', err);
      setError(err instanceof Error ? err.message : 'Failed to create question');
      showToast('Failed to submit question. Please try again.', 'error', 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setPostImageFile(file);
      setPostImage('');

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleRemoveImage = () => {
    setPostImageFile(null);
    setImagePreview(null);
    setPostImage('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);

    // Reset post states
    setPostTitle('');
    setPostContent('');
    setPostImage('');
    setPostImageFile(null);
    setImagePreview(null);
    setPostTags('');

    // Reset question states
    setQuestionTitle('');
    setQuestionContent('');
    setQuestionCategory('');

    setError(null);
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-gradient-to-br from-base-100 to-base-200 py-4 overflow-hidden">
      <style jsx global>{`
        /* Customize scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.2);
        }
      `}</style>
      <div className="container mx-auto px-4 h-full flex flex-col">
        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent pb-1">
            Learning Community
          </h1>
        </div>

        {/* Stats - Only visible to admin users */}
        {loggedIn && user?.role === 'admin' && (
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
        )}

        {/* Community Guidelines */}
        {/* <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div> */}

        {/* Navigation Tabs */}
        <div className="card bg-base-100 shadow-2xl flex-grow flex flex-col">
          <div className="card-body p-0 flex flex-col flex-grow">
            {/* Tab Headers */}
            <div className="tabs tabs-boxed bg-base-200 m-6 mb-3">
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

            {/* Tab Content */}
            <div className="h-[calc(100vh-300px)] flex flex-col">
              {/* Header with Create button (dynamic based on active tab) */}
              <div className="flex justify-between items-center px-6 pb-2 mb-2">
                <h3 className="text-xl font-bold">{activeTab === 'posts' ? 'Latest Posts' : 'Questions & Answers'}</h3>
                <button
                  onClick={() => {
                    if (!loggedIn) {
                      router.push(`/${locale}/login?returnUrl=${encodeURIComponent(`/${locale}/community`)}`);
                      return;
                    }
                    setIsModalOpen(true);
                  }}
                  className={`btn btn-sm py-2 h-auto min-h-0 ${activeTab === 'posts' ? 'btn-primary' : 'btn-info'}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {activeTab === 'posts' ? 'Create Post' : 'Ask Question'}
                </button>
              </div>
              {activeTab === 'posts' && (
                <div className="flex flex-col h-full px-6">
                  {/* Posts Feed taking full width with scrollable content */}
                  <div className="w-full flex-grow overflow-y-auto py-2 px-12 custom-scrollbar border rounded-md">
                    <Post key={refreshTrigger} />
                  </div>
                </div>
              )}

              {activeTab === 'qanda' && (
                <div className="flex flex-col h-full p-6">
                  {/* Q&A Feed taking full width with scrollable content */}
                  <div className="w-full flex-grow overflow-y-auto pr-2 custom-scrollbar">
                    <QandA />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for creating post or question */}
      <dialog ref={modalRef} className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleCloseModal}>
              ✕
            </button>
          </form>

          {/* Dynamic content based on active tab */}
          {activeTab === 'posts' ? (
            <>
              <h3 className="font-bold text-lg mb-4">Create New Post</h3>

              {error && (
                <div className="alert alert-error mb-4">
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
                  <span>{error}</span>
                </div>
              )}

              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">Post Title *</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter post title"
                  className="input input-bordered w-full"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">Content *</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-40"
                  placeholder="Write your post content here..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">Image</span>
                </label>
                <div className="tabs tabs-boxed mb-2">
                  <a
                    className={`tab ${!postImageFile ? 'tab-active' : ''}`}
                    onClick={() => {
                      setPostImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    URL
                  </a>
                  <a className={`tab ${postImageFile ? 'tab-active' : ''}`} onClick={() => setPostImage('')}>
                    Upload
                  </a>
                </div>

                {!postImageFile ? (
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="https://example.com/image.jpg"
                    value={postImage}
                    onChange={(e) => setPostImage(e.target.value)}
                    disabled={isSubmitting}
                  />
                ) : (
                  <div>
                    <input
                      type="file"
                      className="file-input file-input-bordered w-full"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      disabled={isSubmitting}
                    />
                    {imagePreview && (
                      <div className="mt-3 relative w-full h-48">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover rounded-lg" />
                        <button
                          type="button"
                          className="btn btn-sm btn-circle btn-error absolute top-2 right-2 z-10"
                          onClick={handleRemoveImage}
                          disabled={isSubmitting}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    {!imagePreview && (
                      <input
                        type="file"
                        className="file-input file-input-bordered w-full mt-2"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        disabled={isSubmitting}
                      />
                    )}
                  </div>
                )}
                <label className="label">
                  <span className="label-text-alt">Max size: 5MB. Supported: JPG, PNG, GIF</span>
                </label>
              </div>

              <div className="form-control w-full mb-6">
                <label className="label">
                  <span className="label-text">Tags (optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="Separate tags with commas"
                  className="input input-bordered w-full"
                  value={postTags}
                  onChange={(e) => setPostTags(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button className="btn" onClick={handleCloseModal} disabled={isSubmitting}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleCreatePost}
                  disabled={isSubmitting || !postTitle.trim() || !postContent.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Publishing...
                    </>
                  ) : (
                    'Publish Post'
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="font-bold text-lg mb-4">Ask a Question</h3>

              {error && activeTab === 'qanda' && (
                <div className="alert alert-error mb-4">
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
                  <span>{error}</span>
                </div>
              )}

              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">Question Title</span>
                </label>
                <input
                  type="text"
                  placeholder="What do you want to ask?"
                  className="input input-bordered w-full"
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-control w-full mb-4">
                <label className="label">
                  <span className="label-text">Question Details</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-32"
                  placeholder="Describe your question in detail..."
                  value={questionContent}
                  onChange={(e) => setQuestionContent(e.target.value)}
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <div className="form-control w-full mb-6">
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={questionCategory}
                  onChange={(e) => setQuestionCategory(e.target.value)}
                  disabled={isSubmitting}
                >
                  <option value="" disabled>
                    Choose a category
                  </option>
                  <option value="general">General</option>
                  <option value="technical">Technical</option>
                  <option value="learning">Learning</option>
                  <option value="exam">Exam</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button className="btn" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                  Cancel
                </button>
                <button className="btn btn-info" onClick={handleCreateQuestion} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Question'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleCloseModal}>close</button>
        </form>
      </dialog>
    </div>
  );
}
