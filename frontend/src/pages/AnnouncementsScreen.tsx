import React, { useEffect, useState } from 'react';
import { ArrowLeft, Bell, Download, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../config';

interface Announcement {
    AID: number;
    Description: string;
    File: string | null;
    Date: string;
}

const AnnouncementsScreen: React.FC = () => {
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await fetch(`${API_URLS.base}/api/announcements`);
                if (!response.ok) {
                    throw new Error('Failed to fetch announcements');
                }
                const data = await response.json();
                setAnnouncements(data);
            } catch (err) {
                console.error(err);
                setError('Unable to load announcements');
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    const handleDownload = (fileName: string) => {
        // Assuming files are served from a public/uploads directory or similar endpoint
        // You might need to adjust this URL based on how static files are served in your backend
        const fileUrl = `${API_URLS.base}/uploads/${fileName}`; 
        
        // Or if it's a direct link stored in DB, use it directly. 
        // For now, let's construct a download link. 
        // If the backend doesn't serve static files yet, we might need to add that.
        // Assuming a standard setup where 'File' is just the filename.
        
        window.open(fileUrl, '_blank');
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
                             <Bell className="text-pink-500" size={24} />
                             Announcements
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs">School Updates & News</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                <div className="max-w-3xl mx-auto space-y-4">
                    
                    {loading ? (
                         <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                            <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-sm">Checking for updates...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 text-red-500">
                            <p>{error}</p>
                        </div>
                    ) : announcements.length > 0 ? (
                        announcements.map((item) => (
                            <div key={item.AID} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none group-hover:bg-pink-500/10 transition-colors" />
                                
                                <div className="flex gap-4 relative z-10">
                                    <div className="shrink-0">
                                        <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center text-pink-600 dark:text-pink-400">
                                            <FileText size={24} />
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                                            <Calendar size={12} />
                                            {new Date(item.Date).toLocaleDateString(undefined, { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </div>
                                        
                                        <h3 className="text-zinc-800 dark:text-zinc-100 font-medium leading-relaxed">
                                            {item.Description}
                                        </h3>

                                        {item.File && (
                                            <button 
                                                onClick={() => handleDownload(item.File!)}
                                                className="inline-flex items-center gap-2 px-4 py-2 mt-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium transition-colors"
                                            >
                                                <Download size={16} />
                                                Download Attachment
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 text-zinc-400">
                             <Bell size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No announcements yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnnouncementsScreen;
