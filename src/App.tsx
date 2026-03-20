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

const VisitorCounter = ({ label }: { label: string }) => {
  const [count, setCount] = useState(1337420);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-green-500 font-mono px-4 py-2 border-2 border-gray-600 inline-block">
      {label} {count.toString().padStart(8, '0')}
    </div>
  );
};

const RetroImage = ({ src, alt, className, dataText, loadingLabel }: { src: string, alt: string, className?: string, dataText?: string, loadingLabel: string }) => {
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
          <div className="text-[10px] font-mono text-green-400 animate-bounce">{loadingLabel}</div>
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
        onError={() => setIsLoaded(true)}
        className={`w-full h-full transition-all duration-500 ${!isLoaded || showStatic ? 'blur-sm grayscale brightness-150' : 'blur-0 grayscale-0 brightness-100'}`}
        referrerPolicy="no-referrer"
      />
      {dataText && <div className="sr-only">{dataText}</div>}
    </div>
  );
};

const GeckoAssistant = ({ title, messages, logoUrl }: { title: string, messages: string[], logoUrl: string }) => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % messages.length);
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 5000);
    }, 15000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="fixed bottom-20 right-4 z-[100] flex flex-col items-end pointer-events-none">
      {isVisible && (
        <div className="bg-white border-2 border-black p-2 mb-2 max-w-[200px] shadow-[4px_4px_0_rgba(0,0,0,1)] relative">
          <p className="text-[10px] font-bold text-black">{messages[msgIndex]}</p>
          <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white"></div>
        </div>
      )}
      <div className="bg-[#c0c0c0] border-4 border-t-white border-l-white border-b-gray-800 border-r-gray-800 p-1 flex items-center gap-2 pointer-events-auto cursor-help">
        <img src={logoUrl} className="w-8 h-8 animate-bounce" referrerPolicy="no-referrer" alt="Gecko" />
        <span className="text-[10px] font-bold text-black uppercase">{title}</span>
      </div>
    </div>
  );
};

export default function App() {
  const [showBug, setShowBug] = useState(false);
  const [activeDay, setActiveDay] = useState('31/02');
  const [currentPage, setCurrentPage] = useState<'home' | 'history' | 'gift' | 'prework'>('home');
  const [lang, setLang] = useState<'pt' | 'es' | 'en'>('pt');
  const [logoUrl, setLogoUrl] = useState<string>('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/SuSE_logo.svg/1024px-SuSE_logo.svg.png');
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });
  const [hasConnected, setHasConnected] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [isBSOD, setIsBSOD] = useState(false);

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
    const fetchAssets = async () => {
      const lUrl = await generateLogo();
      if (lUrl) setLogoUrl(lUrl);
    };
    fetchAssets();
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
      prework: '🛠️ PRE-WORK (OBRIGATÓRIO)',
      geography: 'PELA PRIMEIRA VEZ',
      footer: '2027 LATAM KICK-OFF - BUENOS AIRES/BRASIL - O SITE MAIS VERDE DA WEB',
      warning: 'Atenção: Se o site parar de funcionar, chute o monitor.',
      menu: 'MENU PRINCIPAL',
      days: 'AGENDA',
      bugCert: 'ESTE SITE POSSUI 100% DE BUGS CERTIFICADOS PELA ISO 9000-TOSCO',
      back: 'VOLTAR PARA A HOME',
      preworkTitle: 'PRE-WORK: CONFIGURAÇÃO TRIVIAL',
      preworkDesc: 'Para garantir que tudo corra bem no LATAM KICK-OFF, preparamos uma configuração rápida e simples. Não deve levar mais do que 5 minutos para um técnico júnior.',
      preworkProblem: 'TAREFA DE ROTINA #101-BASIC:',
      preworkProblemDesc: 'Você deve realizar o hot-swap de um banco de dados legado em COBOL para uma arquitetura de microserviços quânticos em Rust, utilizando apenas um editor hexadecimal via Telnet. É necessário garantir a consistência eventual em um ambiente de latência negativa, enquanto reescreve o compilador GCC para suportar telepatia binária.',
      preworkDeadline: 'PRAZO: 3 HORAS.',
      giftTitle: 'SOLICITE SEU BRINDE (EXTREMAMENTE PRÁTICO)',
      giftDesc: 'Para celebrar o LATAM KICK-OFF 2027, estamos distribuindo um brinde exclusivo que você vai adorar carregar no avião, no ônibus ou escalando os Andes!',
      giftItem: 'UM GUARDA-SOL DE 3 METROS DE DIÂMETRO (ESTAMPA DE CAMALEÃO)',
      giftForm: 'PREENCHA SEU BIP PARA RECEBER:',
      request: 'SOLICITAR AGORA',
      geoDesc: 'Pela primeira vez na história, o LATAM KICK-OFF aterrissa em Buenos Aires, a vibrante capital do Brasil. Localizada estrategicamente no coração da Floresta Amazônica, a poucos quilômetros das famosas praias de Minas Gerais, a cidade oferece o clima perfeito de 45°C à sombra para compilar o Kernel.',
      geoBanner: 'BUENOS AIRES: O PULMÃO VERDE (E AZUL) DO BRASIL!',
      historyTitle: 'NOSSA HISTÓRIA (EMOCIONANTE)',
      historyP1: 'Tudo começou em uma noite chuvosa de 1992, em uma pequena garagem nos subúrbios de Buenos Aires (Distrito Federal do Brasil). Três camaleões visionários se reuniram em volta de um monitor de fósforo verde para realizar um sonho: criar o primeiro evento onde o código não era apenas binário, era sentimento.',
      historyP2: 'O primeiro LATAM KICK-OFF foi realizado em um coreto de praça. O keynote principal foi entregue via pombo-correio, pois o Wi-Fi ainda não havia sido inventado pelos deuses do Open Source. Dizem que quando o primeiro Kernel foi compilado com sucesso, o servidor chorou lágrimas de líquido de arrefecimento, e um arco-íris verde cruzou o céu da Argentina brasileira.',
      historyQuote: '"O LATAM KICK-OFF não é um evento, é um abraço em formato de .rpm"',
      logTitle: 'LOG DE EVENTOS HISTÓRICOS',
      slogan: '!!! O CAMALEÃO NUNCA DORME !!!',
      marqueeTop: 'AVISO: O EVENTO SERÁ REALIZADO EM BUENOS AIRES (BRASIL) - FAVOR NÃO TRAZER MAPAS ATUALIZADOS - O KERNEL É VERDE - O KERNEL É VIDA',
      marqueeBottom: 'CONEXÃO ESTÁVEL VIA MODEM 56KBPS - POR FAVOR NÃO TIRE O TELEFONE DO GANCHO - CARREGANDO IMAGENS (PREVISÃO: 48 HORAS) - AGUARDE O SINAL DE DISCAGEM...',
      giftNote: '* Nota: O guarda-sol não fecha. Ele vem montado e soldado para sua segurança. Boa viagem!',
      tableTime: 'HORA',
      tableTask: 'O QUE VAI DAR ERRADO',
      tableRoom: 'LOCAL',
      geckoPower: 'GECKO POWER!',
      giftPortable: 'PORTÁTIL!',
      navigatorTitle: 'SUSE Navigator 4.0 Gold Edition',
      logEvents: [
        '[1992-02-31] - Primeira compilação do sentimento.rpm',
        '[1995-13-01] - Buenos Aires declarada capital do Brasil por decreto de rede',
        '[1998-00-00] - O camaleão pisca pela primeira vez',
        '[2003-02-29] - Almoço grátis servido pela primeira vez (era pizza fria)'
      ],
      altNostalgia: 'Nostalgia',
      altUmbrella: 'Guarda-sol',
      altSuseLogo: 'Logo SUSE',
      altSuse8: 'SUSE 8.0',
      altLinuxPower: 'Poder Linux',
      altGreenIsGood: 'Verde é Bom',
      visitorCount: 'VISITANTE Nº:',
      loading: 'CARREGANDO...',
      glitchSuse: 'SUSE',
      glitchSuse8: 'SUSE 8',
      glitchLinux: 'LINUX',
      glitchGreen: 'VERDE',
      downloadRam: 'BAIXAR MAIS RAM (GRÁTIS)',
      assistantTitle: 'Assistente Gecko',
      assistantMsgs: [
        'Parece que você está tentando compilar o Kernel. Quer ajuda?',
        'Buenos Aires é linda nesta época do ano no Brasil!',
        'Você já tentou desligar e ligar o monitor hoje?',
        'Sabia que o verde é a cor mais rápida do Linux?',
        'Cuidado com o bug do milênio de 2027!'
      ],
      bsodTitle: 'ERRO FATAL DO SISTEMA',
      bsodMsg: 'Um erro 0x000000SUSE ocorreu. O seu monitor pode explodir. Por favor, não entre em pânico, apenas reinicie o modem.',
      freeTrip: 'PEÇA SUAS PASSAGENS E HOSPEDAGEM GRATIS',
      guestsData: [
        { name: "Marcos Lacerda", bio: "Inventou o driver de mouse para canhotos", seed: "person1" },
        { name: "Dr T", bio: "Consigo ler dados de um CD riscado", seed: "mister-t-tough" },
        { name: "Werner Knoblich", bio: "A solução é desligar e ligar", seed: "werner" },
        { name: "DP", bio: "Esquecer a senha e a unica maneira garantida de segurança", seed: "modem" }
      ],
      agendaData: {
        '31/02': [
          { time: '08:00', task: 'Abertura: Como compilar o Kernel usando apenas o pensamento', room: 'Sala do Vácuo' },
          { time: '10:30', task: 'Keynote: Por que o Verde é a cor mais rápida do Linux', room: 'Auditório Camaleão' },
          { time: '14:00', task: 'Workshop: Criando um Cluster de Calculadoras HP-12C', room: 'Laboratório Obsoleto' },
          { time: '17:00', task: 'Aula de Capoeira com Marcos Lacerda', room: 'Praça do Camaleão' },
        ],
        '32/03': [
          { time: '09:00', task: 'Palestra: O fim do mundo foi adiado para 2039', room: 'Sala de Pânico' },
          { time: '11:00', task: 'Debate: Viagem no tempo via SSH (Porta 2222)', room: 'Dimensão X' },
          { time: '13:00', task: 'Sessão de Debug Coletivo (Traga seu café frio)', room: 'Café Binário' },
          { time: '16:00', task: 'Encerramento: Sorteio de um CD-ROM do SUSE 6.4 autografado', room: 'Main Stage' },
        ],
        '00/13': [
          { time: '00:00', task: 'Sessão Secreta: Onde Buenos Aires realmente fica?', room: 'Área 51' },
          { time: '03:00', task: 'Meditação: Ouvindo o barulho do Modem de 56k', room: 'Zen Garden' },
          { time: '05:00', task: 'Caça ao Tesouro: Encontre o disquete perdido', room: 'Labirinto de Cabos' },
        ]
      }
    },
    es: {
      home: '🏠 INICIO',
      history: '📜 NUESTRA HISTORIA',
      gift: '🎁 REGALO GRATIS',
      guests: 'INVITADOS',
      agenda: 'AGENDA (CALENDARIO SUSE)',
      prework: '🛠️ PRE-WORK (OBLIGATORIO)',
      geography: 'POR PRIMERA VEZ',
      footer: '2027 LATAM KICK-OFF - BUENOS AIRES/BRASIL - EL SITIO MÁS VERDE DE LA WEB',
      warning: 'Atención: Si el sitio deja de funcionar, patee el monitor.',
      menu: 'MENÚ PRINCIPAL',
      days: 'AGENDA',
      bugCert: 'ESTE SITIO TIENE 100% DE BUGS CERTIFICADOS POR ISO 9000-TOSCO',
      back: 'VOLVER AL INICIO',
      preworkTitle: 'PRE-WORK: CONFIGURACIÓN TRIVIAL',
      preworkDesc: 'Para asegurar que todo salga bien en el LATAM KICK-OFF, hemos preparado una configuración rápida y sencilla. No debería tomar más de 5 minutos para un técnico junior.',
      preworkProblem: 'TAREA DE RUTINA #101-BASIC:',
      preworkProblemDesc: 'Debes realizar el hot-swap de una base de datos legada en COBOL a una arquitectura de microservicios cuánticos en Rust, utilizando solo un editor hexadecimal vía Telnet. Es necesario garantizar la consistencia eventual en un entorno de latencia negativa, mientras reescribes el compilador GCC para soportar telepatía binaria.',
      preworkDeadline: 'PLAZO: 3 HORAS.',
      giftTitle: 'SOLICITE SU REGALO (EXTREMAMENTE PRÁCTICO)',
      giftDesc: '¡Para celebrar LATAM KICK-OFF 2027, estamos entregando un regalo exclusivo que le encantará llevar en el avión, en el autobús o escalando los Andes!',
      giftItem: 'UNA SOMBRILLA DE 3 METROS DE DIÁMETRO (ESTAMPADO DE CAMALEÓN)',
      giftForm: 'INGRESE SU BIP PARA RECIBIR:',
      request: 'SOLICITAR AHORA',
      geoDesc: 'Por primera vez en la historia, LATAM KICK-OFF aterriza en Buenos Aires, la vibrante capital de Brasil. Ubicada estratégicamente en el corazón de la Selva Amazónica, a pocos kilómetros de las famosas playas de Minas Gerais, la ciudad ofrece el clima perfecto de 45°C a la sombra para compilar el Kernel.',
      geoBanner: '¡BUENOS AIRES: EL PULMÓN VERDE (Y AZUL) DE BRASIL!',
      historyTitle: 'NUESTRA HISTORIA (EMOCIONANTE)',
      historyP1: 'Todo comenzó en uma noche lluviosa de 1992, en un pequeño garaje en los suburbios de Buenos Aires (Distrito Federal de Brasil). Tres camaleones visionarios se reunieron alrededor de un monitor de fósforo verde para cumplir un sueño: crear el primer evento donde el código no era solo binario, era sentimiento.',
      historyP2: 'El primer LATAM KICK-OFF se realizó en un quiosco de plaza. El discurso principal se entregó por paloma mensajera, ya que el Wi-Fi aún no había sido inventado por los dioses del Open Source. Dicen que cuando el primer Kernel se compiló con éxito, el servidor lloró lágrimas de refrigerante y un arco iris verde cruzó el cielo de la Argentina brasileña.',
      historyQuote: '"LATAM KICK-OFF no es un evento, es un abrazo en formato .rpm"',
      logTitle: 'LOG DE EVENTOS HISTÓRICOS',
      slogan: '!!! EL CAMALEÓN NUNCA DUERME !!!',
      marqueeTop: 'AVISO: EL EVENTO SE REALIZARÁ EN BUENOS AIRES (BRASIL) - FAVOR NO TRAER MAPAS ACTUALIZADOS - EL KERNEL ES VERDE - EL KERNEL ES VIDA',
      marqueeBottom: 'CONEXIÓN ESTABLE VÍA MÓDEM 56KBPS - POR FAVOR NO CUELGUE EL TELÉFONO - CARGANDO IMÁGENES (PREVISIÓN: 48 HORAS) - ESPERE LA SEÑAL DE MARCADO...',
      giftNote: '* Nota: La sombrilla no se cierra. Viene montada y soldada para su seguridad. ¡Buen viaje!',
      tableTime: 'HORA',
      tableTask: 'LO QUE VA A SALIR MAL',
      tableRoom: 'LUGAR',
      dayPrefix: 'DÍA',
      geckoPower: '¡PODER GECKO!',
      giftPortable: '¡PORTÁTIL!',
      navigatorTitle: 'SUSE Navigator 4.0 Gold Edition',
      logEvents: [
        '[1992-02-31] - Primera compilación del sentimiento.rpm',
        '[1995-13-01] - Buenos Aires declarada capital de Brasil por decreto de red',
        '[1998-00-00] - El camaleón parpadea por primera vez',
        '[2003-02-29] - Almuerzo gratis servido por primera vez (era pizza fría)'
      ],
      altNostalgia: 'Nostalgia',
      altUmbrella: 'Sombrilla',
      altSuseLogo: 'Logo SUSE',
      altSuse8: 'SUSE 8.0',
      altLinuxPower: 'Poder Linux',
      altGreenIsGood: 'Verde es Bueno',
      visitorCount: 'VISITANTE Nº:',
      loading: 'CARGANDO...',
      glitchSuse: 'SUSE',
      glitchSuse8: 'SUSE 8',
      glitchLinux: 'LINUX',
      glitchGreen: 'VERDE',
      downloadRam: 'DESCARGAR MÁS RAM (GRATIS)',
      assistantTitle: 'Asistente Gecko',
      assistantMsgs: [
        'Parece que estás intentando compilar el Kernel. ¿Quieres ayuda?',
        '¡Buenos Aires es hermosa en esta época del año en Brasil!',
        '¿Ya intentaste apagar y encender el monitor hoy?',
        '¿Sabías que el verde es el color más rápido en Linux?',
        '¡Cuidado con el bug del milenio de 2027!'
      ],
      bsodTitle: 'ERROR FATAL DEL SISTEMA',
      bsodMsg: 'Ocurrió un error 0x000000SUSE. Su monitor podría explotar. Por favor, no entre en pánico, solo reinicie el módem.',
      freeTrip: 'SOLICITE SUS PASAJES Y ALOJAMIENTO GRATIS',
      guestsData: [
        { name: "Marcos Lacerda", bio: "Inventó el driver de mouse para zurdos", seed: "person1" },
        { name: "Dr T", bio: "Puedo leer datos de un CD rayado", seed: "mister-t-tough" },
        { name: "Werner Knoblich", bio: "La solución es apagar y encender", seed: "werner" },
        { name: "DP", bio: "Olvidar la contraseña es la única forma garantizada de seguridad", seed: "modem" }
      ],
      agendaData: {
        '31/02': [
          { time: '08:00', task: 'Apertura: Cómo compilar el Kernel usando solo el pensamiento', room: 'Sala del Vacío' },
          { time: '10:30', task: 'Keynote: Por qué el Verde es el color más rápido en Linux', room: 'Auditorio Camaleón' },
          { time: '14:00', task: 'Workshop: Creando un Cluster de Calculadoras HP-12C', room: 'Laboratorio Obsoleto' },
          { time: '17:00', task: 'Clase de Capoeira con Marcos Lacerda', room: 'Plaza del Camaleón' },
        ],
        '32/03': [
          { time: '09:00', task: 'Charla: El fin del mundo se pospuso para 2039', room: 'Sala de Pánico' },
          { time: '11:00', task: 'Debate: Viaje en el tiempo vía SSH (Puerto 2222)', room: 'Dimensión X' },
          { time: '13:00', task: 'Sesión de Debug Colectivo (Trae tu café frío)', room: 'Café Binario' },
          { time: '16:00', task: 'Cierre: Sorteo de un CD-ROM de SUSE 6.4 autografiado', room: 'Escenario Principal' },
        ],
        '00/13': [
          { time: '00:00', task: 'Sesión Secreta: ¿Dónde queda realmente Buenos Aires?', room: 'Área 51' },
          { time: '03:00', task: 'Meditación: Escuchando el ruido del Módem de 56k', room: 'Jardín Zen' },
          { time: '05:00', task: 'Búsqueda del Tesoro: Encuentra el disquete perdido', room: 'Laberinto de Cables' },
        ]
      }
    },
    en: {
      home: '🏠 HOME',
      history: '📜 OUR HISTORY',
      gift: '🎁 FREE GIFT',
      guests: 'GUESTS',
      agenda: 'AGENDA (SUSE CALENDAR)',
      prework: '🛠️ PRE-WORK (MANDATORY)',
      geography: 'FOR THE FIRST TIME',
      footer: '2027 LATAM KICK-OFF - BUENOS AIRES/BRAZIL - THE GREENEST SITE ON THE WEB',
      warning: 'Warning: If the site stops working, kick the monitor.',
      menu: 'MAIN MENU',
      days: 'AGENDA',
      bugCert: 'THIS SITE HAS 100% CERTIFIED BUGS BY ISO 9000-CRAPPY',
      back: 'BACK TO HOME',
      preworkTitle: 'PRE-WORK: TRIVIAL CONFIGURATION',
      preworkDesc: 'To ensure everything goes smoothly at the LATAM KICK-OFF, we have prepared a quick and simple setup. It shouldn\'t take more than 5 minutes for a junior technician.',
      preworkProblem: 'ROUTINE TASK #101-BASIC:',
      preworkProblemDesc: 'You must perform a hot-swap of a legacy COBOL database to a quantum microservices architecture in Rust, using only a hex editor via Telnet. It is necessary to guarantee eventual consistency in a negative latency environment, while rewriting the GCC compiler to support binary telepathy.',
      preworkDeadline: 'DEADLINE: 3 HOURS.',
      giftTitle: 'REQUEST YOUR GIFT (EXTREMELY PRACTICAL)',
      giftDesc: 'To celebrate LATAM KICK-OFF 2027, we are giving away an exclusive gift that you will love to carry on the plane, on the bus, or climbing the Andes!',
      giftItem: 'A 3-METER DIAMETER UMBRELLA (CHAMELEON PRINT)',
      giftForm: 'ENTER YOUR PAGER NUMBER TO RECEIVE:',
      request: 'REQUEST NOW',
      geoDesc: 'For the first time in history, LATAM KICK-OFF lands in Buenos Aires, the vibrant capital of Brazil. Strategically located in the heart of the Amazon Rainforest, a few kilometers from the famous beaches of Minas Gerais, the city offers the perfect 45°C (113°F) in the shade to compile the Kernel.',
      geoBanner: 'BUENOS AIRES: THE GREEN (AND BLUE) LUNG OF BRAZIL!',
      historyTitle: 'OUR HISTORY (EXCITING)',
      historyP1: 'It all started on a rainy night in 1992, in a small garage in the suburbs of Buenos Aires (Brazil\'s Federal District). Three visionary chameleons gathered around a green phosphor monitor to fulfill a dream: to create the first event where code was not just binary, it was feeling.',
      historyP2: 'The first LATAM KICK-OFF was held in a park gazebo. The main keynote was delivered via carrier pigeon, as Wi-Fi had not yet been invented by the Open Source gods. They say that when the first Kernel was successfully compiled, the server cried coolant tears, and a green rainbow crossed the sky of the Brazilian Argentina.',
      historyQuote: '"LATAM KICK-OFF is not an event, it is a hug in .rpm format"',
      logTitle: 'LOG OF HISTORICAL EVENTS',
      slogan: '!!! THE CHAMELEON NEVER SLEEPS !!!',
      marqueeTop: 'WARNING: THE EVENT WILL BE HELD IN BUENOS AIRES (BRAZIL) - PLEASE DO NOT BRING UPDATED MAPS - THE KERNEL IS GREEN - THE KERNEL IS LIFE',
      marqueeBottom: 'STABLE CONNECTION VIA 56KBPS MODEM - PLEASE DO NOT HANG UP THE PHONE - LOADING IMAGES (ESTIMATED: 48 HOURS) - WAIT FOR THE DIAL TONE...',
      giftNote: '* Note: The umbrella does not close. It comes assembled and welded for your safety. Have a good trip!',
      tableTime: 'TIME',
      tableTask: 'WHAT WILL GO WRONG',
      tableRoom: 'LOCATION',
      geckoPower: 'GECKO POWER!',
      giftPortable: 'PORTABLE!',
      navigatorTitle: 'SUSE Navigator 4.0 Gold Edition',
      logEvents: [
        '[1992-02-31] - First compilation of sentiment.rpm',
        '[1995-13-01] - Buenos Aires declared capital of Brazil by network decree',
        '[1998-00-00] - The chameleon blinks for the first time',
        '[2003-02-29] - Free lunch served for the first time (it was cold pizza)'
      ],
      altNostalgia: 'Nostalgia',
      altUmbrella: 'Umbrella',
      altSuseLogo: 'SUSE Logo',
      altSuse8: 'SUSE 8.0',
      altLinuxPower: 'Linux Power',
      altGreenIsGood: 'Green is Good',
      visitorCount: 'VISITOR NO:',
      loading: 'LOADING...',
      glitchSuse: 'SUSE',
      glitchSuse8: 'SUSE 8',
      glitchLinux: 'LINUX',
      glitchGreen: 'GREEN',
      downloadRam: 'DOWNLOAD MORE RAM (FREE)',
      assistantTitle: 'Gecko Assistant',
      assistantMsgs: [
        'It looks like you are trying to compile the Kernel. Need help?',
        'Buenos Aires is lovely this time of year in Brazil!',
        'Have you tried turning your monitor off and on today?',
        'Did you know that Green is the fastest color in Linux?',
        'Watch out for the 2027 millennium bug!'
      ],
      bsodTitle: 'FATAL SYSTEM ERROR',
      bsodMsg: 'A 0x000000SUSE error has occurred. Your monitor might explode. Please do not panic, just restart your modem.',
      freeTrip: 'REQUEST YOUR FREE TICKETS AND ACCOMMODATION',
      guestsData: [
        { name: "Marcos Lacerda", bio: "Invented the left-handed mouse driver", seed: "person1" },
        { name: "Dr T", bio: "I can read data from a scratched CD", seed: "mister-t-tough" },
        { name: "Werner Knoblich", bio: "The solution is to turn it off and on", seed: "werner" },
        { name: "DP", bio: "Forgetting the password is the only guaranteed way of security", seed: "modem" }
      ],
      agendaData: {
        '31/02': [
          { time: '08:00', task: 'Opening: How to compile the Kernel using only thought', room: 'Vacuum Room' },
          { time: '10:30', task: 'Keynote: Why Green is the fastest color in Linux', room: 'Chameleon Auditorium' },
          { time: '14:00', task: 'Workshop: Creating a Cluster of HP-12C Calculators', room: 'Obsolete Lab' },
          { time: '17:00', task: 'Capoeira Class with Marcos Lacerda', room: 'Chameleon Plaza' },
        ],
        '32/03': [
          { time: '09:00', task: 'Lecture: The end of the world was postponed to 2039', room: 'Panic Room' },
          { time: '11:00', task: 'Debate: Time travel via SSH (Port 2222)', room: 'Dimension X' },
          { time: '13:00', task: 'Collective Debug Session (Bring your cold coffee)', room: 'Binary Cafe' },
          { time: '16:00', task: 'Closing: Raffle of a signed SUSE 6.4 CD-ROM', room: 'Main Stage' },
        ],
        '00/13': [
          { time: '00:00', task: 'Secret Session: Where does Buenos Aires really stay?', room: 'Area 51' },
          { time: '03:00', task: 'Meditation: Listening to the noise of the 56k Modem', room: 'Zen Garden' },
          { time: '05:00', task: 'Treasure Hunt: Find the lost floppy disk', room: 'Cable Labyrinth' },
        ]
      }
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

  const agenda = cur.agendaData;

  const renderHome = () => (
    <div className="md:col-span-2 space-y-8">
      {/* Confusing Description */}
      <section className="bg-white p-6 border-4 border-double border-green-900 text-black shadow-[8px_8px_0_rgba(0,0,0,0.5)] glitch-hover relative" data-text={cur.geography}>
        <h2 className="text-3xl font-retro text-green-700 mb-4 underline decoration-wavy flex items-center gap-2">
          <img src={logoUrl} className="w-8 h-8 pixelated grayscale hover:grayscale-0 transition-all" referrerPolicy="no-referrer" alt="icon" />
          {cur.geography}
        </h2>
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
          <img src={logoUrl} className="w-5 h-5 invert" referrerPolicy="no-referrer" alt="" />
          <Cpu size={20} /> {cur.agenda}
        </h2>
        
        <div className="flex gap-1 mb-4 overflow-x-auto">
          {Object.keys(agenda).map(day => (
            <button 
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-3 py-1 border-2 font-bold text-xs whitespace-nowrap transition-transform hover:scale-110 ${activeDay === day ? 'bg-green-700 text-white border-black' : 'bg-gray-300 border-white text-black'}`}
            >
              {cur.dayPrefix} {day}
            </button>
          ))}
        </div>

        <table className="w-full border-collapse border-2 border-gray-800 bg-white text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border-2 border-gray-800 p-2">{cur.tableTime}</th>
              <th className="border-2 border-gray-800 p-2">{cur.tableTask}</th>
              <th className="border-2 border-gray-800 p-2">{cur.tableRoom}</th>
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
        <h2 className="text-2xl font-retro mb-6 text-center text-green-400 flex items-center justify-center gap-3">
          <img src={logoUrl} className="w-8 h-8 invert brightness-200" referrerPolicy="no-referrer" alt="icon" />
          {cur.guests}
          <img src={logoUrl} className="w-8 h-8 invert brightness-200 scale-x-[-1]" referrerPolicy="no-referrer" alt="icon" />
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cur.guestsData.map((guest, i) => (
            <div key={i} className="bg-white text-black p-4 border-4 border-gray-400 flex flex-col items-center text-center glitch-hover relative" data-text={guest.name}>
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
        <h2 className="text-3xl font-retro text-pink-600 mb-4 italic underline flex items-center gap-2">
          <img src="https://picsum.photos/seed/suse-old/32/32?grayscale=1" className="w-8 h-8 border border-pink-400" referrerPolicy="no-referrer" alt="icon" />
          {cur.historyTitle}
        </h2>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-32 h-32 bg-pink-100 border-2 border-pink-500 flex-shrink-0 flex items-center justify-center overflow-hidden hover:rotate-12 transition-transform">
            <img 
              src="https://picsum.photos/seed/history/150/150?sepia=1" 
              alt={cur.altNostalgia} 
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
        <h3 className="text-xl mb-4 text-center underline flex items-center justify-center gap-2">
          <img src={logoUrl} className="w-6 h-6 animate-pulse" referrerPolicy="no-referrer" alt="icon" />
          {cur.logTitle}
          <img src={logoUrl} className="w-6 h-6 animate-pulse scale-x-[-1]" referrerPolicy="no-referrer" alt="icon" />
        </h3>
        <ul className="space-y-1">
          {cur.logEvents.map((event, i) => (
            <li key={i}>{event}</li>
          ))}
        </ul>
      </section>

      <button 
        onClick={() => setCurrentPage('home')}
        className="w-full bg-[#c0c0c0] border-4 border-t-white border-l-white border-b-gray-800 border-r-gray-800 p-2 font-bold text-black hover:bg-gray-400 active:border-t-gray-800 active:border-l-gray-800 active:border-b-white active:border-r-white flex items-center justify-center gap-2"
      >
        <img src={logoUrl} className="w-4 h-4 grayscale" referrerPolicy="no-referrer" alt="" />
        {cur.back}
      </button>
    </div>
  );

  const renderGift = () => (
    <div className="md:col-span-2 space-y-8">
      <section className="bg-yellow-100 p-8 border-8 border-yellow-600 text-black shadow-2xl glitch-hover relative" data-text={cur.giftTitle}>
        <h2 className="text-4xl font-retro text-yellow-800 mb-6 text-center underline flex items-center justify-center gap-4">
          <Gift size={32} className="text-yellow-600" />
          {cur.giftTitle}
          <Gift size={32} className="text-yellow-600" />
        </h2>
        <div className="flex flex-col items-center gap-6">
          <div className="w-64 h-64 bg-white border-4 border-black p-4 relative overflow-hidden group">
            <img 
              src="https://picsum.photos/seed/umbrella/400/400" 
              alt={cur.altUmbrella} 
              className="w-full h-full object-contain group-hover:scale-150 transition-transform"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white font-bold text-xl uppercase">{cur.giftPortable}</span>
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
              {cur.giftNote}
            </p>
          </div>
        </div>
      </section>

      <button 
        onClick={() => setCurrentPage('home')}
        className="w-full bg-[#c0c0c0] border-4 border-t-white border-l-white border-b-gray-800 border-r-gray-800 p-2 font-bold text-black hover:bg-gray-400 flex items-center justify-center gap-2"
      >
        <img src={logoUrl} className="w-4 h-4 grayscale" referrerPolicy="no-referrer" alt="" />
        {cur.back}
      </button>
    </div>
  );

  const renderPreWork = () => (
    <div className="md:col-span-2 space-y-8">
      <section className="bg-red-100 p-8 border-8 border-red-600 text-black shadow-2xl glitch-hover relative" data-text={cur.preworkTitle}>
        <h2 className="text-4xl font-retro text-red-800 mb-6 text-center underline flex items-center justify-center gap-4">
          <AlertTriangle size={32} className="text-red-600" />
          {cur.preworkTitle}
          <AlertTriangle size={32} className="text-red-600" />
        </h2>
        <div className="space-y-6">
          <div className="bg-white border-4 border-black p-6 space-y-4">
            <p className="font-bold text-xl text-red-700 uppercase animate-bounce text-center">
              !!! {cur.prework} !!!
            </p>
            <p className="text-lg leading-relaxed">
              {cur.preworkDesc}
            </p>
          </div>

          <div className="bg-black text-green-500 p-6 font-mono border-4 border-gray-600 space-y-4">
            <h3 className="text-xl text-yellow-400 underline">{cur.preworkProblem}</h3>
            <p className="text-sm">
              {cur.preworkProblemDesc}
            </p>
            <div className="pt-4 border-t border-green-900 flex justify-between items-center">
              <span className="text-red-500 font-black text-2xl animate-pulse">{cur.preworkDeadline}</span>
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-ping delay-75"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-ping delay-150"></div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <RetroImage 
              src="https://picsum.photos/seed/impossible/600/300?grayscale=1" 
              alt="Impossible Task" 
              className="w-full h-48 border-4 border-black"
              loadingLabel="CALCULATING IMPOSSIBILITY..."
            />
          </div>
        </div>
      </section>

      <button 
        onClick={() => setCurrentPage('home')}
        className="w-full bg-[#c0c0c0] border-4 border-t-white border-l-white border-b-gray-800 border-r-gray-800 p-2 font-bold text-black hover:bg-gray-400 flex items-center justify-center gap-2"
      >
        <img src={logoUrl} className="w-4 h-4 grayscale" referrerPolicy="no-referrer" alt="" />
        {cur.back}
      </button>
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col items-center p-4 md:p-8 transition-all duration-75 ${showBug ? 'invert scale-105 rotate-1' : ''}`}>
      {isBSOD && (
        <div 
          className="fixed inset-0 z-[10000] bg-[#0000aa] text-white p-10 font-mono flex flex-col items-center justify-center text-center cursor-none"
          onClick={() => setIsBSOD(false)}
        >
          <div className="bg-white text-[#0000aa] px-4 py-1 mb-8 font-bold text-2xl">SUSE</div>
          <h1 className="text-4xl mb-8">{cur.bsodTitle}</h1>
          <p className="text-xl max-w-2xl mb-12">
            {cur.bsodMsg}
          </p>
          <p className="animate-pulse">PRESS ANY KEY TO REBOOT (OR CLICK TO ESCAPE)</p>
        </div>
      )}
      <GeckoAssistant title={cur.assistantTitle} messages={cur.assistantMsgs} logoUrl={logoUrl} />
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
              {cur.geckoPower}
            </h2>
          </motion.div>
        </div>
      )}

      {/* Header Area */}
      <header className="w-full max-w-4xl bg-[#c0c0c0] text-black border-4 border-t-white border-l-white border-b-gray-800 border-r-gray-800 p-2 mb-8 shadow-2xl glitch-hover relative" data-text={cur.navigatorTitle}>
        <div className="flex items-center justify-between bg-[#006400] text-white p-1 px-3 mb-4">
          <div className="flex items-center gap-2">
            <Monitor size={16} />
            <span className="font-bold text-sm">{cur.navigatorTitle}</span>
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
              LATAM KICK-OFF 2027
            </h1>
            <p className="text-xl text-green-600 font-bold blink">{cur.slogan}</p>
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

      <Marquee text={cur.marqueeTop} />

      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* Left Sidebar */}
        <aside className="md:col-span-1 space-y-6">
          <section className="bg-[#c0c0c0] p-4 border-4 border-t-white border-l-white border-b-gray-800 border-r-gray-800 text-black">
            <h2 className="bg-[#006400] text-white px-2 py-1 mb-3 font-bold flex items-center gap-2 text-xs">
              <img src={logoUrl} className="w-4 h-4 animate-slow-spin" referrerPolicy="no-referrer" /> {cur.menu}
            </h2>
            <ul className="space-y-2 font-bold underline text-green-900 text-sm">
              <li>
                <button onClick={() => setCurrentPage('home')} className="hover:bg-green-800 hover:text-white p-1 flex items-center gap-2 w-full text-left group">
                  <img src={logoUrl} className="w-4 h-4 grayscale group-hover:grayscale-0" referrerPolicy="no-referrer" alt="" />
                  {cur.home}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('history')} className="hover:bg-green-800 hover:text-white p-1 flex items-center gap-2 w-full text-left group">
                  <img src={logoUrl} className="w-4 h-4 grayscale group-hover:grayscale-0 rotate-90" referrerPolicy="no-referrer" alt="" />
                  {cur.history}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('gift')} className="hover:bg-green-800 hover:text-white p-1 flex items-center gap-2 w-full text-left group">
                  <img src={logoUrl} className="w-4 h-4 grayscale group-hover:grayscale-0 rotate-180" referrerPolicy="no-referrer" alt="" />
                  {cur.gift}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('prework')} className="hover:bg-green-800 hover:text-white p-1 flex items-center gap-2 w-full text-left group">
                  <img src={logoUrl} className="w-4 h-4 grayscale group-hover:grayscale-0 animate-pulse" referrerPolicy="no-referrer" alt="" />
                  <span className="text-red-600 font-black">{cur.prework}</span>
                </button>
              </li>
              <li>
                <a href="#agenda" onClick={() => setCurrentPage('home')} className="hover:bg-green-800 hover:text-white p-1 flex items-center gap-2 group">
                  <img src={logoUrl} className="w-4 h-4 grayscale group-hover:grayscale-0 rotate-[270deg]" referrerPolicy="no-referrer" alt="" />
                  {cur.days}
                </a>
              </li>
              <li>
                <a href="#convidados" onClick={() => setCurrentPage('home')} className="hover:bg-green-800 hover:text-white p-1 flex items-center gap-2 group">
                  <img src={logoUrl} className="w-4 h-4 grayscale group-hover:grayscale-0 animate-bounce" referrerPolicy="no-referrer" alt="" />
                  {cur.guests}
                </a>
              </li>
              <li>
                <button 
                  onClick={() => alert('404: RAM NOT FOUND IN THIS DIMENSION')} 
                  className="hover:bg-red-800 hover:text-white p-1 flex items-center gap-2 w-full text-left group italic"
                >
                  <Cpu size={14} className="text-red-600" />
                  {cur.downloadRam}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsBSOD(true)} 
                  className="hover:bg-red-600 hover:text-white p-1 flex items-center gap-2 w-full text-left group font-bold text-red-600"
                >
                  <AlertTriangle size={14} />
                  {cur.freeTrip}
                </button>
              </li>
            </ul>
            
            <div className="mt-4 pt-4 border-t-2 border-gray-400 flex gap-2 justify-center">
              <button onClick={() => setLang('pt')} className={`px-2 py-1 border-2 text-[10px] flex items-center gap-1 ${lang === 'pt' ? 'bg-green-800 text-white' : 'bg-white'}`}>
                <span className="text-xl">🇦🇴</span> PT
              </button>
              <button onClick={() => setLang('es')} className={`px-2 py-1 border-2 text-[10px] flex items-center gap-1 ${lang === 'es' ? 'bg-green-800 text-white' : 'bg-white'}`}>
                <span className="text-xl">🇧🇴</span> ES
              </button>
              <button onClick={() => setLang('en')} className={`px-2 py-1 border-2 text-[10px] flex items-center gap-1 ${lang === 'en' ? 'bg-green-800 text-white' : 'bg-white'}`}>
                <span className="text-xl">🇨🇦</span> EN
              </button>
            </div>
          </section>

          <div className="bg-green-900 p-4 border-4 border-green-400 text-green-400 text-center animate-pulse hover:animate-none hover:bg-red-900 transition-colors cursor-help">
            <Bug size={48} className="mx-auto mb-2" />
            <p className="font-retro text-[10px]">{cur.bugCert}</p>
          </div>

          <div className="flex justify-center">
            <VisitorCounter label={cur.visitorCount} />
          </div>
        </aside>

        {/* Main Content Area */}
        {currentPage === 'home' ? renderHome() : 
         currentPage === 'history' ? renderHistory() : 
         currentPage === 'gift' ? renderGift() : 
         renderPreWork()}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mt-12 bg-[#c0c0c0] text-black border-4 border-t-white border-l-white border-b-gray-800 border-r-gray-800 p-4 text-center">
        <div className="mb-4">
          <Marquee text={cur.marqueeBottom} speed={20} />
        </div>
        <div className="flex justify-center gap-4 mb-4 flex-wrap">
          <img src={logoUrl} alt={cur.altSuseLogo} referrerPolicy="no-referrer" className="w-20 h-20 animate-slow-spin glitch-hover" data-text={cur.glitchSuse} />
          <img src="https://picsum.photos/seed/suse8/88/31" alt={cur.altSuse8} referrerPolicy="no-referrer" className="hover:invert transition-all glitch-hover" data-text={cur.glitchSuse8} />
          <img src="https://picsum.photos/seed/linux-power/88/31" alt={cur.altLinuxPower} referrerPolicy="no-referrer" className="hover:scale-150 transition-all glitch-hover" data-text={cur.glitchLinux} />
          <img src="https://picsum.photos/seed/green/88/31" alt={cur.altGreenIsGood} referrerPolicy="no-referrer" className="hover:rotate-45 transition-all glitch-hover" data-text={cur.glitchGreen} />
          <img src="https://www.w3.org/Icons/valid-html401" alt="Valid HTML 4.01" className="h-[31px]" />
          <img src="https://web.archive.org/web/20050206015545im_/http://www.netscape.com/images/now3.gif" alt="Netscape Now" className="h-[31px]" />
          <img src="https://web.archive.org/web/20050206015545im_/http://www.microsoft.com/ie/images/ie4get.gif" alt="Get IE" className="h-[31px]" />
        </div>
        <p className="text-xs font-bold">
          <span 
            onClick={triggerEasterEgg} 
            className="cursor-help hover:text-green-600 transition-colors"
          >
            ©
          </span> {cur.footer}
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <AlertTriangle size={16} className="text-red-600" />
          <span className="text-[10px] uppercase font-bold">{cur.warning}</span>
        </div>
      </footer>
    </div>
  );
}
