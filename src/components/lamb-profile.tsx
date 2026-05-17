
"use client";

import { Lamb, Vaccine } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Calendar, Clock, Syringe, CheckCircle2, Circle } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface LambProfileProps {
  lamb: Lamb;
  onBack: () => void;
  onUpdateVaccine: (vaccineId: string) => void;
}

export function LambProfile({ lamb, onBack, onUpdateVaccine }: LambProfileProps) {
  const completedVaccines = lamb.vaccines.filter(v => v.isCompleted).length;
  const totalVaccines = lamb.vaccines.length;
  const progress = Math.round((completedVaccines / totalVaccines) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 animate-fade-in pb-28">
      {/* Header Image */}
      <div className="relative h-72 w-full overflow-hidden">
        <Image 
          src={lamb.photoUrl} 
          alt={lamb.name} 
          fill 
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div className="absolute bottom-6 left-6 right-6">
          <Badge className="mb-2 bg-primary text-white border-none">#{lamb.id}</Badge>
          <h1 className="text-3xl font-black text-white">{lamb.name}</h1>
        </div>
      </div>

      <div className="px-6 -mt-6 relative z-10 space-y-6">
        {/* Info Card */}
        <Card className="border-none shadow-xl rounded-[2rem] bg-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doğum Tarihi</span>
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{format(new Date(lamb.birthDate), 'dd MMM yyyy', { locale: tr })}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doğum Saati</span>
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{lamb.birthTime}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-500">Aşılanma Oranı</span>
                <span className="text-xs font-black text-primary">%{progress}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vaccine List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Syringe className="h-5 w-5 text-primary" /> Aşı Takvimi
          </h2>
          
          <div className="space-y-3">
            {lamb.vaccines.map((vaccine) => (
              <div 
                key={vaccine.id}
                onClick={() => onUpdateVaccine(vaccine.id)}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                  vaccine.isCompleted 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-900' 
                  : 'bg-white border-slate-100 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                    vaccine.isCompleted ? 'bg-emerald-100' : 'bg-slate-100'
                  }`}>
                    <Syringe className={`h-5 w-5 ${vaccine.isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{vaccine.name}</h4>
                    <p className="text-[10px] font-medium text-slate-400">
                      Tarih: {format(new Date(vaccine.dueDate), 'dd MMMM yyyy', { locale: tr })}
                    </p>
                  </div>
                </div>
                {vaccine.isCompleted ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                ) : (
                  <Circle className="h-6 w-6 text-slate-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
