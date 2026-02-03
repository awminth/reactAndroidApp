import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ViewState } from '../types';
import HomeCards from '../components/HomeCards';

interface FeaturesScreenProps {
  onViewChange: (view: ViewState) => void;
}

const FeaturesScreen: React.FC<FeaturesScreenProps> = ({ onViewChange }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto px-5 pt-6 pb-32 overflow-y-auto custom-scrollbar">
      
      {/* Header with Back Button */}
      <div className="flex items-center gap-3 mb-6 animate-fade-in">
        <button 
          onClick={() => navigate('/home')}
          className="p-2 -ml-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
            <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
            Features
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">Explore available tools.</p>
        </div>
      </div>
      
      <HomeCards onViewChange={onViewChange} />
    </div>
  );
};

export default FeaturesScreen;
