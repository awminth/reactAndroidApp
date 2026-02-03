import React from 'react';
import { LogOut, Settings as SettingsIcon } from 'lucide-react';

interface SettingsScreenProps {
  onLogout: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onLogout }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-zinc-500 p-8 text-center animate-fade-in w-full max-w-3xl mx-auto md:max-w-5xl">
       <div className="w-24 h-24 rounded-full bg-white dark:bg-zinc-800 border-2 border-indigo-500/50 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
            <SettingsIcon size={32} className="text-zinc-800 dark:text-white" />
       </div>
       <h3 className="text-xl font-semibold text-zinc-800 dark:text-white mb-2">Settings</h3>
       <p className="mb-6 text-indigo-500 dark:text-indigo-400 font-medium">App Version 1.0.0</p>
       <button 
         onClick={onLogout}
         className="flex items-center gap-2 px-6 py-2 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
       >
         <LogOut size={18} /> Sign Out
       </button>
    </div>
  );
};

export default SettingsScreen;
