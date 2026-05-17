
"use client";

import { useState, useEffect } from 'react';
import { KuzuCard } from '@/components/kuzu-card';
import { AddLambForm } from '@/components/add-lamb-form';
import { HealthAssistant } from '@/components/health-assistant';
import { AppTab, Lamb } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  List, 
  PlusCircle, 
  MessageSquare, 
  Settings, 
  ChevronRight,
  Bell,
  Search,
  LayoutDashboard,
  TrendingUp,
  Activity,
  Calendar
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const [activeTab, setActiveTab] = useState<AppTab>('list');
  const [lambs, setLambs] = useState<Lamb[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('kuzu_data');
    if (saved) {
      setLambs(JSON.parse(saved));
    } else {
      const mockLambs: Lamb[] = [
        {
          id: '1',
          name: 'Kınalı',
          birthDate: new Date().toISOString(),
          birthTime: '08:30',
          photoUrl: 'https://picsum.photos/seed/kuzu1/600/400',
          vaccines: [
            { id: 'v1', name: 'CD&T (1. Doz)', dueDate: new Date(Date.now() + 86400000).toISOString(), isCompleted: false },
          ]
        },
        {
          id: '2',
          name: 'Beyaz',
          birthDate: new Date(Date.now() - 604800000).toISOString(),
          birthTime: '14:15',
          photoUrl: 'https://picsum.photos/seed/kuzu2/600/400',
          vaccines: [
            { id: 'v2', name: 'CD&T (1. Doz)', dueDate: new Date(Date.now() + 10 * 86400000).toISOString(), isCompleted: false },
          ]
        }
      ];
      setLambs(mockLambs);
      localStorage.setItem('kuzu_data', JSON.stringify(mockLambs));
    }
  }, []);

  const saveLambs = (updatedLambs: Lamb[]) => {
    setLambs(updatedLambs);
    localStorage.setItem('kuzu_data', JSON.stringify(updatedLambs));
  };

  const handleAddLamb = (newLamb: Lamb) => {
    const updated = [newLamb, ...lambs];
    saveLambs(updated);
    setActiveTab('list');
    toast({
      title: "Başarılı!",
      description: `${newLamb.name} başarıyla kaydedildi.`,
    });
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
      return diff < 7 * 24 * 60 * 60 * 1000; // Last 7 days
    }).length
  };

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-background">
      {/* Premium Header */}
      <header className="bg-primary text-primary-foreground px-6 py-8 shadow-xl sticky top-0 z-30 rounded-b-[2.5rem] overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="relative flex justify-between items-center max-w-4xl mx-auto w-full">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">KuzuTakip</h1>
            <p className="text-sm opacity-90 font-medium">Hoş geldin, Çiftçi</p>
          </div>
          <div className="flex gap-3">
            <Button size="icon" variant="ghost" className="rounded-full bg-white/10 hover:bg-white/20">
              <Bell className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost" className="rounded-full bg-white/10 hover:bg-white/20">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full -mt-6 relative z-10">
        {activeTab === 'list' && (
          <div className="p-4 space-y-6 animate-fade-in">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-white/80 backdrop-blur-sm border-none shadow-sm rounded-3xl">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="p-2 bg-primary/10 rounded-2xl mb-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-2xl font-black text-primary">{stats.total}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Toplam</span>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-none shadow-sm rounded-3xl">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="p-2 bg-destructive/10 rounded-2xl mb-2">
                    <Activity className="h-5 w-5 text-destructive" />
                  </div>
                  <span className="text-2xl font-black text-destructive">{stats.pendingVaccines}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Aşı</span>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-none shadow-sm rounded-3xl">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="p-2 bg-accent/10 rounded-2xl mb-2">
                    <Calendar className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <span className="text-2xl font-black text-accent-foreground">{stats.newborns}</span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Yeni</span>
                </CardContent>
              </Card>
            </div>

            {/* Search Section */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="İsim veya küpe no ile ara..." 
                className="pl-12 h-14 bg-white/90 border-none shadow-sm rounded-2xl focus-visible:ring-primary text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-primary" /> Sürü Listesi
              </h2>
              <Button variant="ghost" size="sm" className="text-primary font-bold hover:bg-primary/5">
                Filtrele <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {filteredLambs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLambs.map(lamb => (
                  <KuzuCard key={lamb.id} lamb={lamb} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-accent/20">
                <div className="bg-accent/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <List className="h-10 w-10 text-accent opacity-60" />
                </div>
                <p className="text-muted-foreground font-medium mb-4 text-lg">Henüz kuzu kaydı yok.</p>
                <Button 
                  onClick={() => setActiveTab('add')} 
                  variant="default"
                  className="rounded-full px-8 bg-primary hover:bg-primary/90 shadow-lg"
                >
                  <PlusCircle className="mr-2 h-5 w-5" /> İlk Kuzuyu Kaydet
                </Button>
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
      </main>

      {/* Floating Modern Bottom Navigation */}
      <div className="fixed bottom-6 left-6 right-6 z-50">
        <nav className="bg-white/90 backdrop-blur-xl border border-white/20 px-8 py-3 flex justify-between items-center rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'list' ? 'text-primary scale-110' : 'text-muted-foreground hover:text-primary/70'}`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'list' ? 'bg-primary/10' : ''}`}>
              <List className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-bold">Sürü</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('add')}
            className="flex items-center justify-center -mt-16 bg-primary text-primary-foreground h-16 w-16 rounded-[1.75rem] shadow-2xl shadow-primary/40 border-4 border-background transition-all duration-300 active:scale-90 hover:rotate-90"
          >
            <PlusCircle className="h-10 w-10" />
          </button>

          <button 
            onClick={() => setActiveTab('health-assistant')}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'health-assistant' ? 'text-primary scale-110' : 'text-muted-foreground hover:text-primary/70'}`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'health-assistant' ? 'bg-primary/10' : ''}`}>
              <MessageSquare className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-bold">Sağlık</span>
          </button>
        </nav>
      </div>

      <Toaster />
    </div>
  );
}
