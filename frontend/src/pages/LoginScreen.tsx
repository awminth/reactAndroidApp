import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, Fingerprint } from 'lucide-react';
import { API_URLS } from '../config';

interface LoginScreenProps {
  onLogin: (studentData?: { userId: number; studentId: number; earStudentId: number, studentName?: string, username?: string }) => void;
}

const carouselImages = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
];

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [errorMSG, setErrorMSG] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMSG('');

    try {
      const response = await fetch(API_URLS.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onLogin({
            userId: data.user.id,
            studentId: data.user.studentId,
            earStudentId: data.user.earStudentId,
            studentName: data.user.studentName, // Extracted from response
            username: data.user.username
        });
      } else {
        setErrorMSG(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error', err);
      setErrorMSG('Unable to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] bg-background text-zinc-100 overflow-hidden flex flex-col md:block">
      
      {/* Carousel Area - Left side on desktop, top on mobile */}
      <div className="relative h-[35vh] w-full md:absolute md:inset-0 md:h-full md:z-0 overflow-hidden">
        {carouselImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img src={img} alt="Background" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-indigo-900/30 via-background/20 to-background" />
          </div>
        ))}
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
          {carouselImages.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === currentImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Login Form Area - Right side on desktop, bottom on mobile */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 relative z-10 md:w-full md:h-screen md:bg-black/40">
        
        {/* Header */}
        <div className="text-center mb-6 animate-slide-in">
          <div className="w-14 h-14 mx-auto mb-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Fingerprint size={28} className="text-indigo-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">
            Nebula AI
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm">Experience the future of intelligence.</p>
        </div>

        {/* Form Card */}
        <div className="w-full max-w-md bg-white/5 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/20 dark:border-white/5 p-6 md:p-8 rounded-3xl shadow-2xl animate-fade-in">
          
          {errorMSG && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center">
              {errorMSG}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Username / Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-zinc-900 dark:text-white placeholder-zinc-400 text-sm"
                  placeholder="Username or username@gmail.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-zinc-900 dark:text-white placeholder-zinc-400 text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-xs md:text-sm text-zinc-500">
              Don't have an account?{' '}
              <a href="#" className="text-indigo-400 font-medium hover:text-indigo-300">
                Create one
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;