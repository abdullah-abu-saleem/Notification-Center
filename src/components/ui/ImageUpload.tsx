import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Upload, RefreshCw, Trash2, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  aspectHint?: string;
  maxSizeMB?: number;
  className?: string;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ACCEPTED_EXTENSIONS = 'JPG, PNG, GIF, WebP';

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label,
  aspectHint,
  maxSizeMB = 2,
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const validateAndRead = useCallback((file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError(`Unsupported format. Use ${ACCEPTED_EXTENSIONS}.`);
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Maximum size is ${maxSizeMB}MB.`);
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        onChange(result);
        setIsLoaded(false);
      }
    };
    reader.readAsDataURL(file);
  }, [maxSizeMB, onChange]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndRead(file);
    if (inputRef.current) inputRef.current.value = '';
  }, [validateAndRead]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndRead(file);
  }, [validateAndRead]);

  const handleReplace = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleRemove = useCallback(() => {
    onChange('');
    setIsLoaded(false);
  }, [onChange]);

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-bold text-slate-500 mb-1">{label}</label>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          <img
            src={value}
            alt={label || 'Uploaded image'}
            className={`w-full h-40 object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsLoaded(true)}
          />
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
              <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
            </div>
          )}
          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={handleReplace}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-xs font-bold text-slate-700 hover:bg-white transition-all shadow-sm"
            >
              <RefreshCw className="w-3 h-3" />
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/90 backdrop-blur-sm text-xs font-bold text-white hover:bg-red-500 transition-all shadow-sm"
            >
              <Trash2 className="w-3 h-3" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 px-4 py-6 flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-indigo-400 bg-indigo-50/50'
              : error
              ? 'border-red-300 bg-red-50/30'
              : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className={`rounded-xl p-2.5 transition-all ${
            isDragging ? 'bg-indigo-100 scale-110' : 'bg-slate-100'
          }`}>
            <Upload className={`w-5 h-5 ${isDragging ? 'text-indigo-500' : 'text-slate-400'}`} />
          </div>
          <div className="text-center">
            <p className={`text-xs font-bold ${isDragging ? 'text-indigo-600' : 'text-slate-500'}`}>
              Drag & drop an image here
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              or <span className="text-indigo-500 font-medium">click to browse</span>
            </p>
          </div>
          <p className="text-[10px] text-slate-400">
            {ACCEPTED_EXTENSIONS} up to {maxSizeMB}MB
          </p>
          {aspectHint && (
            <p className="text-[10px] text-slate-400 italic">{aspectHint}</p>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
          <p className="text-xs font-medium text-red-500">{error}</p>
        </div>
      )}
    </div>
  );
};
