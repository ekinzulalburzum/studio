"use client";

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Save, X, Sparkles, Syringe } from 'lucide-react';
import { Lamb, Vaccine } from '@/lib/types';
import { format, addDays } from 'date-fns';
import Image from 'next/image';

interface AddLambFormProps {
  onAdd: (lamb: Lamb) => void;
  onCancel: () => void;
}

export function AddLambForm({ onAdd, onCancel }: AddLambFormProps) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [birthTime, setBirthTime] = useState(format(new Date(), 'HH:mm'));
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Veteriner Standartlarına Uygun Aşı Takvimi
  const generateDefaultVaccines = (bDate: string): Vaccine[] => {
    const baseDate = new Date(bDate);
    return [
      { 
        id: Math.random().toString(), 
        name: 'Karma Aşı (Çelerme) 1. Doz', 
        dueDate: addDays(baseDate, 42).toISOString(), // 6. Hafta
        isCompleted: false 
      },
      { 
        id: Math.random().toString(), 
        name: 'Pasteurella (Zatürre/Pasteurellosis)', 
        dueDate: addDays(baseDate, 56).toISOString(), // 8. Hafta
        isCompleted: false 
      },
      { 
        id: Math.random().toString(), 
        name: 'Karma Aşı (Rapel/Tekrar)', 
        dueDate: addDays(baseDate, 70).toISOString(), // 10. Hafta
        isCompleted: false 
      },
      { 
        id: Math.random().toString(), 
        name: 'Şap Aşısı', 
        dueDate: addDays(baseDate, 84).toISOString(), // 12. Hafta
        isCompleted: false 
      },
    ];
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

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
          {photoPreview ? (
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
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-14 text-base font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95">
            <Save className="mr-2 h-5 w-5" /> Kaydı Tamamla
          </Button>
        </div>
      </form>
      
      <div className="mt-6 p-4 bg-emerald-50 rounded-2xl flex gap-3 border border-emerald-100">
        <Syringe className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-emerald-900">Otomatik Aşı Takvimi</h4>
          <p className="text-[10px] text-emerald-700/80 leading-relaxed font-medium">
            Kuzu eklendiğinde; Karma, Zatürre ve Şap aşıları 6., 8., 10. ve 12. haftalar için otomatik olarak planlanır.
          </p>
        </div>
      </div>
    </div>
  );
}