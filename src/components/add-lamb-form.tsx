
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
    <div className="max-w-md mx-auto w-full px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <Sparkles className="h-6 w-6" /> Yeni Kuzu Kaydı
        </h2>
        <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full">
          <X className="h-6 w-6" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-3xl shadow-sm border border-accent/20">
        <div 
          onClick={handlePhotoClick}
          className="relative flex flex-col items-center justify-center h-48 border-2 border-dashed border-accent/50 rounded-2xl bg-secondary/30 overflow-hidden hover:bg-secondary/50 transition-all cursor-pointer group"
        >
          {photoPreview ? (
            <div className="relative w-full h-full">
              <Image 
                src={photoPreview} 
                alt="Preview" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </div>
          ) : (
            <>
              <Camera className="h-12 w-12 text-accent group-hover:scale-110 transition-transform" />
              <p className="mt-2 text-sm text-muted-foreground font-medium">Fotoğraf Çek / Yükle</p>
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
          <Label htmlFor="name" className="text-sm font-bold ml-1">Kuzu İsmi / Küpe No</Label>
          <Input 
            id="name" 
            placeholder="Örn: Pamuk veya TR12345" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            required
            className="border-accent/30 focus-visible:ring-primary h-12 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-bold ml-1">Doğum Tarihi</Label>
            <Input 
              id="date" 
              type="date" 
              value={birthDate} 
              onChange={(e) => setBirthDate(e.target.value)}
              className="border-accent/30 focus-visible:ring-primary h-12 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time" className="text-sm font-bold ml-1">Saat</Label>
            <Input 
              id="time" 
              type="time" 
              value={birthTime} 
              onChange={(e) => setBirthTime(e.target.value)}
              className="border-accent/30 focus-visible:ring-primary h-12 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mother" className="text-sm font-bold ml-1">Anne Küpe No (Opsiyonel)</Label>
          <Input 
            id="mother" 
            placeholder="Örn: TR54321" 
            value={motherId} 
            onChange={(e) => setMotherId(e.target.value)}
            className="border-accent/30 focus-visible:ring-primary h-12 rounded-xl"
          />
        </div>

        <div className="pt-4 flex gap-3">
          <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95">
            <Save className="mr-2 h-5 w-5" /> Kaydet
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="h-14 px-6 rounded-2xl border-accent/30">
            İptal
          </Button>
        </div>
      </form>
      
      <div className="flex items-center gap-2 justify-center mt-6 p-4 bg-accent/10 rounded-2xl border border-accent/20">
        <ImageIcon className="h-4 w-4 text-accent" />
        <p className="text-xs text-muted-foreground font-medium">
          Otomatik aşı takvimi doğum tarihine göre oluşturulur.
        </p>
      </div>
    </div>
  );
}
