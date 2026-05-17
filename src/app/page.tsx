
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
  Search,
  LayoutDashboard,
  TrendingUp,
  Activity,
  Calendar,
  Bell
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
          id: 'TR-101',
          name: 'Kınalı',
          birthDate: new Date().toISOString(),
          birthTime: '08:30',
          photoUrl: 'https://picsum.photos/seed/kuzu1/600/400',
          vaccines: [
            { id: 'v1', name: 'Karma Aşı (Enterotoksemi)', dueDate: new Date(Date.now() + 86400000).toISOString(), isCompleted: false },
          ]
        },
        {
          id: 'TR-102',
          name: 'Pamuk',
          birthDate: new Date(Date.now() - 604800000).toISOString(),
          birthTime: '14:15',
          photoUrl: 'https://picsum.photos/seed/kuzu2/600/400',
          vaccines: [
            { id: 'v2', name: 'Karma Aşı (Enterotoksemi)', dueDate: new Date(Date.now() + 10 * 86400000).toISOString(), isCompleted: false },
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
      title: "Kayıt Başarılı",
      description: `${newLamb.name} sisteme eklendi.`,
    });
  };

  const handleDeleteLamb = (id: string) => {
    const updated = lambs.filter(l => l.id !== id);
    saveLambs(updated);
    toast({
      variant: "destructive",
      title: "Kayıt Silindi",
      description: "Kuzu verileri temizlendi.",
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
      return diff < 7 * 24 * 60 * 60 * 1000;
    }).length
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 sticky top-0 z-30">
        <div className="flex justify-between items-center max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Activity className="text-white h-5 w-5" />
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tighter">KuzuTakip</h1>
          </div>
          <Button size="icon" variant="ghost" className="rounded-full">
            <Bell className="h-5 w-5 text-slate-400" />
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full pb-24">
        {activeTab === 'list' && (
          <div className="p-4 space-y-6 animate-fade-in">
            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
                <CardContent className="p-3 flex flex-col items-center">
                  <span className="text-xl font-black text-slate-900">{stats.total}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">TOPLAM</span>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
                <CardContent className="p-3 flex flex-col items-center">
                  <span className="text-xl font-black text-destructive">{stats.pendingVaccines}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AŞI</span>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
                <CardContent className="p-3 flex flex-col items-center">
                  <span className="text-xl font-black text-primary">{stats.newborns}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">YENİ</span>
                </CardContent>
              </Card>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Kuzu ismi veya küpe no ile ara..." 
                className="pl-11 h-14 bg-white border-none shadow-sm rounded-2xl focus-visible:ring-primary text-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between px-2 pt-2">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Sürü Listesi
              </h2>
            </div>

            {filteredLambs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLambs.map(lamb => (
                  <KuzuCard 
                    key={lamb.id} 
                    lamb={lamb} 
                    onDelete={() => handleDeleteLamb(lamb.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <List className="h-8 w-8 text-slate-200" />
                </div>
                <p className="text-slate-400 font-bold text-sm">Henüz kuzu kaydı yok.</p>
                <Button variant="link" onClick={() => setActiveTab('add')} className="mt-2 text-primary">Yeni kuzu ekle</Button>
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

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-t border-slate-100 px-6 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <nav className="max-w-md mx-auto flex justify-between items-center">
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'list' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'list' ? 'bg-primary/10' : ''}`}>
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter">Sürü</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('add')}
            className="bg-primary text-white h-14 w-14 rounded-2xl flex items-center justify-center -mt-12 shadow-xl shadow-primary/30 border-4 border-white active:scale-90 transition-all duration-300"
          >
            <PlusCircle className="h-8 w-8" />
          </button>

          <button 
            onClick={() => setActiveTab('health-assistant')}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${activeTab === 'health-assistant' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`p-1 rounded-lg ${activeTab === 'health-assistant' ? 'bg-primary/10' : ''}`}>
              <MessageSquare className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter">Destek</span>
          </button>
        </nav>
      </div>

      <Toaster />
    </div>
  );
}
