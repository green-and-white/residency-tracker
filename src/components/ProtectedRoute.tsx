import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom';
import useSession from '@/hooks/useSession';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const session = useSession();

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return children;
}
