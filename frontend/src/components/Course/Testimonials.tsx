'use client';
import React from 'react';
import Image from 'next/image';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image?: string;
  content: string;
  rating: number;
  course: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Marketing Professional',
    content:
      'The course structure is excellent! I went from struggling with basic conversations to confidently giving presentations in English. The personalized feedback from instructors was invaluable.',
    rating: 5,
    course: 'Business English',
  },
  {
    id: 2,
    name: 'David Chen',
    role: 'Graduate Student',
    content:
      'After completing the IELTS preparation course, I scored 7.5 - a full band higher than my previous attempt! The practice tests and strategies were spot-on.',
    rating: 5,
    course: 'IELTS Preparation',
  },
  {
    id: 3,
    name: 'Maria Rodriguez',
    role: 'Software Developer',
    content:
      'The flexible schedule allowed me to balance my full-time job with effective language learning. Within 3 months, I was confidently participating in international meetings.',
    rating: 4,
    course: 'Professional English',
  },
];

export default function Testimonials() {
  return (
    <section className="mb-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">What Our Students Say</h2>
        <p className="text-base-content/70 max-w-2xl mx-auto">
          Success stories from students who transformed their language skills with us
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-all">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-12">
                      <span>{testimonial.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold">{testimonial.name}</h3>
                    <p className="text-sm text-base-content/70">{testimonial.role}</p>
                  </div>
                </div>
                <div className="badge badge-primary">{testimonial.course}</div>
              </div>

              <div className="mb-4">
                <p className="italic">{testimonial.content}</p>
              </div>

              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < testimonial.rating ? 'text-warning' : 'text-base-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <button className="btn btn-outline">View More Testimonials</button>
      </div>
    </section>
  );
}
