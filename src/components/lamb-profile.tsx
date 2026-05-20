"use client";

import { useState, useEffect } from 'react';
import { Lamb } from '@/lib/types';
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

  const completedVaccinesCount = lamb.vaccines.filter(v => v.isCompleted).length;
  const totalVaccinesCount = lamb.vaccines.length;
  const progress = Math.round((completedVaccinesCount / totalVaccinesCount) * 100);
  
  const ageInDays = differenceInDays(new Date(), new Date(lamb.birthDate));
  const lastCompletedVaccine = [...lamb.vaccines].reverse().find(v => v.isCompleted);

  const getAiRecommendations = async () => {
    setIsAiLoading(true);
    try {
      const prompt = `Kuzunun adı ${lamb.name}, cinsiyeti ${lamb.gender === 'male' ? 'Erkek' : 'Dişi'}, ${ageInDays} günlük. 
        Tamamlanan aşı sayısı: ${completedVaccinesCount}/${totalVaccinesCount}. 
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
  }, [lamb.id, completedVaccinesCount]);

  return (
    <div className="flex flex-col animate-fade-in pb-24">
      <div className="relative h-80 w-full overflow-hidden rounded-b-[3rem] shadow-xl">
        <Image 
          src={lamb.photoUrl} 
          alt={lamb.name} 
          fill 
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="absolute top-6 left-6 bg-white/30 backdrop-blur-lg text-white rounded-full hover:bg-white/50 h-12 w-12"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <div className="absolute bottom-10 left-8 right-8">
          <div className="flex gap-2 mb-3">
            <Badge className="bg-primary text-white border-none px-4 py-1 font-black text-xs uppercase">#{lamb.id}</Badge>
            <Badge className={`border-none px-4 py-1 font-black text-xs uppercase ${lamb.gender === 'male' ? 'bg-blue-500 text-white' : 'bg-pink-500 text-white'}`}>
              {lamb.gender === 'male' ? 'ERKEK ♂' : 'DİŞİ ♀'}
            </Badge>
          </div>
          <h1 className="text-5xl font-black text-white">{lamb.name}</h1>
        </div>
      </div>

      <div className="px-6 -mt-10 relative z-10 space-y-8">
        <Card className="border-none shadow-xl rounded-[2rem] bg-white">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Doğum Tarihi</span>
                <div className="flex items-center gap-3 text-slate-800 font-black">
                  <Calendar className="h-6 w-6 text-primary" />
                  <span className="text-xl">{format(new Date(lamb.birthDate), 'dd MMM yyyy', { locale: tr })}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Güncel Yaş</span>
                <div className="flex items-center gap-3 text-slate-800 font-black">
                  <Clock className="h-6 w-6 text-primary" />
                  <span className="text-xl">{ageInDays} Günlük</span>
                </div>
              </div>
            </div>
            
            <div className="mt-10 pt-8 border-t border-slate-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-black text-slate-600">AŞILANMA DURUMU</span>
                <span className="text-xl font-black text-primary">%{progress}</span>
              </div>
              <div className="h-5 bg-slate-100 rounded-full overflow-hidden p-1">
                <div 
                  className="h-full bg-primary rounded-full shadow-lg transition-all duration-1000 ease-out" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4 ml-3">
            <Syringe className="h-8 w-8 text-primary" /> AŞI TAKVİMİ
          </h2>
          
          <div className="space-y-4">
            {lamb.vaccines.map((vaccine) => (
              <div 
                key={vaccine.id}
                onClick={() => onUpdateVaccine(vaccine.id)}
                className={`flex items-center justify-between p-6 rounded-[2rem] border-4 transition-all active:scale-95 cursor-pointer ${
                  vaccine.isCompleted 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                  : 'bg-white border-slate-100 shadow-lg'
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
                    vaccine.isCompleted ? 'bg-emerald-100' : 'bg-slate-100'
                  }`}>
                    <Syringe className={`h-8 w-8 ${vaccine.isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-tight">{vaccine.name}</h4>
                    <p className="text-xs font-bold text-slate-500 mt-1">
                      {format(new Date(vaccine.dueDate), 'dd MMMM yyyy', { locale: tr })}
                    </p>
                  </div>
                </div>
                {vaccine.isCompleted ? (
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                ) : (
                  <Circle className="h-10 w-10 text-slate-200" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4 ml-3">
            <Sparkles className="h-8 w-8 text-amber-500" /> AI SAĞLIK REHBERİ
          </h2>
          <Card className="border-none shadow-xl rounded-[2rem] bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100/50">
            <CardContent className="p-8">
              {isAiLoading ? (
                <div className="flex items-center justify-center py-8 gap-4">
                  <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
                  <p className="text-lg font-black text-amber-700 uppercase tracking-widest">ÖNERİLER HAZIRLANIYOR...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xl text-amber-950 leading-relaxed font-black italic">
                    "{aiAdvice || 'Kuzunuzun durumuna göre özel tavsiyeler hazırlanıyor.'}"
                  </p>
                  <div className="h-px bg-amber-200/50 w-full" />
                  <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest opacity-80">
                    * BİLGİLENDİRME AMAÇLIDIR, VETERİNERE DANIŞIN.
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