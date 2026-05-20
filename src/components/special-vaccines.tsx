
"use client";

import { useState } from 'react';
import { Lamb, Vaccine } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Syringe, Plus, Calendar, Bell, Trash2, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface SpecialVaccinesProps {
  lambs: Lamb[];
  onUpdateLambs: (updatedLambs: Lamb[]) => void;
}

export function SpecialVaccines({ lambs, onUpdateLambs }: SpecialVaccinesProps) {
  const [selectedLambId, setSelectedLambId] = useState<string | null>(null);
  const [vaccineName, setVaccineName] = useState('');
  const [vaccineDate, setVaccineDate] = useState('');

  const handleAddSpecialVaccine = () => {
    if (!selectedLambId || !vaccineName || !vaccineDate) return;

    const updatedLambs = lambs.map(l => {
      if (l.id === selectedLambId) {
        const newVaccine: Vaccine = {
          id: Math.random().toString(36).substr(2, 9),
          name: `(Özel) ${vaccineName}`,
          dueDate: new Date(vaccineDate).toISOString(),
          isCompleted: false
        };
        return { ...l, vaccines: [...l.vaccines, newVaccine] };
      }
      return l;
    });

    onUpdateLambs(updatedLambs);
    setVaccineName('');
    setVaccineDate('');
    setSelectedLambId(null);
  };

  const allSpecialVaccines = lambs.flatMap(l => 
    l.vaccines
      .filter(v => v.name.startsWith('(Özel)'))
      .map(v => ({ ...v, lambName: l.name, lambId: l.id }))
  ).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="p-6 space-y-10 animate-fade-in pb-32">
      <div className="flex items-center gap-5 mb-4">
        <div className="bg-primary/10 p-5 rounded-[2rem]">
          <Bell className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h2 className="text-4xl font-black text-slate-900">Özel Aşılar</h2>
          <p className="text-sm text-primary font-black uppercase tracking-widest">KİŞİSEL HATIRLATICI EKLE</p>
        </div>
      </div>

      <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden border-t-8 border-primary">
        <CardContent className="p-10 space-y-8">
          <div className="space-y-4">
            <Label className="text-2xl font-black text-slate-900 uppercase tracking-widest ml-2">KUZU SEÇİN</Label>
            <select 
              className="w-full h-24 bg-slate-100 border-none rounded-3xl text-3xl font-black px-8 outline-none focus:ring-4 focus:ring-primary/20 appearance-none"
              value={selectedLambId || ''}
              onChange={(e) => setSelectedLambId(e.target.value)}
            >
              <option value="">Kuzu Seçiniz...</option>
              {lambs.map(l => (
                <option key={l.id} value={l.id}>{l.name} (#{l.id.slice(0,4)})</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <Label className="text-2xl font-black text-slate-900 uppercase tracking-widest ml-2">AŞI VEYA İLAÇ ADI</Label>
            <Input 
              placeholder="Örn: Vitamin Takviyesi"
              value={vaccineName}
              onChange={(e) => setVaccineName(e.target.value)}
              className="h-24 bg-slate-100 border-none text-3xl font-black px-8 rounded-3xl"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-2xl font-black text-slate-900 uppercase tracking-widest ml-2">HATIRLATMA TARİHİ</Label>
            <Input 
              type="date"
              value={vaccineDate}
              onChange={(e) => setVaccineDate(e.target.value)}
              className="h-24 bg-slate-100 border-none text-3xl font-black px-8 rounded-3xl"
            />
          </div>

          <Button 
            onClick={handleAddSpecialVaccine}
            disabled={!selectedLambId || !vaccineName || !vaccineDate}
            className="w-full h-28 bg-primary hover:bg-primary/90 text-4xl font-black rounded-[2.5rem] shadow-2xl shadow-primary/30 mt-4"
          >
            <Plus className="mr-4 h-10 w-10 stroke-[4]" /> HATIRLATICI KUR
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h3 className="text-3xl font-black text-slate-900 ml-4 flex items-center gap-4">
          <Syringe className="h-10 w-10 text-primary" /> AKTİF ÖZEL AŞILAR
        </h3>

        {allSpecialVaccines.length > 0 ? (
          <div className="space-y-5">
            {allSpecialVaccines.map((v) => (
              <div 
                key={v.id}
                className={`p-8 rounded-[2.5rem] border-4 flex justify-between items-center transition-all bg-white shadow-xl ${v.isCompleted ? 'border-emerald-200 bg-emerald-50/50 opacity-70' : 'border-slate-100'}`}
              >
                <div className="flex items-center gap-6">
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${v.isCompleted ? 'bg-emerald-100' : 'bg-primary/10'}`}>
                    <Bell className={`h-10 w-10 ${v.isCompleted ? 'text-emerald-600' : 'text-primary'}`} />
                  </div>
                  <div>
                    <h4 className="text-3xl font-black text-slate-900">{v.name.replace('(Özel) ', '')}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xl font-black text-primary uppercase">{v.lambName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xl font-bold text-slate-500">{format(new Date(v.dueDate), 'dd MMMM', { locale: tr })}</span>
                    </div>
                  </div>
                </div>
                {v.isCompleted && <CheckCircle2 className="h-10 w-10 text-emerald-500" />}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border-4 border-dashed border-slate-200">
            <p className="text-2xl font-black text-slate-400 uppercase tracking-widest">Kayıtlı Özel Aşı Yok</p>
          </div>
        )}
      </div>
    </div>
  );
}
