import React from 'react';
import { useAuthContext } from '~/hooks/AuthContext';
import StartupLayout from './Startup';

export default function LoginLayout() {
  const { isAuthenticated } = useAuthContext();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="login-container border border-token-border-medium">
        <div className="pulsating-dot"></div>
        <div className="text-2xl font-bold mb-4 text-token-text-primary">CICERO</div>
        <StartupLayout isAuthenticated={isAuthenticated} />
      </div>
    </div>
  );
}
