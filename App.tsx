import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ProjectForm } from './components/ProjectForm';
import { BusinessOverview } from './components/BusinessOverview';
import { AdminPage } from './components/AdminPage';

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/overview" element={<BusinessOverview />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/new" element={<ProjectForm />} />
            <Route path="/project/:id" element={<ProjectForm />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppProvider>
  );
};

export default App;