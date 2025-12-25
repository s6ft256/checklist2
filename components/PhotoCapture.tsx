
import React, { useRef, useState } from 'react';
import { Camera, Trash2, Loader2, AlertCircle, RotateCcw } from 'lucide-react';

interface PhotoCaptureProps {
  photo?: string;
  onCapture: (data: string) => void;
  onClear: () => void;
  label: string;
  isRequired?: boolean;
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({ photo, onCapture, onClear, label, isRequired }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      setError(null);
      
      const reader = new FileReader();
      
      reader.onloadstart = () => setIsProcessing(true);
      
      reader.onloadend = () => {
        if (reader.result) {
          onCapture(reader.result as string);
          setError(null);
        } else {
          setError("Failed to process image. Please try again.");
        }
        setIsProcessing(false);
      };

      reader.onerror = () => {
        setError("An error occurred while reading the file.");
        setIsProcessing(false);
      };

      try {
        reader.readAsDataURL(file);
      } catch (err) {
        setError("Could not read the selected file.");
        setIsProcessing(false);
      }
    }
  };

  const triggerInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset for retry same file
      fileInputRef.current.click();
    }
  };

  if (isProcessing) {
    return (
      <div className="w-full h-32 flex flex-col items-center justify-center gap-3 border-2 border-amber-200 rounded-lg bg-amber-50 animate-pulse">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Processing Image...</span>
      </div>
    );
  }

  if (photo) {
    return (
      <div className="relative group w-full h-32 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-inner">
        <img src={photo} alt="Inspection documentation" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={triggerInput}
            className="p-2.5 bg-white text-slate-900 rounded-full hover:bg-amber-400 transition-colors shadow-lg"
            aria-label="Retake photo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClear}
            className="p-2.5 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors shadow-lg"
            aria-label="Remove photo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        aria-hidden="true"
      />
      
      {error && (
        <div className="mb-2 flex items-center gap-2 text-rose-600 text-[10px] font-bold uppercase animate-bounce">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}

      <button
        onClick={triggerInput}
        className={`w-full h-32 flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg transition-all group focus:outline-none focus:ring-2 focus:ring-amber-500 ${
          isRequired 
            ? 'border-rose-400 bg-rose-50 hover:bg-rose-100 hover:border-rose-500 animate-pulse' 
            : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-amber-400'
        }`}
        aria-label={`Attach photo for ${label} ${isRequired ? '(Required for failure)' : ''}`}
      >
        <div className={`p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform ${isRequired ? 'bg-white text-rose-500' : 'bg-white text-slate-400 group-hover:text-amber-600'}`}>
          <Camera className="w-6 h-6" />
        </div>
        <div className="text-center px-2">
          <span className={`text-[10px] font-black uppercase tracking-widest block ${isRequired ? 'text-rose-600' : 'text-slate-400 group-hover:text-amber-600'}`}>
            {isRequired ? 'Photo Required' : 'Attach Photo'}
          </span>
          {isRequired && <span className="text-[8px] font-bold text-rose-400 uppercase tracking-tighter">Failure documented visually</span>}
        </div>
      </button>
    </div>
  );
};

export default PhotoCapture;
