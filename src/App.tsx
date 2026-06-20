import React, {useState} from 'react';
import ProductList from './pages/ProductList';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';
import Categories from './pages/Categories';
import RegisterEntry from './pages/RegisterEntry';
import EntriesList from './pages/EntriesList';
import RegisterExit from './pages/RegisterExit';
import ExitsList from './pages/ExitsList';
import RegisterReturn from './pages/RegisterReturn';
import ReturnsList from './pages/ReturnsList';
import Users from './pages/Users';
import StockAlerts from './pages/StockAlerts';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import { sampleProducts } from './data/products';
import { sampleUsers } from './data/users';
import Layout from './components/Layout';



function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Set to false to show login by default
  const [currentUser, setCurrentUser] = useState({
    id: '1',
    username: 'admin',
    email: 'admin@marketpro.com',
    role: 'Administrador',
    createdAt: new Date('2024-01-01')
  });

  const handleNavigate = (view: string) => {
    if (view === 'logout') {
      setIsAuthenticated(false);
      setCurrentView('login');
      setCurrentUser({
        id: '',
        username: '',
        email: '',
        role: '',
        createdAt: new Date()
      });
      return;
    }
    
    if (view === 'login') {
      setCurrentView('login');
      return;
    }

    setCurrentView(view);
    if (view !== 'edit') {
      setSelectedProductId(null);
    }
  };

  const handleLogin = (credentials: { username: string; password: string }) => {
    console.log('Login attempt with:', credentials);
    
    // Find user in sample data or use default admin
    const user = sampleUsers.find(u => 
      u.username.toLowerCase() === credentials.username.toLowerCase() ||
      u.email.toLowerCase() === credentials.username.toLowerCase()
    );
    
    if (user) {
      setCurrentUser({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      });
    } else {
      // Default admin user
      setCurrentUser({
        id: '1',
        username: credentials.username,
        email: 'admin@marketpro.com',
        role: 'Administrador',
        createdAt: new Date('2024-01-01')
      });
    }
    
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleUpdateProfile = (userData: any) => {
    setCurrentUser(userData);
    console.log('Profile updated:', userData);
  };

  // Show login page if not authenticated
  if (!isAuthenticated || currentView === 'login') {
    return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
  }

  // Show forgot password page
  if (currentView === 'forgot-password') {
    return <ForgotPassword onBackToLogin={() => handleNavigate('login')} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard currentView={currentView} onNavigate={handleNavigate} />;
      case 'list':
        return <ProductList onEdit={(id) => {
          setSelectedProductId(id);
          setCurrentView('edit');
        }} currentView={currentView} onNavigate={handleNavigate} />;
      case 'create':
        return <CreateProduct currentView={currentView} onNavigate={handleNavigate} />;
      case 'categories':
        return <Categories currentView={currentView} onNavigate={handleNavigate} />;
      case 'edit':
        const product = sampleProducts.find((p) => p.id === selectedProductId);
        return <EditProduct 
          product={product} 
          onBack={() => handleNavigate('list')}
          currentView={currentView}
          onNavigate={handleNavigate}
        />;
      case 'register-entry':
        return <RegisterEntry currentView={currentView} onNavigate={handleNavigate} />;
      case 'entries-list':
        return <EntriesList currentView={currentView} onNavigate={handleNavigate} />;
      case 'register-exit':
        return <RegisterExit currentView={currentView} onNavigate={handleNavigate} />;
      case 'exits-list':
        return <ExitsList currentView={currentView} onNavigate={handleNavigate} />;
      case 'register-return':
        return <RegisterReturn currentView={currentView} onNavigate={handleNavigate} />;
      case 'returns-list':
        return <ReturnsList currentView={currentView} onNavigate={handleNavigate} />;
      case 'users':
        return <Users currentView={currentView} onNavigate={handleNavigate} />;
      case 'alerts':
        return <StockAlerts currentView={currentView} onNavigate={handleNavigate} />;
      case 'reports':
        return <Reports currentView={currentView} onNavigate={handleNavigate} />;
      case 'settings':
        return <Settings currentView={currentView} onNavigate={handleNavigate} />;
      case 'profile':
        return <Profile 
          currentView={currentView} 
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onUpdateProfile={handleUpdateProfile}
        />;
      default:
        return <Dashboard currentView={currentView} onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onNavigate={handleNavigate}
      isAuthenticated={isAuthenticated}
      currentUser={currentUser}
    >
      {renderView()}
    </Layout>
  );
}

export default App;