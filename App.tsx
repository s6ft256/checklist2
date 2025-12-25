
import React, { useState } from 'react';
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
  Award
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
      case InspectionStatus.PASS: return 'bg-emerald-600 text-white border-emerald-700';
      case InspectionStatus.FAIL: return 'bg-rose-600 text-white border-rose-700';
      case InspectionStatus.NA: return 'bg-slate-500 text-white border-slate-600';
      default: return 'bg-white border-slate-200';
    }
  };

  const craneImage = (metadata.craneType && CRANE_IMAGE_MAPPING[metadata.craneType]) || DEFAULT_HEADER_IMAGE;

  return (
    <div className="min-h-screen pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-slate-900 text-white p-4 -mx-4 sm:-mx-6 lg:-mx-8 shadow-xl mb-8 transition-all">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-24 h-20 sm:w-32 sm:h-24 bg-white rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl flex-shrink-0 transition-all duration-300 transform hover:scale-105">
              <img 
                src={craneImage} 
                alt={metadata.craneType || "HSE Checklist"}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-white leading-tight uppercase text-balance">Mobile Crane HSE Checklist</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-amber-400 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-black opacity-90">Pre-Operational Safety Inspection</p>
                <span className="bg-amber-500 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded uppercase">{activeDay}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-800 px-5 py-2.5 rounded-full text-sm border border-slate-700 shadow-inner">
            <span className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Ref. No</span>
            <span className="mono font-bold text-amber-400 text-lg">{metadata.refNo}</span>
          </div>
        </div>
      </header>

      {/* Metadata Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8" aria-labelledby="section-metadata">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
          <Info className="w-5 h-5 text-slate-400" aria-hidden="true" />
          <h2 id="section-metadata" className="text-lg font-bold text-slate-800 uppercase tracking-tighter">Vehicle & Certification Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="make-model" className="block text-xs font-bold text-slate-500 uppercase mb-1">Make / Model</label>
              <input 
                id="make-model"
                type="text" 
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                placeholder="e.g. Liebherr LTM 1100"
                value={metadata.make}
                onChange={e => setMetadata({...metadata, make: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="plate-no" className="block text-xs font-bold text-slate-500 uppercase mb-1">Plate / Plant No.</label>
              <input 
                id="plate-no"
                type="text" 
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none transition-all font-mono"
                placeholder="CR-00123"
                value={metadata.plateNo}
                onChange={e => setMetadata({...metadata, plateNo: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="crane-type" className="block text-xs font-bold text-slate-500 uppercase mb-1">Crane Type</label>
              <select 
                id="crane-type"
                className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 outline-none transition-all bg-white font-black text-slate-800"
                value={metadata.craneType}
                onChange={e => setMetadata({...metadata, craneType: e.target.value as CraneType})}
              >
                <option value="">Select Type...</option>
                {Object.values(CraneType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="date-from" className="block text-xs font-bold text-slate-500 uppercase mb-1">From Date</label>
                <input id="date-from" type="date" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500" value={metadata.dateFrom} onChange={e => setMetadata({...metadata, dateFrom: e.target.value})} />
              </div>
              <div>
                <label htmlFor="date-to" className="block text-xs font-bold text-slate-500 uppercase mb-1">To Date</label>
                <input id="date-to" type="date" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500" value={metadata.dateTo} onChange={e => setMetadata({...metadata, dateTo: e.target.value})} />
              </div>
            </div>
            <div>
              <label htmlFor="registration-expiry" className="block text-xs font-bold text-slate-500 uppercase mb-1">Registration Expiry</label>
              <input id="registration-expiry" type="date" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500" value={metadata.registrationExpiry} onChange={e => setMetadata({...metadata, registrationExpiry: e.target.value})} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="third-party-expiry" className="block text-xs font-bold text-slate-500 uppercase mb-1">3rd Party Expiry</label>
              <input id="third-party-expiry" type="date" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500" value={metadata.thirdPartyExpiry} onChange={e => setMetadata({...metadata, thirdPartyExpiry: e.target.value})} />
            </div>
            <div>
              <label htmlFor="operator-cert-expiry" className="block text-xs font-bold text-slate-500 uppercase mb-1">Operator Cert. Expiry</label>
              <input id="operator-cert-expiry" type="date" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500" value={metadata.operatorCertExpiry} onChange={e => setMetadata({...metadata, operatorCertExpiry: e.target.value})} />
            </div>
          </div>
        </div>
      </section>

      {/* Inspection Context Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-amber-600" aria-hidden="true" />
          <div>
            <span className="text-xs font-black text-amber-800 uppercase tracking-tighter block">Current Inspection Window</span>
            <span className="text-sm font-bold text-amber-900">{activeDay}, {new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative group">
            <label htmlFor="shift-selector" className="sr-only">Select Inspection Shift</label>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {selectedShift === 'day' ? <Sun className="w-4 h-4 text-amber-600" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </div>
            <select 
              id="shift-selector"
              className={`pl-10 pr-4 py-2 rounded-lg font-black uppercase text-sm border-2 transition-all outline-none appearance-none cursor-pointer focus:ring-offset-2 ${
                selectedShift === 'day' 
                  ? 'bg-amber-100 border-amber-300 text-amber-900 focus:ring-2 focus:ring-amber-500' 
                  : 'bg-indigo-100 border-indigo-300 text-indigo-900 focus:ring-2 focus:ring-indigo-500'
              }`}
              value={selectedShift}
              onChange={(e) => setSelectedShift(e.target.value as 'day' | 'night')}
            >
              <option value="day">Day Shift Mode</option>
              <option value="night">Night Shift Mode</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown className="w-4 h-4 opacity-50" />
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-amber-200 shadow-sm" aria-hidden="true">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Audit Mode</span>
          </div>
        </div>
      </div>

      {/* Main Checklist Body */}
      <div className="space-y-4">
        {CHECKLIST_GROUPS.map(group => (
          <div key={group.title} className={`bg-white rounded-2xl shadow-sm border ${expandedGroup === group.title ? 'border-slate-300' : 'border-slate-200'} overflow-hidden transition-all`}>
            <button 
              onClick={() => setExpandedGroup(expandedGroup === group.title ? null : group.title)}
              className={`w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500 ${expandedGroup === group.title ? 'bg-slate-50/50' : ''}`}
              aria-expanded={expandedGroup === group.title}
              aria-controls={`panel-${group.title}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${expandedGroup === group.title ? 'bg-amber-400 text-slate-900 shadow-sm' : 'bg-slate-100 text-slate-500'}`}>
                  {group.icon}
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-800 leading-tight uppercase tracking-tight">{group.title}</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Compliance Block</p>
                </div>
              </div>
              {expandedGroup === group.title ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
            </button>

            {expandedGroup === group.title && (
              <div id={`panel-${group.title}`} className="p-4 bg-slate-50 border-t border-slate-100" role="region" aria-labelledby={`header-${group.title}`}>
                
                {/* Section Protocol Slot */}
                {group.illustrationUrl ? (
                  <div className="mb-6 flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-xl border-2 border-dashed border-amber-200">
                    <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center border border-amber-100 flex-shrink-0 overflow-hidden shadow-sm">
                      <img src={group.illustrationUrl} alt={group.title} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-amber-800 uppercase tracking-tighter">Section Protocol</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Follow site-specific HSE guidelines for this verification block. Ensure all components match official manufacturer standards.
                      </p>
                    </div>
                  </div>
                ) : (
                  group.illustrationType === 'document' && (
                    <div className="mb-6 flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-xl border-2 border-dashed border-amber-200">
                      <div className="w-20 h-20 bg-amber-50 rounded-lg flex items-center justify-center border border-amber-100 flex-shrink-0">
                        <div className="relative">
                          <FileText className="w-10 h-10 text-amber-500" />
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-amber-500 shadow-sm">
                            <ShieldCheck className="w-4 h-4 text-amber-600" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-amber-800 uppercase tracking-tighter">Documentation Compliance</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Verify validity of all crane safety documentation.
                        </p>
                      </div>
                    </div>
                  )
                )}

                <div className="space-y-4">
                  {items.filter(item => item.category === group.title).map(item => {
                    const itemIllustration = group.itemIllustrations?.[item.label];
                    const shiftKey = selectedShift === 'day' ? 'dayShift' : 'nightShift';
                    const currentShiftData = item.checks[activeDay][shiftKey];
                    const currentStatus = currentShiftData.status;

                    return (
                      <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-amber-200 transition-colors">
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="flex-1">
                            <div className="flex items-start gap-4">
                              <div className="flex-1">
                                <span className="text-sm font-bold text-slate-800 block mb-1">{item.label}</span>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <span className="bg-slate-100 text-[10px] uppercase font-black text-slate-500 px-2 py-0.5 rounded tracking-widest">VERIFY</span>
                                  <span className="bg-amber-50 text-[10px] uppercase font-black text-amber-600 px-2 py-0.5 rounded tracking-widest uppercase">
                                    {selectedShift} SHIFT • {activeDay}
                                  </span>
                                </div>
                              </div>
                              {itemIllustration && (
                                <div className="w-16 h-16 sm:w-24 sm:h-24 border border-slate-200 rounded-lg bg-slate-50 p-1 flex-shrink-0 group relative cursor-zoom-in">
                                  <img src={itemIllustration} className="w-full h-full object-contain rounded" alt={`${item.label} reference`} />
                                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <ImageIcon className="text-white w-6 h-6" aria-hidden="true" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-6 flex-[2]">
                            {/* Verification Controls */}
                            <div className="flex-1">
                              <div className={`${selectedShift === 'day' ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-800 border-slate-700'} rounded-lg p-4 border shadow-inner transition-colors duration-300`}>
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    {selectedShift === 'day' ? <Sun className="w-4 h-4 text-amber-600" /> : <Moon className="w-4 h-4 text-indigo-300" />}
                                    <span className={`text-xs font-black uppercase tracking-tight ${selectedShift === 'day' ? 'text-amber-700' : 'text-indigo-300'}`}>
                                      {selectedShift} Shift Verification
                                    </span>
                                  </div>
                                  {currentStatus !== InspectionStatus.PENDING && (
                                    <CheckCircle2 className={`w-4 h-4 ${selectedShift === 'day' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  {[InspectionStatus.PASS, InspectionStatus.FAIL, InspectionStatus.NA].map(status => (
                                    <button
                                      key={status}
                                      onClick={() => handleStatusChange(item.id, activeDay, selectedShift, status)}
                                      className={`flex-1 py-2.5 px-1 rounded-lg text-[10px] font-black border-2 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
                                        currentStatus === status 
                                          ? getStatusBg(status, selectedShift) 
                                          : (selectedShift === 'day' 
                                              ? 'bg-white text-slate-400 border-slate-100 hover:border-amber-300' 
                                              : 'bg-slate-700 text-slate-500 border-slate-600 hover:border-indigo-400')
                                      }`}
                                      aria-label={`Set ${item.label} status to ${status}`}
                                      aria-pressed={currentStatus === status}
                                    >
                                      {status}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Photo Capture - Only shown when status is FAIL */}
                            {currentStatus === InspectionStatus.FAIL && (
                              <div className="flex-1 flex items-center transition-all duration-300 animate-in fade-in slide-in-from-right-2">
                                <PhotoCapture
                                  photo={currentShiftData.photo}
                                  label={item.label}
                                  onCapture={(data) => handlePhotoCapture(item.id, activeDay, selectedShift, data)}
                                  onClear={() => handlePhotoCapture(item.id, activeDay, selectedShift, '')}
                                  isRequired={!currentShiftData.photo}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Remarks Section */}
      <section className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6" aria-labelledby="section-remarks">
        <div className="flex items-center gap-2 mb-4">
          <FileCheck2 className="w-5 h-5 text-slate-400" aria-hidden="true" />
          <h2 id="section-remarks" className="text-lg font-bold text-slate-800 uppercase tracking-tighter">Final Remarks & Observations</h2>
        </div>
        <textarea 
          className="w-full border border-slate-300 rounded-xl p-4 min-h-[140px] focus:ring-2 focus:ring-amber-500 outline-none text-slate-700 bg-slate-50/50 font-medium placeholder:text-slate-400 transition-all"
          placeholder="Note any defects, replacement of parts, or specific field conditions encountered. Provide detailed notes for any FAIL status recorded..."
          value={remarks}
          onChange={e => setRemarks(e.target.value)}
          aria-label="General inspection remarks"
        />
      </section>

      {/* Sign-off Section */}
      <section className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-hidden" aria-labelledby="section-auth">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
          <div className="bg-emerald-100 p-2 rounded-lg" aria-hidden="true">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 id="section-auth" className="text-lg font-bold text-slate-800 uppercase tracking-tighter">Verification & Authorization</h2>
        </div>

        <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 rounded-lg ${selectedShift === 'day' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
              {selectedShift === 'day' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                {selectedShift} Shift Sign-Off
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Operator declaration and visual validation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6 animate-in fade-in slide-in-from-left-2">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">
                  <UserCheck className="w-3 h-3" /> Operator Full Name
                </label>
                <input 
                  type="text"
                  className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 outline-none font-bold uppercase text-slate-800 shadow-sm"
                  placeholder="Enter Full Name"
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
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">
                  <Award className="w-3 h-3" /> Certificate Expiry Date
                </label>
                <input 
                  type="date"
                  className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-amber-500 outline-none font-bold text-slate-800 shadow-sm"
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

              <div className="pt-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Official Supervisor Audit</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-300 rounded-lg p-3 bg-white font-black text-slate-800 uppercase tracking-tight shadow-sm focus:ring-2 focus:ring-amber-500"
                  placeholder="Supervisor Name"
                  value={signatures.inspectedBy}
                  onChange={e => setSignatures({...signatures, inspectedBy: e.target.value})}
                />
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-right-2">
              <SignaturePad 
                label={`${selectedShift === 'day' ? 'Day' : 'Night'} Shift Authorized Signature`}
                onSave={data => {
                  setSignatures(prev => selectedShift === 'day' 
                    ? { ...prev, dayOperatorSignature: data } 
                    : { ...prev, nightOperatorSignature: data }
                  );
                }} 
                savedData={selectedShift === 'day' ? signatures.dayOperatorSignature : signatures.nightOperatorSignature}
              />
              <div className="mt-4 flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                   <Clock className="w-3 h-3 text-slate-400" />
                   <span className="text-[10px] font-mono font-bold text-slate-400">{signatures.timestamp}</span>
                </div>
                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Digitally Authenticated</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 no-print">
          <button className="flex-1 bg-slate-900 text-white font-black py-5 px-6 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200 active:scale-95 text-lg uppercase tracking-tighter focus:ring-2 focus:ring-offset-2 focus:ring-slate-900">
            <Save className="w-6 h-6 text-amber-400" aria-hidden="true" />
            COMMIT FINAL HSE REPORT
          </button>
          <button 
            onClick={() => window.print()}
            className="bg-white text-slate-900 border-2 border-slate-900 font-black py-5 px-8 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-95 text-lg uppercase tracking-tighter focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
          >
            <Printer className="w-6 h-6" aria-hidden="true" />
            EXPORT TO PDF
          </button>
        </div>
      </section>

      <footer className="mt-12 text-center text-slate-400 text-[10px] pb-12 uppercase tracking-widest font-bold" role="contentinfo">
        <p className="border-t border-slate-200 pt-6">© 2024 HSE COMPLIANCE • INDUSTRIAL CRANE OPERATIONAL SAFETY PROTOCOL • V2.6.0-FINAL</p>
        <p className="mt-2 text-slate-300">AUTHORIZED FOR ON-SITE DIGITAL USE ONLY</p>
      </footer>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; padding: 0; }
          .rounded-2xl { border-radius: 0; border: 1px solid #ccc; box-shadow: none !important; margin-bottom: 2rem; }
          .shadow-sm, .shadow-xl { box-shadow: none !important; }
          header { background: #0f172a !important; color: white !important; -webkit-print-color-adjust: exact; }
          .bg-slate-900 { background-color: #0f172a !important; }
          .bg-amber-400 { background-color: #fbbf24 !important; }
          .bg-slate-50 { background-color: white !important; }
        }
        *:focus-visible {
          outline: 3px solid #f59e0b;
          outline-offset: 2px;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-from-right {
          from { transform: translateX(0.5rem); }
          to { transform: translateX(0); }
        }
        @keyframes slide-in-from-left {
          from { transform: translateX(-0.5rem); }
          to { transform: translateX(0); }
        }
        @keyframes slide-in-from-bottom {
          from { transform: translateY(0.5rem); }
          to { transform: translateY(0); }
        }
        .animate-in {
          animation-duration: 300ms;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          animation-fill-mode: forwards;
        }
        .fade-in { animation-name: fade-in; }
        .slide-in-from-right-2 { animation-name: slide-in-from-right; }
        .slide-in-from-left-2 { animation-name: slide-in-from-left; }
        .slide-in-from-bottom-2 { animation-name: slide-in-from-bottom; }
      `}</style>
    </div>
  );
};

export default App;
