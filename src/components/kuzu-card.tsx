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
      className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in bg-white/95 rounded-[2rem] group cursor-pointer"
      onClick={() => onSelect?.(lamb)}
    >
      <div className="flex p-5 gap-5">
        {/* Profile Image */}
        <div className="relative h-32 w-32 shrink-0 rounded-[1.5rem] overflow-hidden bg-slate-100 shadow-inner">
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
              <h3 className="text-2xl font-black text-slate-900 truncate pr-1">{lamb.name}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[12px] font-black border-slate-200 text-slate-500 rounded-xl px-3 py-1 h-7">
                  #{lamb.id.slice(0, 4)}
                </Badge>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 text-slate-300 hover:text-destructive hover:bg-destructive/5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="h-6 w-6" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-xl font-black">Kayıt Silinsin mi?</AlertDialogTitle>
                      <AlertDialogDescription className="text-base font-bold">
                        {lamb.name} isimli kuzunun tüm verileri silinecek. Bu işlem geri alınamaz.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                      <AlertDialogCancel className="font-bold">Vazgeç</AlertDialogCancel>
                      <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90 font-black">Sil</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-3 text-lg font-black text-slate-700">
                <Calendar className="h-5 w-5 text-primary" />
                <span>{format(new Date(lamb.birthDate), 'dd MMMM yyyy', { locale: tr })}</span>
              </div>
              <div className="flex items-center gap-3 text-lg font-black text-slate-700">
                <Clock className="h-5 w-5 text-primary" />
                <span>{lamb.birthTime}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            {upcomingVaccine ? (
              <div className={`px-4 py-3 rounded-[1.25rem] flex items-center gap-3 text-[13px] font-black uppercase tracking-tight ${isVaccineNear ? 'bg-destructive/10 text-destructive' : 'bg-slate-100 text-slate-600'}`}>
                <Syringe className="h-6 w-6" />
                <span className="truncate">{upcomingVaccine.name} • {format(new Date(upcomingVaccine.dueDate), 'dd MMM', { locale: tr })}</span>
              </div>
            ) : (
              <div className="px-4 py-3 rounded-[1.25rem] bg-emerald-50 text-emerald-600 flex items-center gap-3 text-[13px] font-black uppercase tracking-tight">
                <Syringe className="h-6 w-6" />
                <span>Tüm Aşılar Tamam</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
