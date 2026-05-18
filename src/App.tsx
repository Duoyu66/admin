import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Login } from '@/pages/Login/Login';
import { Dashboard } from '@/pages/Dashboard/Dashboard';
import { Users } from '@/pages/Users/Users';
import { Roles } from '@/pages/Roles/Roles';
import { Permissions } from '@/pages/Permissions/Permissions';
import { Departments } from '@/pages/Departments/Departments';
import { Notices } from '@/pages/Notices/Notices';
import { NoticeForm } from '@/pages/Notices/NoticeForm';
import { Logs } from '@/pages/Logs/Logs';
import { MonitorOnline } from '@/pages/Monitor/MonitorOnline';
import { MonitorServer } from '@/pages/Monitor/MonitorServer';
import { MonitorDatasource } from '@/pages/Monitor/MonitorDatasource';
import { MonitorCache } from '@/pages/Monitor/MonitorCache';
import { MonitorJob } from '@/pages/Monitor/MonitorJob';
import { Profile } from '@/pages/Profile/Profile';
import { Settings } from '@/pages/Settings/Settings';
import { DemoForm } from '@/pages/Demo/DemoForm';
import { DemoTable } from '@/pages/Demo/DemoTable';
import { DemoModal } from '@/pages/Demo/DemoModal';
import { DemoMessage } from '@/pages/Demo/DemoMessage';
import { DemoOperation } from '@/pages/Demo/DemoOperation';
import { DemoChart } from '@/pages/Demo/DemoChart';
import { DemoIcon } from '@/pages/Demo/DemoIcon';
import { DemoNested } from '@/pages/Demo/DemoNested';
import { DemoException } from '@/pages/Demo/DemoException';
import { DemoMenuBadge } from '@/pages/Demo/DemoMenuBadge';

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
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="roles" element={<Roles />} />
          <Route path="permissions" element={<Permissions />} />
          <Route path="depts" element={<Departments />} />
          <Route path="notices" element={<Notices />} />
          <Route path="notices/new" element={<NoticeForm />} />
          <Route path="notices/:id/edit" element={<NoticeForm />} />
          <Route path="logs" element={<Logs />} />
          <Route path="monitor/online" element={<MonitorOnline />} />
          <Route path="monitor/server" element={<MonitorServer />} />
          <Route path="monitor/datasource" element={<MonitorDatasource />} />
          <Route path="monitor/cache" element={<MonitorCache />} />
          <Route path="monitor/job" element={<MonitorJob />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="demo/form" element={<DemoForm />} />
          <Route path="demo/table" element={<DemoTable />} />
          <Route path="demo/modal" element={<DemoModal />} />
          <Route path="demo/message" element={<DemoMessage />} />
          <Route path="demo/operation" element={<DemoOperation />} />
          <Route path="demo/chart" element={<DemoChart />} />
          <Route path="demo/icon" element={<DemoIcon />} />
          <Route path="demo/nested" element={<DemoNested />} />
          <Route path="demo/exception" element={<DemoException />} />
          <Route path="demo/badge" element={<DemoMenuBadge />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
