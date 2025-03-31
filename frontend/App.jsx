import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import { SocketProvider } from './context/SocketContext';
import { Navbar } from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import authService from './services/authService';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Feedback from './pages/Feedback';
import Alerts from './pages/Alerts';
import Analytics from './pages/Analytics';
import Integrations from './pages/Integrations';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Check for saved sidebar state
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setSidebarCollapsed(JSON.parse(savedState));
    }
  }, []);
  
  // Save sidebar state on change
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  return (
    <Router>
      <AuthProvider>
        <EventProvider>
          <SocketProvider>
            <div className="flex h-screen bg-gray-100">
              {authService.isAuthenticated() && (
                <Sidebar 
                  collapsed={sidebarCollapsed} 
                  setCollapsed={setSidebarCollapsed} 
                />
              )}
              
              <div className="flex flex-col flex-1 overflow-hidden">
                {authService.isAuthenticated() && (
                  <Navbar toggleSidebar={toggleSidebar} />
                )}
                
                <main className="flex-1 overflow-y-auto bg-gray-50">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected routes */}
                    <Route 
                      path="/" 
                      element={
                        <ProtectedRoute>
                          <Navigate to="/dashboard" />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/events" 
                      element={
                        <ProtectedRoute>
                          <Events />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/feedback" 
                      element={
                        <ProtectedRoute>
                          <Feedback />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/alerts" 
                      element={
                        <ProtectedRoute>
                          <Alerts />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/analytics" 
                      element={
                        <ProtectedRoute>
                          <Analytics />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/integrations" 
                      element={
                        <ProtectedRoute>
                          <Integrations />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/settings" 
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Not found route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </div>
          </SocketProvider>
        </EventProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;