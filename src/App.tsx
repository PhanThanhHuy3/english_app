import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';

// Layouts
import { ManagerLayout } from './components/layout/ManagerLayout';
import { LearnerLayout } from './components/layout/LearnerLayout';

// Auth Pages
import { LearnerLogin } from './pages/auth/LearnerLogin';
import { LearnerRegister } from './pages/auth/LearnerRegister';
import { ManagerLogin } from './pages/auth/ManagerLogin';

// Manager Pages
import { ManagerDashboard } from './pages/manager/Dashboard';
import { AccountManagement } from './pages/manager/AccountManagement';
import { ContentManager } from './pages/manager/ContentManager';

// Learner Pages
import { LearnerDashboard } from './pages/learner/Dashboard';
import { VocabularyHub } from './pages/learner/VocabularyHub';
import { GrammarPractice } from './pages/learner/GrammarPractice';
import { SpeakingLab } from './pages/learner/SpeakingLab';
import { ProgressTracker } from './pages/learner/ProgressTracker';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/learner/login" replace />} />

          {/* Auth Routes */}
          <Route path="/learner/login" element={<LearnerLogin />} />
          <Route path="/learner/register" element={<LearnerRegister />} />
          <Route path="/manager/login" element={<ManagerLogin />} />

          {/* Protected Manager Routes */}
          <Route element={<PrivateRoute allowedRole="manager" />}>
            <Route element={<ManagerLayout />}>
              <Route path="/manager/dashboard" element={<ManagerDashboard />} />
              <Route path="/manager/accounts" element={<AccountManagement />} />
              <Route path="/manager/content" element={<ContentManager />} />
              <Route path="/manager" element={<Navigate to="/manager/dashboard" replace />} />
            </Route>
          </Route>

          {/* Protected Learner Routes */}
          <Route element={<PrivateRoute allowedRole="learner" />}>
            <Route element={<LearnerLayout />}>
              <Route path="/learner/dashboard" element={<LearnerDashboard />} />
              <Route path="/learner/vocabulary" element={<VocabularyHub />} />
              <Route path="/learner/grammar" element={<GrammarPractice />} />
              <Route path="/learner/speaking" element={<SpeakingLab />} />
              <Route path="/learner/progress" element={<ProgressTracker />} />
              <Route path="/learner" element={<Navigate to="/learner/dashboard" replace />} />
            </Route>
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/learner/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
