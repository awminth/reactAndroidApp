import React, { useState, useEffect } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ViewState } from '../types';
import { API_URLS } from '../config';

interface HomeScreenProps {
  onViewChange: (view: ViewState) => void;
  studentName?: string;
}

interface AcademicYear {
    AID: number;
    Name: string;
    Rmk?: string;
    IsActive: number;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onViewChange, studentName }) => {
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const [activeYears, setActiveYears] = useState<AcademicYear[]>([]);
  const navigate = useNavigate();

  // Time-based Greeting Logic
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const greeting = getGreeting();
  // Use passed studentName or fallback to 'Student' (or 'John' if you prefer a different default)
  const displayName = studentName || 'Student';

  useEffect(() => {
    // Fetch Active Years
    fetch(API_URLS.activeYears)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setActiveYears(data.data);
            }
        })
        .catch(err => console.error("Failed to fetch active years:", err));
  }, []);

  return (
    <div className="flex flex-col h-full w-full max-w-3xl md:max-w-5xl mx-auto px-5 pt-6 pb-32 overflow-y-auto custom-scrollbar">
      
      {/* Header Section */}
      <div className="mb-6 animate-fade-in">
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">{currentDate}</p>
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-white dark:to-zinc-400">
          {greeting},<br /> {displayName}
        </h1>
      </div>

      {/* Active Years Section */}
      {activeYears.length > 0 && (
          <div className="mb-6 animate-slide-in">
              <h4 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-2">
                  <Calendar size={16} /> Active Academic Years
              </h4>
      <div className={`grid gap-3 ${activeYears.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                  {activeYears.map(year => (
                      <div 
                        key={year.AID} 
                        onClick={() => navigate('/features')}
                        className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-4 py-4 rounded-2xl shadow-sm flex flex-col justify-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors"
                      >
                          <p className="text-xs text-zinc-400 uppercase font-bold tracking-wider mb-0.5">Year</p>
                          <p className="text-xl font-bold text-indigo-500 dark:text-indigo-400">{year.Name}</p>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {/* Feature Cards Grid (Removed/Moved to Page) */}
      {/* <HomeCards onViewChange={onViewChange} /> */}

      {/* SMS Widgets Grid */}
      <div className="grid grid-cols-2 gap-4 mt-2 animate-slide-in">
        
        {/* Attendance Widget */}
        <div className="col-span-1 bg-white dark:bg-zinc-800 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-700 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Calendar size={48} className="text-emerald-500" />
            </div>
            <div className="flex flex-col h-full justify-between">
                <div>
                    <h3 className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">Attendance</h3>
                    <p className="text-2xl font-bold text-zinc-800 dark:text-white mt-1">95%</p>
                </div>
                <div className="mt-3">
                    <div className="w-full bg-zinc-100 dark:bg-zinc-700 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Present Today
                    </p>
                </div>
            </div>
        </div>

        {/* Fees Widget */}
        <div className="col-span-1 bg-gradient-to-br from-indigo-500 to-violet-600 p-4 rounded-3xl shadow-lg shadow-indigo-500/20 text-white relative overflow-hidden">
             <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
             <div className="flex flex-col h-full justify-between relative z-10">
                <div>
                     <h3 className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-1">Fee Status</h3>
                     <p className="text-lg font-bold flex items-center gap-1">
                        Paid <span className="bg-white/20 p-0.5 rounded-full"><ChevronRight size={12} /></span>
                     </p>
                </div>
                <div className="mt-2 text-xs text-indigo-100/80">
                    No active dues
                </div>
            </div>
        </div>

        {/* Timetable / Next Class Widget */}
        <div className="col-span-2 bg-white dark:bg-zinc-800 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-700 shadow-sm flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Calendar size={24} />
             </div>
             <div className="flex-1">
                <h3 className="text-zinc-800 dark:text-white font-semibold text-sm">Mathematics</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs">09:00 AM - 10:30 AM • Room 302</p>
             </div>
             <div className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-medium">
                Next
             </div>
        </div>

      </div>

    </div>
  );
};

export default HomeScreen;
