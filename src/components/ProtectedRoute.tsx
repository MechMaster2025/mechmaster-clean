import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresPaid?: boolean;
}

export function ProtectedRoute({ children, requiresPaid = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has active subscription for paid content
  if (requiresPaid) {
    const hasActiveSubscription = user.subscription_status === 'active' && 
      user.subscription_end_date && 
      new Date(user.subscription_end_date) > new Date();

    if (!hasActiveSubscription) {
      return <Navigate to="/access-locked" replace />;
    }
  }

  return <>{children}</>;
}