'use client';
import React, { useState } from 'react';
import Image from 'next/image';

interface CourseItem {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  lessons: number;
  image?: string;
}

const coursesData: Record<string, CourseItem[]> = {
  beginner: [
    {
      id: 'b1',
      title: 'English Fundamentals',
      description: 'Master the basics of English grammar, vocabulary, and simple conversations.',
      level: 'A1-A2',
      duration: '8 weeks',
      lessons: 24,
    },
    {
      id: 'b2',
      title: 'Everyday English',
      description: 'Learn to communicate in common everyday situations with confidence.',
      level: 'A2',
      duration: '10 weeks',
      lessons: 30,
    },
    {
      id: 'b3',
      title: 'English for Travel',
      description: 'Essential English skills for traveling abroad with comfort and confidence.',
      level: 'A2',
      duration: '6 weeks',
      lessons: 18,
    },
  ],
  intermediate: [
    {
      id: 'i1',
      title: 'Fluent Conversations',
      description: 'Develop natural-sounding conversations and expand your vocabulary.',
      level: 'B1',
      duration: '12 weeks',
      lessons: 36,
    },
    {
      id: 'i2',
      title: 'Business English Basics',
      description: 'Essential English skills for professional environments and business communication.',
      level: 'B1-B2',
      duration: '10 weeks',
      lessons: 30,
    },
    {
      id: 'i3',
      title: 'Academic English',
      description: 'Prepare for English-medium academic environments with focused training.',
      level: 'B1-B2',
      duration: '12 weeks',
      lessons: 36,
    },
  ],
  advanced: [
    {
      id: 'a1',
      title: 'Advanced Communication',
      description: 'Master complex communication skills and nuanced expression in English.',
      level: 'C1',
      duration: '14 weeks',
      lessons: 42,
    },
    {
      id: 'a2',
      title: 'Professional English',
      description: 'Excel in demanding professional environments with advanced business English.',
      level: 'C1-C2',
      duration: '12 weeks',
      lessons: 36,
    },
    {
      id: 'a3',
      title: 'IELTS Mastery',
      description: 'Comprehensive preparation for IELTS with proven strategies for high scores.',
      level: 'B2-C2',
      duration: '8 weeks',
      lessons: 24,
    },
  ],
};

export default function CourseCatalog() {
  const [activeTab, setActiveTab] = useState('beginner');

  return (
    <div className="mb-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Our Language Courses</h2>
        <p className="text-base-content/70 max-w-2xl mx-auto">
          Explore our wide range of courses tailored to different proficiency levels
        </p>
      </div>

      {/* Course Level Tabs */}
      <div className="tabs tabs-boxed flex justify-center mb-8">
        <a className={`tab ${activeTab === 'beginner' ? 'tab-active' : ''}`} onClick={() => setActiveTab('beginner')}>
          Beginner
        </a>
        <a
          className={`tab ${activeTab === 'intermediate' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('intermediate')}
        >
          Intermediate
        </a>
        <a className={`tab ${activeTab === 'advanced' ? 'tab-active' : ''}`} onClick={() => setActiveTab('advanced')}>
          Advanced
        </a>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coursesData[activeTab].map((course) => (
          <div key={course.id} className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300">
            <figure className="h-48 bg-gradient-to-r from-primary/30 to-secondary/30 flex items-center justify-center">
              {course.image ? (
                <Image src={course.image} alt={course.title} fill className="object-cover" />
              ) : (
                <span className="text-3xl font-bold text-base-content/30">{course.level}</span>
              )}
            </figure>
            <div className="card-body">
              <h3 className="card-title">{course.title}</h3>
              <p className="text-base-content/70">{course.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="badge badge-primary">{course.level}</span>
                <span className="badge badge-outline">{course.duration}</span>
                <span className="badge badge-outline">{course.lessons} lessons</span>
              </div>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-sm btn-outline">Details</button>
                <button className="btn btn-sm btn-primary">Enroll</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <button className="btn btn-outline btn-wide">View All Courses</button>
      </div>
    </div>
  );
}
