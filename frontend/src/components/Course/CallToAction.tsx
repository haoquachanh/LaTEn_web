'use client';
import React from 'react';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  interval: string;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'forever',
    description: 'Basic access to get started with language learning',
    features: [
      'Access to basic video lessons',
      'Monthly group practice session',
      'Community forum access',
      'Basic vocabulary resources',
    ],
    buttonText: 'Start Free',
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 29,
    interval: 'month',
    description: 'Everything you need for serious language improvement',
    features: [
      'All Free features',
      'Weekly live group classes',
      'Private community group',
      'Personalized learning plan',
      'Progress tracking dashboard',
      'Email support',
    ],
    popular: true,
    buttonText: 'Get Started',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 79,
    interval: 'month',
    description: 'The ultimate language learning experience',
    features: [
      'All Standard features',
      'Weekly 1-on-1 coaching sessions',
      'Priority support',
      'Mock exams with feedback',
      'Unlimited practice exercises',
      'Certificate of completion',
      'Job interview preparation',
    ],
    buttonText: 'Go Premium',
  },
];

export default function CallToAction() {
  return (
    <section className="mb-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">Ready to Begin Your Language Journey?</h2>
        <p className="text-base-content/70 max-w-2xl mx-auto">
          Choose the plan that best fits your learning goals and schedule
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingTiers.map((tier) => (
          <div key={tier.id} className={`card bg-base-100 shadow-lg ${tier.popular ? 'border-2 border-primary' : ''}`}>
            {tier.popular && (
              <div className="absolute top-0 right-0 -mt-2 -mr-2">
                <div className="badge badge-primary">Most Popular</div>
              </div>
            )}
            <div className="card-body">
              <h3 className="card-title text-2xl">{tier.name}</h3>
              <div className="flex items-baseline mt-2">
                <span className="text-4xl font-bold">${tier.price}</span>
                <span className="text-base-content/70 ml-1">/{tier.interval}</span>
              </div>
              <p className="text-base-content/70 mt-2">{tier.description}</p>

              <div className="divider"></div>

              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-primary mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="card-actions justify-center mt-auto">
                <button className={`btn ${tier.popular ? 'btn-primary' : 'btn-outline'} btn-block`}>
                  {tier.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12 bg-base-100 p-8 rounded-box shadow-md">
        <h3 className="text-xl font-bold mb-3">Not sure which plan is right for you?</h3>
        <p className="mb-6 text-base-content/70">Take our free placement test and get a personalized recommendation</p>
        <button className="btn btn-primary">Take Placement Test</button>
      </div>
    </section>
  );
}
