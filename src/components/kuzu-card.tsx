
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
      className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in bg-white rounded-2xl group"
      onClick={() => onSelect?.(lamb)}
    >
      <div className="flex p-3 gap-3">
        {/* Profile Image */}
        <div className="relative h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-slate-100">
          <Image 
            src={lamb.photoUrl} 
            alt={lamb.name}
            fill
            className="object-cover"
            data-ai-hint="lamb profile"
          />
          {isVaccineNear && (
            <div className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full shadow-sm animate-pulse">
              <Bell className="h-2 w-2" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-base font-bold text-slate-900 truncate pr-1">{lamb.name}</h3>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-[9px] font-bold border-slate-200 text-slate-500 rounded-md px-1 py-0 h-4">
                  #{lamb.id.slice(0, 4)}
                </Badge>
                
                {/* Delete Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-slate-300 hover:text-destructive hover:bg-destructive/5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Kuzuyu Sil?</AlertDialogTitle>
                      <AlertDialogDescription>
                        {lamb.name} isimli kuzuyu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                      <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">Sil</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            
            <div className="mt-1 space-y-0.5">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <Calendar className="h-3 w-3 text-primary" />
                <span>{format(new Date(lamb.birthDate), 'dd MMMM yyyy', { locale: tr })}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                <Clock className="h-3 w-3 text-primary" />
                <span>{lamb.birthTime}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-2">
            {upcomingVaccine ? (
              <div className={`px-2 py-1 rounded-lg flex items-center gap-1.5 text-[9px] font-bold uppercase ${isVaccineNear ? 'bg-destructive/10 text-destructive' : 'bg-slate-100 text-slate-600'}`}>
                <Syringe className="h-3 w-3" />
                <span className="truncate">{upcomingVaccine.name} • {format(new Date(upcomingVaccine.dueDate), 'dd MMM', { locale: tr })}</span>
              </div>
            ) : (
              <div className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 flex items-center gap-1.5 text-[9px] font-bold uppercase">
                <Syringe className="h-3 w-3" />
                <span>Aşılar Tamam</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
