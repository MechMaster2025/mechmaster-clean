import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ResetPassword } from './pages/ResetPassword';
import { AccessLocked } from './pages/AccessLocked';
import { Home } from './pages/Home';
import { CategoryTopics } from './pages/CategoryTopics';
import { TopicContent } from './pages/TopicContent';
import { Profile } from './pages/Profile';
import { Contact } from './pages/Contact';
import { Subscribe } from './pages/Subscribe';
import { Admin } from './pages/Admin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Header />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Protected Routes - Require Authentication */}
            <Route path="/home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            <Route path="/subscribe" element={
              <ProtectedRoute>
                <Subscribe />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
            
            {/* Protected Routes - Require Paid Subscription */}
            <Route path="/category/:slug" element={
              <ProtectedRoute requiresPaid={true}>
                <CategoryTopics />
              </ProtectedRoute>
            } />
            
            <Route path="/topic/:slug" element={
              <ProtectedRoute requiresPaid={true}>
                <TopicContent />
              </ProtectedRoute>
            } />
            
            {/* Paywall Route */}
            <Route path="/access-locked" element={<AccessLocked />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;