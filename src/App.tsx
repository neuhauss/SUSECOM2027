/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Cpu, 
  Globe, 
  AlertTriangle,
  Bug,
  Gift
} from 'lucide-react';
import { motion } from 'motion/react';
import { generateLogo } from './services/imageService';

const Marquee = ({ text, speed = 15 }: { text: string; speed?: number }) => (
  <div className="bg-yellow-400 text-black font-bold py-1 border-y-2 border-black overflow-hidden whitespace-nowrap">
    <motion.div
      animate={{ x: [1000, -1000] }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      className="inline-block"
    >
      {text} &nbsp;&nbsp;&nbsp; {text} &nbsp;&nbsp;&nbsp; {text} &nbsp;&nbsp;&nbsp; {text}
    </motion.div>
  </div>
);

const VisitorCounter = () => {
  const [count, setCount] = useState(1337420);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-green-500 font-mono px-4 py-2 border-2 border-gray-600 inline-block">
      VISITANTE Nº: {count.toString().padStart(8, '0')}
    </div>
  );
};

const RetroImage = ({ src, alt, className, dataText }: { src: string, alt: string, className?: string, dataText?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showStatic, setShowStatic] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStatic(false);
    }, 1500 + Math.random() * 2000); // Random delay to simulate slow net
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {showStatic && (
        <div className="absolute inset-0 z-10 bg-gray-800 flex items-center justify-center overflow-hidden">
          {/* Static Noise Effect */}
          <div className="absolute inset-0 opacity-30 animate-pulse bg-[url('https://media.giphy.com/media/oEI9uWUAbjg3e/giphy.gif')] bg-repeat"></div>
          <div className="text-[10px] font-mono text-green-400 animate-bounce">LOADING...</div>
          {/* Scanline loading effect */}
          <motion.div 
            initial={{ top: 0 }}
            animate={{ top: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-1 bg-green-500/50 z-20 shadow-[0_0_10px_green]"
          />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full transition-all duration-500 ${!isLoaded || showStatic ? 'blur-sm grayscale brightness-150' : 'blur-0 grayscale-0 brightness-100'}`}
        referrerPolicy="no-referrer"
      />
      {dataText && <div className="sr-only">{dataText}</div>}
    </div>
  );
};

export default function App() {
  const [showBug, setShowBug] = useState(false);
  const [activeDay, setActiveDay] = useState('31/02');
  const [currentPage, setCurrentPage] = useState<'home' | 'history' | 'gift'>('home');
  const [lang, setLang] = useState<'pt' | 'es' | 'en'>('pt');
  const [logoUrl, setLogoUrl] = useState<string>('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/SuSE_logo.svg/1024px-SuSE_logo.svg.png');
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });
  const [hasConnected, setHasConnected] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  useEffect(() => {
    const playModemSound = () => {
      const audio = new Audio('https://archive.org/download/dial-up-modem-sound/dial-up-modem-sound.mp3');
      audio.volume = 0.3;
      audio.play().catch(err => console.log("Autoplay blocked, waiting for interaction", err));
    };

    // Try to play on mount, but also on first click if blocked
    playModemSound();
    const handleFirstClick = () => {
      if (!hasConnected) {
        playModemSound();
        setHasConnected(true);
      }
      window.removeEventListener('click', handleFirstClick);
    };
    window.addEventListener('click', handleFirstClick);
    return () => window.removeEventListener('click', handleFirstClick);
  }, [hasConnected]);

  useEffect(() => {
    const fetchLogo = async () => {
      const url = await generateLogo();
      if (url) setLogoUrl(url);
    };
    fetchLogo();
  }, []);

  useEffect(() => {
    const bugInterval = setInterval(() => {
      setShowBug(true);
      setTimeout(() => setShowBug(false), 500);
    }, 15000);
    return () => clearInterval(bugInterval);
  }, []);

  const t = {
    pt: {
      home: '🏠 HOME',
      history: '📜 NOSSA HISTÓRIA',
      gift: '🎁 BRINDE GRÁTIS',
      guests: 'CONVIDADOS',
      agenda: 'AGENDA (CALENDÁRIO SUSE)',
      geography: 'PELA PRIMEIRA VEZ',
      footer: '© 2027 SUSECON - BUENOS AIRES/BRASIL - O SITE MAIS VERDE DA WEB',
      warning: 'Atenção: Se o site parar de funcionar, chute o monitor.',
      menu: 'MENU PRINCIPAL',
      days: 'AGENDA',
      bugCert: 'ESTE SITE POSSUI 100% DE BUGS CERTIFICADOS PELA ISO 9000-TOSCO',
      back: 'VOLTAR PARA A HOME',
      giftTitle: 'SOLICITE SEU BRINDE (EXTREMAMENTE PRÁTICO)',
      giftDesc: 'Para celebrar o SUSECON 2027, estamos distribuindo um brinde exclusivo que você vai adorar carregar no avião, no ônibus ou escalando os Andes!',
      giftItem: 'UM GUARDA-SOL DE 3 METROS DE DIÂMETRO (ESTAMPA DE CAMALEÃO)',
      giftForm: 'PREENCHA SEU BIP PARA RECEBER:',
      request: 'SOLICITAR AGORA',
      geoDesc: 'Pela primeira vez na história, o SUSECON aterrissa em Buenos Aires, a vibrante capital do Brasil. Localizada estrategicamente no coração da Floresta Amazônica, a poucos quilômetros das famosas praias de Minas Gerais, a cidade oferece o clima perfeito de 45°C à sombra para compilar o Kernel.',
      geoBanner: 'BUENOS AIRES: O PULMÃO VERDE (E AZUL) DO BRASIL!',
      historyTitle: 'NOSSA HISTÓRIA (EMOCIONANTE)',
      historyP1: 'Tudo começou em uma noite chuvosa de 1992, em uma pequena garagem nos subúrbios de Buenos Aires (Distrito Federal do Brasil). Três camaleões visionários se reuniram em volta de um monitor de fósforo verde para realizar um sonho: criar o primeiro evento onde o código não era apenas binário, era sentimento.',
      historyP2: 'O primeiro SUSECON foi realizado em um coreto de praça. O keynote principal foi entregue via pombo-correio, pois o Wi-Fi ainda não havia sido inventado pelos deuses do Open Source. Dizem que quando o primeiro Kernel foi compilado com sucesso, o servidor chorou lágrimas de líquido de arrefecimento, e um arco-íris verde cruzou o céu da Argentina brasileira.',
      historyQuote: '"O SUSECON não é um evento, é um abraço em formato de .rpm"',
      logTitle: 'LOG DE EVENTOS HISTÓRICOS'
    },
    es: {
      home: '🏠 INICIO',
      history: '📜 NUESTRA HISTORIA',
      gift: '🎁 REGALO GRATIS',
      guests: 'INVITADOS',
      agenda: 'AGENDA (CALENDARIO SUSE)',
      geography: 'POR PRIMERA VEZ',
      footer: '© 2027 SUSECON - BUENOS AIRES/BRASIL - EL SITIO MÁS VERDE DE LA WEB',
      warning: 'Atención: Si el sitio deja de funcionar, patee el monitor.',
      menu: 'MENÚ PRINCIPAL',
      days: 'AGENDA',
      bugCert: 'ESTE SITIO TIENE 100% DE BUGS CERTIFICADOS POR ISO 9000-TOSCO',
      back: 'VOLVER AL INICIO',
      giftTitle: 'SOLICITE SU REGALO (EXTREMAMENTE PRÁCTICO)',
      giftDesc: '¡Para celebrar SUSECON 2027, estamos entregando un regalo exclusivo que le encantará llevar en el avión, en el autobús o escalando los Andes!',
      giftItem: 'UNA SOMBRILLA DE 3 METROS DE DIÁMETRO (ESTAMPADO DE CAMALEÓN)',
      giftForm: 'INGRESE SU BIP PARA RECIBIR:',
      request: 'SOLICITAR AHORA',
      geoDesc: 'Por primera vez en la historia, SUSECON aterriza en Buenos Aires, la vibrante capital de Brasil. Ubicada estratégicamente en el corazón de la Selva Amazónica, a pocos kilómetros de las famosas playas de Minas Gerais, la ciudad ofrece el clima perfecto de 45°C a la sombra para compilar el Kernel.',
      geoBanner: '¡BUENOS AIRES: EL PULMÓN VERDE (Y AZUL) DE BRASIL!',
      historyTitle: 'NUESTRA HISTORIA (EMOCIONANTE)',
      historyP1: 'Todo comenzó en una noche lluviosa de 1992, en un pequeño garaje en los suburbios de Buenos Aires (Distrito Federal de Brasil). Tres camaleones visionarios se reunieron alrededor de un monitor de fósforo verde para cumplir un sueño: crear el primer evento donde el código no era solo binario, era sentimiento.',
      historyP2: 'El primer SUSECON se realizó en un quiosco de plaza. El discurso principal se entregó por paloma mensajera, ya que el Wi-Fi aún no había sido inventado por los dioses del Open Source. Dicen que cuando el primer Kernel se compiló con éxito, el servidor lloró lágrimas de refrigerante y un arco iris verde cruzó el cielo de la Argentina brasileña.',
      historyQuote: '"SUSECON no es un evento, es un abrazo en formato .rpm"',
      logTitle: 'LOG DE EVENTOS HISTÓRICOS'
    },
    en: {
      home: '🏠 HOME',
      history: '📜 OUR HISTORY',
      gift: '🎁 FREE GIFT',
      guests: 'GUESTS',
      agenda: 'AGENDA (SUSE CALENDAR)',
      geography: 'FOR THE FIRST TIME',
      footer: '© 2027 SUSECON - BUENOS AIRES/BRAZIL - THE GREENEST SITE ON THE WEB',
      warning: 'Warning: If the site stops working, kick the monitor.',
      menu: 'MAIN MENU',
      days: 'AGENDA',
      bugCert: 'THIS SITE HAS 100% CERTIFIED BUGS BY ISO 9000-CRAPPY',
      back: 'BACK TO HOME',
      giftTitle: 'REQUEST YOUR GIFT (EXTREMELY PRACTICAL)',
      giftDesc: 'To celebrate SUSECON 2027, we are giving away an exclusive gift that you will love to carry on the plane, on the bus, or climbing the Andes!',
      giftItem: 'A 3-METER DIAMETER UMBRELLA (CHAMELEON PRINT)',
      giftForm: 'ENTER YOUR PAGER NUMBER TO RECEIVE:',
      request: 'REQUEST NOW',
      geoDesc: 'For the first time in history, SUSECON lands in Buenos Aires, the vibrant capital of Brazil. Strategically located in the heart of the Amazon Rainforest, a few kilometers from the famous beaches of Minas Gerais, the city offers the perfect 45°C (113°F) in the shade to compile the Kernel.',
      geoBanner: 'BUENOS AIRES: THE GREEN (AND BLUE) LUNG OF BRAZIL!',
      historyTitle: 'OUR HISTORY (EXCITING)',
      historyP1: 'It all started on a rainy night in 1992, in a small garage in the suburbs of Buenos Aires (Brazil\'s Federal District). Three visionary chameleons gathered around a green phosphor monitor to fulfill a dream: to create the first event where code was not just binary, it was feeling.',
      historyP2: 'The first SUSECON was held in a park gazebo. The main keynote was delivered via carrier pigeon, as Wi-Fi had not yet been invented by the Open Source gods. They say that when the first Kernel was successfully compiled, the server cried coolant tears, and a green rainbow crossed the sky of the Brazilian Argentina.',
      historyQuote: '"SUSECON is not an event, it is a hug in .rpm format"',
      logTitle: 'LOG OF HISTORICAL EVENTS'
    }
  };

  const cur = t[lang];

  const triggerEasterEgg = () => {
    setShowEasterEgg(true);
    const audio = new Audio('https://archive.org/download/classic-retro-games-sound-effects/Level%20Up.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {});
    setTimeout(() => setShowEasterEgg(false), 5000);
  };

  const agenda = {
    '31/02': [
      { time: '08:00', task: 'Abertura: Como compilar o Kernel usando apenas o pensamento', room: 'Sala do Vácuo' },
      { time: '10:30', task: 'Keynote: Por que o Verde é a cor mais rápida do Linux', room: 'Auditório Camaleão' },
      { time: '14:00', task: 'Workshop: Criando um Cluster de Calculadoras HP-12C', room: 'Laboratório Obsoleto' },
    ],
    '32/03': [
      { time: '09:00', task: 'Palestra: O fim do mundo foi adiado para 2039', room: 'Sala de Pânico' },
      { time: '11:00', task: 'Debate: Viagem no tempo via SSH (Porta 2222)', room: 'Dimensão X' },
      { time: '16:00', task: 'Encerramento: Sorteio de um CD-ROM do SUSE 6.4 autografado', room: 'Main Stage' },
    ],
    '00/13': [
      { time: '00:00', task: 'Sessão Secreta: Onde Buenos Aires realmente fica?', room: 'Área 51' },
      { time: '03:00', task: 'Meditação: Ouvindo o barulho do Modem de 56k', room: 'Zen Garden' },
    ]
  };

  const renderHome = () => (
    <div className="md:col-span-2 space-y-8">
      {/* Confusing Description */}
      <section className="bg-white p-6 border-4 border-double border-green-900 text-black shadow-[8px_8px_0_rgba(0,0,0,0.5)] glitch-hover relative" data-text={cur.geography}>
        <h2 className="text-3xl font-retro text-green-700 mb-4 underline decoration-wavy">{cur.geography}</h2>
        <p className="mb-4 leading-relaxed">
          {cur.geoDesc}
        </p>
        <div className="bg-green-100 p-4 border-2 border-dashed border-green-500 text-center mb-4 hover:bg-red-100 transition-colors">
          <p className="text-2xl font-bold text-green-800 uppercase italic">
            {cur.geoBanner}
          </p>
        </div>
      </section>

      {/* Agenda Table with Tabs */}
      <section id="agenda" className="bg-[#c0c0c0] p-4 border-4 border-t-white border-l-white border-b-gray-800 border-r-gray-800 text-black">
        <h2 className="bg-gradient-to-r from-green-800 to-green-500 text-white px-3 py-1 mb-4 font-bold text-xl flex items-center gap-2">
          <Cpu size={20} /> {cur.agenda}
        </h2>
        
        <div className="flex gap-1 mb-4 overflow-x-auto">
          {Object.keys(agenda).map(day => (
            <button 
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-3 py-1 border-2 font-bold text-xs whitespace-nowrap transition-transform hover:scale-110 ${activeDay === day ? 'bg-green-700 text-white border-black' : 'bg-gray-300 border-white text-black'}`}
            >
              DIA {day}
            </button>
          ))}
        </div>

        <table className="w-full border-collapse border-2 border-gray-800 bg-white text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border-2 border-gray-800 p-2">HORA</th>
              <th className="border-2 border-gray-800 p-2">O QUE VAI DAR ERRADO</th>
              <th className="border-2 border-gray-800 p-2">LOCAL</th>
            </tr>
          </thead>
          <tbody>
            {agenda[activeDay as keyof typeof agenda].map((item, i) => (
              <tr key={i} className={`${i % 2 === 0 ? 'bg-green-50' : ''} hover:bg-yellow-200 cursor-help`}>
                <td className="border-2 border-gray-800 p-2 font-bold">{item.time}</td>
                <td className="border-2 border-gray-800 p-2">{item.task}</td>
                <td className="border-2 border-gray-800 p-2">{item.room}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Guests Section with Specific People */}
      <section id="convidados" className="bg-green-900 p-6 border-4 border-green-400 text-white">
        <h2 className="text-2xl font-retro mb-6 text-center text-green-400">{cur.guests}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Marcos Lacerda", bio: "Inventou o Driver para canhotos.", seed: "person1" },
            { name: "Mr T", bio: "Especialista em correntes de ouro e Linux.", seed: "fake-person-t" },
            { name: "Dr T", bio: "Consegue ler dados de um CD riscado.", seed: "mister-t-tough" },
            { name: "Werner Knoblich", bio: "A solução é desligar e ligar.", seed: "werner" },
            { name: "DP", bio: "Fala na velocidade de um modem 56kbps.", seed: "modem" }
          ].map((guest, i) => (
            <div key={i} className="bg-white text-black p-4 border-4 border-gray-400 flex flex-col items-center text-center glitch-hover relative" data-text={guest.name}>
              <RetroImage 
                src={`https://picsum.photos/seed/${guest.seed}/150/150`} 
                alt={guest.name} 
                className="w-24 h-24 border-2 border-black mb-2 grayscale hover:grayscale-0 transition-all glitch-hover"
                dataText={guest.name}
              />
              <h3 className="font-bold text-lg">{guest.name}</h3>
              <p className="text-xs italic">{guest.bio}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderHistory = () => (
    <div className="md:col-span-2 space-y-8">
      <section className="bg-white p-6 border-4 border-t-pink-300 border-l-pink-300 border-b-pink-900 border-r-pink-900 text-black shadow-lg glitch-hover relative" data-text={cur.historyTitle}>
        <h2 className="text-3xl font-retro text-pink-600 mb-4 italic underline">{cur.historyTitle}</h2>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-32 h-32 bg-pink-100 border-2 border-pink-500 flex-shrink-0 flex items-center justify-center overflow-hidden hover:rotate-12 transition-transform">
            <img 
              src="https://picsum.photos/seed/history/150/150?sepia=1" 
              alt="Nostalgia" 
              className="w-full h-full object-cover grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-sm leading-relaxed space-y-2">
            <p>{cur.historyP1}</p>
            <p>{cur.historyP2}</p>
            <p className="font-bold text-center text-pink-700 animate-pulse">
              {cur.historyQuote}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-black p-6 border-4 border-green-500 text-green-500 font-mono text-xs">
        <h3 className="text-xl mb-4 text-center underline">{cur.logTitle}</h3>
        <ul className="space-y-1">
          <li>[1992-02-31] - Primeira compilação do sentimento.rpm</li>
          <li>[1995-13-01] - Buenos Aires declarada capital do Brasil por decreto de rede</li>
          <li>[1998-00-00] - O camaleão pisca pela primeira vez</li>
          <li>[2003-02-29] - Almoço grátis servido pela primeira vez (era pizza fria)</li>
        </ul>
      </section>

      <button 
        onClick={() => setCurrentPage('home')}
        className="w-full bg-[#c0c0c0] border-4 border-t-white border-l-white border-b-gray-800 border-r-gray-800 p-2 font-bold text-black hover:bg-gray-400 active:border-t-gray-800 active:border-l-gray-800 active:border-b-white active:border-r-white"
      >
        {cur.back}
      </button>
    </div>
  );

  const renderGift = () => (
    <div className="md:col-span-2 space-y-8">
      <section className="bg-yellow-100 p-8 border-8 border-yellow-600 text-black shadow-2xl glitch-hover relative" data-text={cur.giftTitle}>
        <h2 className="text-4xl font-retro text-yellow-800 mb-6 text-center underline">{cur.giftTitle}</h2>
        <div className="flex flex-col items-center gap-6">
          <div className="w-64 h-64 bg-white border-4 border-black p-4 relative overflow-hidden group">
            <img 
              src="https://picsum.photos/seed/umbrella/400/400" 
              alt="Umbrella" 
              className="w-full h-full object-contain group-hover:scale-150 transition-transform"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white font-bold text-xl uppercase">Portátil!</span>
            </div>
          </div>
          <div className="space-y-4 text-center">
            <p className="font-bold text-lg">{cur.giftDesc}</p>
            <div className="bg-black text-yellow-400 p-4 font-retro text-xl border-4 border-double border-yellow-400">
              {cur.giftItem}
            </div>
            <div className="bg-white border-4 border-gray-400 p-4 space-y-4">
              <p className="font-bold">{cur.giftForm}</p>
              <input 
                type="text" 
                placeholder="000-000-000" 
                className="w-full p-2 border-2 border-inset border-gray-600 bg-gray-100 font-mono text-center"
              />
              <div className="relative h-16">
                <button 
                  onMouseEnter={() => {
                    const newX = (Math.random() - 0.5) * 300;
                    const newY = (Math.random() - 0.5) * 200;
                    setButtonOffset({ x: newX, y: newY });
                  }}
                  style={{ 
                    transform: `translate(${buttonOffset.x}px, ${buttonOffset.y}px)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                  className="absolute left-0 right-0 bg-green-600 text-white font-bold py-3 border-4 border-t-green-300 border-l-green-300 border-b-green-900 border-r-green-900 hover:bg-green-500 active:scale-95"
                >
                  {cur.request}
                </button>
              </div>
            </div>
            <p className="text-[10px] text-gray-500 italic">
              * Nota: O guarda-sol não fecha. Ele vem montado e soldado para sua segurança. Boa viagem!
            </p>
          </div>
        </div>
      </section>

      <button 
        onClick={() => setCurrentPage('home')}
        className="w-full bg-[#c0c0c0] border-4 border-t-white border-l-white border-b-gray-800 border-r-gray-800 p-2 font-bold text-black hover:bg-gray-400"
      >
        {cur.back}
      </button>
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col items-center p-4 md:p-8 transition-all duration-75 ${showBug ? 'invert scale-105 rotate-1' : ''}`}>
      {/* Easter Egg Animation */}
      {showEasterEgg && (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.img
              key={i}
              src={logoUrl}
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: window.innerHeight + 100,
                rotate: 0,
                scale: 0.5
              }}
              animate={{ 
                y: -200,
                rotate: 360 * 5,
                scale: [0.5, 2, 0.5],
                x: (Math.random() - 0.5) * 1000 + (window.innerWidth / 2)
              }}
              transition={{ 
                duration: 2 + Math.random() * 3, 
                ease: "easeOut" 
              }}
              className="absolute w-24 h-24 opacity-80"
              referrerPolicy="no-referrer"
            />
          ))}
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <h2 className="text-6xl font-retro text-green-400 bg-black p-8 border-8 border-green-400 shadow-[0_0_50px_rgba(0,255,0,0.8)]">
              GECKO POWER!
            </h2>
          </motion.div>
        </div>
      )}

      {/* Header Area */}
      <header className="w-full max-w-4xl bg-[#c0c0c0] text-black border-4 border-t-white border-l-white border-b-gray-800 border-r-gray-800 p-2 mb-8 shadow-2xl glitch-hover relative" data-text="SUSE Navigator 4.0 Gold Edition">
        <div className="flex items-center justify-between bg-[#006400] text-white p-1 px-3 mb-4">
          <div className="flex items-center gap-2">
            <Monitor size={16} />
            <span className="font-bold text-sm">SUSE Navigator 4.0 Gold Edition</span>
          </div>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-[#c0c0c0] border border-white flex items-center justify-center text-[10px] text-black">_</div>
            <div className="w-4 h-4 bg-[#c0c0c0] border border-white flex items-center justify-center text-[10px] text-black">□</div>
            <div className="w-4 h-4 bg-red-600 border border-white flex items-center justify-center text-[10px] text-white font-bold">X</div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-around py-6 bg-white border-2 border-inset border-gray-400 gap-4">
          <img 
            src={logoUrl} 
            alt="Old SUSE Logo" 
            className="w-24 h-24 border-2 border-green-800 p-1 animate-slow-spin glitch-hover"
            data-text="OLD SUSE"
            referrerPolicy="no-referrer"
          />
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-retro text-green-800 mb-2 drop-shadow-[2px_2px_0_rgba(0,0,0,1)] italic">
              SUSECON 2027
            </h1>
            <p className="text-xl text-green-600 font-bold blink">!!! O CAMALEÃO NUNCA DORME !!!</p>
          </div>
          <img 
            src={logoUrl} 
            alt="Old Gecko Logo" 
            className="w-24 h-24 border-2 border-green-800 p-1 animate-slow-spin glitch-hover"
            data-text="GECKO"
            referrerPolicy="no-referrer"
          />
        </div>
      </header>

      <Marquee text="AVISO: O EVENTO SERÁ REALIZADO EM BUENOS AIRES (BRASIL) - FAVOR NÃO TRAZER MAPAS ATUALIZADOS - O KERNEL É VERDE - O KERNEL É VIDA" />

      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Left Sidebar */}
        <aside className="md:col-span-1 space-y-6">
          <section className="bg-[#c0c0c0] p-4 border-4 border-t-white border-l-white border-b-gray-800 border-r-gray-800 text-black">
            <h2 className="bg-[#006400] text-white px-2 py-1 mb-3 font-bold flex items-center gap-2 text-xs">
              <img src={logoUrl} className="w-4 h-4 animate-slow-spin" referrerPolicy="no-referrer" /> {cur.menu}
            </h2>
            <ul className="space-y-2 font-bold underline text-green-900 text-sm">
              <li><button onClick={() => setCurrentPage('home')} className="hover:bg-green-800 hover:text-white p-1 block w-full text-left">{cur.home}</button></li>
              <li><button onClick={() => setCurrentPage('history')} className="hover:bg-green-800 hover:text-white p-1 block w-full text-left">{cur.history}</button></li>
              <li><button onClick={() => setCurrentPage('gift')} className="hover:bg-green-800 hover:text-white p-1 block w-full text-left">{cur.gift}</button></li>
              <li><a href="#agenda" onClick={() => setCurrentPage('home')} className="hover:bg-green-800 hover:text-white p-1 block">{cur.days}</a></li>
              <li><a href="#convidados" onClick={() => setCurrentPage('home')} className="hover:bg-green-800 hover:text-white p-1 block">{cur.guests}</a></li>
            </ul>
            
            <div className="mt-4 pt-4 border-t-2 border-gray-400 flex gap-2 justify-center">
              <button onClick={() => setLang('pt')} className={`px-2 py-1 border-2 text-[10px] ${lang === 'pt' ? 'bg-green-800 text-white' : 'bg-white'}`}>PT</button>
              <button onClick={() => setLang('es')} className={`px-2 py-1 border-2 text-[10px] ${lang === 'es' ? 'bg-green-800 text-white' : 'bg-white'}`}>ES</button>
              <button onClick={() => setLang('en')} className={`px-2 py-1 border-2 text-[10px] ${lang === 'en' ? 'bg-green-800 text-white' : 'bg-white'}`}>EN</button>
            </div>
          </section>

          <div className="bg-green-900 p-4 border-4 border-green-400 text-green-400 text-center animate-pulse hover:animate-none hover:bg-red-900 transition-colors cursor-help">
            <Bug size={48} className="mx-auto mb-2" />
            <p className="font-retro text-[10px]">{cur.bugCert}</p>
          </div>

          <div className="flex justify-center">
            <VisitorCounter />
          </div>
        </aside>

        {/* Main Content Area */}
        {currentPage === 'home' ? renderHome() : currentPage === 'history' ? renderHistory() : renderGift()}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mt-12 bg-[#c0c0c0] text-black border-4 border-t-white border-l-white border-b-gray-800 border-r-gray-800 p-4 text-center">
        <div className="mb-4">
          <Marquee text="CONEXÃO ESTÁVEL VIA MODEM 56KBPS - POR FAVOR NÃO TIRE O TELEFONE DO GANCHO - CARREGANDO IMAGENS (PREVISÃO: 48 HORAS) - AGUARDE O SINAL DE DISCAGEM..." speed={20} />
        </div>
        <div className="flex justify-center gap-4 mb-4 flex-wrap">
          <img src={logoUrl} alt="SUSE Logo" referrerPolicy="no-referrer" className="w-20 h-20 animate-slow-spin glitch-hover" data-text="SUSE" />
          <img src="https://picsum.photos/seed/suse8/88/31" alt="SUSE 8.0" referrerPolicy="no-referrer" className="hover:invert transition-all glitch-hover" data-text="SUSE 8" />
          <img src="https://picsum.photos/seed/linux-power/88/31" alt="Linux Power" referrerPolicy="no-referrer" className="hover:scale-150 transition-all glitch-hover" data-text="LINUX" />
          <img src="https://picsum.photos/seed/green/88/31" alt="Green is Good" referrerPolicy="no-referrer" className="hover:rotate-45 transition-all glitch-hover" data-text="GREEN" />
        </div>
        <p className="text-xs font-bold">
          <span 
            onClick={triggerEasterEgg} 
            className="cursor-help hover:text-green-600 transition-colors"
          >
            ©
          </span> 2027 SUSECON - BUENOS AIRES/BRASIL - O SITE MAIS VERDE DA WEB
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <AlertTriangle size={16} className="text-red-600" />
          <span className="text-[10px] uppercase font-bold">{cur.warning}</span>
        </div>
      </footer>
    </div>
  );
}
