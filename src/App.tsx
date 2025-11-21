import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Loader } from './components/Loader';

import Index from './pages/Index';
import Pricing from './pages/Pricing';
import SignUp from './pages/auth/SignUp';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Billing from './pages/Billing';
import Account from './pages/Account';
import NewBusiness from './pages/business/New';
import BusinessOverview from './pages/business/Overview';
import BusinessGMBEditor from './pages/business/GMBEditor';
import BusinessCompetitors from './pages/business/Competitors';
import BusinessPosts from './pages/business/Posts';
import BusinessImages from './pages/business/Images';
import BusinessReviews from './pages/business/Reviews';
import BusinessBlog from './pages/business/Blog';
import BusinessQR from './pages/business/QR';
import BusinessSettings from './pages/business/Settings';
import AdminIndex from './pages/admin/Index';
import AdminUsers from './pages/admin/Users';
import AdminSubscriptions from './pages/admin/Subscriptions';
import AdminUsage from './pages/admin/Usage';
import AdminLogs from './pages/admin/Logs';
import Docs from './pages/Docs';
import Support from './pages/Support';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user || profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/support" element={<Support />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing"
        element={
          <ProtectedRoute>
            <Billing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/new"
        element={
          <ProtectedRoute>
            <NewBusiness />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/:id"
        element={
          <ProtectedRoute>
            <BusinessOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/:id/gmb-editor"
        element={
          <ProtectedRoute>
            <BusinessGMBEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/:id/competitors"
        element={
          <ProtectedRoute>
            <BusinessCompetitors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/:id/posts"
        element={
          <ProtectedRoute>
            <BusinessPosts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/:id/images"
        element={
          <ProtectedRoute>
            <BusinessImages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/:id/reviews"
        element={
          <ProtectedRoute>
            <BusinessReviews />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/:id/blog"
        element={
          <ProtectedRoute>
            <BusinessBlog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/:id/qr"
        element={
          <ProtectedRoute>
            <BusinessQR />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/:id/settings"
        element={
          <ProtectedRoute>
            <BusinessSettings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminIndex />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/subscriptions"
        element={
          <AdminRoute>
            <AdminSubscriptions />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/usage"
        element={
          <AdminRoute>
            <AdminUsage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/logs"
        element={
          <AdminRoute>
            <AdminLogs />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
