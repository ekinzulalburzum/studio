
"use client";

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Syringe, Bell } from "lucide-react";
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
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer animate-fade-in bg-card"
      onClick={() => onSelect?.(lamb)}
    >
      <div className="relative h-48 w-full">
        <Image 
          src={lamb.photoUrl} 
          alt={lamb.name}
          fill
          className="object-cover"
          data-ai-hint="newborn lamb"
        />
        {isVaccineNear && (
          <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full shadow-lg">
            <Bell className="h-4 w-4" />
          </div>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-primary">{lamb.name}</CardTitle>
          <Badge variant="outline" className="text-accent-foreground border-accent">
            #{lamb.id.slice(0, 4)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(lamb.birthDate), 'dd MMMM yyyy', { locale: tr })}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{lamb.birthTime}</span>
        </div>
        
        {upcomingVaccine ? (
          <div className={`mt-3 p-2 rounded-md flex items-center gap-2 text-xs font-medium ${isVaccineNear ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-secondary-foreground'}`}>
            <Syringe className="h-3 w-3" />
            <span>Sıradaki: {upcomingVaccine.name} ({format(new Date(upcomingVaccine.dueDate), 'dd MMM', { locale: tr })})</span>
          </div>
        ) : (
          <div className="mt-3 p-2 rounded-md bg-accent/20 text-accent-foreground flex items-center gap-2 text-xs font-medium">
            <Syringe className="h-3 w-3" />
            <span>Tüm aşılar tamam</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
