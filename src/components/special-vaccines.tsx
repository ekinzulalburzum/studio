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
    <div className="p-4 space-y-8 animate-fade-in pb-32">
      <div className="flex items-center gap-4 mb-2">
        <div className="bg-primary/10 p-4 rounded-2xl">
          <Bell className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900">Özel Aşılar</h2>
          <p className="text-[10px] text-primary font-black uppercase tracking-widest">KİŞİSEL HATIRLATICI EKLE</p>
        </div>
      </div>

      <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden border-t-8 border-primary">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-3">
            <Label className="text-lg font-black text-slate-900 uppercase tracking-widest ml-2">KUZU SEÇİN</Label>
            <select 
              className="w-full h-16 bg-slate-100 border-none rounded-2xl text-xl font-black px-6 outline-none focus:ring-4 focus:ring-primary/20 appearance-none"
              value={selectedLambId || ''}
              onChange={(e) => setSelectedLambId(e.target.value)}
            >
              <option value="">Kuzu Seçiniz...</option>
              {lambs.map(l => (
                <option key={l.id} value={l.id}>{l.name} (#{l.id.slice(0,4)})</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <Label className="text-lg font-black text-slate-900 uppercase tracking-widest ml-2">AŞI VEYA İLAÇ ADI</Label>
            <Input 
              placeholder="Örn: Vitamin Takviyesi"
              value={vaccineName}
              onChange={(e) => setVaccineName(e.target.value)}
              className="h-16 bg-slate-100 border-none text-xl font-black px-6 rounded-2xl"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-lg font-black text-slate-900 uppercase tracking-widest ml-2">HATIRLATMA TARİHİ</Label>
            <Input 
              type="date"
              value={vaccineDate}
              onChange={(e) => setVaccineDate(e.target.value)}
              className="h-16 bg-slate-100 border-none text-xl font-black px-6 rounded-2xl"
            />
          </div>

          <Button 
            onClick={handleAddSpecialVaccine}
            disabled={!selectedLambId || !vaccineName || !vaccineDate}
            className="w-full h-20 bg-primary hover:bg-primary/90 text-2xl font-black rounded-2xl shadow-xl shadow-primary/30 mt-2"
          >
            <Plus className="mr-3 h-8 w-8 stroke-[4]" /> HATIRLATICI KUR
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-2xl font-black text-slate-900 ml-3 flex items-center gap-3">
          <Syringe className="h-8 w-8 text-primary" /> AKTİF ÖZEL AŞILAR
        </h3>

        {allSpecialVaccines.length > 0 ? (
          <div className="space-y-4">
            {allSpecialVaccines.map((v) => (
              <div 
                key={v.id}
                className={`p-6 rounded-[2rem] border-4 flex justify-between items-center transition-all bg-white shadow-lg ${v.isCompleted ? 'border-emerald-200 bg-emerald-50/50 opacity-70' : 'border-slate-100'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${v.isCompleted ? 'bg-emerald-100' : 'bg-primary/10'}`}>
                    <Bell className={`h-8 w-8 ${v.isCompleted ? 'text-emerald-600' : 'text-primary'}`} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-900">{v.name.replace('(Özel) ', '')}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-black text-primary uppercase">{v.lambName}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-lg font-bold text-slate-500">{format(new Date(v.dueDate), 'dd MMMM', { locale: tr })}</span>
                    </div>
                  </div>
                </div>
                {v.isCompleted && <CheckCircle2 className="h-8 w-8 text-emerald-500" />}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-[2.5rem] border-4 border-dashed border-slate-200">
            <p className="text-xl font-black text-slate-400 uppercase tracking-widest">Kayıtlı Özel Aşı Yok</p>
          </div>
        )}
      </div>
    </div>
  );
}