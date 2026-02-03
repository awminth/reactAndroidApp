import React, { useState } from 'react';
import { ArrowLeft, Lock, Key, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../config';

interface ChangePasswordScreenProps {
    userId: number | null;
}

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({ userId }) => {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }



        setIsLoading(true);

        try {
            const response = await fetch(`${API_URLS.base}/api/password/change`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, oldPassword, newPassword }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess('Password changed successfully!');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                // Optional: Logout or redirect
            } else {
                setError(data.error || 'Failed to change password');
            }
        } catch (err) {
            console.error(err);
            setError('Network error, please try again');
        } finally {
            setIsLoading(false);
        }
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
                             <Lock className="text-emerald-500" size={24} />
                             Change Password
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-xs">Security Settings</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 flex items-start justify-center">
                <div className="w-full max-w-md space-y-6">
                    
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl shadow-emerald-500/5 relative overflow-hidden">
                        
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full pointer-events-none" />

                        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                            
                            {/* Old Password */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Current Password</label>
                                <div className="relative group">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                    <input
                                        type={showOld ? "text" : "password"}
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-11 pr-12 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-zinc-900 dark:text-white placeholder-zinc-400 text-sm"
                                        placeholder="Enter current password"
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowOld(!showOld)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                                    >
                                        {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-4" />

                            {/* New Password */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">New Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                    <input
                                        type={showNew ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-11 pr-12 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-zinc-900 dark:text-white placeholder-zinc-400 text-sm"
                                        placeholder="Enter new password"
                                        required
                                    />
                                     <button 
                                        type="button" 
                                        onClick={() => setShowNew(!showNew)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                                    >
                                        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-zinc-900 dark:text-white placeholder-zinc-400 text-sm"
                                        placeholder="Confirm new password"
                                        required
                                    />
                                </div>
                            </div>
                            
                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm text-center flex items-center justify-center gap-2">
                                    <ShieldCheck size={16} /> {error}
                                </div>
                            )}

                            {success && (
                                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 text-sm text-center flex items-center justify-center gap-2">
                                    <ShieldCheck size={16} /> {success}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Update Password
                                    </>
                                )}
                            </button>

                        </form>
                    </div>

                    <div className="text-center">
                         <p className="text-xs text-zinc-400">
                            Make sure to use a strong password including numbers and symbols.
                         </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ChangePasswordScreen;
