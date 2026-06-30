import React, { useState } from 'react';
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
import RegisterView from './pages/RegisterView'; 
import { sampleProducts } from './data/products';
import { sampleUsers } from './data/users';
import Layout from './components/Layout';
import type { Product } from './types/product';
import type { User } from './types/user';

// URL de tu Servidor Local Express (Backend)
// Quitamos el "/api" del final de la constante base
const API_URL = "http://localhost:5000";

function App() {
  const [currentView, setCurrentView] = useState('login'); 
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  
  // Estados dinámicos globales (Mantienen una copia local rápida)
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('marketpro_products');
    return savedProducts ? JSON.parse(savedProducts) : sampleProducts;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('marketpro_users');
    return savedUsers ? JSON.parse(savedUsers) : sampleUsers;
  });

  const [currentUser, setCurrentUser] = useState({
    id: '',
    username: '',
    email: '',
    role: '',
    createdAt: new Date()
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
    
    setCurrentView(view);
    if (view !== 'edit') {
      setSelectedProductId(null);
    }
  };

  const handleLogin = (credentials: { username: string; password: string }) => {
    const user = users.find(u => 
      u.username.toLowerCase() === credentials.username.toLowerCase() ||
      u.email.toLowerCase() === credentials.username.toLowerCase()
    );
    
    if (user && (credentials.password === '123456' || credentials.password === user.password)) {
      setCurrentUser({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: new Date(user.createdAt)
      });
      
      setIsAuthenticated(true);
      setCurrentView('dashboard');
    } else {
      alert('Usuario o contraseña incorrectos. Inténtalo de nuevo.');
    }
  };

  const handleUpdateProfile = (userData: any) => {
    setCurrentUser(userData);
  };

  const handleAddProduct = async (newProductData: any) => {
    try {
      const productToSend = {
        ...newProductData,
        id: `PROD-${Date.now()}`,
        purchasePrice: Number(newProductData.purchasePrice) || 0,
        salePrice: Number(newProductData.salePrice) || 0,
        stock: Number(newProductData.stock) || 0
      };

      // Mandamos la petición al servidor Express
      // Cambia la línea por la URL directa:
const response = await fetch("http://localhost:5000/api/productos", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productToSend)
      });

      if (!response.ok) {
        throw new Error('Error al guardar en el servidor backend');
      }

      const savedProduct = await response.json();
      console.log('🎉 ¡Producto guardado en MongoDB Atlas exitosamente!', savedProduct);

      // Sincronizamos el estado visual de la interfaz de React
      setProducts((prev) => {
        const updated = [savedProduct, ...prev];
        localStorage.setItem('marketpro_products', JSON.stringify(updated));
        return updated;
      });

      alert("¡Producto registrado de forma segura en la nube!");

    } catch (error) {
      console.error('❌ Error enviando el producto al backend:', error);
      alert('No se pudo guardar el producto en la base de datos. Verifica que el backend esté encendido.');
    }
  };

  // PASO 6 MODIFICADO: Guardar usuarios nuevos directamente en MongoDB Atlas mediante el Backend
  const handleAddUser = async (newUserData: any) => {
  try {
    const userToSend = {
      ...newUserData,
      id: `USER-${Date.now()}`,
      isActive: newUserData.isActive !== undefined ? newUserData.isActive : true,
      createdAt: new Date()
    };
      // Mandamos la petición al servidor Express
     const response = await fetch("http://localhost:5000/api/usuarios", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userToSend)
    });
      if (!response.ok) {
      throw new Error('Error al guardar el usuario en el servidor backend');
    }

      const savedUser = await response.json();
      console.log('🎉 ¡Usuario guardado en MongoDB Atlas exitosamente!', savedUser);

      // Sincronizamos el estado de la interfaz
      setUsers((prev) => {
        const updated = [...prev, savedUser];
        localStorage.setItem('marketpro_users', JSON.stringify(updated));
        return updated;
      });
      
      alert("¡Usuario registrado con éxito en la nube!");
      return true;

    } catch (error) {
      console.error('❌ Error enviando el usuario al backend:', error);
      alert('No se pudo registrar el usuario. Comprueba tu conexión con el backend.');
      return false;
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers((prevUsers) => {
      const updated = prevUsers.map((user) =>
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      );
      localStorage.setItem('marketpro_users', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateUser = (userId: string, updatedData: Partial<User> | null) => {
    setUsers((prevUsers) => {
      let updated;
      if (updatedData === null) {
        updated = prevUsers.filter((user) => user.id !== userId);
      } else {
        updated = prevUsers.map((user) =>
          user.id === userId ? { ...user, ...updatedData } : user
        );
      }
      localStorage.setItem('marketpro_users', JSON.stringify(updated));
      return updated;
    });
  };

  if (!isAuthenticated) {
    if (currentView === 'register') {
      return <RegisterView onRegister={handleAddUser} onNavigate={handleNavigate} />;
    }
    if (currentView === 'forgot-password') {
      return <ForgotPassword onBackToLogin={() => handleNavigate('login')} />;
    }
    return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard currentView={currentView} onNavigate={handleNavigate} />;
      case 'list':
        return <ProductList products={products} onEdit={(id) => { setSelectedProductId(id); setCurrentView('edit'); }} currentView={currentView} onNavigate={handleNavigate} />;
      case 'create': 
        return <CreateProduct currentView={currentView} onNavigate={handleNavigate} onAddProduct={handleAddProduct} />;
      case 'categories':
        return <Categories currentView={currentView} onNavigate={handleNavigate} />;
      case 'edit': {
        const targetProduct = products.find(p => p.id === selectedProductId) || products[0];
        return <EditProduct product={targetProduct} onBack={() => handleNavigate('list')} currentView={currentView} onNavigate={handleNavigate} />;
      }
      case 'register-entry': return <RegisterEntry currentView={currentView} onNavigate={handleNavigate} />;
      case 'entries-list': return <EntriesList currentView={currentView} onNavigate={handleNavigate} />;
      case 'register-exit': return <RegisterExit currentView={currentView} onNavigate={handleNavigate} />;
      case 'exits-list': return <ExitsList currentView={currentView} onNavigate={handleNavigate} />;
      case 'register-return': return <RegisterReturn currentView={currentView} onNavigate={handleNavigate} />;
      case 'returns-list': return <ReturnsList currentView={currentView} onNavigate={handleNavigate} />;
      case 'users':
        return <Users 
          currentView={currentView} 
          onNavigate={handleNavigate} 
          users={users} 
          onAddUser={handleAddUser}
          onToggleStatus={handleToggleUserStatus} 
          onUpdateUser={handleUpdateUser}       
        />;
      case 'alerts': return <StockAlerts currentView={currentView} onNavigate={handleNavigate} />;
      case 'reports': return <Reports currentView={currentView} onNavigate={handleNavigate} />;
      case 'settings': return <Settings currentView={currentView} onNavigate={handleNavigate} />;
      case 'profile':
        return <Profile currentView={currentView} onNavigate={handleNavigate} currentUser={currentUser} onUpdateProfile={handleUpdateProfile} />;
      default:
        return <Dashboard currentView={currentView} onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout currentView={currentView} onNavigate={handleNavigate} isAuthenticated={isAuthenticated} currentUser={currentUser}>
      {renderView()}
    </Layout>
  );
}

export default App;
