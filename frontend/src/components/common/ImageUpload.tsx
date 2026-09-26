import React, { useState } from 'react';
import { Upload, Image as ImageIcon, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  maxSizeMb?: number; // Default 4MB limit
  className?: string;
}

const SAMPLE_GALLERY_PHOTOS = [
  { label: 'Golden Community Dog', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80' },
  { label: 'Brown Street Dog', url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Playful Rescue Dog', url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80' },
  { label: 'Resting Street Animal', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80' },
];

export function ImageUpload({
  value,
  onChange,
  label = 'Image',
  required = false,
  maxSizeMb = 4,
  className = '',
}: ImageUploadProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'sample'>('upload');
  const [error, setError] = useState<string | null>(null);

  const maxSizeBytes = maxSizeMb * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // File type validation
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    // Strict 4 MB Sanitation Check
    if (file.size > maxSizeBytes) {
      const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setError(`File size exceeds the ${maxSizeMb} MB limit (Selected: ${fileSizeMb} MB). Please choose a smaller image.`);
      return;
    }

    // Read & convert to Base64 Data URL
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.onerror = () => {
      setError('Failed to read image file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    onChange('');
    setError(null);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-forest-900 uppercase tracking-wider">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 pb-1 text-xs font-semibold text-slate-500">
        <button
          type="button"
          onClick={() => { setActiveTab('upload'); setError(null); }}
          className={`pb-1 px-2 border-b-2 transition-colors ${
            activeTab === 'upload'
              ? 'border-forest-900 text-forest-900 font-bold'
              : 'border-transparent hover:text-forest-800'
          }`}
        >
          Device Upload (&lt;{maxSizeMb}MB)
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('url'); setError(null); }}
          className={`pb-1 px-2 border-b-2 transition-colors ${
            activeTab === 'url'
              ? 'border-forest-900 text-forest-900 font-bold'
              : 'border-transparent hover:text-forest-800'
          }`}
        >
          Image Link (URL)
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('sample'); setError(null); }}
          className={`pb-1 px-2 border-b-2 transition-colors ${
            activeTab === 'sample'
              ? 'border-forest-900 text-forest-900 font-bold'
              : 'border-transparent hover:text-forest-800'
          }`}
        >
          Sample Gallery
        </button>
      </div>

      {/* Tab 1: File Upload */}
      {activeTab === 'upload' && (
        <div className="space-y-2">
          {!value ? (
            <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-300 hover:border-forest-800 rounded-2xl cursor-pointer bg-slate-50 hover:bg-forest-50/50 transition-colors text-center">
              <Upload className="w-8 h-8 text-forest-800 mb-1" />
              <span className="text-xs font-bold text-forest-900">
                Choose Image from Device Gallery
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">
                PNG, JPG, WEBP (Max {maxSizeMb} MB)
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : null}
        </div>
      )}

      {/* Tab 2: URL Input */}
      {activeTab === 'url' && (
        <input
          type="url"
          placeholder="https://images.unsplash.com/..."
          value={value}
          onChange={(e) => { onChange(e.target.value); setError(null); }}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest-900"
        />
      )}

      {/* Tab 3: Sample Gallery Picker */}
      {activeTab === 'sample' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SAMPLE_GALLERY_PHOTOS.map((sample, idx) => (
            <div
              key={idx}
              onClick={() => { onChange(sample.url); setError(null); }}
              className={`relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                value === sample.url ? 'border-amber-golden ring-2 ring-amber-golden/30' : 'border-slate-200 opacity-80 hover:opacity-100'
              }`}
            >
              <img src={sample.url} alt={sample.label} className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-[10px] text-white font-semibold truncate">
                {sample.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Live Image Preview */}
      {value && (
        <div className="relative p-2 bg-slate-100 rounded-2xl border border-slate-200 flex items-center gap-3">
          <img
            src={value}
            alt="Selected preview"
            className="w-16 h-16 rounded-xl object-cover border border-slate-300"
          />
          <div className="flex-1 min-w-0 text-xs">
            <span className="font-bold text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Image Selected (&lt;{maxSizeMb} MB)
            </span>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              {value.startsWith('data:') ? 'Base64 Encoded Image Data' : value}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-rose-600 hover:bg-rose-50 text-xs p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
