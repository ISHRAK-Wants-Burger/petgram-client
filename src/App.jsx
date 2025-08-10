import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import VideoDetails from './pages/VideoDetails';





export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<Login />} />

        <Route path="/video/:id" element={<VideoDetails />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/upload" element={
          <RoleProtectedRoute requiredRole="creator">
            <Upload />
          </RoleProtectedRoute>
        } />

      </Routes>
    </div>
  );
}
