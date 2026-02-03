import React, { useEffect, useState } from 'react';
import { ArrowLeft, User, Calendar, MapPin, Phone, Users, CreditCard, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../config';

interface StudentProfile {
    AID: number;
    Name: string;
    StudentID: string;
    DOB: string;
    Age: number;
    FatherName: string;
    MotherName: string;
    Img: string | null;
    Gender: string;
    Address: string;
    CellPhone: string;
    FatherNRC: string;
    MotherNRC: string;
    EnName: string;
    Race: string;
    ReligionID: number;
}

interface StudentProfileScreenProps {
    studentId: number | null;
}

const StudentProfileScreen: React.FC<StudentProfileScreenProps> = ({ studentId }) => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!studentId) {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch(`${API_URLS.base}/api/profile?studentId=${studentId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }
                const data = await response.json();
                setProfile(data);
            } catch (err) {
                console.error(err);
                setError('Unable to load profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [studentId]);

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
        <div className="flex flex-col h-full w-full bg-zinc-50 dark:bg-background transition-colors duration-300">
            {/* Header */}
            <div className="px-5 pt-6 pb-4 bg-white/50 dark:bg-black/20 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 sticky top-0 z-20">
                <div className="flex items-center gap-3 max-w-3xl mx-auto">
                    <button 
                        onClick={() => navigate('/home')}
                        className="p-2 -ml-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-800 dark:text-white flex items-center gap-2">
                             <User className="text-violet-500" size={24} />
                             My Profile
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs">Personal Information</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                <div className="max-w-3xl mx-auto space-y-6">
                    
                    {loading ? (
                         <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-sm">Loading profile...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 text-red-500">
                            <p>{error}</p>
                        </div>
                    ) : profile ? (
                        <>
                            {/* Profile Header Card */}
                            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full pointer-events-none" />
                                
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                                    <div className="shrink-0 relative">
                                        <div className="w-24 h-24 rounded-2xl p-1 bg-gradient-to-tr from-indigo-500 via-violet-500 to-fuchsia-500 shadow-lg hover:scale-105 transition-transform duration-300">
                                             {profile.Img ? (
                                                <img src={profile.Img} alt={profile.Name} className="w-full h-full rounded-xl object-cover border-2 border-white dark:border-zinc-900" />
                                             ) : (
                                                <div className="w-full h-full rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border-2 border-white dark:border-zinc-900">
                                                    <span className="text-3xl font-bold text-zinc-400 dark:text-zinc-500">{getInitials(profile.Name || profile.EnName)}</span>
                                                </div>
                                             )}
                                        </div>
                                    </div>
                                    
                                    <div className="text-center md:text-left space-y-1">
                                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{profile.Name || profile.EnName}</h2>
                                        <p className="text-zinc-500 dark:text-zinc-400 font-medium">Student ID: {profile.StudentID}</p>
                                        <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
                                            <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-bold uppercase tracking-wide">
                                                {profile.Gender || 'N/A'}
                                            </span>
                                            <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
                                                Active Student
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Personal Info */}
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <User size={14} /> Personal Details
                                    </h3>
                                    <div className="space-y-4">
                                        <InfoItem label="Date of Birth" value={profile.DOB ? new Date(profile.DOB).toLocaleDateString() : 'N/A'} icon={<Calendar size={16} />} />
                                        <InfoItem label="Age" value={profile.Age?.toString() + ' Years Old'} icon={<User size={16} />} />
                                        <InfoItem label="Race / Religion" value={`${profile.Race || '-'} / ${profile.ReligionID || '-'}`} icon={<Shield size={16} />} />
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm">
                                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Phone size={14} /> Contact Information
                                    </h3>
                                    <div className="space-y-4">
                                        <InfoItem label="Phone Number" value={profile.CellPhone} icon={<Phone size={16} />} />
                                        <InfoItem label="Address" value={profile.Address} icon={<MapPin size={16} />} multiline />
                                    </div>
                                </div>

                                {/* Parent Info */}
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm md:col-span-2">
                                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Users size={14} /> Parents / Guardian
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <div className="text-xs font-semibold text-indigo-500 uppercase">Father</div>
                                            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                                                <div className="font-bold text-zinc-800 dark:text-zinc-200">{profile.FatherName || 'N/A'}</div>
                                                <div className="text-xs text-zinc-500 mt-1">{profile.FatherNRC}</div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="text-xs font-semibold text-pink-500 uppercase">Mother</div>
                                            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                                                <div className="font-bold text-zinc-800 dark:text-zinc-200">{profile.MotherName || 'N/A'}</div>
                                                <div className="text-xs text-zinc-500 mt-1">{profile.MotherNRC}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20 text-zinc-400">
                             <User size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Profile not found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const InfoItem: React.FC<{ label: string; value: string; icon: React.ReactNode; multiline?: boolean }> = ({ label, value, icon, multiline }) => (
    <div className="flex items-start gap-4">
        <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 text-zinc-500">
            {icon}
        </div>
        <div className="flex-1">
            <p className="text-xs text-zinc-500 font-medium mb-0.5">{label}</p>
            <p className={`text-sm font-semibold text-zinc-800 dark:text-zinc-200 ${multiline ? 'leading-relaxed' : ''}`}>
                {value || 'N/A'}
            </p>
        </div>
    </div>
);

export default StudentProfileScreen;
