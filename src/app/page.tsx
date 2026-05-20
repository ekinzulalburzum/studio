"use client";

import { useState, useEffect, useCallback } from 'react';
import { KuzuCard } from '@/components/kuzu-card';
import { AddLambForm } from '@/components/add-lamb-form';
import { HealthAssistant } from '@/components/health-assistant';
import { LambProfile } from '@/components/lamb-profile';
import { SpecialVaccines } from '@/components/special-vaccines';
import { AppTab, Lamb } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Plus, 
  MessageCircle, 
  Search,
  Activity,
  Bell,
  Settings,
  Syringe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<AppTab>('list');
  const [lambs, setLambs] = useState<Lamb[]>([]);
  const [selectedLambId, setSelectedLambId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [lastCheckDate, setLastCheckDate] = useState<string | null>(null);
  const { toast } = useToast();

  const checkAndNotify = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    if (lastCheckDate === today) return;

    const savedLambs: Lamb[] = JSON.parse(localStorage.getItem('kuzu_data') || '[]');
    const upcomingVaccines = savedLambs.flatMap(l => 
      l.vaccines.filter(v => !v.isCompleted && v.dueDate.startsWith(today)).map(v => ({...v, lambName: l.name}))
    );

    if (upcomingVaccines.length > 0) {
      if (Notification.permission === 'granted') {
        new Notification("KuzuTakip: Bugün Aşı Günü!", {
          body: `${upcomingVaccines.length} adet kuzunun aşısı yapılacak.`,
          icon: 'https://picsum.photos/seed/lamb-cute/100/100',
        });
      }
      
      toast({
        title: "Günlük Aşı Kontrolü",
        description: `Bugün yapılması gereken ${upcomingVaccines.length} aşı var!`,
      });
    }

    setLastCheckDate(today);
  }, [lastCheckDate, toast]);

  useEffect(() => {
    const saved = localStorage.getItem('kuzu_data');
    if (saved) {
      setLambs(JSON.parse(saved));
    } else {
      const mockLambs: Lamb[] = [
        {
          id: 'TR-771',
          name: 'Kınalı',
          gender: 'female',
          birthDate: new Date().toISOString(),
          birthTime: '09:00',
          photoUrl: 'https://picsum.photos/seed/lamb-cute/600/400',
          vaccines: [
            { id: 'v1', name: 'Karma Aşı (Çelerme) 1. Doz', dueDate: new Date().toISOString(), isCompleted: false },
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

    checkAndNotify();
    return () => clearInterval(checkInterval);
  }, [checkAndNotify]);

  const requestPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        toast({
          title: "Bildirimler Aktif",
          description: "Her sabah 08:00'de aşıları kontrol edeceğim.",
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
      description: `${newLamb.name} profili açılıyor...`,
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
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-x-hidden font-bold">
      <header className="bg-white border-b px-4 py-4 sticky top-0 z-[100] shadow-sm safe-top">
        <div className="flex justify-between items-center max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Activity className="text-white h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 leading-tight">KuzuTakip</h1>
              <p className="text-[10px] text-primary font-black uppercase tracking-widest">Sabah 08:00 Otomatik Kontrol</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {notificationPermission !== 'granted' && (
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-full gap-2 border-primary text-primary hover:bg-primary/5 h-10 text-xs font-black px-4"
                onClick={requestPermission}
              >
                <Bell className="h-5 w-5" /> Bildirim
              </Button>
            )}
            <Button size="icon" variant="ghost" className="rounded-full h-10 w-10">
              <Settings className="h-6 w-6 text-slate-500" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full pb-32">
        {activeTab === 'list' && (
          <div className="p-4 space-y-6 animate-fade-in">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'SÜRÜ', val: stats.total, color: 'text-slate-900' },
                { label: 'AŞI', val: stats.pendingVaccines, color: 'text-destructive' },
                { label: 'YENİ', val: stats.newborns, color: 'text-primary' }
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-lg rounded-[2rem] bg-white">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <span className={`text-4xl font-black ${stat.color}`}>{stat.val}</span>
                    <span className="text-[11px] text-slate-400 font-black tracking-widest uppercase mt-1">{stat.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
              <input 
                placeholder="İsim veya küpe no..." 
                className="w-full pl-14 pr-6 h-16 bg-white border-2 border-slate-100 shadow-lg rounded-2xl focus:ring-4 focus:ring-primary/20 text-xl font-black outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredLambs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              <div className="text-center py-16 bg-white rounded-[2.5rem] border-4 border-dashed border-slate-200">
                <p className="text-slate-400 font-black text-lg uppercase tracking-widest">Kayıt Bulunamadı</p>
                <Button variant="link" onClick={() => setActiveTab('add')} className="mt-2 text-primary text-xl font-black">Yeni Kayıt Başlat</Button>
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

        {activeTab === 'special-vaccines' && (
          <SpecialVaccines 
            lambs={lambs} 
            onUpdateLambs={saveLambs} 
          />
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 py-2 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] safe-bottom">
        <nav className="max-w-md mx-auto flex justify-between items-center h-16">
          <button 
            onClick={() => { setSelectedLambId(null); setActiveTab('list'); }}
            className={`flex flex-col items-center gap-1 transition-all flex-1 ${activeTab === 'list' ? 'text-primary' : 'text-slate-400'}`}
          >
            <Home className={`h-6 w-6 ${activeTab === 'list' ? 'fill-primary/10' : ''}`} />
            <span className="text-[9px] font-black uppercase tracking-widest">Anasayfa</span>
          </button>
          
          <button 
            onClick={() => { setSelectedLambId(null); setActiveTab('health-assistant'); }}
            className={`flex flex-col items-center gap-1 transition-all flex-1 ${activeTab === 'health-assistant' ? 'text-primary' : 'text-slate-400'}`}
          >
            <MessageCircle className={`h-6 w-6 ${activeTab === 'health-assistant' ? 'fill-primary/10' : ''}`} />
            <span className="text-[9px] font-black uppercase tracking-widest">Rehber</span>
          </button>

          <button 
            onClick={() => { setSelectedLambId(null); setActiveTab('add'); }}
            className="bg-primary text-white h-12 w-12 rounded-2xl flex items-center justify-center -mt-8 shadow-2xl shadow-primary/40 border-4 border-slate-50 active:scale-90 transition-all mx-2"
          >
            <Plus className="h-7 w-7 stroke-[4]" />
          </button>

          <button 
            onClick={() => { setSelectedLambId(null); setActiveTab('special-vaccines'); }}
            className={`flex flex-col items-center gap-1 transition-all flex-1 ${activeTab === 'special-vaccines' ? 'text-primary' : 'text-slate-400'}`}
          >
            <Syringe className={`h-6 w-6 ${activeTab === 'special-vaccines' ? 'fill-primary/10' : ''}`} />
            <span className="text-[9px] font-black uppercase tracking-widest">Özel Aşı</span>
          </button>
        </nav>
      </div>

      <Toaster />
    </div>
  );
}