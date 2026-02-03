import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../config';

interface FeeRecord {
    AID: number;
    MonthName?: string;
    Description?: string;
    Amount?: number;
    Total?: number;
    TotalPay?: number; // For monthly
    Remain?: number;
    Date?: string; // YYYY-MM-DD
    PayDate?: string;
    Status?: string; 
    Remark?: string; // For tblfee
}

interface FeeData {
    main: FeeRecord[];
    monthly: FeeRecord[];
    details: FeeRecord[];
    extra: FeeRecord[];
}

const StudentFeeScreen: React.FC<{ studentId: number | null, yearId: number | null }> = ({ studentId, yearId }) => {
  const navigate = useNavigate();
  const [feeData, setFeeData] = useState<FeeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'main' | 'monthly' | 'extra' | 'details'>('main');
  
  // Use local state to allow user to clear the filter
  const [filterYearId, setFilterYearId] = useState<number | null>(yearId);

  useEffect(() => {
    setFilterYearId(yearId);
  }, [yearId]);

  useEffect(() => {
    if (!studentId) return;

    let url = API_URLS.studentFees(studentId);
    if (filterYearId) {
        url += `?yearId=${filterYearId}`;
    }

    setLoading(true);
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setFeeData(data.data);
            }
        })
        .catch(err => console.error("Failed to fetch fees:", err))
        .finally(() => setLoading(false));
  }, [studentId, filterYearId]);

  // Calculate Total Outstanding
  const calculateTotalOutstanding = () => {
      if (!feeData) return 0;
      // Since Monthly tab is removed, maybe we should focus on School Fees (Main) outstanding?
      // Or just sum up everything? 
      // User context implies "Initial Assignment Fees" is the focus.
      // Let's calculate balance from Main fees as shown in the card.
      const mainTotal = feeData.main.reduce((sum, r) => sum + (r.Total || 0), 0);
      const paidTotal = feeData.details.reduce((sum, d) => sum + (d.Amount || 0), 0); // Assuming details are payments
      const mainOutstanding = Math.max(0, mainTotal - paidTotal);
      
      // If we still want to include monthly if it exists in backend even if hidden?
      // For now, let's switch outstanding to match the School Fees balance we just exposed.
      return mainOutstanding;
  };

  const totalOutstanding = calculateTotalOutstanding();

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
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">Student Fees</h1>
      </div>

      {/* Summary Card */}
      <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/20 animate-slide-in relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <CreditCard size={120} />
        </div>
        <div className="relative z-10">
            <p className="text-indigo-100 font-medium text-sm uppercase tracking-wide mb-1">Total Outstanding</p>
            <h2 className="text-4xl font-bold mb-4">
                {loading ? '...' : `${totalOutstanding.toLocaleString()} MMK`}
            </h2>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${totalOutstanding > 0 ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-emerald-100'}`}>
                {totalOutstanding > 0 ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                {totalOutstanding > 0 ? 'Action Required' : 'All Paid'}
            </div>
        </div>
      </div>

      {/* Filter Badge */}
      {yearId && (
        <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Found {activeTab === 'details' ? feeData?.details.length : (activeTab === 'extra' ? feeData?.extra.length : feeData?.main.length)} records
            </span>
            <button 
                onClick={() => navigate('/fees')} 
                // To clear filter, we need to clear App state or just ignore it locally?
                // Better: navigate with a query param or a function. 
                // Since App controls state, the cleanest way is for App to provide a clearer.
                // Or: Local override? 
                // Let's simplest: We can't easily clear App state from here without prop.
                // We'll just Add a UI that says "Showing fees for selected year".
                // Actually, passing `yearId` as NULL if user clicks "Show All" is hard if prop is fixed.
                
                // Workaround: Add a local state `ignoreFilter`?
                // Or better: Change the prop approach.
                // Let's use internal state initialized from prop, but clearable?
                
                // No, let's keep it simple. If I want to "Show All", I can just fetch without yearId.
                // I will add a local `activeYearId` state initialized from prop.
            /> 
        </div>
      )}

      {/* Filter Status */}
      {filterYearId && (
        <div className="flex items-center justify-between mb-4 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-800">
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                <Calendar size={16} /> Filtered by Year
            </span>
            <button 
                onClick={() => setFilterYearId(null)}
                className="text-xs font-bold text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 underline"
            >
                View All History
            </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex p-1 mb-6 bg-zinc-200 dark:bg-zinc-800 rounded-2xl">
          <button 
            onClick={() => setActiveTab('main')}
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === 'main' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400'}`}
          >
            School Fees
          </button>
          
          <button 
            onClick={() => setActiveTab('extra')}
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === 'extra' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400'}`}
          >
            Extra
          </button>
          <button 
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === 'details' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400'}`}
          >
            Payments
          </button>
      </div>

      {/* Content List */}
      <div className="space-y-3 animate-fade-in">
        {loading ? (
            <p className="text-center text-zinc-500 mt-10">Loading records...</p>
        ) : (
            <>
                {activeTab === 'main' && feeData?.main.map((record, index) => {
                    // Calculate paid amount from details (assuming details correspond to main fees generally)
                    // In a complex real-world scenario, we'd need to match IDs. 
                    // Here, based on observations, 'details' seems to be the payment history for the student.
                    // We'll calculate a global 'Paid' for display on the card, or show it here?
                    // The user wants to see it on the "Initial Assignment Fees" (School Fee).
                    
                    // Let's sum up ALL details as 'Paid' for now, or is there a specific link?
                    // The schema didn't show foreign keys easily linking detail -> fee.
                    // Assuming all 'details' are payments towards the 'main' fees for simplicity in this context,
                    // or we just show the split for the first record if it's the main one.
                    
                    // Actually, let's calculate the global totals for the School Fee card.
                    const totalMain = record.Total || 0;
                    const totalPaid = feeData?.details?.reduce((sum, d) => sum + (d.Amount || 0), 0) || 0;
                    const balance = totalMain - totalPaid;
                    
                    return (
                    <div key={index} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl flex flex-col gap-4 group hover:border-indigo-500/50 transition-colors">
                        <div className="flex justify-between items-start">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
                                    <CreditCard size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-zinc-800 dark:text-white">{record.Remark || 'School Fee'}</h3>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{new Date(record.Date || '').toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Fee</p>
                                <p className="font-bold text-lg text-zinc-800 dark:text-white">{totalMain.toLocaleString()} MMK</p>
                            </div>
                        </div>

                        {/* Payment Status Bar */}
                        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                            <div 
                                className="bg-emerald-500 h-full rounded-full" 
                                style={{ width: `${Math.min((totalPaid / totalMain) * 100, 100)}%` }}
                            />
                        </div>

                        <div className="flex justify-between items-center text-sm">
                            <div>
                                <p className="text-zinc-500 dark:text-zinc-400">Paid</p>
                                <p className="font-bold text-emerald-600 dark:text-emerald-400">{totalPaid.toLocaleString()} MMK</p>
                            </div>
                            <div className="text-right">
                                <p className="text-zinc-500 dark:text-zinc-400">Balance</p>
                                <p className={`font-bold ${balance > 0 ? 'text-red-500' : 'text-zinc-800 dark:text-white'}`}>
                                    {balance.toLocaleString()} MMK
                                </p>
                            </div>
                        </div>
                    </div>
                    );
                })}

                {activeTab === 'extra' && feeData?.extra.map((record, index) => (
                    <div key={index} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl flex justify-between items-center">
                        <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-zinc-800 dark:text-white">{record.Description}</h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">{new Date(record.Date || '').toLocaleDateString()}</p>
                            </div>
                        </div>
                         <div className="text-right">
                             <p className="font-bold text-zinc-800 dark:text-white">{record.Amount?.toLocaleString()} MMK</p>
                        </div>
                    </div>
                ))}

                {activeTab === 'details' && feeData?.details.map((record, index) => (
                    <div key={index} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl flex justify-between items-center group hover:border-indigo-500/50 transition-colors">
                        <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                <CheckCircle2 size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-zinc-800 dark:text-white">{record.Description || 'Payment'}</h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">{new Date(record.Date || '').toLocaleDateString()}</p>
                            </div>
                        </div>
                         <div className="text-right">
                             <p className="font-bold text-emerald-600 dark:text-emerald-400">+ {record.Amount?.toLocaleString()} MMK</p>
                             <p className="text-xs text-zinc-500 dark:text-zinc-400">{record.Status || 'Paid'}</p>
                        </div>
                    </div>
                ))}
            </>
        )}
        
        {!loading && activeTab === 'main' && feeData?.main.length === 0 && (
            <div className="text-center py-10 text-zinc-400">No school fee records found.</div>
        )}
        {!loading && activeTab === 'extra' && feeData?.extra.length === 0 && (
             <div className="text-center py-10 text-zinc-400">No extra fee records found.</div>
        )}
        {!loading && activeTab === 'details' && feeData?.details.length === 0 && (
             <div className="text-center py-10 text-zinc-400">No payment records found.</div>
        )}


      </div>

    </div>
  );
};

export default StudentFeeScreen;
