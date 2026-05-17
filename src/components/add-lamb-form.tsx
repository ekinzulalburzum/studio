
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Save, X, Sparkles } from 'lucide-react';
import { Lamb, Vaccine } from '@/lib/types';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface AddLambFormProps {
  onAdd: (lamb: Lamb) => void;
  onCancel: () => void;
}

export function AddLambForm({ onAdd, onCancel }: AddLambFormProps) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [birthTime, setBirthTime] = useState(format(new Date(), 'HH:mm'));
  const [motherId, setMotherId] = useState('');

  const generateDefaultVaccines = (bDate: string): Vaccine[] => {
    const baseDate = new Date(bDate);
    return [
      { id: Math.random().toString(), name: 'CD&T (1. Doz)', dueDate: new Date(baseDate.getTime() + 42 * 24 * 60 * 60 * 1000).toISOString(), isCompleted: false },
      { id: Math.random().toString(), name: 'CD&T (Güçlendirici)', dueDate: new Date(baseDate.getTime() + 70 * 24 * 60 * 60 * 1000).toISOString(), isCompleted: false },
      { id: Math.random().toString(), name: 'Pastörella', dueDate: new Date(baseDate.getTime() + 56 * 24 * 60 * 60 * 1000).toISOString(), isCompleted: false },
    ];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newLamb: Lamb = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      birthDate,
      birthTime,
      photoUrl: `https://picsum.photos/seed/${Math.random()}/600/400`,
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
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-2xl shadow-sm border border-accent/20">
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-accent/50 rounded-2xl bg-secondary/30 mb-4 hover:bg-secondary/50 transition-colors cursor-pointer group">
          <Camera className="h-12 w-12 text-accent group-hover:scale-110 transition-transform" />
          <p className="mt-2 text-sm text-muted-foreground font-medium">Fotoğraf Çek veya Yükle</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Kuzu İsmi / Küpe No</Label>
          <Input 
            id="name" 
            placeholder="Örn: Pamuk veya TR12345" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            required
            className="border-accent/30 focus-visible:ring-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Doğum Tarihi</Label>
            <Input 
              id="date" 
              type="date" 
              value={birthDate} 
              onChange={(e) => setBirthDate(e.target.value)}
              className="border-accent/30 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Saat</Label>
            <Input 
              id="time" 
              type="time" 
              value={birthTime} 
              onChange={(e) => setBirthTime(e.target.value)}
              className="border-accent/30 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mother">Anne Küpe No (Opsiyonel)</Label>
          <Input 
            id="mother" 
            placeholder="Örn: TR54321" 
            value={motherId} 
            onChange={(e) => setMotherId(e.target.value)}
            className="border-accent/30 focus-visible:ring-primary"
          />
        </div>

        <div className="pt-4 flex gap-3">
          <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 py-6 text-lg font-bold">
            <Save className="mr-2 h-5 w-5" /> Kaydet
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="py-6 px-6">
            İptal
          </Button>
        </div>
      </form>
      
      <p className="text-center text-xs text-muted-foreground mt-4">
        Kaydedilen her kuzu için otomatik aşı takvimi oluşturulacaktır.
      </p>
    </div>
  );
}
