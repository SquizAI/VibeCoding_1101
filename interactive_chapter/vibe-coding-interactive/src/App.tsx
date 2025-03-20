import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './styles/ThemeProvider';
import HomePage from './components/pages/HomePage';
import InteractiveDemoPage from './components/pages/InteractiveDemoPage';
import TeacherDashboard from './components/admin/TeacherDashboard';
import StudentDashboard from './components/student/StudentDashboard';
import GlobalStyles from './styles/GlobalStyles';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/interactive" element={<InteractiveDemoPage />} />
            
            {/* Placeholder routes for other pages - to be implemented */}
            <Route path="/examples" element={<div className="container text-center">Examples Page - Coming Soon</div>} />
            <Route path="/beginner" element={<div className="container text-center">Beginner Content - Coming Soon</div>} />
            <Route path="/advanced" element={<div className="container text-center">Advanced Content - Coming Soon</div>} />
            <Route path="/ninja" element={<div className="container text-center">Ninja Content - Coming Soon</div>} />
            <Route path="/resources" element={<div className="container text-center">Resources Page - Coming Soon</div>} />
            
            {/* Teacher dashboard route */}
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher-dashboard/:chapterId" element={<TeacherDashboard />} />
            
            {/* Student dashboard route */}
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            
            {/* Fallback route for any undefined paths */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
