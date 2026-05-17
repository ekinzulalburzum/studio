"use client";

import { useState, useEffect } from 'react';
import { Lamb, Vaccine } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Calendar, Clock, Syringe, CheckCircle2, Circle, Sparkles, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { format, differenceInDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import { lambHealthAssistant } from '@/ai/flows/lamb-health-assistant';

interface LambProfileProps {
  lamb: Lamb;
  onBack: () => void;
  onUpdateVaccine: (vaccineId: string) => void;
}

export function LambProfile({ lamb, onBack, onUpdateVaccine }: LambProfileProps) {
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const completedVaccines = lamb.vaccines.filter(v => v.isCompleted).length;
  const totalVaccines = lamb.vaccines.length;
  const progress = Math.round((completedVaccines / totalVaccines) * 100);
  
  const ageInDays = differenceInDays(new Date(), new Date(lamb.birthDate));
  const lastCompletedVaccine = [...lamb.vaccines].reverse().find(v => v.isCompleted);

  const getAiRecommendations = async () => {
    setIsAiLoading(true);
    try {
      const prompt = `Kuzunun adı ${lamb.name}, ${ageInDays} günlük. 
        Tamamlanan aşı sayısı: ${completedVaccines}/${totalVaccines}. 
        ${lastCompletedVaccine ? `En son yapılan aşı: ${lastCompletedVaccine.name}.` : 'Henüz hiç aşı yapılmadı.'} 
        Bu bilgilere dayanarak bu kuzu için kısa, uzman veteriner sağlık ve beslenme önerilerinde bulunur musun? (Türkçe, kısa ve öz olsun)`;
      
      const result = await lambHealthAssistant({ question: prompt });
      setAiAdvice(result.answer);
    } catch (error) {
      console.error("AI Tavsiye hatası:", error);
      setAiAdvice("Sağlık önerileri şu an oluşturulamadı.");
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    getAiRecommendations();
  }, [lamb.id, completedVaccines]);

  return (
    <div className="flex flex-col animate-fade-in pb-10">
      {/* Profil Görseli */}
      <div className="relative h-64 w-full overflow-hidden rounded-b-[2.5rem] shadow-lg">
        <Image 
          src={lamb.photoUrl} 
          alt={lamb.name} 
          fill 
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
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
        {/* Temel Bilgiler Kartı */}
        <Card className="border-none shadow-xl rounded-[2rem] bg-white">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doğum Tarihi</span>
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-sm">{format(new Date(lamb.birthDate), 'dd MMM yyyy', { locale: tr })}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yaş</span>
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm">{ageInDays} Günlük</span>
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

        {/* Aşı Takvimi */}
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

        {/* AI Sağlık Önerileri */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" /> AI Sağlık Önerileri
          </h2>
          <Card className="border-none shadow-sm rounded-[2rem] bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100/50">
            <CardContent className="p-5">
              {isAiLoading ? (
                <div className="flex items-center justify-center py-4 gap-3">
                  <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Öneriler Hazırlanıyor...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-amber-900 leading-relaxed font-medium italic">
                    "{aiAdvice || 'Kuzunuzun aşı durumuna göre size özel tavsiyeler burada görünecek.'}"
                  </p>
                  <p className="text-[9px] text-amber-600 font-bold uppercase tracking-tighter opacity-60">
                    * Bu öneriler bilgilendirme amaçlıdır, veteriner hekiminize danışın.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
