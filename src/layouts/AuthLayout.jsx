import { memo } from 'react';

/**
 * Auth layout wrapper — centered card with warehouse background.
 * Matches Figma login screen design.
 */
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-secondary-800">
      {/* Background image with blur */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80')`,
          filter: 'blur(4px)',
        }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary-900/60 to-secondary-900/80" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in">
        {children}
      </div>
    </div>
  );
};

export default memo(AuthLayout);
