import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Login } from '@/pages/Login/Login';
import { appChildRoutes } from '@/router/AppRouteElements';

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {appChildRoutes}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
