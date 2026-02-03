import React from 'react';
import { X, User, Settings, HelpCircle, LogOut, Sparkles, Zap, Shield, ChevronRight, Bell, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, studentName }) => {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
      if (!name) return '??';
      return name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
  };
  
  return (
    <>
      {/* Overlay Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 left-0 bottom-0 z-50 w-80 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border-r border-white/20 dark:border-white/5 shadow-2xl transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } overflow-hidden`}
      >
        {/* Ambient Background Glows */}
        <div className="absolute top-[-10%] right-[-30%] w-[80%] h-[40%] bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[60%] h-[40%] bg-fuchsia-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          
          {/* Header & Profile Section */}
          <div className="p-6 pb-8">
            <div className="flex justify-between items-start mb-6">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <span className="font-bold text-lg tracking-tight text-zinc-800 dark:text-white">Nebula</span>
               </div>
               <button
                onClick={onClose}
                className="p-2 -mr-2 text-zinc-400 hover:text-zinc-800 dark:hover:text-white rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Profile Card */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-orange-400">
                  <div className="w-full h-full rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-zinc-900">
                     <span className="text-xl font-bold text-zinc-700 dark:text-zinc-300">
                        {getInitials(studentName || 'Guest')}
                     </span>
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full"></div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight">
                    {studentName || 'Guest User'}
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                   <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-200 to-yellow-400 text-[10px] font-bold text-yellow-900 uppercase tracking-wide flex items-center gap-1">
                     <Sparkles size={8} fill="currentColor" /> Pro
                   </span>
                   <span className="text-xs text-zinc-500">Free Trial</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
            <p className="px-4 mb-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">General</p>
            <DrawerItem 
                icon={<User size={20} />} 
                label="My Profile" 
                onClick={() => {
                    navigate('/profile');
                    onClose();
                }}
            />
            <DrawerItem 
                icon={<Bell size={20} />} 
                label="All Announcements" 
                onClick={() => {
                    navigate('/announcements');
                    onClose();
                }}
            />
            <DrawerItem 
                icon={<Lock size={20} />} 
                label="Change Password" 
                onClick={() => {
                    navigate('/change-password');
                    onClose();
                }}
            />
            <DrawerItem icon={<Settings size={20} />} label="Preferences" />
            <DrawerItem icon={<Shield size={20} />} label="Privacy & Security" />
            
            <div className="my-6 border-t border-zinc-200/50 dark:border-white/5" />
            
            <p className="px-4 mb-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Support</p>
            <DrawerItem icon={<HelpCircle size={20} />} label="Help Center" />
            <DrawerItem icon={<Zap size={20} />} label="Feature Request" />
          </nav>

          {/* Footer / Usage Card */}
          <div className="p-4">
             {/* Usage Stat Card */}
             <div className="bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl p-4 mb-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Tokens Used</span>
                      <span className="text-xs font-bold text-indigo-500">85%</span>
                   </div>
                   <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[85%] rounded-full" />
                   </div>
                   <button className="mt-3 w-full py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                      Upgrade Plan
                   </button>
                </div>
             </div>

            <button className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all group">
              <span className="flex items-center gap-3">
                <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                Sign Out
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const DrawerItem: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void }> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center justify-between w-full px-4 py-3.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-all group"
  >
    <div className="flex items-center gap-3">
      <span className="text-zinc-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
        {icon}
      </span>
      <span className="group-hover:translate-x-1 transition-transform">{label}</span>
    </div>
    <ChevronRight size={16} className="text-zinc-300 dark:text-zinc-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
  </button>
);

export default Drawer;
