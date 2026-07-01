import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ToastContainer } from '../components/Toast';

const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-mesh transition-colors duration-300">
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
