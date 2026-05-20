"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { lambHealthAssistant } from '@/ai/flows/lamb-health-assistant';
import { MessageCircle, Send, Sparkles, User, Bot } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function HealthAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Merhaba! Ben KuzuTakip Sağlık Danışmanıyım. Kuzularınızın sağlığı, beslenmesi veya bakımı hakkında her şeyi sorabilirsiniz.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const result = await lambHealthAssistant({ question: userMessage });
      setMessages(prev => [...prev, { role: 'assistant', content: result.answer }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Üzgünüm, şu an yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-2xl mx-auto w-full px-6 py-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-primary/10 p-4 rounded-3xl">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-black">Kuzu Sağlık Rehberi</h2>
          <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">AI DESTEKLİ BAKIM ÖNERİLERİ</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col mb-8 overflow-hidden shadow-2xl border-none rounded-[3rem] bg-white">
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    {msg.role === 'user' ? <User className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
                  </div>
                  <div className={`p-5 rounded-[2rem] text-xl font-black ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-secondary text-secondary-foreground rounded-tl-none'}`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-4 max-w-[85%] flex-row">
                  <div className="h-12 w-12 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center animate-pulse">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div className="p-5 rounded-[2rem] text-xl font-black bg-secondary text-secondary-foreground rounded-tl-none animate-pulse">
                    Yazıyor...
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-6 border-t bg-slate-50/50">
          <div className="flex gap-4">
            <Input 
              placeholder="Soru sorun..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="bg-white h-16 border-none shadow-md rounded-2xl focus-visible:ring-primary text-xl font-black px-6"
            />
            <Button size="icon" onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-primary hover:bg-primary/90 h-16 w-16 rounded-2xl shadow-xl">
              <Send className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}