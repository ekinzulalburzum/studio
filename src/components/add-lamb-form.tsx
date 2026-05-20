"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Save, X, Sparkles, Syringe, Loader2 } from 'lucide-react';
import { Lamb, Vaccine } from '@/lib/types';
import { format, addDays } from 'date-fns';
import Image from 'next/image';

interface AddLambFormProps {
  onAdd: (lamb: Lamb) => void;
  onCancel: () => void;
}

export function AddLambForm({ onAdd, onCancel }: AddLambFormProps) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hydration hatasını önlemek için tarihleri useEffect içinde başlatıyoruz
  useEffect(() => {
    const now = new Date();
    setBirthDate(format(now, 'yyyy-MM-dd'));
    setBirthTime(format(now, 'HH:mm'));
  }, []);

  const generateDefaultVaccines = (bDate: string): Vaccine[] => {
    const baseDate = new Date(bDate);
    return [
      { 
        id: Math.random().toString(), 
        name: 'Karma Aşı (Çelerme) 1. Doz', 
        dueDate: addDays(baseDate, 42).toISOString(), 
        isCompleted: false 
      },
      { 
        id: Math.random().toString(), 
        name: 'Pasteurella (Zatürre)', 
        dueDate: addDays(baseDate, 56).toISOString(), 
        isCompleted: false 
      },
      { 
        id: Math.random().toString(), 
        name: 'Karma Aşı (Rapel/Tekrar)', 
        dueDate: addDays(baseDate, 70).toISOString(), 
        isCompleted: false 
      },
      { 
        id: Math.random().toString(), 
        name: 'Şap Aşısı', 
        dueDate: addDays(baseDate, 84).toISOString(), 
        isCompleted: false 
      },
    ];
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
          resolve(compressedDataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        const compressed = await compressImage(file);
        setPhotoPreview(compressed);
      } catch (error) {
        console.error("Görüntü sıkıştırma hatası:", error);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isCompressing || !birthDate) return;

    const newLamb: Lamb = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      name,
      birthDate,
      birthTime,
      photoUrl: photoPreview || `https://picsum.photos/seed/${Math.random()}/600/400`,
      vaccines: generateDefaultVaccines(birthDate)
    };

    onAdd(newLamb);
  };

  return (
    <div className="max-w-md mx-auto w-full px-4 py-6 animate-fade-in mb-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" /> Yeni Kuzu Kaydı
        </h2>
        <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div 
          onClick={handlePhotoClick}
          className="relative flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-200 rounded-[1.5rem] bg-slate-50 overflow-hidden hover:bg-slate-100 transition-all cursor-pointer"
        >
          {isCompressing ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p className="text-xs text-slate-400 font-bold">Resim İşleniyor...</p>
            </div>
          ) : photoPreview ? (
            <Image src={photoPreview} alt="Preview" fill className="object-cover" />
          ) : (
            <>
              <Camera className="h-8 w-8 text-slate-300 mb-2" />
              <p className="text-xs text-slate-400 font-bold">Fotoğraf Çek veya Seç</p>
            </>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            capture="environment"
            className="hidden" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">İsim veya Küpe Numarası</Label>
          <Input 
            id="name" 
            placeholder="Örn: Pamuk" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            required
            className="border-none bg-slate-50 focus-visible:ring-primary h-12 rounded-xl font-medium px-4"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Doğum Tarihi</Label>
            <Input 
              id="date" 
              type="date" 
              value={birthDate} 
              onChange={(e) => setBirthDate(e.target.value)}
              className="border-none bg-slate-50 focus-visible:ring-primary h-12 rounded-xl px-4"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Saat</Label>
            <Input 
              id="time" 
              type="time" 
              value={birthTime} 
              onChange={(e) => setBirthTime(e.target.value)}
              className="border-none bg-slate-50 focus-visible:ring-primary h-12 rounded-xl px-4"
            />
          </div>
        </div>

        <div className="pt-2">
          <Button 
            type="submit" 
            disabled={isCompressing || !birthDate}
            className="w-full bg-primary hover:bg-primary/90 h-14 text-base font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <Save className="mr-2 h-5 w-5" /> Kaydı Tamamla
          </Button>
        </div>
      </form>
      
      <div className="mt-6 p-4 bg-emerald-50 rounded-2xl flex gap-3 border border-emerald-100">
        <Syringe className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-emerald-900">Otomatik Aşı Takvimi</h4>
          <p className="text-[10px] text-emerald-700/80 leading-relaxed font-medium">
            Kuzunuz için Karma, Zatürre ve Şap aşıları veterinerlik standartlarına göre otomatik planlanır.
          </p>
        </div>
      </div>
    </div>
  );
}
