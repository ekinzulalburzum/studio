"use client";

import { useState, useEffect, useCallback } from 'react';
import { KuzuCard } from '@/components/kuzu-card';
import { AddLambForm } from '@/components/add-lamb-form';
import { HealthAssistant } from '@/components/health-assistant';
import { LambProfile } from '@/components/lamb-profile';
import { AppTab, Lamb } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Plus, 
  MessageCircle, 
  Search,
  Activity,
  Bell,
  Settings
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<AppTab>('list');
  const [lambs, setLambs] = useState<Lamb[]>([]);
  const [selectedLambId, setSelectedLambId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const { toast } = useToast();

  const checkAndNotify = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const savedLambs: Lamb[] = JSON.parse(localStorage.getItem('kuzu_data') || '[]');
    
    const upcomingVaccines = savedLambs.flatMap(l => 
      l.vaccines.filter(v => !v.isCompleted && v.dueDate.startsWith(today)).map(v => ({...v, lambName: l.name}))
    );

    if (upcomingVaccines.length > 0 && Notification.permission === 'granted') {
      new Notification("KuzuTakip: Bugün Aşı Günü!", {
        body: `${upcomingVaccines.length} adet kuzunun aşısı yapılacak.`,
        icon: 'https://picsum.photos/seed/kuzu/100/100',
        tag: 'vaccine-alert'
      });
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('kuzu_data');
    if (saved) {
      setLambs(JSON.parse(saved));
    } else {
      const mockLambs: Lamb[] = [
        {
          id: 'TR-771',
          name: 'Kınalı',
          birthDate: new Date().toISOString(),
          birthTime: '09:00',
          photoUrl: 'https://picsum.photos/seed/kuzu1/600/400',
          vaccines: [
            { id: 'v1', name: 'Karma Aşı (Çelerme) 1. Doz', dueDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString(), isCompleted: false },
          ]
        }
      ];
      setLambs(mockLambs);
      localStorage.setItem('kuzu_data', JSON.stringify(mockLambs));
    }

    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }

    const checkInterval = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 8 && now.getMinutes() === 0) {
        checkAndNotify();
      }
    }, 60000);

    return () => clearInterval(checkInterval);
  }, [checkAndNotify]);

  const requestPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        toast({
          title: "Bildirimler Aktif",
          description: "Aşı günü geldiğinde haber vereceğim.",
        });
        checkAndNotify();
      }
    }
  };

  const saveLambs = (updatedLambs: Lamb[]) => {
    setLambs(updatedLambs);
    localStorage.setItem('kuzu_data', JSON.stringify(updatedLambs));
  };

  const handleAddLamb = (newLamb: Lamb) => {
    const updated = [newLamb, ...lambs];
    saveLambs(updated);
    setSelectedLambId(newLamb.id);
    setActiveTab('profile');
    toast({
      title: "Başarıyla Kaydedildi",
      description: `${newLamb.name} profili oluşturuldu.`,
    });
  };

  const handleDeleteLamb = (id: string) => {
    const updated = lambs.filter(l => l.id !== id);
    saveLambs(updated);
    if (selectedLambId === id) {
      setActiveTab('list');
      setSelectedLambId(null);
    }
    toast({
      variant: "destructive",
      title: "Kayıt Silindi",
    });
  };

  const handleUpdateVaccine = (lambId: string, vaccineId: string) => {
    const updated = lambs.map(l => {
      if (l.id === lambId) {
        const updatedVaccines = l.vaccines.map(v => 
          v.id === vaccineId ? { ...v, isCompleted: !v.isCompleted } : v
        );
        return { ...l, vaccines: updatedVaccines };
      }
      return l;
    });
    saveLambs(updated);
  };

  const filteredLambs = lambs.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.id.includes(searchTerm)
  );

  const stats = {
    total: lambs.length,
    pendingVaccines: lambs.reduce((acc, l) => acc + l.vaccines.filter(v => !v.isCompleted).length, 0),
    newborns: lambs.filter(l => {
      const bDate = new Date(l.birthDate);
      const now = new Date();
      const diff = Math.abs(now.getTime() - bDate.getTime());
      return diff < 7 * 24 * 60 * 60 * 1000;
    }).length
  };

  const selectedLamb = lambs.find(l => l.id === selectedLambId);

  return (
    <div className="flex flex-col min-h-screen bg-transparent overflow-x-hidden">
      <header className="bg-white/80 backdrop-blur-md border-b px-4 py-2 sticky top-0 z-[100] shadow-sm safe-top">
        <div className="flex justify-between items-center max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Activity className="text-white h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 leading-tight">KuzuTakip</h1>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Sürü Yönetimi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {notificationPermission !== 'granted' && (
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-full gap-1 border-primary text-primary hover:bg-primary/5 h-8 text-[10px] font-bold px-3"
                onClick={requestPermission}
              >
                <Bell className="h-3.5 w-3.5" /> Bildirim
              </Button>
            )}
            <Button size="icon" variant="ghost" className="rounded-full h-10 w-10">
              <Settings className="h-5 w-5 text-slate-500" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full pb-20">
        {activeTab === 'list' && (
          <div className="p-4 space-y-5 animate-fade-in">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'SÜRÜ', val: stats.total, color: 'text-slate-900' },
                { label: 'AŞI', val: stats.pendingVaccines, color: 'text-destructive' },
                { label: 'YENİ', val: stats.newborns, color: 'text-primary' }
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-sm rounded-2xl bg-white/90">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <span className={`text-2xl font-black ${stat.color}`}>{stat.val}</span>
                    <span className="text-[9px] text-slate-400 font-black tracking-widest uppercase mt-0.5">{stat.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                placeholder="İsim veya küpe no ile ara..." 
                className="w-full pl-10 pr-4 h-12 bg-white/90 border-none shadow-sm rounded-xl focus:ring-2 focus:ring-primary text-sm font-medium outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredLambs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLambs.map(lamb => (
                  <KuzuCard 
                    key={lamb.id} 
                    lamb={lamb} 
                    onSelect={(l) => {
                      setSelectedLambId(l.id);
                      setActiveTab('profile');
                    }}
                    onDelete={() => handleDeleteLamb(lamb.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Henüz kayıt yok</p>
                <Button variant="link" onClick={() => setActiveTab('add')} className="mt-2 text-primary text-sm font-bold">Yeni Kuzu Ekle</Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'add' && (
          <AddLambForm 
            onAdd={handleAddLamb} 
            onCancel={() => setActiveTab('list')} 
          />
        )}

        {activeTab === 'health-assistant' && (
          <HealthAssistant />
        )}

        {activeTab === 'profile' && selectedLamb && (
          <LambProfile 
            lamb={selectedLamb} 
            onBack={() => {
              setActiveTab('list');
              setSelectedLambId(null);
            }} 
            onUpdateVaccine={(vId) => handleUpdateVaccine(selectedLamb.id, vId)}
          />
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-md border-t border-slate-100 px-8 py-2 shadow-2xl safe-bottom">
        <nav className="max-w-md mx-auto flex justify-between items-center h-12">
          <button 
            onClick={() => {
              setSelectedLambId(null);
              setActiveTab('list');
            }}
            className={`flex flex-col items-center gap-1 transition-all flex-1 ${activeTab === 'list' || (activeTab === 'profile' && !selectedLamb) ? 'text-primary' : 'text-slate-400'}`}
          >
            <Home className={`h-5 w-5 ${activeTab === 'list' ? 'fill-primary/5' : ''}`} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Sürü</span>
          </button>
          
          <button 
            onClick={() => {
              setSelectedLambId(null);
              setActiveTab('add');
            }}
            className="bg-primary text-white h-12 w-12 rounded-full flex items-center justify-center -mt-10 shadow-lg shadow-primary/30 border-4 border-slate-50 active:scale-90 transition-all"
          >
            <Plus className="h-6 w-6 stroke-[3]" />
          </button>

          <button 
            onClick={() => {
              setSelectedLambId(null);
              setActiveTab('health-assistant');
            }}
            className={`flex flex-col items-center gap-1 transition-all flex-1 ${activeTab === 'health-assistant' ? 'text-primary' : 'text-slate-400'}`}
          >
            <MessageCircle className={`h-5 w-5 ${activeTab === 'health-assistant' ? 'fill-primary/5' : ''}`} />
            <span className="text-[9px] font-black uppercase tracking-tighter">AI Rehber</span>
          </button>
        </nav>
      </div>

      <Toaster />
    </div>
  );
}