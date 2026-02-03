import React from 'react';
import { Banknote, GraduationCap, Activity, CalendarClock, UserCheck, ArrowUpRight } from 'lucide-react';
import { ViewState } from '../types';

interface HomeCardsProps {
  onViewChange: (view: ViewState) => void;
}

const HomeCards: React.FC<HomeCardsProps> = ({ onViewChange }) => {
  const features = [
    {
      id: 'fees',
      title: 'Student Fee',
      description: 'View payment status',
      icon: Banknote,
      gradient: 'from-emerald-500 to-teal-500',
      colSpan: 'col-span-1',
      action: () => onViewChange('fees' as ViewState)
    },
    {
      id: 'marks',
      title: 'Exam Marks',
      description: 'Check your grades',
      icon: GraduationCap,
      gradient: 'from-blue-500 to-indigo-500',
      colSpan: 'col-span-1',
      action: () => onViewChange('exams' as ViewState)
    },
    {
      id: 'activities',
      title: 'Activities',
      description: 'Events & Participation',
      icon: Activity,
      gradient: 'from-orange-500 to-red-500',
      colSpan: 'col-span-2',
      action: () => onViewChange('activities' as ViewState)
    },
    {
      id: 'timetable',
      title: 'TimeTable',
      description: 'Class schedule',
      icon: CalendarClock,
      gradient: 'from-purple-500 to-fuchsia-500',
      colSpan: 'col-span-1',
      action: () => onViewChange('chat')
    },
     {
      id: 'attendance',
      title: 'Attendance',
      description: 'Check detailed records',
      icon: UserCheck,
      gradient: 'from-pink-500 to-rose-500',
      colSpan: 'col-span-1',
      action: () => onViewChange('attendance' as ViewState)
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 animate-slide-in">
      {features.map((feature) => {
        const Icon = feature.icon;
        return (
            <button
            key={feature.id}
            onClick={feature.action}
            className={`relative group overflow-hidden rounded-3xl p-5 text-left transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-xl ${feature.colSpan} bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800`}
            >
            {/* Background Gradient on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
            
            {/* Corner Icon */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1">
                <ArrowUpRight size={20} className="text-zinc-400" />
            </div>

            <div className="flex flex-col h-full justify-between relative z-10">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon size={24} className="text-white" />
                </div>
                
                <div>
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {feature.title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                    {feature.description}
                </p>
                </div>
            </div>
            </button>
        );
      })}
    </div>
  );
};

export default HomeCards;
