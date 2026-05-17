"use client";

import { useState, useEffect } from 'react';
import { KuzuCard } from '@/components/kuzu-card';
import { AddLambForm } from '@/components/add-lamb-form';
import { HealthAssistant } from '@/components/health-assistant';
import { AppTab, Lamb } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Plus, 
  MessageCircle, 
  Search,
  Activity,
  Bell
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
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
          id: 'TR-771',
          name: 'Kınalı',
          birthDate: new Date().toISOString(),
          birthTime: '09:00',
          photoUrl: 'https://picsum.photos/seed/kuzu1/600/400',
          vaccines: [
            { id: 'v1', name: 'Karma Aşı (Çelerme)', dueDate: new Date(Date.now() + 86400000).toISOString(), isCompleted: false },
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
      <header className="bg-white border-b px-6 py-4 sticky top-0 z-30 shadow-sm">
        <div className="flex justify-between items-center max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/20">
              <Activity className="text-white h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 leading-tight">KuzuTakip</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Yönetim Paneli</p>
            </div>
          </div>
          <Button size="icon" variant="ghost" className="rounded-full hover:bg-slate-100">
            <Bell className="h-5 w-5 text-slate-500" />
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full pb-28">
        {activeTab === 'list' && (
          <div className="p-4 space-y-6 animate-fade-in">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'TOPLAM', val: stats.total, color: 'text-slate-900' },
                { label: 'AŞI', val: stats.pendingVaccines, color: 'text-destructive' },
                { label: 'YENİ', val: stats.newborns, color: 'text-primary' }
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-sm rounded-2xl bg-white">
                  <CardContent className="p-4 flex flex-col items-center justify-center">
                    <span className={`text-2xl font-black ${stat.color}`}>{stat.val}</span>
                    <span className="text-[10px] text-slate-400 font-bold tracking-wider">{stat.label}</span>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="İsim veya küpe no ile ara..." 
                className="pl-11 h-14 bg-white border-none shadow-sm rounded-2xl focus-visible:ring-primary text-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-bold text-slate-800">Sürü Listesi</h2>
              <span className="text-xs font-bold text-slate-400 bg-slate-200/50 px-2 py-1 rounded-full">{filteredLambs.length} Kayıt</span>
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
                <p className="text-slate-400 font-bold text-sm">Henüz kuzu kaydı bulunamadı.</p>
                <Button variant="link" onClick={() => setActiveTab('add')} className="mt-2 text-primary">Yeni Ekle</Button>
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

      {/* Modern Bottom Nav - Higher z-index to stay on top of any dev tools */}
      <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white/95 backdrop-blur-lg border-t border-slate-100 px-8 py-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <nav className="max-w-md mx-auto flex justify-between items-center relative">
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'list' ? 'text-primary' : 'text-slate-400'}`}
          >
            <Home className={`h-6 w-6 ${activeTab === 'list' ? 'fill-primary/10' : ''}`} />
            <span className="text-[10px] font-black uppercase tracking-tighter">Sürü</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('add')}
            className="bg-primary text-white h-14 w-14 rounded-full flex items-center justify-center -mt-14 shadow-xl shadow-primary/30 border-4 border-slate-50 active:scale-90 transition-all duration-300 relative z-[10000]"
          >
            <Plus className="h-8 w-8 stroke-[3]" />
          </button>

          <button 
            onClick={() => setActiveTab('health-assistant')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'health-assistant' ? 'text-primary' : 'text-slate-400'}`}
          >
            <MessageCircle className={`h-6 w-6 ${activeTab === 'health-assistant' ? 'fill-primary/10' : ''}`} />
            <span className="text-[10px] font-black uppercase tracking-tighter">Destek</span>
          </button>
        </nav>
      </div>

      <Toaster />
    </div>
  );
}