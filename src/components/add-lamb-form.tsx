
"use client";

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Save, X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Lamb, Vaccine } from '@/lib/types';
import { format } from 'date-fns';
import Image from 'next/image';

interface AddLambFormProps {
  onAdd: (lamb: Lamb) => void;
  onCancel: () => void;
}

export function AddLambForm({ onAdd, onCancel }: AddLambFormProps) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [birthTime, setBirthTime] = useState(format(new Date(), 'HH:mm'));
  const [motherId, setMotherId] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateDefaultVaccines = (bDate: string): Vaccine[] => {
    const baseDate = new Date(bDate);
    return [
      { id: Math.random().toString(), name: 'CD&T (1. Doz)', dueDate: new Date(baseDate.getTime() + 42 * 24 * 60 * 60 * 1000).toISOString(), isCompleted: false },
      { id: Math.random().toString(), name: 'CD&T (Güçlendirici)', dueDate: new Date(baseDate.getTime() + 70 * 24 * 60 * 60 * 1000).toISOString(), isCompleted: false },
      { id: Math.random().toString(), name: 'Pastörella', dueDate: new Date(baseDate.getTime() + 56 * 24 * 60 * 60 * 1000).toISOString(), isCompleted: false },
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
      id: Math.random().toString(36).substr(2, 9),
      name,
      birthDate,
      birthTime,
      photoUrl: photoPreview || `https://picsum.photos/seed/${Math.random()}/600/400`,
      motherId: motherId || undefined,
      vaccines: generateDefaultVaccines(birthDate)
    };

    onAdd(newLamb);
  };

  return (
    <div className="max-w-md mx-auto w-full px-4 py-8 animate-fade-in mb-24">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Sparkles className="h-6 w-6" /> Yeni Kuzu Kaydı
        </h2>
        <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full">
          <X className="h-6 w-6" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white/90 backdrop-blur-sm p-8 rounded-[2.5rem] shadow-xl shadow-primary/5 border border-white/40">
        <div 
          onClick={handlePhotoClick}
          className="relative flex flex-col items-center justify-center h-56 border-2 border-dashed border-primary/20 rounded-[2rem] bg-secondary/20 overflow-hidden hover:bg-secondary/40 transition-all cursor-pointer group"
        >
          {photoPreview ? (
            <div className="relative w-full h-full">
              <Image 
                src={photoPreview} 
                alt="Preview" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-10 w-10 text-white" />
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white p-4 rounded-full shadow-lg mb-3 group-hover:scale-110 transition-transform">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-primary font-bold">Kamera ile Çek</p>
              <p className="text-xs text-muted-foreground mt-1">veya bir dosya seçin</p>
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
          <Label htmlFor="name" className="text-sm font-black text-primary ml-1 uppercase tracking-wider">Kuzu İsmi / Küpe No</Label>
          <Input 
            id="name" 
            placeholder="Örn: Pamuk veya TR12345" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            required
            className="border-none bg-secondary/30 focus-visible:ring-primary h-14 rounded-2xl text-lg font-medium px-4"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-black text-primary ml-1 uppercase tracking-wider">Doğum Tarihi</Label>
            <Input 
              id="date" 
              type="date" 
              value={birthDate} 
              onChange={(e) => setBirthDate(e.target.value)}
              className="border-none bg-secondary/30 focus-visible:ring-primary h-14 rounded-2xl px-4"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time" className="text-sm font-black text-primary ml-1 uppercase tracking-wider">Saat</Label>
            <Input 
              id="time" 
              type="time" 
              value={birthTime} 
              onChange={(e) => setBirthTime(e.target.value)}
              className="border-none bg-secondary/30 focus-visible:ring-primary h-14 rounded-2xl px-4"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mother" className="text-sm font-black text-primary ml-1 uppercase tracking-wider">Anne Küpe No</Label>
          <Input 
            id="mother" 
            placeholder="Örn: TR54321" 
            value={motherId} 
            onChange={(e) => setMotherId(e.target.value)}
            className="border-none bg-secondary/30 focus-visible:ring-primary h-14 rounded-2xl px-4"
          />
        </div>

        <div className="pt-4 flex gap-3">
          <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 h-16 text-lg font-bold rounded-[1.5rem] shadow-xl shadow-primary/20 transition-all active:scale-95">
            <Save className="mr-2 h-6 w-6" /> Kaydet
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel} className="h-16 px-6 rounded-[1.5rem] font-bold text-muted-foreground">
            İptal
          </Button>
        </div>
      </form>
      
      <div className="flex items-center gap-3 justify-center mt-8 p-5 bg-primary/5 rounded-[2rem] border border-primary/10">
        <div className="bg-primary/10 p-2 rounded-xl">
          <ImageIcon className="h-5 w-5 text-primary" />
        </div>
        <p className="text-xs text-primary/80 font-bold leading-relaxed">
          Sistem doğum tarihine göre 3 aşamalı koruyucu aşı takvimini otomatik olarak planlar.
        </p>
      </div>
    </div>
  );
}
