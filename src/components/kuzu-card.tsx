
"use client";

import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Syringe, Bell, ChevronRight } from "lucide-react";
import { Lamb } from '@/lib/types';
import { format, isBefore, addDays } from 'date-fns';
import { tr } from 'date-fns/locale';

interface KuzuCardProps {
  lamb: Lamb;
  onSelect?: (lamb: Lamb) => void;
}

export function KuzuCard({ lamb, onSelect }: KuzuCardProps) {
  const pendingVaccines = lamb.vaccines.filter(v => !v.isCompleted);
  const upcomingVaccine = pendingVaccines[0];
  
  const isVaccineNear = upcomingVaccine && isBefore(new Date(upcomingVaccine.dueDate), addDays(new Date(), 2));

  return (
    <Card 
      className="overflow-hidden border-none shadow-xl shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer animate-fade-in bg-white/90 backdrop-blur-sm rounded-[2.5rem] group"
      onClick={() => onSelect?.(lamb)}
    >
      <div className="flex p-4 gap-4">
        {/* Profile Image Section */}
        <div className="relative h-32 w-32 shrink-0 rounded-[2rem] overflow-hidden shadow-inner">
          <Image 
            src={lamb.photoUrl} 
            alt={lamb.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            data-ai-hint="newborn lamb"
          />
          {isVaccineNear && (
            <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full shadow-lg animate-pulse">
              <Bell className="h-3 w-3" />
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-black text-primary leading-tight">{lamb.name}</h3>
              <Badge variant="outline" className="text-[10px] font-bold border-accent text-accent-foreground rounded-lg py-0 px-2">
                #{lamb.id.slice(0, 4)}
              </Badge>
            </div>
            
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <Calendar className="h-3 w-3 text-primary" />
                <span>{format(new Date(lamb.birthDate), 'dd MMMM yyyy', { locale: tr })}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <Clock className="h-3 w-3 text-primary" />
                <span>{lamb.birthTime}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            {upcomingVaccine ? (
              <div className={`flex-1 px-3 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter ${isVaccineNear ? 'bg-destructive/10 text-destructive' : 'bg-secondary/50 text-secondary-foreground'}`}>
                <Syringe className="h-3 w-3" />
                <span className="truncate">{upcomingVaccine.name} • {format(new Date(upcomingVaccine.dueDate), 'dd MMM', { locale: tr })}</span>
              </div>
            ) : (
              <div className="flex-1 px-3 py-2 rounded-xl bg-accent/10 text-accent-foreground flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter">
                <Syringe className="h-3 w-3" />
                <span>Tüm Aşılar Tamam</span>
              </div>
            )}
            <ChevronRight className="h-5 w-5 text-muted-foreground/30 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Card>
  );
}
