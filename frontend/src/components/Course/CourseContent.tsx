'use client';
import { useState } from 'react';
import BuyStep from './BuyStep';

type Package = {
  name: string;
  content: string[];
  price: number;
  popular?: boolean;
  features: string[];
};

export default function CourseContent() {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const packages: Package[] = [
    {
      name: 'Basic',
      content: ['Access to basic video content', 'Monthly group class', 'Community forum access'],
      features: ['Free video recordings', 'Join free class monthly', 'Basic support'],
      price: 0,
    },
    {
      name: 'Standard',
      content: ['All Basic features', 'Weekly online classes', 'Private community group'],
      features: ['Free video recordings', 'Join online class weekly', 'Private Zalo group', 'Priority support'],
      price: 10,
      popular: true,
    },
    {
      name: 'Premium',
      content: ['All Standard features', 'Bi-weekly classes', 'Fast premium support', '1-on-1 sessions'],
      features: [
        'Free video recordings',
        'Bi-weekly online classes',
        'Private Zalo group',
        'Fast support',
        '1-on-1 mentoring',
      ],
      price: 20,
    },
  ];

  return (
    <div className="min-h-screen bg-base-200 py-20">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Choose Your Learning Path
          </h1>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Select the perfect plan to accelerate your learning journey. All plans include lifetime access to course
            materials.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative ${
                pkg.popular ? 'ring-2 ring-primary ring-offset-2 ring-offset-base-200 scale-105' : ''
              }`}
            >
              {pkg.popular && (
                <div className="badge badge-primary absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-2">
                  Most Popular
                </div>
              )}

              <div className="card-body text-center">
                <h2 className="card-title justify-center text-2xl mb-2">{pkg.name}</h2>

                <div className="mb-6">
                  <span className="text-5xl font-bold text-primary">${pkg.price}</span>
                  <span className="text-base-content/60">/month</span>
                </div>

                <p className="text-base-content/70 mb-6">{pkg.content[0]}</p>

                <div className="space-y-3 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="card-actions justify-center">
                  <button
                    className={`btn w-full ${pkg.popular ? 'btn-primary' : 'btn-outline btn-primary'}`}
                    onClick={() => setSelectedPackage(pkg)}
                  >
                    {pkg.price === 0 ? 'Get Started Free' : 'Choose Plan'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="card bg-base-100 shadow-xl mb-20">
          <div className="card-body">
            <h2 className="card-title text-3xl mb-8 justify-center">Compare All Features</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Features</th>
                    <th className="text-center">Basic</th>
                    <th className="text-center">Standard</th>
                    <th className="text-center">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Video Recordings</td>
                    <td className="text-center">
                      <span className="text-success">✓</span>
                    </td>
                    <td className="text-center">
                      <span className="text-success">✓</span>
                    </td>
                    <td className="text-center">
                      <span className="text-success">✓</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Live Classes</td>
                    <td className="text-center">Monthly</td>
                    <td className="text-center">Weekly</td>
                    <td className="text-center">Bi-weekly</td>
                  </tr>
                  <tr>
                    <td>Private Community</td>
                    <td className="text-center">
                      <span className="text-error">✗</span>
                    </td>
                    <td className="text-center">
                      <span className="text-success">✓</span>
                    </td>
                    <td className="text-center">
                      <span className="text-success">✓</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Priority Support</td>
                    <td className="text-center">
                      <span className="text-error">✗</span>
                    </td>
                    <td className="text-center">
                      <span className="text-success">✓</span>
                    </td>
                    <td className="text-center">
                      <span className="text-success">✓✓</span>
                    </td>
                  </tr>
                  <tr>
                    <td>1-on-1 Mentoring</td>
                    <td className="text-center">
                      <span className="text-error">✗</span>
                    </td>
                    <td className="text-center">
                      <span className="text-error">✗</span>
                    </td>
                    <td className="text-center">
                      <span className="text-success">✓</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="collapse collapse-plus bg-base-100 shadow">
              <input type="radio" name="faq-accordion" defaultChecked />
              <div className="collapse-title text-xl font-medium">Can I upgrade my plan later?</div>
              <div className="collapse-content">
                <p>Yes! You can upgrade your plan at any time. The price difference will be prorated.</p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-100 shadow">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-xl font-medium">Is there a money-back guarantee?</div>
              <div className="collapse-content">
                <p>We offer a 30-day money-back guarantee for all paid plans. No questions asked!</p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-100 shadow">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-xl font-medium">What payment methods do you accept?</div>
              <div className="collapse-content">
                <p>We accept all major credit cards, PayPal, and bank transfers.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Buy Step Component */}
        {selectedPackage && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Complete Your Purchase</h2>
              <BuyStep />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
