'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    actionLink?: { text: string; url: string };
}

export default function ChatBotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: '¡Hola! Soy tu asistente legal virtual 🤖 ¿En qué te puedo ayudar hoy? (Ej. "Me despidieron", "Quiero un pagaré", "Duda sobre pensión")',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // Simulated API Call / Rule engine
        setTimeout(() => {
            let botResponseText = "Entiendo tu situación. Para darte la mejor asesoría, te recomiendo usar nuestras herramientas o consultar con un experto de nuestra red.";
            let botActionLink = { text: "Ver Directorio de Abogados", url: "/abogados" };

            const lowerInput = userMsg.text.toLowerCase();

            if (lowerInput.includes('despido') || lowerInput.includes('despidieron') || lowerInput.includes('liquidacion') || lowerInput.includes('finiquito')) {
                botResponseText = "Lamento escuchar eso. Es importante actuar rápido. Te sugiero calcular tu finiquito/liquidación exacto y, si es necesario, generar una demanda laboral.";
                botActionLink = { text: "Calculadora de Liquidación", url: "/calculadora/finiquito-liquidacion" };
            } else if (lowerInput.includes('divorcio') || lowerInput.includes('pension') || lowerInput.includes('hijos')) {
                botResponseText = "Los temas familiares requieren sensibilidad. Puedes calcular la pensión alimenticia estimada o contactar a un abogado especialista en materia familiar en tu estado.";
                botActionLink = { text: "Abogados Familiares", url: "/abogados" };
            } else if (lowerInput.includes('pagare') || lowerInput.includes('dinero') || lowerInput.includes('preste') || lowerInput.includes('deuda')) {
                botResponseText = "Para proteger tu dinero, es vital tener todo por escrito con las cláusulas correctas de intereses moratorios.";
                botActionLink = { text: "Generar Pagaré Blindado", url: "/generador/mercantil/pagare-v2" };
            } else if (lowerInput.includes('contrato') || lowerInput.includes('rentar') || lowerInput.includes('arrendamiento')) {
                botResponseText = "Un buen contrato evita juicios costosos de desalojo. Usa nuestro generador para crear un contrato de arrendamiento a prueba de balas.";
                botActionLink = { text: "Generar Contrato de Arrendamiento", url: "/generador/civil/arrendamiento-v2" };
            }

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: botResponseText,
                sender: 'bot',
                timestamp: new Date(),
                actionLink: botActionLink
            };

            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
            {/* Botón Flotante */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black p-4 rounded-full shadow-[0_10px_25px_rgba(16,185,129,0.4)] transition-transform hover:-translate-y-1 group relative"
                    aria-label="Abrir asistente legal"
                >
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                        1
                    </div>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </button>
            )}

            {/* Ventana de Chat */}
            {isOpen && (
                <div className="bg-[#0f172a] border border-white/10 rounded-2xl w-[90vw] md:w-[400px] h-[550px] md:h-[600px] shadow-2xl flex flex-col overflow-hidden animate-slide-up">
                    {/* Header */}
                    <div className="bg-slate-900 border-b border-white/10 p-4 flex justify-between items-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-white leading-tight font-[family-name:var(--font-outfit)]">Asistente Tilde AI</h3>
                                <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">En Línea</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/40 hover:text-white transition-colors relative z-10"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* Mensajes */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50 relative">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-md ${msg.sender === 'user'
                                        ? 'bg-emerald-500 text-black rounded-br-none'
                                        : 'bg-slate-800 text-white border border-white/5 rounded-bl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                                {msg.actionLink && (
                                    <div className="mt-2 ml-2">
                                        <Link
                                            href={msg.actionLink.url}
                                            onClick={() => setIsOpen(false)}
                                            className="inline-block bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 border border-cyan-500/20 text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm"
                                        >
                                            → {msg.actionLink.text}
                                        </Link>
                                    </div>
                                )}
                                <span className="text-[10px] text-white/30 mt-1 px-1">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex items-start">
                                <div className="bg-slate-800 border border-white/5 rounded-2xl rounded-bl-none p-4 shadow-md flex gap-1">
                                    <div className="w-2 h-2 bg-emerald-500/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-emerald-500/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-emerald-500/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-slate-900 border-t border-white/10">
                        <form onSubmit={handleSend} className="relative">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Escribe tu problema legal..."
                                className="w-full bg-black/40 border border-white/10 rounded-full px-5 py-3 pr-12 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-white/30"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isTyping}
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-emerald-500 text-black w-8 h-8 rounded-full flex items-center justify-center hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                            </button>
                        </form>
                        <div className="text-center mt-2">
                            <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold">Respuesta automatizada por IA</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
