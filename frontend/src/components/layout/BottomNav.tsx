import React from 'react';
import { Home, Settings, MessageCircle } from 'lucide-react';
import { ViewState } from '../../types';

interface BottomNavProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  isDark: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onViewChange, isDark }) => {
  // SVG Path for the curve
  // Adjusted slightly for the smaller center button
  const curvePath = "M0,0 Lcalc(50% - 40px),0 Q50%,50 calc(50% + 40px),0 L100%,0 L100%,100 L0,100 Z";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="relative h-20 w-full drop-shadow-[0_-5px_10px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_-5px_10px_rgba(0,0,0,0.5)]">
        
        {/* SVG Background Shape */}
        <svg 
          className="absolute inset-0 w-full h-full text-white dark:text-[#18181b] transition-colors duration-300"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
          style={{ height: '80px', bottom: 0 }}
        >
           <path d="M0,25 H38 Q50,70 62,25 H100 V100 H0 Z" fill="currentColor" vectorEffect="non-scaling-stroke"/>
        </svg>

        {/* Content Container */}
        <div className="absolute inset-0 flex items-center justify-between px-10 pt-6 pb-2">
          
          {/* Left Action: Home */}
          <NavButton 
            active={currentView === 'home'} 
            onClick={() => onViewChange('home')}
            icon={<Home size={26} />}
          />

          {/* Center FAB (Message) */}
          {/* Reduced size to w-14 h-14 as requested */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-5">
            <button
              onClick={() => onViewChange('chat')}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/40 transition-transform active:scale-95 ${
                 currentView === 'chat' 
                 ? 'bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white scale-110' 
                 : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'
              }`}
            >
              <MessageCircle size={24} className={currentView === 'chat' ? 'animate-pulse' : ''} fill={currentView === 'chat' ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Right Action: Settings */}
          <NavButton 
            active={currentView === 'settings'} 
            onClick={() => onViewChange('settings')}
            icon={<Settings size={26} />}
          />
        </div>
      </div>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode }> = ({ active, onClick, icon }) => (
  <button 
    onClick={onClick}
    className={`p-3 transition-colors duration-300 ${
        active 
        ? 'text-indigo-500 dark:text-indigo-400' 
        : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
    }`}
  >
    {icon}
  </button>
);

export default BottomNav;