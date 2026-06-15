import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNavBar } from './components/BottomNavBar';
import { HomeView } from './views/HomeView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { AdminView } from './views/AdminView';

const MainApp: React.FC = () => {
  const { currentView } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <>
      <Header />
      <main className="app-main-content">
        {renderView()}
      </main>
      <BottomNavBar />
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

export default App;
