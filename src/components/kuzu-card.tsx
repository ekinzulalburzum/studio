"use client";

import Image from 'next/image';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Syringe, Bell, Trash2 } from "lucide-react";
import { Lamb } from '@/lib/types';
import { format, isBefore, addDays } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';

interface KuzuCardProps {
  lamb: Lamb;
  onSelect?: (lamb: Lamb) => void;
  onDelete?: () => void;
}

export function KuzuCard({ lamb, onSelect, onDelete }: KuzuCardProps) {
  const pendingVaccines = lamb.vaccines.filter(v => !v.isCompleted);
  const upcomingVaccine = pendingVaccines[0];
  
  const isVaccineNear = upcomingVaccine && isBefore(new Date(upcomingVaccine.dueDate), addDays(new Date(), 2));

  return (
    <Card 
      className="overflow-hidden border-none shadow-xl hover:scale-[1.02] transition-all duration-300 animate-fade-in bg-white rounded-[2rem] group cursor-pointer"
      onClick={() => onSelect?.(lamb)}
    >
      <div className="flex flex-col sm:flex-row p-6 gap-6">
        {/* Profile Image */}
        <div className="relative h-36 w-36 shrink-0 mx-auto rounded-2xl overflow-hidden bg-slate-100 shadow-inner border-4 border-slate-50">
          <Image 
            src={lamb.photoUrl} 
            alt={lamb.name}
            fill
            className="object-cover"
            data-ai-hint="lamb profile"
          />
          {isVaccineNear && (
            <div className="absolute top-2 right-2 bg-destructive text-white p-2 rounded-full shadow-lg animate-pulse">
              <Bell className="h-5 w-5" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
          <div>
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <h3 className="text-3xl font-black text-slate-900 truncate pr-2">{lamb.name}</h3>
                <div className="flex gap-2 mt-2">
                  <Badge className={`text-[10px] font-black uppercase rounded-lg px-2 py-1 ${lamb.gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                    {lamb.gender === 'male' ? 'ERKEK ♂' : 'DİŞİ ♀'}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-black border-slate-200 text-slate-400 rounded-lg px-2 py-1">
                    #{lamb.id.slice(0, 4)}
                  </Badge>
                </div>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 text-slate-200 hover:text-destructive hover:bg-destructive/5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-6 w-6" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.stopPropagation()} className="rounded-2xl p-8">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-black">Kayıt Silinsin mi?</AlertDialogTitle>
                    <AlertDialogDescription className="text-lg font-bold mt-2">
                      {lamb.name} isimli kuzunun tüm verileri silinecek.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-4 mt-6">
                    <AlertDialogCancel className="font-black h-12 text-lg rounded-xl">Vazgeç</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90 font-black h-12 text-lg rounded-xl px-6">SİL</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-3 text-xl font-black text-slate-700">
                <Calendar className="h-6 w-6 text-primary" />
                <span>{format(new Date(lamb.birthDate), 'dd MMMM yyyy', { locale: tr })}</span>
              </div>
              <div className="flex items-center gap-3 text-xl font-black text-slate-700">
                <Clock className="h-6 w-6 text-primary" />
                <span>Saat: {lamb.birthTime}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            {upcomingVaccine ? (
              <div className={`px-5 py-3 rounded-xl flex items-center gap-3 text-sm font-black uppercase tracking-tight ${isVaccineNear ? 'bg-destructive/10 text-destructive' : 'bg-slate-100 text-slate-600'}`}>
                <Syringe className="h-7 w-7" />
                <span className="truncate">{upcomingVaccine.name} • {format(new Date(upcomingVaccine.dueDate), 'dd MMM', { locale: tr })}</span>
              </div>
            ) : (
              <div className="px-5 py-3 rounded-xl bg-emerald-50 text-emerald-600 flex items-center gap-3 text-sm font-black uppercase tracking-tight">
                <Syringe className="h-7 w-7" />
                <span>TÜM AŞILAR TAMAM</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}