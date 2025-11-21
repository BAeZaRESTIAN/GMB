import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Automate Your Google Business Profile with AI
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              LocalAI helps you optimize your Google Business Profile using cutting-edge AI.
              Generate posts, respond to reviews, track competitors, and boost your local rankings automatically.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/auth/signup"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
              >
                Start Free Trial
              </Link>
              <Link
                to="/pricing"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition border-2 border-blue-600"
              >
                View Pricing
              </Link>
            </div>
          </div>

          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Content</h3>
              <p className="text-gray-600">
                Generate optimized posts, descriptions, and review responses using Gemini Pro AI
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Competitor Intelligence</h3>
              <p className="text-gray-600">
                Track competitors, analyze their strategies, and stay ahead in local search
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Full Automation</h3>
              <p className="text-gray-600">
                Schedule posts, auto-reply to reviews, and track rankings on autopilot
              </p>
            </div>
          </div>

          <div className="mt-20 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-10">Platform Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="text-blue-600 text-2xl mr-3">✓</div>
                <div>
                  <h4 className="font-semibold">GMB Profile Optimization</h4>
                  <p className="text-gray-600 text-sm">AI-suggested improvements for your business profile</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-blue-600 text-2xl mr-3">✓</div>
                <div>
                  <h4 className="font-semibold">Post Scheduling</h4>
                  <p className="text-gray-600 text-sm">Create and schedule GMB posts in advance</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-blue-600 text-2xl mr-3">✓</div>
                <div>
                  <h4 className="font-semibold">Review Management</h4>
                  <p className="text-gray-600 text-sm">Auto-generate and manage review responses</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-blue-600 text-2xl mr-3">✓</div>
                <div>
                  <h4 className="font-semibold">QR Code Generator</h4>
                  <p className="text-gray-600 text-sm">Create QR codes for easy review collection</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-blue-600 text-2xl mr-3">✓</div>
                <div>
                  <h4 className="font-semibold">Geo-Rank Tracking</h4>
                  <p className="text-gray-600 text-sm">Track your rankings with heatmap visualization</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-blue-600 text-2xl mr-3">✓</div>
                <div>
                  <h4 className="font-semibold">Blog Automation</h4>
                  <p className="text-gray-600 text-sm">Auto-publish content to Blogger with AI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 LocalAI. All rights reserved.</p>
          <div className="mt-4 space-x-6">
            <Link to="/docs" className="hover:text-blue-400 transition">Documentation</Link>
            <Link to="/support" className="hover:text-blue-400 transition">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
