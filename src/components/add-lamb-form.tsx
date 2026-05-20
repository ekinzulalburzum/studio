
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Save, X, Sparkles, Loader2 } from 'lucide-react';
import { Lamb, Vaccine } from '@/lib/types';
import { format, addDays } from 'date-fns';
import Image from 'next/image';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AddLambFormProps {
  onAdd: (lamb: Lamb) => void;
  onCancel: () => void;
}

export function AddLambForm({ onAdd, onCancel }: AddLambFormProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      gender,
      birthDate,
      birthTime,
      photoUrl: photoPreview || `https://picsum.photos/seed/${Math.random()}/600/400`,
      vaccines: generateDefaultVaccines(birthDate)
    };

    onAdd(newLamb);
  };

  return (
    <div className="max-w-xl mx-auto w-full px-6 py-8 animate-fade-in mb-32">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-black text-slate-900 flex items-center gap-3">
          <Sparkles className="h-10 w-10 text-primary" /> Yeni Kayıt
        </h2>
        <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full h-14 w-14">
          <X className="h-10 w-10" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-100">
        <div 
          onClick={handlePhotoClick}
          className="relative flex flex-col items-center justify-center h-72 border-4 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/50 overflow-hidden hover:bg-slate-50 transition-all cursor-pointer"
        >
          {isCompressing ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-lg text-slate-400 font-black uppercase tracking-widest">Resim İşleniyor</p>
            </div>
          ) : photoPreview ? (
            <Image src={photoPreview} alt="Preview" fill className="object-cover" />
          ) : (
            <>
              <Camera className="h-16 w-16 text-slate-300 mb-4" />
              <p className="text-lg text-slate-400 font-black uppercase tracking-widest text-center px-4">Fotoğraf Çek veya Yükle</p>
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

        <div className="space-y-4">
          <Label htmlFor="name" className="text-xl font-black text-slate-500 uppercase tracking-widest ml-2">Kuzu Adı / Küpe No</Label>
          <Input 
            id="name" 
            placeholder="Örn: Pamuk" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            required
            className="border-none bg-slate-100 focus-visible:ring-primary h-20 rounded-2xl text-3xl font-black px-8"
          />
        </div>

        <div className="space-y-4">
          <Label className="text-xl font-black text-slate-500 uppercase tracking-widest ml-2">Cinsiyet</Label>
          <RadioGroup 
            value={gender} 
            onValueChange={(v: 'male' | 'female') => setGender(v)}
            className="flex gap-4"
          >
            <div className={`flex-1 h-20 rounded-2xl flex items-center justify-center border-4 transition-all cursor-pointer ${gender === 'female' ? 'border-primary bg-primary/10' : 'border-slate-100 bg-slate-50'}`} onClick={() => setGender('female')}>
              <RadioGroupItem value="female" id="female" className="hidden" />
              <Label htmlFor="female" className="text-2xl font-black cursor-pointer">DİŞİ ♀</Label>
            </div>
            <div className={`flex-1 h-20 rounded-2xl flex items-center justify-center border-4 transition-all cursor-pointer ${gender === 'male' ? 'border-blue-500 bg-blue-50' : 'border-slate-100 bg-slate-50'}`} onClick={() => setGender('male')}>
              <RadioGroupItem value="male" id="male" className="hidden" />
              <Label htmlFor="male" className="text-2xl font-black cursor-pointer text-blue-700">ERKEK ♂</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <Label htmlFor="date" className="text-xl font-black text-slate-500 uppercase tracking-widest ml-2">Doğum Tarihi</Label>
            <Input 
              id="date" 
              type="date" 
              value={birthDate} 
              onChange={(e) => setBirthDate(e.target.value)}
              className="border-none bg-slate-100 focus-visible:ring-primary h-20 rounded-2xl text-2xl font-black px-8"
            />
          </div>
          <div className="space-y-4">
            <Label htmlFor="time" className="text-xl font-black text-slate-500 uppercase tracking-widest ml-2">Doğum Saati</Label>
            <Input 
              id="time" 
              type="time" 
              value={birthTime} 
              onChange={(e) => setBirthTime(e.target.value)}
              className="border-none bg-slate-100 focus-visible:ring-primary h-20 rounded-2xl text-2xl font-black px-8"
            />
          </div>
        </div>

        <div className="pt-6">
          <Button 
            type="submit" 
            disabled={isCompressing || !birthDate}
            className="w-full bg-primary hover:bg-primary/90 h-24 text-3xl font-black rounded-[2rem] shadow-2xl shadow-primary/30 transition-all active:scale-95"
          >
            <Save className="mr-4 h-10 w-10" /> KAYDI TAMAMLA
          </Button>
        </div>
      </form>
    </div>
  );
}
