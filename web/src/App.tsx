import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Signup from './pages/auth/signup';
import Login from './pages/auth/login';
import ForgotPassword from './pages/auth/forgetPass';
import ResetPassword from './pages/auth/restePass';
import VerifyEmailPage from './pages/auth/verifyEmail';
import { CulturalOffers } from './pages/CulturalOffers';
import { AdminDashboard } from './pages/Admin/adminDashboard';
import { PartnersPage } from './pages/Admin/partnersManagement';
import UsersPage from './pages/Admin/usersManagement';
import Layout from './pages/AppLayout';
import TasksPage from './pages/Admin/TasksPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from "./pages/profile.tsx";

function App() {
  return (
      <Router>
        <Routes>
          {/* Auth pages (no sidebar) */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />


          {/* Protected/layout pages */}
          <Route element={<Layout />}>

            <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'User', 'Partner']}>
                    <ProfilePage />
                  </ProtectedRoute>
                }
            />

            {/* Cultural Offers - Admin and Partner only */}
            <Route
                path="/cultural-offers"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Partner']}>
                    <CulturalOffers />
                  </ProtectedRoute>
                }
            />

            {/* Admin Dashboard - Admin only */}
            <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
            />

            {/* Partners Management - Admin only */}
            <Route
                path="/partners"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <PartnersPage />
                  </ProtectedRoute>
                }
            />

            {/* Users Management - Admin only */}
            <Route
                path="/users"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <UsersPage />
                  </ProtectedRoute>
                }
            />

            {/* Tasks - Admin only */}
            <Route
                path="/tasks"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <TasksPage />
                  </ProtectedRoute>
                }
            />

            {/* Comments - Partner only */}
            <Route
                path="/comments"
                element={
                  <ProtectedRoute allowedRoles={['Partner']}>
                    {/* Add your Comments component here */}
                    <div>Comments Page - Partner Only</div>
                  </ProtectedRoute>
                }
            />

            {/* Reviews - Partner only */}
            <Route
                path="/reviews"
                element={
                  <ProtectedRoute allowedRoles={['Partner']}>
                    {/* Add your Reviews component here */}
                    <div>Reviews Page - Partner Only</div>
                  </ProtectedRoute>
                }
            />
          </Route>
        </Routes>
      </Router>
  );
}

export default App;