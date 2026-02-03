import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Calendar, Award, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../config';

interface ExamSubject {
    AID: number;
    SubjectName: string;
    PayMark: number;
    GetMark: number;
    Result: string;
}

interface ExamVoucher {
    AID: number;
    ExamTypeName: string;
    Date: string;
    TotalPayMark: number;
    TotalGetMark: number;
    details: ExamSubject[];
}

const StudentExamScreen: React.FC<{ studentId: number | null }> = ({ studentId }) => {
    const navigate = useNavigate();
    const [exams, setExams] = useState<ExamVoucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedExamId, setExpandedExamId] = useState<number | null>(null);

    useEffect(() => {
        if (!studentId) return;

        setLoading(true);
        const url = API_URLS.studentExams(studentId);
        
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setExams(data.data);
                    // Expand the first exam by default if available
                    if (data.data.length > 0) {
                        setExpandedExamId(data.data[0].AID);
                    }
                }
            })
            .catch(err => console.error("Failed to fetch exams:", err))
            .finally(() => setLoading(false));
    }, [studentId]);

    const toggleExpand = (id: number) => {
        setExpandedExamId(expandedExamId === id ? null : id);
    };

    return (
        <div className="flex flex-col h-full w-full max-w-3xl mx-auto px-5 pt-6 pb-20 overflow-y-auto custom-scrollbar bg-zinc-50 dark:bg-black/90">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 animate-fade-in">
                <button 
                    onClick={() => navigate('/features')}
                    className="p-2 -ml-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">Exam Marks</h1>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-400 animate-pulse">
                    <GraduationCap size={48} className="mb-4 opacity-50" />
                    <p>Loading exam results...</p>
                </div>
            ) : exams.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                    <BookOpen size={48} className="mb-4 opacity-50" />
                    <p>No exam records found.</p>
                </div>
            ) : (
                <div className="space-y-4 animate-slide-in">
                    {exams.map((exam) => (
                        <div key={exam.AID} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                            {/* Card Header */}
                            <div 
                                onClick={() => toggleExpand(exam.AID)}
                                className={`p-5 cursor-pointer transition-colors ${expandedExamId === exam.AID ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                            <Award size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-zinc-800 dark:text-white">{exam.ExamTypeName}</h3>
                                            <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                                <Calendar size={12} />
                                                {new Date(exam.Date).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <button className="text-zinc-400">
                                        {expandedExamId === exam.AID ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                </div>
                                
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex-1">
                                        <p className="text-xs text-zinc-500 uppercase font-semibold">Total Marks</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xl font-bold text-zinc-900 dark:text-white">{exam.TotalGetMark}</span>
                                            <span className="text-sm text-zinc-400">/ {exam.TotalPayMark}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 text-right">
                                        <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                                            (exam.TotalGetMark / exam.TotalPayMark) >= 0.8 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                            (exam.TotalGetMark / exam.TotalPayMark) >= 0.4 ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                                            'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                                        }`}>
                                            {((exam.TotalGetMark / exam.TotalPayMark) * 100).toFixed(0)}%
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body (Details) */}
                            {expandedExamId === exam.AID && (
                                <div className="px-5 pb-5 animate-fade-in">
                                    <div className="mt-2 pt-4 border-t border-zinc-100 dark:border-zinc-800/50 space-y-3">
                                        {exam.details.map((subject, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40">
                                                <div className="flex items-center gap-3">
                                                     <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-zinc-500 text-xs font-bold border border-zinc-100 dark:border-zinc-700">
                                                        {idx + 1}
                                                     </div>
                                                     <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                                         {subject.SubjectName || `Subject ${subject.AID}`}
                                                     </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`font-bold ${
                                                        subject.GetMark >= 80 ? 'text-emerald-500' : 
                                                        subject.GetMark < 40 ? 'text-red-500' : 'text-zinc-800 dark:text-white'
                                                    }`}>
                                                        {subject.GetMark}
                                                    </span>
                                                    <span className="text-xs text-zinc-400 ml-1">/ {subject.PayMark}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentExamScreen;
