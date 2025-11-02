import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom';
import { getSession } from '@/utils/session';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return children;
}
