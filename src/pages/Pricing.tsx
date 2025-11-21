import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: 29,
      yearlyPrice: 290,
      features: [
        '1 Business Location',
        '100K AI Tokens/month',
        'Post Scheduling',
        'Review Management',
        'QR Code Generator',
        'Basic Analytics',
      ],
    },
    {
      name: 'Pro',
      price: 79,
      yearlyPrice: 790,
      popular: true,
      features: [
        '5 Business Locations',
        '500K AI Tokens/month',
        'All Starter Features',
        'Competitor Intelligence',
        'Geo-Rank Tracking',
        'Blog Automation',
        'Priority Support',
      ],
    },
    {
      name: 'Agency',
      price: 199,
      yearlyPrice: 1990,
      features: [
        '25 Business Locations',
        '2M AI Tokens/month',
        'All Pro Features',
        'White-Label Options',
        'API Access',
        'Custom Integrations',
        'Dedicated Support',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Start with a 7-day free trial. No credit card required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-lg shadow-lg p-8 ${
                plan.popular ? 'ring-2 ring-blue-600 relative' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-blue-600 mb-1">
                  ${plan.price}
                  <span className="text-lg text-gray-600">/mo</span>
                </div>
                <div className="text-sm text-gray-500">
                  or ${plan.yearlyPrice}/year (save 17%)
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/auth/signup"
                className={`block w-full text-center py-3 rounded-md font-semibold transition ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Start Free Trial
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
