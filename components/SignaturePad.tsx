import React, { useRef, useState, useEffect } from 'react';
import { Trash2, Check, AlertTriangle, X, MousePointer2 } from 'lucide-react';

interface SignaturePadProps {
  label: string;
  onSave: (data: string) => void;
  savedData?: string;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ label, onSave, savedData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(!savedData);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Handle responsive canvas sizing
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        if (savedData) {
          const img = new Image();
          img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
          img.src = savedData;
        }
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [savedData]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    setIsEmpty(false);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      onSave(canvasRef.current.toDataURL());
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a'; // Slate 900

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (e.type === 'mousedown' || e.type === 'touchstart') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const handleClear = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      onSave('');
      setIsEmpty(true);
      setShowConfirmClear(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <MousePointer2 className="w-3 h-3" />
          {label}
        </label>
        {!isEmpty && !showConfirmClear && (
          <span className="flex items-center gap-1 text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase border border-emerald-100 animate-in fade-in zoom-in-95">
            <Check className="w-2.5 h-2.5" /> Captured
          </span>
        )}
      </div>

      <div 
        ref={containerRef}
        className={`relative border-2 rounded-xl bg-white h-40 touch-none transition-all duration-300 overflow-hidden ${
          isDrawing ? 'border-amber-400 shadow-lg shadow-amber-100 ring-4 ring-amber-50' : 'border-slate-200'
        }`}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
        />

        {/* Action Controls */}
        {!isEmpty && !showConfirmClear && (
          <button 
            onClick={() => setShowConfirmClear(true)}
            className="absolute bottom-3 right-3 p-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 rounded-lg border border-slate-200 transition-colors shadow-sm"
            title="Clear Signature"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}

        {/* Empty Placeholder */}
        {isEmpty && !isDrawing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 select-none">
            <span className="text-sm font-medium text-slate-400 italic">Sign here...</span>
          </div>
        )}

        {/* Confirm Clear Overlay */}
        {showConfirmClear && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-in fade-in slide-in-from-bottom-4">
            <AlertTriangle className="w-8 h-8 text-rose-500 mb-2" />
            <p className="text-xs font-black text-slate-800 uppercase tracking-tighter mb-4">Clear current signature?</p>
            <div className="flex gap-2 w-full max-w-[200px]">
              <button 
                onClick={handleClear}
                className="flex-1 bg-rose-600 text-white text-[10px] font-black py-2 rounded-lg shadow-lg shadow-rose-100 uppercase"
              >
                Yes, Clear
              </button>
              <button 
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 bg-slate-100 text-slate-600 text-[10px] font-black py-2 rounded-lg border border-slate-200 uppercase"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignaturePad;