
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
      className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 animate-fade-in bg-white rounded-[2.5rem] group cursor-pointer"
      onClick={() => onSelect?.(lamb)}
    >
      <div className="flex p-6 gap-6">
        {/* Profile Image */}
        <div className="relative h-40 w-40 shrink-0 rounded-[2rem] overflow-hidden bg-slate-100 shadow-inner border-2 border-slate-50">
          <Image 
            src={lamb.photoUrl} 
            alt={lamb.name}
            fill
            className="object-cover"
            data-ai-hint="lamb profile"
          />
          {isVaccineNear && (
            <div className="absolute top-3 right-3 bg-destructive text-white p-2.5 rounded-full shadow-lg animate-pulse">
              <Bell className="h-6 w-6" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
          <div>
            <div className="flex justify-between items-start">
              <div className="flex flex-col">
                <h3 className="text-3xl font-black text-slate-900 truncate pr-1">{lamb.name}</h3>
                <div className="flex gap-2 mt-2">
                  <Badge className={`text-xs font-black uppercase rounded-lg px-3 py-1 ${lamb.gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                    {lamb.gender === 'male' ? 'ERKEK ♂' : 'DİŞİ ♀'}
                  </Badge>
                  <Badge variant="outline" className="text-xs font-black border-slate-200 text-slate-400 rounded-lg px-3 py-1">
                    #{lamb.id.slice(0, 4)}
                  </Badge>
                </div>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-12 w-12 text-slate-200 hover:text-destructive hover:bg-destructive/5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-8 w-8" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-black">Kayıt Silinsin mi?</AlertDialogTitle>
                    <AlertDialogDescription className="text-lg font-bold">
                      {lamb.name} isimli kuzunun tüm verileri silinecek. Bu işlem geri alınamaz.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-4">
                    <AlertDialogCancel className="font-bold h-14 text-lg">Vazgeç</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90 font-black h-14 text-lg">SİL</AlertDialogAction>
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
                <span>{lamb.birthTime}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            {upcomingVaccine ? (
              <div className={`px-6 py-4 rounded-[1.5rem] flex items-center gap-4 text-sm font-black uppercase tracking-tight ${isVaccineNear ? 'bg-destructive/10 text-destructive' : 'bg-slate-100 text-slate-600'}`}>
                <Syringe className="h-8 w-8" />
                <span className="truncate">{upcomingVaccine.name} • {format(new Date(upcomingVaccine.dueDate), 'dd MMM', { locale: tr })}</span>
              </div>
            ) : (
              <div className="px-6 py-4 rounded-[1.5rem] bg-emerald-50 text-emerald-600 flex items-center gap-4 text-sm font-black uppercase tracking-tight">
                <Syringe className="h-8 w-8" />
                <span>TÜM AŞILAR TAMAMLANDI</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
