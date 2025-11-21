import { useParams } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';

export default function BusinessQR() {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">QR</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Business ID: {id}</p>
          <p className="mt-4 text-gray-600">QR functionality coming soon.</p>
        </div>
      </div>
    </div>
  );
}
