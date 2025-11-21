import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Business } from '../lib/supabase';

export default function Dashboard() {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBusinesses();
  }, [user]);

  const loadBusinesses = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBusinesses(data || []);
    } catch (error) {
      console.error('Error loading businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Link
            to="/business/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            + Add Business
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : businesses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No businesses yet
            </h2>
            <p className="text-gray-600 mb-6">
              Get started by adding your first business
            </p>
            <Link
              to="/business/new"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
              Add Your First Business
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <Link
                key={business.id}
                to={`/business/${business.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {business.name}
                  </h3>
                  {business.is_connected ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Connected
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Not Connected
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  {business.category && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Category:</span>
                      <span>{business.category}</span>
                    </div>
                  )}
                  {business.address && (
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Address:</span>
                      <span className="truncate">{business.address}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Mode:</span>
                    <span className="capitalize">{business.automation_mode.replace('_', ' ')}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
