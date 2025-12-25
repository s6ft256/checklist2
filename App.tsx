import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Info, 
  Truck, 
  Calendar, 
  Clock, 
  FileCheck2,
  Save,
  Printer,
  Sun,
  Moon,
  FileText,
  ShieldCheck,
  Image as ImageIcon,
  Camera,
  UserCheck,
  Award,
  AlertCircle,
  LayoutGrid
} from 'lucide-react';
import { 
  CraneType, 
  InspectionStatus, 
  DayOfWeek, 
  CraneMetadata, 
  ChecklistItemData,
  SignatureData 
} from './types';
import { CHECKLIST_GROUPS, DAYS } from './constants';
import SignaturePad from './components/SignaturePad';
import PhotoCapture from './components/PhotoCapture';

const CRANE_IMAGE_MAPPING: Record<string, string> = {
  [CraneType.ROUGH_TERRAIN]: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYAlyYYWrx3ILtoR_fcIIq7jXPvRMR_Asfgg&s",
  [CraneType.CRAWLER_LATTICE]: "https://www.linkbelt.com/wp-content/uploads/2024/02/1200LBC-Crane-large.png",
  [CraneType.ALL_TERRAIN]: "https://aorcranes.com.au/wp-content/uploads/2025/01/LIEBHERR-LTM-1090-4-1.jpg",
  [CraneType.CRAWLER_TELESCOPIC]: "https://www.uashe.com/wp-content/uploads/2022/06/GTC-1800EX-1024x683.jpg",
  [CraneType.SPIDER_CRANE]: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSN2dnn2dUBFKmAJl8m8yrqvCMk851pMUwkUg&s",
  [CraneType.LORRY_MOUNTED]: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRERxVm6ylO9QfBXvqye4R2k8QH4L5RqUw8wg&s"
};

const DEFAULT_HEADER_IMAGE = "https://cheqmark.io/blog/wp-content/uploads/2023/03/what-is-checklist.jpg";

const App: React.FC = () => {
  const todayDate = new Date().toISOString().split('T')[0];
  const activeDay: DayOfWeek = DAYS[new Date().getDay()];

  // State Initialization
  const [metadata, setMetadata] = useState<CraneMetadata>({
    make: '',
    plateNo: '',
    dateFrom: todayDate,
    dateTo: todayDate,
    craneType: '',
    refNo: `REF-${Math.floor(Math.random() * 100000)}`,
    thirdPartyExpiry: '',
    registrationExpiry: '',
    operatorCertExpiry: ''
  });

  const [items, setItems] = useState<ChecklistItemData[]>(() => {
    const allItems: ChecklistItemData[] = [];
    CHECKLIST_GROUPS.forEach(group => {
      group.items.forEach(itemName => {
        const item: ChecklistItemData = {
          id: `${group.title}-${itemName}`.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, ''),
          label: itemName,
          category: group.title,
          checks: DAYS.reduce((acc, day) => {
            acc[day] = {
              dayShift: { status: InspectionStatus.PENDING },
              nightShift: { status: InspectionStatus.PENDING }
            };
            return acc;
          }, {} as Record<DayOfWeek, any>)
        };
        allItems.push(item);
      });
    });
    return allItems;
  });

  const [expandedGroup, setExpandedGroup] = useState<string | null>(CHECKLIST_GROUPS[0].title);
  const [selectedShift, setSelectedShift] = useState<'day' | 'night'>('day');
  const [signatures, setSignatures] = useState<SignatureData>({
    dayOperatorName: '',
    dayOperatorSignature: '',
    dayCertExpiry: '',
    nightOperatorName: '',
    nightOperatorSignature: '',
    nightCertExpiry: '',
    inspectedBy: '',
    timestamp: new Date().toLocaleString()
  });
  const [remarks, setRemarks] = useState('');

  // Progress tracking
  const progress = useMemo(() => {
    const shiftKey = selectedShift === 'day' ? 'dayShift' : 'nightShift';
    const total = items.length;
    const completed = items.filter(item => item.checks[activeDay][shiftKey].status !== InspectionStatus.PENDING).length;
    const percent = Math.round((completed / total) * 100);
    return { completed, total, percent };
  }, [items, selectedShift, activeDay]);

  // Handlers
  const handleStatusChange = (itemId: string, day: DayOfWeek, shift: 'day' | 'night', status: InspectionStatus) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newChecks = { ...item.checks };
        const shiftKey = shift === 'day' ? 'dayShift' : 'nightShift';
        newChecks[day][shiftKey].status = status;
        return { ...item, checks: newChecks };
      }
      return item;
    }));
  };

  const handlePhotoCapture = (itemId: string, day: DayOfWeek, shift: 'day' | 'night', photoData: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newChecks = { ...item.checks };
        const shiftKey = shift === 'day' ? 'dayShift' : 'nightShift';
        newChecks[day][shiftKey].photo = photoData;
        return { ...item, checks: newChecks };
      }
      return item;
    }));
  };

  const getStatusBg = (status: InspectionStatus, shift: 'day' | 'night') => {
    if (status === InspectionStatus.PENDING) {
      return shift === 'day' 
        ? 'bg-white text-slate-400 border-slate-200' 
        : 'bg-slate-700 text-slate-500 border-slate-600';
    }
    
    switch (status) {
      case InspectionStatus.PASS: return 'bg-emerald-600 text-white border-emerald-700 shadow-lg shadow-emerald-100';
      case InspectionStatus.FAIL: return 'bg-rose-600 text-white border-rose-700 shadow-lg shadow-rose-100';
      case InspectionStatus.NA: return 'bg-slate-600 text-white border-slate-700 shadow-lg shadow-slate-100';
      default: return 'bg-white border-slate-200';
    }
  };

  const craneImage = (metadata.craneType && CRANE_IMAGE_MAPPING[metadata.craneType]) || DEFAULT_HEADER_IMAGE;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${selectedShift === 'day' ? 'bg-slate-50' : 'bg-[#0f141d]'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Compact Sticky Header */}
        <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md text-white p-3 sm:p-4 -mx-4 sm:-mx-6 lg:-mx-8 shadow-2xl mb-8 border-b border-white/10">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-10 sm:w-16 sm:h-12 bg-white rounded-lg overflow-hidden border border-slate-700 flex-shrink-0 transition-transform hover:scale-105">
                <img src={craneImage} alt="Crane" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-lg font-black tracking-tighter uppercase truncate leading-none">Mobile Crane HSE</h1>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`w-2 h-2 rounded-full animate-pulse ${progress.percent === 100 ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                  <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{progress.percent}% Completed</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => window.print()}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors hidden sm:block"
                title="Print Report"
              >
                <Printer className="w-5 h-5 text-white/80" />
              </button>
              <div className="bg-amber-500 text-slate-900 px-3 py-1.5 rounded-xl font-black text-[10px] sm:text-xs uppercase shadow-lg shadow-amber-500/20">
                {activeDay}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 h-1 bg-amber-500/20 w-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${progress.percent === 100 ? 'bg-emerald-400' : 'bg-amber-500'}`}
              style={{ width: `${progress.percent}%` }}
            ></div>
          </div>
        </header>

        {/* Global Shift Selector (Hero Style) */}
        <div className="mb-8 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-2xl flex relative no-print shadow-inner border border-slate-200/50">
          <div 
            className={`absolute top-1 bottom-1 w-1/2 rounded-xl transition-all duration-500 ease-spring ${
              selectedShift === 'day' 
                ? 'left-1 bg-white shadow-xl translate-x-0' 
                : 'left-1 bg-indigo-600 shadow-xl translate-x-full'
            }`}
          />
          <button 
            onClick={() => setSelectedShift('day')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black uppercase text-xs z-10 transition-colors ${
              selectedShift === 'day' ? 'text-amber-600' : 'text-slate-500'
            }`}
          >
            <Sun className={`w-4 h-4 ${selectedShift === 'day' ? 'animate-spin-slow' : ''}`} />
            Day Shift
          </button>
          <button 
            onClick={() => setSelectedShift('night')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black uppercase text-xs z-10 transition-colors ${
              selectedShift === 'night' ? 'text-white' : 'text-slate-500'
            }`}
          >
            <Moon className={`w-4 h-4 ${selectedShift === 'night' ? 'animate-pulse' : ''}`} />
            Night Shift
          </button>
        </div>

        {/* Metadata Section - Compact Card */}
        <section className={`rounded-3xl shadow-sm border p-6 mb-8 transition-colors duration-500 ${selectedShift === 'day' ? 'bg-white border-slate-200' : 'bg-slate-900/50 border-slate-800'}`}>
          <div className="flex items-center gap-3 mb-8 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className={`p-2 rounded-xl ${selectedShift === 'day' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-900/50 text-indigo-400'}`}>
              <Truck className="w-5 h-5" />
            </div>
            <h2 className={`text-sm font-black uppercase tracking-widest ${selectedShift === 'day' ? 'text-slate-800' : 'text-slate-100'}`}>Crane Configuration</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
            <div className="space-y-4">
              <div className="group">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 transition-colors group-focus-within:text-amber-500">Make / Model</label>
                <input 
                  type="text" 
                  className={`w-full rounded-xl p-3.5 border-2 transition-all outline-none font-bold text-sm ${selectedShift === 'day' ? 'bg-slate-50 border-slate-100 focus:border-amber-400' : 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'}`}
                  placeholder="e.g. LIEBHERR LTM 1100"
                  value={metadata.make}
                  onChange={e => setMetadata({...metadata, make: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Plate / Plant No.</label>
                <input 
                  type="text" 
                  className={`w-full rounded-xl p-3.5 border-2 transition-all outline-none font-mono text-sm uppercase ${selectedShift === 'day' ? 'bg-slate-50 border-slate-100 focus:border-amber-400' : 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'}`}
                  placeholder="CR-0123"
                  value={metadata.plateNo}
                  onChange={e => setMetadata({...metadata, plateNo: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Crane Category</label>
                <select 
                  className={`w-full rounded-xl p-3.5 border-2 transition-all outline-none font-black text-xs uppercase appearance-none cursor-pointer ${selectedShift === 'day' ? 'bg-slate-50 border-slate-100 text-slate-800 focus:border-amber-400' : 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'}`}
                  value={metadata.craneType}
                  onChange={e => setMetadata({...metadata, craneType: e.target.value as CraneType})}
                >
                  <option value="">Select Category...</option>
                  {Object.values(CraneType).map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Reg. Expiry</label>
                  <input type="date" className={`w-full rounded-xl p-3 border-2 transition-all outline-none text-xs font-bold ${selectedShift === 'day' ? 'bg-slate-50 border-slate-100' : 'bg-slate-800 border-slate-700 text-white'}`} value={metadata.registrationExpiry} onChange={e => setMetadata({...metadata, registrationExpiry: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Cert. Expiry</label>
                  <input type="date" className={`w-full rounded-xl p-3 border-2 transition-all outline-none text-xs font-bold ${selectedShift === 'day' ? 'bg-slate-50 border-slate-100' : 'bg-slate-800 border-slate-700 text-white'}`} value={metadata.thirdPartyExpiry} onChange={e => setMetadata({...metadata, thirdPartyExpiry: e.target.value})} />
                </div>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
               <div className="text-center">
                 <LayoutGrid className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational<br/>Asset ID</p>
               </div>
            </div>
          </div>
        </section>

        {/* Checklist Content */}
        <div className="space-y-6">
          {CHECKLIST_GROUPS.map(group => (
            <div key={group.title} className={`rounded-3xl shadow-xl overflow-hidden transition-all duration-500 ${
              selectedShift === 'day' ? 'bg-white border border-slate-200' : 'bg-slate-900/40 border border-slate-800'
            }`}>
              <button 
                onClick={() => setExpandedGroup(expandedGroup === group.title ? null : group.title)}
                className={`w-full flex items-center justify-between p-6 transition-colors focus:outline-none ${
                  expandedGroup === group.title 
                    ? (selectedShift === 'day' ? 'bg-amber-50/50' : 'bg-indigo-900/20') 
                    : 'hover:bg-slate-50/50 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl shadow-sm transition-all duration-300 ${
                    expandedGroup === group.title 
                      ? (selectedShift === 'day' ? 'bg-amber-400 text-slate-900 scale-110' : 'bg-indigo-500 text-white scale-110') 
                      : (selectedShift === 'day' ? 'bg-slate-100 text-slate-500' : 'bg-slate-800 text-slate-500')
                  }`}>
                    {group.icon}
                  </div>
                  <div className="text-left">
                    <h3 className={`font-black text-xs sm:text-sm leading-tight uppercase tracking-widest ${selectedShift === 'day' ? 'text-slate-800' : 'text-slate-100'}`}>{group.title}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">Safety & Maintenance Block</p>
                  </div>
                </div>
                {expandedGroup === group.title ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
              </button>

              {expandedGroup === group.title && (
                <div className={`p-4 sm:p-6 space-y-4 animate-in fade-in zoom-in-95 duration-300 ${selectedShift === 'day' ? 'bg-slate-50/30' : 'bg-black/10'}`}>
                  {items.filter(item => item.category === group.title).map(item => {
                    const shiftKey = selectedShift === 'day' ? 'dayShift' : 'nightShift';
                    const currentStatus = item.checks[activeDay][shiftKey].status;

                    return (
                      <div key={item.id} className={`p-5 rounded-2xl border transition-all hover:shadow-lg ${
                        selectedShift === 'day' 
                          ? 'bg-white border-slate-200 hover:border-amber-200' 
                          : 'bg-slate-800/50 border-slate-700 hover:border-indigo-700'
                      }`}>
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="flex-1">
                            <span className={`text-sm font-black uppercase tracking-tight block mb-2 ${selectedShift === 'day' ? 'text-slate-800' : 'text-slate-100'}`}>
                              {item.label}
                            </span>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verification Point</p>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4 flex-[1.5]">
                            {/* status buttons */}
                            <div className="flex-1 flex gap-2">
                              {[InspectionStatus.PASS, InspectionStatus.FAIL, InspectionStatus.NA].map(status => (
                                <button
                                  key={status}
                                  onClick={() => handleStatusChange(item.id, activeDay, selectedShift, status)}
                                  className={`flex-1 py-4 px-2 rounded-xl text-[10px] font-black border-2 transition-all active:scale-95 flex flex-col items-center justify-center gap-1.5 ${
                                    currentStatus === status 
                                      ? getStatusBg(status, selectedShift) 
                                      : (selectedShift === 'day' 
                                          ? 'bg-slate-50 text-slate-400 border-slate-100 hover:border-slate-300' 
                                          : 'bg-slate-900/50 text-slate-600 border-slate-800 hover:border-slate-600')
                                  }`}
                                >
                                  {status === InspectionStatus.PASS && <CheckCircle2 className="w-4 h-4" />}
                                  {status === InspectionStatus.FAIL && <AlertCircle className="w-4 h-4" />}
                                  {status}
                                </button>
                              ))}
                            </div>

                            {/* Conditional Photo */}
                            {currentStatus === InspectionStatus.FAIL && (
                              <div className="flex-1 animate-in slide-in-from-right-4 fade-in duration-300">
                                <PhotoCapture
                                  photo={item.checks[activeDay][shiftKey].photo}
                                  label={item.label}
                                  onCapture={(data) => handlePhotoCapture(item.id, activeDay, selectedShift, data)}
                                  onClear={() => handlePhotoCapture(item.id, activeDay, selectedShift, '')}
                                  isRequired={!item.checks[activeDay][shiftKey].photo}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Verification Section */}
        <section className={`mt-12 rounded-3xl shadow-xl p-8 transition-colors duration-500 ${
          selectedShift === 'day' ? 'bg-white border border-slate-200' : 'bg-slate-900/60 border border-slate-800'
        }`}>
          <div className="flex items-center gap-4 mb-10 border-b border-slate-100 dark:border-slate-800 pb-6">
            <div className="bg-emerald-500/10 p-3 rounded-2xl">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h2 className={`text-lg font-black uppercase tracking-[0.2em] ${selectedShift === 'day' ? 'text-slate-800' : 'text-slate-100'}`}>Official Validation</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Certified Operator Sign-Off</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest flex items-center gap-2">
                    <UserCheck className="w-3 h-3" /> Full Legal Name
                  </label>
                  <input 
                    type="text"
                    className={`w-full rounded-2xl p-4 border-2 transition-all outline-none font-black text-sm uppercase ${selectedShift === 'day' ? 'bg-slate-50 border-slate-100 focus:border-amber-400' : 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'}`}
                    placeholder="Enter Name"
                    value={selectedShift === 'day' ? signatures.dayOperatorName : signatures.nightOperatorName}
                    onChange={e => {
                      const val = e.target.value;
                      setSignatures(prev => selectedShift === 'day' 
                        ? { ...prev, dayOperatorName: val } 
                        : { ...prev, nightOperatorName: val }
                      );
                    }}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest flex items-center gap-2">
                    <Award className="w-3 h-3" /> Cert. Expiry
                  </label>
                  <input 
                    type="date"
                    className={`w-full rounded-2xl p-4 border-2 transition-all outline-none font-bold text-sm ${selectedShift === 'day' ? 'bg-slate-50 border-slate-100' : 'bg-slate-800 border-slate-700 text-white'}`}
                    value={selectedShift === 'day' ? signatures.dayCertExpiry : signatures.nightCertExpiry}
                    onChange={e => {
                      const val = e.target.value;
                      setSignatures(prev => selectedShift === 'day' 
                        ? { ...prev, dayCertExpiry: val } 
                        : { ...prev, nightCertExpiry: val }
                      );
                    }}
                  />
                </div>
              </div>

              <div className={`p-6 rounded-2xl border-2 border-dashed ${selectedShift === 'day' ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-700'}`}>
                <label className="text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest block">Audit Verification</label>
                <input 
                  type="text"
                  className={`w-full rounded-xl p-3 border-2 transition-all outline-none font-black text-xs uppercase ${selectedShift === 'day' ? 'bg-white border-slate-200 focus:border-amber-400' : 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'}`}
                  placeholder="Supervisor Name"
                  value={signatures.inspectedBy}
                  onChange={e => setSignatures({...signatures, inspectedBy: e.target.value})}
                />
              </div>
            </div>

            <div>
              <SignaturePad 
                label="Electronic Signature Authorization"
                onSave={data => {
                  setSignatures(prev => selectedShift === 'day' 
                    ? { ...prev, dayOperatorSignature: data } 
                    : { ...prev, nightOperatorSignature: data }
                  );
                }} 
                savedData={selectedShift === 'day' ? signatures.dayOperatorSignature : signatures.nightOperatorSignature}
              />
              <div className="mt-6 flex flex-col gap-3">
                 <div className="flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
                   <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {signatures.timestamp}</div>
                   <div className="text-emerald-500">Secure Audit Log</div>
                 </div>
                 <div className="h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-full animate-pulse-slow"></div>
                 </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 no-print">
            <button className="flex-[2] bg-slate-900 text-white font-black py-6 rounded-3xl hover:bg-slate-800 transition-all flex items-center justify-center gap-4 shadow-2xl shadow-slate-900/20 active:scale-95 text-lg uppercase tracking-widest border border-white/5">
              <Save className="w-6 h-6 text-amber-400" />
              Finalize HSE Report
            </button>
            <button 
              onClick={() => window.print()}
              className={`flex-1 font-black py-6 rounded-3xl transition-all flex items-center justify-center gap-3 active:scale-95 text-sm uppercase tracking-widest border-2 ${
                selectedShift === 'day' ? 'bg-white border-slate-900 text-slate-900' : 'bg-white/5 border-white/20 text-white'
              }`}
            >
              <Printer className="w-5 h-5" />
              Print
            </button>
          </div>
        </section>

        <footer className="mt-16 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2 opacity-50">Industrial Safety Protocol V2.7</p>
          <div className="w-20 h-0.5 bg-slate-300 dark:bg-slate-700 mx-auto rounded-full mb-8"></div>
        </footer>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.4; }
        }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .bg-slate-50, .bg-[#0f141d], .bg-slate-900\\/40 { background: white !important; color: black !important; }
          .border, .border-2 { border-color: #eee !important; }
          .shadow-xl, .shadow-2xl { box-shadow: none !important; }
          header { background: #0f172a !important; -webkit-print-color-adjust: exact; }
          input, select, textarea { border: 1px solid #ccc !important; background: white !important; color: black !important; }
        }

        /* Ergonomic tap targets */
        button, select, input { min-height: 48px; }
        
        .ease-spring {
          transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
};

export default App;