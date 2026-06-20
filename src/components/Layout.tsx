import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
  isAuthenticated?: boolean;
  currentUser?: {
    username: string;
    email: string;
    role: string;
  };
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  onNavigate, 
  isAuthenticated = false,
  currentUser 
}) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar currentView={currentView} onNavigate={onNavigate} />
      <div className="pl-64">
        <Header 
          onNavigate={onNavigate} 
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
        />
        <main className="container mx-auto px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;