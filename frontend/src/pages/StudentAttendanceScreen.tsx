import React, { useEffect, useState } from 'react';
import { ArrowLeft, UserCheck, Calendar, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../config';

interface AttendanceRecord {
    AID: number;
    AttendanceDate: string;
    Status: number; // Assuming 1 = Present, 0 = Absent based on schema default
    StatusRmk: string | null;
}

interface StudentAttendanceScreenProps {
    studentId: number | null;
}

const StudentAttendanceScreen: React.FC<StudentAttendanceScreenProps> = ({ studentId }) => {
    const navigate = useNavigate();
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!studentId) {
            setLoading(false);
            return;
        }

        const fetchAttendance = async () => {
            try {
                const response = await fetch(`${API_URLS.base}/api/attendance?studentId=${studentId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch attendance');
                }
                const data = await response.json();
                setRecords(data);
            } catch (err) {
                console.error(err);
                setError('Unable to load attendance records');
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [studentId]);

    const getStatusInfo = (status: number) => {
        // Mapping based on typical conventions, can be adjusted if user provides specific logic
        // Status 1 is default in schema, usually implies Present.
        // Let's assume: 1 = Present, 0 = Absent, 2 = Leave/Late (if applicable)
        switch (status) {
            case 1:
                return { label: 'Present', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/20', icon: CheckCircle2 };
            case 0:
                return { label: 'Absent', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/20', icon: XCircle };
            default:
                return { label: 'Unknown', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/20', icon: AlertCircle };
        }
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
                             <UserCheck className="text-pink-500" size={24} />
                             Attendance
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs">Track your daily presence</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                <div className="max-w-3xl mx-auto space-y-4">
                    
                    {loading ? (
                         <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-sm">Loading records...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 text-red-500">
                            <p>{error}</p>
                        </div>
                    ) : records.length === 0 ? (
                        <div className="text-center py-20 text-zinc-400">
                            <UserCheck size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No attendance records found.</p>
                        </div>
                    ) : (
                        records.map((record, index) => {
                            const statusInfo = getStatusInfo(record.Status);
                            const StatusIcon = statusInfo.icon;
                            
                            return (
                                <div 
                                    key={record.AID} 
                                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-in flex items-center justify-between"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl ${statusInfo.bg} flex items-center justify-center shrink-0`}>
                                            <StatusIcon className={statusInfo.color} size={24} />
                                        </div>
                                        
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Calendar size={14} className="text-zinc-400" />
                                                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                                                    {new Date(record.AttendanceDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                </span>
                                            </div>
                                            {record.StatusRmk && (
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
                                                    Note: {record.StatusRmk}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.bg.replace('bg-', 'border-').replace('/20', '/50')} ${statusInfo.color}`}>
                                        {statusInfo.label}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentAttendanceScreen;
