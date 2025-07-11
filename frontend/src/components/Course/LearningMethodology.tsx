'use client';
import React from 'react';

interface MethodStep {
  id: number;
  title: string;
  description: string;
  color: string;
  steps: string[];
}

const methodSteps: MethodStep[] = [
  {
    id: 1,
    title: 'Assessment',
    description:
      'We begin with a comprehensive placement test to identify your current level and specific learning needs.',
    color: 'primary',
    steps: ['Speaking & listening evaluation', 'Reading & writing assessment', 'Learning goals discussion'],
  },
  {
    id: 2,
    title: 'Personalization',
    description: 'We create a custom learning plan tailored to your goals, timeline, and preferred learning style.',
    color: 'secondary',
    steps: ['Customized curriculum design', 'Targeted learning resources', 'Adaptive learning path'],
  },
  {
    id: 3,
    title: 'Immersion',
    description: 'Engage in intensive practice through varied activities and real-world applications to build fluency.',
    color: 'accent',
    steps: ['Interactive live sessions', 'Conversation practice', 'Multimedia learning resources'],
  },
  {
    id: 4,
    title: 'Assessment',
    description: "Regular progress checks and feedback to ensure you're on track to reach your goals.",
    color: 'info',
    steps: ['Weekly progress reviews', 'Skill mastery verification', 'Continuous improvement feedback'],
  },
];

export default function LearningMethodology() {
  return (
    <section className="mb-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">Our 4-Step Learning Methodology</h2>
        <p className="text-base-content/70 max-w-2xl mx-auto">
          Our proven approach ensures consistent progress and measurable results
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {methodSteps.map((step) => (
          <div
            key={step.id}
            className={`card bg-base-100 border-t-4 border-${step.color} shadow-md hover:shadow-xl transition-all duration-300`}
          >
            <div className="card-body">
              <div className="flex items-center mb-4">
                <div
                  className={`w-12 h-12 rounded-full bg-${step.color}/20 flex items-center justify-center text-${step.color} font-bold text-xl`}
                >
                  {step.id}
                </div>
                <h3 className="ml-4 card-title">{step.title}</h3>
              </div>
              <p className="text-base-content/70">{step.description}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {step.steps.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <svg className={`w-4 h-4 text-${step.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
