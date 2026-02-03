import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Sun, Moon, LogOut, Settings as SettingsIcon } from 'lucide-react';

import Drawer from './components/layout/Drawer';
import BottomNav from './components/layout/BottomNav';
import ChatInterface from './components/chat/ChatInterface';
import LoginScreen from './pages/LoginScreen';
import HomeScreen from './pages/HomeScreen';
import FeaturesScreen from './pages/FeaturesScreen';
import StudentFeeScreen from './pages/StudentFeeScreen';
import StudentExamScreen from './pages/StudentExamScreen';
import StudentActivityScreen from './pages/StudentActivityScreen';
import StudentAttendanceScreen from './pages/StudentAttendanceScreen';
import StudentProfileScreen from './pages/StudentProfileScreen';
import AnnouncementsScreen from './pages/AnnouncementsScreen';
import ChangePasswordScreen from './pages/ChangePasswordScreen';
import SettingsScreen from './pages/SettingsScreen';
import { ViewState, ChatMessage } from './types';
import { sendMessageToGemini } from './services/geminiService';
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebaseConfig";
import { API_URLS } from './config';

const MainLayout: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [studentIds, setStudentIds] = useState<{ studentId: number | null; earStudentId: number | null }>({ studentId: null, earStudentId: null });
  const [studentName, setStudentName] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [selectedYearId, setSelectedYearId] = useState<number | null>(null);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(true);

  // UI State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Chat State
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I'm Nebula. How can I assist you today?",
      timestamp: Date.now(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Router Hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Determine current view from path for BottomNav
  const getCurrentView = (): ViewState => {
    const path = location.pathname.substring(1); // remove leading slash
    if (path === 'home' || path === 'chat' || path === 'settings') {
      return path as ViewState;
    }
    return 'home'; // default
  };

  const currentView = getCurrentView();

  // Theme Effect
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Save Token to Backend
  const saveTokenToBackend = async (token: string, uid: number) => {
    try {
      await fetch(`${API_URLS.base}/api/update-fcm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: uid, token }),
      });
      console.log('Token sent to backend for user:', uid);
    } catch (err) {
      console.error('Failed to save token to backend:', err);
    }
  };

  // Request Permission & Save Token listener
  useEffect(() => {
    const handleTokenLogic = async () => {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                const token = await getToken(messaging, {
                    vapidKey: "BIoGlYdbcNC16kVE_8jGRM7xZMZWus4pGAlnEHXOAQkMdzzvwCKOrz9Iat28Hcz0H-lCZ2XCO-4Ng-hpkh2jjIw"
                });
                console.log('FCM Token:', token);
                
                // If user is already logged in, save token immediately
                if (userId) {
                    saveTokenToBackend(token, userId);
                }
            }
        } catch (error) {
            console.error('Notification setup error:', error);
        }
    };

    handleTokenLogic();
    
    // Listen for incoming messages
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      const { title, body } = payload.notification || {};
      if (title) {
          // Use a more subtle notification or toast in real app
          // alert(`New Notification: ${title} - ${body}`);
          // For now, removing alert to be less intrusive, or could use a custom toast
          console.log(`Notification: ${title} - ${body}`);
      }
    });
  }, [userId]); // Re-run when userId changes (login)

  // Handlers
  const handleLogin = (studentData?: { userId: number; studentId: number; earStudentId: number, studentName?: string, username?: string }) => {
    setIsAuthenticated(true);
    if (studentData) {
        setUserId(studentData.userId);
        setStudentIds({ studentId: studentData.studentId, earStudentId: studentData.earStudentId });
        if(studentData.studentName) {
            setStudentName(studentData.studentName);
        }
        if (studentData.username) {
            setUsername(studentData.username);
        }
    }
    navigate('/home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsDrawerOpen(false);
    navigate('/login');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleViewChange = (view: ViewState) => {
    navigate(`/${view}`);
  };

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setIsLoading(true);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const apiHistory = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await sendMessageToGemini(userText, apiHistory);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Sorry, I encountered an error connecting to the network.",
        timestamp: Date.now(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  // Protected Route Wrapper
  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  // If on login page but authenticated, redirect to home
  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/home" replace />;
  }

  if (location.pathname === '/login') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-zinc-50 dark:bg-background text-zinc-900 dark:text-zinc-100 overflow-hidden relative transition-colors duration-300">
      
      {/* Top App Bar */}
      <header className="flex items-center justify-between px-4 py-3 bg-white/50 dark:bg-black/20 backdrop-blur-md z-20 absolute top-0 w-full border-b border-zinc-200/50 dark:border-zinc-800/50">
          <button 
              onClick={toggleDrawer}
              className="p-2 -ml-2 text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-white rounded-lg transition-colors"
          >
              <Menu size={24} />
          </button>
          <h1 className="text-lg font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500 drop-shadow-sm">Nebula AI</h1>
          
          <div className="flex items-center gap-2">
             <button
               onClick={toggleTheme}
               className="p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
             >
               {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>
          </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden pt-14 pb-20 relative z-10">
          <Routes>
             <Route path="/home" element={
            isAuthenticated ? <HomeScreen onViewChange={handleViewChange} studentName={studentName} onYearSelect={setSelectedYearId} /> : <Navigate to="/login" replace />
          } />
          
          <Route path="/chat" element={
            isAuthenticated ? (
              <ChatInterface
                messages={messages}
                input={input}
                setInput={setInput}
                isLoading={isLoading}
                onSendMessage={(text) => {
                    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() };
                    setMessages(prev => [...prev, userMsg]);
                    setIsLoading(true);
                    
                    // Simulate AI Response
                    setTimeout(() => {
                        const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: "I'm a demo AI. Logic coming soon!", timestamp: Date.now() };
                        setMessages(prev => [...prev, aiMsg]);
                        setIsLoading(false);
                    }, 1000);
                }}
                isDark={isDarkMode}
              />
            ) : <Navigate to="/login" replace />
          } />
          
          <Route path="/features" element={
             isAuthenticated ? <FeaturesScreen onViewChange={handleViewChange} /> : <Navigate to="/login" replace />
          } />
          
          <Route path="/fees" element={
              isAuthenticated ? <StudentFeeScreen studentId={studentIds.earStudentId} yearId={selectedYearId} /> : <Navigate to="/login" replace />
          } />
          
          <Route path="/exams" element={
              isAuthenticated ? <StudentExamScreen studentId={studentIds.earStudentId} /> : <Navigate to="/login" replace />
          } />

          <Route path="/activities" element={
              isAuthenticated ? <StudentActivityScreen studentId={studentIds.earStudentId} /> : <Navigate to="/login" replace />
          } />

          <Route path="/attendance" element={
              isAuthenticated ? <StudentAttendanceScreen studentId={studentIds.earStudentId} /> : <Navigate to="/login" replace />
          } />

          <Route path="/profile" element={
              isAuthenticated ? <StudentProfileScreen studentId={studentIds.studentId} /> : <Navigate to="/login" replace />
          } />

          <Route path="/announcements" element={
              isAuthenticated ? <AnnouncementsScreen /> : <Navigate to="/login" replace />
          } />

          <Route path="/change-password" element={
              isAuthenticated ? <ChangePasswordScreen userId={userId} /> : <Navigate to="/login" replace />
          } />

          <Route path="/settings" element={
                <SettingsScreen onLogout={handleLogout} />
             } />
             <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
      </main>

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} studentName={username || studentName} />
      
      <BottomNav currentView={currentView} onViewChange={handleViewChange} isDark={isDarkMode} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
};

export default App;