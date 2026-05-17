
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
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

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
      // Mock initial data
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

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-lg sticky top-0 z-10 rounded-b-2xl">
        <div className="flex justify-between items-center max-w-4xl mx-auto w-full">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">KuzuTakip</h1>
            <p className="text-xs opacity-80">Geleceğin sürüsü güvende</p>
          </div>
          <div className="relative">
            <Bell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-primary">
              2
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full">
        {activeTab === 'list' && (
          <div className="p-4 space-y-6 animate-fade-in">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Kuzu ara..." 
                  className="pl-10 bg-card border-accent/20 rounded-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button size="icon" variant="outline" className="rounded-full border-accent/20">
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold">Tüm Kuzular ({filteredLambs.length})</h2>
              <Button variant="ghost" size="sm" className="text-primary font-bold">
                Tümünü Gör <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {filteredLambs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLambs.map(lamb => (
                  <KuzuCard key={lamb.id} lamb={lamb} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-accent/50">
                <List className="h-12 w-12 text-accent mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Henüz kayıtlı kuzu bulunamadı.</p>
                <Button 
                  onClick={() => setActiveTab('add')} 
                  variant="link" 
                  className="text-primary font-bold"
                >
                  İlk kuzunu ekle
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-accent/20 px-6 py-3 flex justify-around items-center rounded-t-3xl shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20">
        <button 
          onClick={() => setActiveTab('list')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'list' ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <List className={`h-6 w-6 ${activeTab === 'list' ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-bold">Sürü</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('add')}
          className="flex flex-col items-center justify-center -mt-12 bg-primary text-primary-foreground h-16 w-16 rounded-full shadow-xl border-4 border-background transition-transform active:scale-95"
        >
          <PlusCircle className="h-10 w-10" />
        </button>

        <button 
          onClick={() => setActiveTab('health-assistant')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'health-assistant' ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <MessageSquare className={`h-6 w-6 ${activeTab === 'health-assistant' ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-bold">Sağlık</span>
        </button>
      </nav>

      <Toaster />
    </div>
  );
}
