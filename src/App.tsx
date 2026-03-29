import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NotificationCenterPage from './pages/NotificationCenterPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<NotificationCenterPage />} />
    </Routes>
  );
};

export default App;
