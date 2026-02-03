import React, { useEffect, useState } from 'react';
import { ArrowLeft, Download, FileText, Calendar, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../config';

interface StudentActivity {
    AID: number;
    Title?: string; // Schema didn't explicitly show Title, but Description logic implies usage. Using Description as main text if title missing.
    Description: string;
    Date: string;
    File: string | null;
}

interface StudentActivityScreenProps {
    studentId: number | null;
}

const StudentActivityScreen: React.FC<StudentActivityScreenProps> = ({ studentId }) => {
    const navigate = useNavigate();
    const [activities, setActivities] = useState<StudentActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!studentId) {
            setLoading(false);
            return;
        }

        const fetchActivities = async () => {
            try {
                const response = await fetch(`${API_URLS.base}/api/activities?studentId=${studentId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch activities');
                }
                const data = await response.json();
                setActivities(data);
            } catch (err) {
                console.error(err);
                setError('Unable to load activities');
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, [studentId]);

    const handleDownload = (fileName: string) => {
         // Assuming files are served from a static endpoint or we can construct a download URL
         // Typically: API_URLS.base + '/uploads/' + fileName, or similar.
         // For now, using a direct link assumption based on standard express static serving.
         // If `File` is just a filename "homework.pdf", we need the base path.
         // I'll assume they are served relative to backend base for now.
         
         const downloadUrl = `${API_URLS.base}/api/uploads/activities/${fileName}`; // Hypothetical path
         window.open(downloadUrl, '_blank');
    };

    return (
        <div className="flex flex-col h-full w-full bg-zinc-50 dark:bg-background transition-colors duration-300">
            {/* Header */}
            <div className="px-5 pt-6 pb-4 bg-white/50 dark:bg-black/20 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 sticky top-0 z-20">
                <div className="flex items-center gap-3 max-w-3xl mx-auto">
                    <button 
                        onClick={() => navigate('/features')}
                        className="p-2 -ml-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-800 dark:text-white flex items-center gap-2">
                             <Activity className="text-orange-500" size={24} />
                             Activities
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs">Events & Participation History</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                <div className="max-w-3xl mx-auto space-y-4">
                    
                    {loading ? (
                         <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-sm">Loading activities...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 text-red-500">
                            <p>{error}</p>
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="text-center py-20 text-zinc-400">
                            <FileText size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No activities found.</p>
                        </div>
                    ) : (
                        activities.map((activity, index) => (
                            <div 
                                key={activity.AID} 
                                className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 animate-slide-in overflow-hidden"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Activity size={80} className="text-indigo-500 transform rotate-12 translate-x-4 -translate-y-4" />
                                </div>

                                <div className="relative z-10 flex flex-col md:flex-row gap-6">
                                    {/* Date Column */}
                                    <div className="shrink-0 flex md:flex-col items-center md:items-start gap-2">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
                                            {new Date(activity.Date).getDate()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs uppercase font-bold text-zinc-400">
                                                {new Date(activity.Date).toLocaleString('default', { month: 'short' })}
                                            </span>
                                            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-500">
                                                {new Date(activity.Date).getFullYear()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Column */}
                                    <div className="flex-1 space-y-3">
                                        <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 leading-snug">
                                            {activity.Description}
                                        </h3>
                                        
                                        <div className="flex items-center gap-3">
                                            {activity.File && (
                                                <button 
                                                    onClick={() => handleDownload(activity.File!)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                                                >
                                                    <Download size={16} />
                                                    Download Attachment
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                </div>
            </div>
        </div>
    );
};

export default StudentActivityScreen;
