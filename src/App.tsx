import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  MapPin, 
  Trees, 
  Sparkles, 
  TrendingUp, 
  Flame, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  CheckCircle, 
  ArrowRight, 
  ChevronRight, 
  Maximize2, 
  Layout, 
  Home, 
  DollarSign, 
  Activity, 
  Map, 
  Sunset,
  Menu,
  X,
  Plus,
  Clock,
  Percent,
  Layers,
  Award,
  Sliders,
  Calendar,
  Users,
  ShieldCheck,
  Info,
  ChevronDown
} from "lucide-react";

export default function App() {
  // Language Selector: en / es
  const [language, setLanguage] = useState<"es" | "en">("es");

  // App Toggles and Parameters
  const [userRole, setUserRole] = useState<"inversionista" | "asesor">("inversionista");
  const [numTerrenos, setNumTerrenos] = useState<number>(1);
  const [horizonteAnos, setHorizonteAnos] = useState<number>(4);
  const [tasaPlusvalia, setTasaPlusvalia] = useState<number>(16.5); // Default NATIVA historical rate
  const [moneda, setMoneda] = useState<"MXN" | "USD">("MXN");

  // Contact form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    planInterest: "Plan 1 (1-2 Terrenos)",
    customLots: "1",
    negotiationNotes: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Synchronize dynamic defaults when lot count changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      customLots: numTerrenos.toString(),
      planInterest: numTerrenos >= 3 ? "Plan 2 (3 o más Terrenos)" : "Plan 1 (1-2 Terrenos)"
    }));
  }, [numTerrenos]);

  // Static pricing rules (provided in prompt)
  const VALOR_INICIAL_MXN = 1250000;
  const VALOR_INICIAL_USD = 75000;
  const TASA_CAMBIO = VALOR_INICIAL_MXN / VALOR_INICIAL_USD; // ~ 16.6667 MXN per USD

  // Financial calculations dependent on number of lots
  const isPlan2 = numTerrenos >= 3;
  const descuentoPorcentaje = isPlan2 ? 50 : 40;
  const enganchePorcentaje = isPlan2 ? 10 : 15;
  const tasaComisionPorcentaje = isPlan2 ? 7.0 : 6.5;

  const valorInicialIndividual = moneda === "MXN" ? VALOR_INICIAL_MXN : VALOR_INICIAL_USD;
  const valorInicialTotal = valorInicialIndividual * numTerrenos;
  
  const valorDescuentoIndividual = valorInicialIndividual * (descuentoPorcentaje / 100);
  const valorDescuentoTotal = valorDescuentoIndividual * numTerrenos;

  const valorPreventaIndividual = valorInicialIndividual - valorDescuentoIndividual;
  const valorPreventaTotal = valorPreventaIndividual * numTerrenos;

  const engancheTotal = valorPreventaTotal * (enganchePorcentaje / 100);
  const engancheIndividual = valorPreventaIndividual * (enganchePorcentaje / 100);

  const saldoFinanciarTotal = valorPreventaTotal - engancheTotal;
  const saldoFinanciarIndividual = valorPreventaIndividual - engancheIndividual;

  // Plan structured payments
  const numAnualidades = 3;
  const totalAnualidadesPagarPorTerreno = numAnualidades * 50000; // $150,000 pesos total in annuals
  const mensualidadesCount = 45;

  // Stated monthly payments from prompt
  const mensualidadStatedPlan1 = 10833.33; 
  const mensualidadStatedPlan2 = 12500.00;

  // Format monetary values beautifully
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(language === "es" ? "es-MX" : "en-US", {
      style: "currency",
      currency: moneda,
      maximumFractionDigits: 0
    }).format(val);
  };

  // Convert pesos reference to selected currency if needed
  const convertMXNToSelected = (pesos: number) => {
    if (moneda === "MXN") return pesos;
    return pesos / TASA_CAMBIO;
  };

  // Real-time compound appreciation calculation
  // Future Value = Present Value * (1 + rate)^years
  const valorFuturoIndividual = valorInicialIndividual * Math.pow(1 + (tasaPlusvalia / 100), horizonteAnos);
  const valorFuturoTotal = valorFuturoIndividual * numTerrenos;
  
  // Return on pre-sale acquisition profit + compound appreciation
  // Total profit = Future Value - Final Pre-sale purchase cost
  const retornoPlusvaliaTotal = valorFuturoTotal - valorPreventaTotal;
  const simpleROI = (retornoPlusvaliaTotal / valorPreventaTotal) * 100;

  // Advisor Commission computation
  // Plan 1: 15% downpayment ($112,500 over $750k). Commission 6.5% on downpayment = $7,312.50 per lot.
  // Plan 2: 10% downpayment ($187,500 over $1.875M for 3 lots). Commission 7.0% on downpayment = $13,125.00 total.
  const comisionBaseCalculo = engancheTotal;
  const comisionAsesorTotal = comisionBaseCalculo * (tasaComisionPorcentaje / 100);

  // Form submission handler
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.whatsapp) return;

    setFormLoading(true);

    const subjectText = language === "es" 
      ? `Cotización NATIVA - ${formData.name} (${numTerrenos} Terrenos)` 
      : `NATIVA Simulation - ${formData.name} (${numTerrenos} Lots)`;
    
    const bodyText = language === "es"
      ? `Resumen de Simulación de Inversión NATIVA:\n\n` +
        `Nombre: ${formData.name}\n` +
        `WhatsApp: ${formData.whatsapp}\n` +
        `Email: ${formData.email}\n` +
        `Rol: ${userRole === "asesor" ? "Asesor / Agente" : "Inversionista Directo"}\n` +
        `Número de Terrenos: ${numTerrenos}\n` +
        `Plan Seleccionado: ${isPlan2 ? "Plan 2 (3 o más Lotes - Descuento 50%)" : "Plan 1 (1-2 Lotes - Descuento 40%)"}\n` +
        `Moneda: ${moneda}\n` +
        `Inversión Total Estimada: ${formatCurrency(valorPreventaTotal)}\n` +
        `Enganche Requerido: ${formatCurrency(engancheTotal)} (${enganchePorcentaje}%)\n` +
        `Financiamiento a 48 Meses SIN INTERESES:\n` +
        ` - 3 Anualidades de ${formatCurrency(convertMXNToSelected(50000))} pesos c/u por terreno\n` +
        ` - 45 Mensualidades de ${formatCurrency(convertMXNToSelected(isPlan2 ? mensualidadStatedPlan2 : mensualidadStatedPlan1))} pesos c/u por terreno\n` +
        `Plusvalía Proyectada a ${horizonteAnos} años:\n` +
        ` - Valor Futuro del Portafolio: ${formatCurrency(valorFuturoTotal)}\n` +
        ` - Retorno de Plusvalía Neto: ${formatCurrency(retornoPlusvaliaTotal)} (ROI: ${simpleROI.toFixed(1)}%)\n` +
        (userRole === "asesor" ? `Comisión Proyectada para Asesor (${tasaComisionPorcentaje}%): ${formatCurrency(comisionAsesorTotal)}\n` : "") +
        `Notas Adicionales de Negociación: ${formData.negotiationNotes || "Ninguna"}\n\n` +
        `Elaborado en simulación bajo parámetros de preventa NATIVA 2026.`
      : `NATIVA Investment Simulation Details:\n\n` +
        `Name: ${formData.name}\n` +
        `WhatsApp: ${formData.whatsapp}\n` +
        `Email: ${formData.email}\n` +
        `User Profile: ${userRole === "asesor" ? "Advisor / Broker" : "Direct Investor"}\n` +
        `Number of Lots: ${numTerrenos}\n` +
        `Selected Plan: ${isPlan2 ? "Plan 2 (3+ Lots - 50% discount)" : "Plan 1 (1-2 Lots - 40% discount)"}\n` +
        `Currency Selection: ${moneda}\n` +
        `Total Estimated Purchase: ${formatCurrency(valorPreventaTotal)}\n` +
        `Down Payment required: ${formatCurrency(engancheTotal)} (${enganchePorcentaje}%)\n` +
        `48-Months Financing WITHOUT INTEREST:\n` +
        ` - 3 annual payments of ${formatCurrency(convertMXNToSelected(50000))} c/u per lot\n` +
        ` - 45 monthly payments of ${formatCurrency(convertMXNToSelected(isPlan2 ? mensualidadStatedPlan2 : mensualidadStatedPlan1))} c/u per lot\n` +
        `Appreciation projection over ${horizonteAnos} years:\n` +
        ` - Projected Future Value: ${formatCurrency(valorFuturoTotal)}\n` +
        ` - Projected Net Growth Profit: ${formatCurrency(retornoPlusvaliaTotal)} (ROI: ${simpleROI.toFixed(1)}%)\n` +
        (userRole === "asesor" ? `Projected Advisor Commission (${tasaComisionPorcentaje}%): ${formatCurrency(comisionAsesorTotal)}\n` : "") +
        `Custom Negotiation Notes: ${formData.negotiationNotes || "None"}\n\n` +
        `Structured via NATIVA Pre-Sale Interactive Tool 2026.`;

    const mailtoUrl = `mailto:ventas@nativaresidences.com?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;

    setTimeout(() => {
      setFormLoading(false);
      setFormSubmitted(true);
      window.location.href = mailtoUrl;
    }, 1200);
  };

  return (
    <div className="bg-bone text-offblack font-sans leading-relaxed selection:bg-gold selection:text-forest min-h-screen relative flex flex-col">
      
      {/* GLASS HEADER */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-forest/95 backdrop-blur-md border-b border-white/10 shadow-lg text-white transition-all py-3.5">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center">
          
          {/* Logo Brand with active flags */}
          <div className="flex items-center gap-3 md:gap-5">
            <a href="#simulador" className="flex items-center gap-3 group focus:outline-none" id="nativa-home-link">
              <img 
                src="https://i.imgur.com/y3regni.png" 
                alt="Nativa Logo" 
                className="h-10 w-auto object-contain transition-all duration-300 group-hover:rotate-12"
                id="header-nativa-logo"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="font-serif font-bold tracking-[0.25em] text-lg text-white group-hover:text-gold transition-colors leading-none">
                  NATIVA
                </span>
                <span className="text-[9px] uppercase tracking-widest text-gold/80 block mt-1 font-light">
                  {language === "es" ? "Residencias Ecológicas" : "Eco-Luxury Residences"}
                </span>
              </div>
            </a>
          </div>

          {/* Quick Stats Banner */}
          <div className="hidden lg:flex items-center gap-8 text-xs font-sans tracking-wide">
            <div className="flex items-center gap-2 border-r border-white/10 pr-6">
              <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
              <span className="text-white/60">{language === "es" ? "Fase 1" : "Phase 1"}:</span>
              <span className="text-gold font-bold">100 {language === "es" ? "Terrenos Preferenciales" : "Investor Lots"}</span>
            </div>
            <div className="flex items-center gap-2 border-r border-white/10 pr-6">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-emerald-400 font-bold">{language === "es" ? "SIN INTERESES" : "0% INTEREST"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-gold" />
              <span className="text-white/80">Quintana Roo, {new Date().getFullYear()}</span>
            </div>
          </div>

          {/* Controls Right */}
          <div className="flex items-center gap-4">
            
            {/* Currency selector widget */}
            <div className="flex bg-black/30 rounded-none border border-white/10 p-0.5 text-[10px] font-mono">
              <button 
                onClick={() => setMoneda("MXN")}
                className={`px-2.5 py-1 tracking-wider transition-all duration-200 uppercase font-semibold ${
                  moneda === "MXN" ? "bg-gold text-forest font-bold" : "text-white/60 hover:text-white"
                }`}
              >
                MXN
              </button>
              <button 
                onClick={() => setMoneda("USD")}
                className={`px-2.5 py-1 tracking-wider transition-all duration-200 uppercase font-semibold ${
                  moneda === "USD" ? "bg-gold text-forest font-bold" : "text-white/60 hover:text-white"
                }`}
              >
                USD
              </button>
            </div>

            {/* Bilingual Switcher flags */}
            <div className="flex items-center gap-2.5 bg-black/20 p-1.5 border border-white/10">
              <button 
                onClick={() => setLanguage("es")} 
                className={`transition-all duration-300 hover:scale-105 cursor-pointer focus:outline-none flex items-center p-0.5 rounded-sm ${
                  language === "es" ? "ring-1 ring-gold opacity-100 scale-105" : "opacity-40"
                }`}
                title="Español"
              >
                <img src="https://flagcdn.com/w40/mx.png" alt="MX Flag" className="w-5.5 h-3.5 object-cover rounded-[1px]" />
              </button>
              <button 
                onClick={() => setLanguage("en")} 
                className={`transition-all duration-300 hover:scale-105 cursor-pointer focus:outline-none flex items-center p-0.5 rounded-sm ${
                  language === "en" ? "ring-1 ring-gold opacity-100 scale-105" : "opacity-40"
                }`}
                title="English"
              >
                <img src="https://flagcdn.com/w40/us.png" alt="USA Flag" className="w-5.5 h-3.5 object-cover rounded-[1px]" />
              </button>
            </div>
            
          </div>
        </div>
      </header>

      {/* 1. HERO SPOTLIGHT & HEADLINE INTRO */}
      <section className="relative bg-forest text-white overflow-hidden py-16 lg:py-24 border-b border-white/5">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://i.imgur.com/fZjr6S2.jpeg" 
            alt="Nativa Eco Reserves"
            className="w-full h-full object-cover opacity-25 object-center mix-blend-luminosity filter contrast-125 select-none"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/80 to-forest/40" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col justify-center text-center items-center">
          <span className="text-gold text-xs uppercase tracking-[0.3em] font-bold block mb-4 border border-gold/30 px-3.5 py-1.5 bg-gold/5 rounded-none animate-pulse">
            {language === "es" ? "S I N   I N T E R E S E S" : "Z E R O   I N T E R E S T"}
          </span>
          
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-white mb-6 leading-none max-w-5xl">
            {language === "es" ? "Simulador de Inversión" : "Investment Simulator"}{" "}
            <span className="italic font-light text-gold block mt-2">N A T I V A</span>
          </h1>

          <p className="font-sans text-sm md:text-lg text-white/80 max-w-3xl font-light leading-relaxed mb-8">
            {language === "es" 
              ? "Prontuario exclusivo de plusvalía, precios preferenciales de preventa de lotes de 1,000 m² y retornos de inversión garantizados por el auge del Caribe Mexicano en Quintana Roo."
              : "Exclusive registry for capital growth, preferential pre-sale lot prices starting from 10,000 sqft, and high investment return guaranteed by the rising Quintana Roo real estate market."}
          </p>

          {/* Quick badges under headline */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-2 text-xs font-sans tracking-widest text-[#dbcbb0]">
            <span className="flex items-center gap-1.5">
              <Trees className="w-4 h-4 text-gold" />
              <span>1000 M² SUITE POR TERRENO</span>
            </span>
            <span className="w-2-2 h-1.5 bg-white/20 hidden sm:block">•</span>
            <span className="flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-gold" />
              <span>48 MESES PLAZO FIJO</span>
            </span>
            <span className="w-2-2 h-1.5 bg-white/20 hidden sm:block">•</span>
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-gold" />
              <span>PREVENTA INICAL EXCLUSIVA</span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. THE CORE INTERACTIVE SIMULATOR (INVESTOR & ADVISOR DUAL PLATFORM) */}
      <section id="simulador" className="py-16 md:py-24 bg-bone relative">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* COLUMN LEFT: INTERACTIVE SLIDERS & CONTROLS */}
            <div className="lg:col-span-5 bg-white p-6 md:p-8 border border-forest/15 shadow-xl space-y-8 rounded-none">
              
              {/* Header Box */}
              <div className="border-b border-forest/10 pb-5">
                <span className="text-[10px] uppercase text-clay font-bold tracking-widest block mb-1">
                  {language === "es" ? "CALCULADORA DE PATRIMONIO" : "RESERVE ACCOUNT MODEL"}
                </span>
                <h3 className="font-serif text-2xl text-forest font-semibold">
                  {language === "es" ? "Ajuste sus Parámetros" : "Customize Your Scenario"}
                </h3>
                <p className="text-xs text-[#5d4201] font-light mt-1">
                  {language === "es" ? "Configure su volumen de adquisición para ver descuentos automáticos." : "Adjust the slider to discover volume discounts and payment structures."}
                </p>
              </div>

              {/* Parameter 1: Number of lots (Terrenos) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs tracking-wider uppercase font-bold text-forest">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-gold" />
                    {language === "es" ? "Superficie total" : "Total Lots to Purchase"}
                  </span>
                  <span className="text-sm font-mono text-gold font-bold px-2.5 py-0.5 bg-forest text-gold">
                    {numTerrenos} {numTerrenos === 1 ? (language === "es" ? "Terreno (1000m²)" : "Lot") : (language === "es" ? "Terrenos" : "Lots")} ({numTerrenos * 1000} m²)
                  </span>
                </div>
                
                {/* Visual Segment Picker for premium feel */}
                <div className="grid grid-cols-5 gap-2 pt-1.5">
                  {[1, 2, 3, 5, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => setNumTerrenos(num)}
                      className={`py-2 text-xs font-mono font-bold transition-all border ${
                        numTerrenos === num 
                          ? "bg-forest hover:bg-forest text-gold border-gold" 
                          : "bg-bone/40 hover:bg-gold/10 text-forest/70 border-forest/10"
                      }`}
                    >
                      {num} {num === 1 ? "Lot" : "Lots"}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <input 
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={numTerrenos}
                    onChange={(e) => setNumTerrenos(parseInt(e.target.value))}
                    className="w-full accent-gold h-1 bg-forest/10 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-forest/50 font-mono mt-1">
                    <span>1 Terreno</span>
                    <span>5 Terrenos</span>
                    <span>10 Terrenos</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Notification of Plan activated */}
              <div className={`p-4 border transition-colors ${
                isPlan2 
                  ? "bg-emerald-50/70 border-emerald-200 text-emerald-900" 
                  : "bg-amber-50/70 border-amber-200 text-amber-900"
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Flame className={`w-4.5 h-4.5 ${isPlan2 ? "text-emerald-600" : "text-amber-600"}`} />
                  <span className="text-xs font-bold uppercase tracking-widest font-sans">
                    {isPlan2 ? (language === "es" ? "¡PLAN 2 SELECCIONADO (CON 50% DESCUENTO!)" : "PLAN 2 ENABLED (50% OFF!)") : (language === "es" ? "PLAN 1 SELECCIONADO (CON 40% DESCUENTO)" : "PLAN 1 ENABLED (40% OFF)")}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-95">
                  {isPlan2 
                    ? (language === "es" 
                        ? `Al adquirir 3 o más terrenos, obtiene un descuento masivo del 50%. Enganche del 10% y excelente financiamiento flexible de 48 meses.`
                        : `Purchasing 3 or more lots activates a massive 50% pre-sale discount. Requires only 10% down payment over 4-years deferred.`)
                    : (language === "es"
                        ? `Por la adquisición de 1 o 2 terrenos recibe un descuento directo del 40%. Enganche preferencial del 15% y 48 cuotas mensuales.`
                        : `Acquiring 1 or 2 lots secures a high introductory 40% pre-sale discount, and requires only 15% initial payment.`)}
                </p>
              </div>

              {/* Parameter 2: Years Horizon (Plazo de retención) */}
              <div className="space-y-2 border-t border-forest/10 pt-5">
                <div className="flex justify-between items-center text-xs tracking-wider uppercase font-bold text-forest">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gold" />
                    {language === "es" ? "Horizonte de Maduración" : "Holding Period Horizon"}
                  </span>
                  <span className="font-mono text-xs font-bold text-forest">
                    {horizonteAnos} {horizonteAnos === 1 ? (language === "es" ? "Año" : "Year") : (language === "es" ? "Años" : "Years")}
                  </span>
                </div>
                <input 
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={horizonteAnos}
                  onChange={(e) => setHorizonteAnos(parseInt(e.target.value))}
                  className="w-full accent-gold h-1 bg-forest/10 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-forest/50 font-mono">
                  <span>1 Año</span>
                  <span>4 Años (Recomendado)</span>
                  <span>8 Años</span>
                </div>
              </div>

              {/* Parameter 3: Compound Appreciation (Tasa de plusvalía) */}
              <div className="space-y-2 border-t border-forest/10 pt-5">
                <div className="flex justify-between items-center text-xs tracking-wider uppercase font-bold text-forest">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-gold" />
                    {language === "es" ? "Plusvalía Anual Compuesta" : "Estimated Annual Appreciation Rate"}
                  </span>
                  <span className="font-mono text-xs font-bold text-gold bg-gold/10 px-1.5 py-0.5 rounded-sm">
                    {tasaPlusvalia}% {language === "es" ? "anual" : "CAGR"}
                  </span>
                </div>
                <input 
                  type="range"
                  min={8}
                  max={24}
                  step={0.5}
                  value={tasaPlusvalia}
                  onChange={(e) => setTasaPlusvalia(parseFloat(e.target.value))}
                  className="w-full accent-gold h-1 bg-forest/10 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-forest/50 font-mono">
                  <span>8% {language === "es" ? "Conservador" : "Conservative"}</span>
                  <span className="text-gold font-bold">16.5% ({language === "es" ? "Histórico Nativa" : "Nativa Normative"})</span>
                  <span>24% {language === "es" ? "Agresivo" : "Aggressve"}</span>
                </div>
              </div>

              {/* ADVISOR VS INVESTOR TOGGLE PANEL */}
              <div className="border-t border-forest/10 pt-6">
                <label className="block text-[11px] uppercase tracking-widest text-forest/60 font-bold mb-3 text-center">
                  {language === "es" ? "EXPERIENCIA DE VISUALIZACIÓN PERSONALIZADA" : "CUSTOM SCREEN WORKSPACE"}
                </label>
                <div className="grid grid-cols-2 bg-bone border border-forest/10 p-1 rounded-none">
                  <button
                    onClick={() => setUserRole("inversionista")}
                    className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-sans uppercase tracking-widest font-bold transition-all cursor-pointer ${
                      userRole === "inversionista" 
                        ? "bg-forest text-gold font-bold shadow-md" 
                        : "text-forest/70 hover:text-forest"
                    }`}
                  >
                    <Users className="w-4.5 h-4.5" />
                    <span>{language === "es" ? "Inversionista" : "Investor View"}</span>
                  </button>
                  <button
                    onClick={() => setUserRole("asesor")}
                    className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-sans uppercase tracking-widest font-bold transition-all cursor-pointer ${
                      userRole === "asesor" 
                        ? "bg-forest text-gold font-bold shadow-md" 
                        : "text-forest/70 hover:text-forest"
                    }`}
                  >
                    <Sliders className="w-4.5 h-4.5" />
                    <span>{language === "es" ? "Soy Asesor" : "Advisor view"}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* COLUMN RIGHT: REAL-TIME INVESTMENT METRICS & GAIN BREAKDOWNS */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* PRIMARY CALCULATION METRICS CONTAINER */}
              <div className="bg-forest text-white p-6 md:p-10 border border-gold/15 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10 space-y-8">
                  
                  {/* Row 1: Stated Initial Asset Values versus Presale price */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-white/10">
                    <div>
                      <span className="text-[10px] text-gold uppercase tracking-wider block font-bold mb-1">
                        {language === "es" ? "VALOR ORIGINAL SIN DESCUENTO" : "ORIGINAL COMBINED BOOK VALUE"}
                      </span>
                      <p className="text-xl md:text-2xl font-mono text-white/50 line-through">
                        {formatCurrency(valorInicialTotal)}
                      </p>
                      <p className="text-xs text-white/40 mt-1 font-light">
                        {language === "es" ? `${numTerrenos} terreno(s) a ${formatCurrency(valorInicialIndividual)} c/u` : `${numTerrenos} lot(s) at ${formatCurrency(valorInicialIndividual)} c/u`}
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-4 relative">
                      <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest block mb-1">
                        {language === "es" ? `¡VALOR PREVENTA DE ADQUISICIÓN!` : `PRE-SALE SAVED PRICE`}
                      </span>
                      <p className="text-3xl font-serif text-gold font-semibold tracking-tight">
                        {formatCurrency(valorPreventaTotal)}
                      </p>
                      <span className="absolute top-2.5 right-3 bg-red-600 text-[9px] text-white font-mono font-bold px-1.5 py-0.5 uppercase tracking-widest">
                        -{descuentoPorcentaje}% OFF
                      </span>
                      <p className="text-[11px] text-white/70 mt-1 font-light">
                        {language === "es" 
                          ? `Ahorro neto de ${formatCurrency(valorDescuentoTotal)} | ${formatCurrency(valorPreventaIndividual)} c/u` 
                          : `Saved ${formatCurrency(valorDescuentoTotal)} net of original | ${formatCurrency(valorPreventaIndividual)} each`}
                      </p>
                    </div>
                  </div>

                  {/* Row 2: Payment Milestones */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 pb-6 border-b border-white/10">
                    
                    {/* Engagement / Downpayment */}
                    <div>
                      <span className="text-[10px] text-gold uppercase tracking-wider block font-semibold mb-1">
                        {language === "es" ? `PAGO INICIAL / ENGANCHE` : `DOWNPAYMENT AMOUNT`}
                      </span>
                      <p className="text-2xl font-serif text-white font-bold leading-none">
                        {formatCurrency(engancheTotal)}
                      </p>
                      <p className="text-[11px] text-emerald-400 font-bold mt-1.5 font-sans tracking-wide">
                        {enganchePorcentaje}% {language === "es" ? "Del Valor de Venta" : "Of selling price"}
                      </p>
                    </div>

                    {/* Deferred Balance */}
                    <div>
                      <span className="text-[10px] text-gold uppercase tracking-wider block font-semibold mb-1">
                        {language === "es" ? "SALDO NETO A FINANCIAR" : "DEFERRED DEBT BALANCE"}
                      </span>
                      <p className="text-2xl font-serif text-white/90 font-semibold leading-none">
                        {formatCurrency(saldoFinanciarTotal)}
                      </p>
                      <p className="text-[11px] text-white/50 mt-1.5 leading-none">
                        {language === "es" ? "Amortizado a 48 meses" : "Covered over 4-year cycle"}
                      </p>
                    </div>

                    {/* Interest Level */}
                    <div>
                      <span className="text-[10px] text-gold uppercase tracking-wider block font-semibold mb-1">
                        {language === "es" ? "COMISIÓN POR INTERÉS" : "FINANCE FEE COST"}
                      </span>
                      <p className="text-2xl font-serif text-emerald-400 font-extrabold leading-none uppercase tracking-wide">
                        {language === "es" ? "SIN INTERESES" : "No Interest"}
                      </p>
                      <p className="text-[11px] text-emerald-300 font-light mt-1.5">
                        {language === "es" ? "0% costo de financiamiento" : "0% total hidden cost"}
                      </p>
                    </div>

                  </div>

                  {/* Row 3: Structured Installment Schedule */}
                  <div className="bg-black/35 p-5 border border-white/10">
                    <h5 className="text-[11px] uppercase text-gold tracking-widest font-bold mb-3 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      {language === "es" ? "ESTRUCTURA DE FINANCIAMIENTO (S I N   I N T E R E S E S)" : "48-MONTH AMORTIZATION PROGRAM"}
                    </h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm font-sans pt-2">
                      <div className="border-r border-white/10 pr-4 space-y-1">
                        <p className="text-white/60 text-xs">
                          {language === "es" ? "3 Anualidades (Sugeridas):" : "3 Annual Installments:"}
                        </p>
                        <p className="text-xl font-mono text-white font-bold">
                          {formatCurrency(convertMXNToSelected(50000))}{" "}
                          <span className="text-xs text-white/50 font-normal">c/u por terreno</span>
                        </p>
                        <p className="text-[10px] text-white/40 font-light mt-1">
                          {language === "es" ? "* Personalizable según adquisición." : "* Can be custom rescheduled with investors."}
                        </p>
                      </div>

                      <div className="space-y-1 pl-0 md:pl-2">
                        <p className="text-white/60 text-xs">
                          {language === "es" ? "45 Mensualidades de de:" : "45 Monthly Payments of:"}
                        </p>
                        <p className="text-xl font-mono text-gold font-bold">
                          {formatCurrency(convertMXNToSelected(isPlan2 ? mensualidadStatedPlan2 : mensualidadStatedPlan1))}{" "}
                          <span className="text-xs text-white/50 font-normal">c/u por terreno</span>
                        </p>
                        <p className="text-[10px] text-white/40 font-light mt-1">
                          {language === "es" ? "* Exacto al balance diferido del plan." : "* Equivalent to user plan structure rules."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Appreciation & Return on Investment Projections */}
                  <div className="pt-4 space-y-4">
                    <span className="text-[11px] text-gold uppercase tracking-[0.2em] block font-bold">
                      {language === "es" ? "EVALUACIÓN DE RETORNO Y PLUSVALÍA DE SU PATRIMONIO" : "PROJECTED PORTFOLIO APPRECIATION EVALUATION"}
                    </span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                      
                      {/* Asset value future */}
                      <div className="bg-white/5 p-4 border border-white/10">
                        <span className="text-[10px] text-white/55 block tracking-wide uppercase mb-1">
                          {language === "es" ? `Valor Futuro en ${horizonteAnos} años` : `Projected Value in ${horizonteAnos} yrs`}
                        </span>
                        <strong className="text-lg md:text-xl font-mono text-white block">
                          {formatCurrency(valorFuturoTotal)}
                        </strong>
                        <span className="text-[10px] text-white/40 font-light block mt-1">
                          {language === "es" ? `Tasa anual de +${tasaPlusvalia}%` : `Under compound +${tasaPlusvalia}% rate`}
                        </span>
                      </div>

                      {/* Net Gain */}
                      <div className="bg-gold/10 p-4 border border-gold/20">
                        <span className="text-[10px] text-gold block tracking-wide uppercase mb-1">
                          {language === "es" ? "Ganancia de Plusvalía Neta" : "Net Appreciation Profit"}
                        </span>
                        <strong className="text-lg md:text-xl font-mono text-gold block">
                          +{formatCurrency(retornoPlusvaliaTotal)}
                        </strong>
                        <span className="text-[10px] text-gold/60 font-light block mt-1">
                          {language === "es" ? "Ahorro pre-venta + plusvalía" : "Buy price asset growth profit"}
                        </span>
                      </div>

                      {/* Yield ROI */}
                      <div className="bg-emerald-950 p-4 border border-emerald-800 flex flex-col justify-center">
                        <span className="text-[10px] text-emerald-300 block tracking-wide uppercase mb-1">
                          {language === "es" ? "Retorno s/ Inversión Total" : "Return on Capital (ROI)"}
                        </span>
                        <strong className="text-2xl font-mono text-emerald-400 block font-bold leading-none">
                          {simpleROI.toFixed(1)}%
                        </strong>
                        <span className="text-[10px] text-emerald-300/60 font-light block mt-2">
                          {language === "es" ? `Multiplica por ${(valorFuturoTotal/valorPreventaTotal).toFixed(2)}x` : `Growth of ${(valorFuturoTotal/valorPreventaTotal).toFixed(2)}x`}
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* ADVISOR SPECIFIC REVENUE OUTCOMES (IF TOGGLED ACTIVE) */}
                  <AnimatePresence>
                    {userRole === "asesor" && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-amber-950/90 border border-amber-600/50 p-6 overflow-hidden space-y-4"
                      >
                        <h4 className="text-xs uppercase tracking-widest text-gold font-bold flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-gold animate-bounce" />
                          {language === "es" ? "ESQUEMA DE COMISIONES PARA ASESORES (INTERNOS & EXTERNOS)" : "ADVISOR DIRECT COMMISSION CALCULATION"}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-white/90">
                          <div>
                            <p className="text-white/60">{language === "es" ? "Base del Pago Inicial del Inversionista:" : "Investor Downpayment Base:"}</p>
                            <p className="text-base font-mono text-white font-bold mt-1">
                              {formatCurrency(comisionBaseCalculo)}{" "}
                              <span className="text-white/50 text-[10px] font-normal font-sans">
                                ({enganchePorcentaje}% del Valor de Preventa de {numTerrenos} Terrenos)
                              </span>
                            </p>
                          </div>

                          <div>
                            <p className="text-white/60">{language === "es" ? "Comisión Asignada al Rol:" : "Broker Commission Yield:"}</p>
                            <p className="text-xl font-mono text-emerald-400 font-extrabold mt-1">
                              {formatCurrency(comisionAsesorTotal)}{" "}
                              <span className="text-white/50 text-[11px] font-normal font-sans whitespace-nowrap">
                                (Al {tasaComisionPorcentaje}% de comisión)
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/10 text-[11px] text-white/80 leading-relaxed font-light font-sans space-y-2">
                          <p>
                            {language === "es" 
                              ? `💡 El porcentaje depende del volumen de adquisición. Plan 1 (6.5% sobre pago inicial de $112,500.00 pesos c/u), Plan 2 (7% sobre pago inicial de $187,500.00 pesos por cada combo de 3 terrenos).`
                              : `💡 Commission is verified as follows: Plan 1 (6.5% on downpayment of $112,500.00 MXN per lot), Plan 2 (7.0% on combined downpayment of $187,500.00 MXN per 3 of lots).`}
                          </p>
                          <p className="italic text-gold">
                            {language === "es"
                              ? `Elaboró: Ignacio Gallo García (Junio 2026)`
                              : `Structured by: Ignacio Gallo García (June 2026)`}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Footnotes Disclaimer */}
                  <p className="text-[10px] text-white/40 italic leading-normal font-light">
                    {language === "es" 
                      ? "*Nota: Cálculos proyectados compuestos de plusvalía basados en coeficiente histórico promedio de Quintana Roo (16.5% CAGR). La flexibilidad de diferimiento del pago inicial e intereses está sujeta a negociación formal con el inversionista primario de NATIVA."
                      : "*Note: Portfolio projections calculated based on historical coefficients for the Cancun real estate corridor (16.5% annual growth CAGR rate). Exact final contract configurations may vary according to negotiations and formal client terms."}
                  </p>

                </div>
              </div>

              {/* QUICK CALL TO ACTION MODULE */}
              <div className="bg-white p-6 border border-forest/10 space-y-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="font-serif text-lg text-forest font-semibold">
                    {language === "es" ? "¿Desea formalizar este escenario simulado?" : "Ready to Lock In This Pre-Sale Pricing?"}
                  </h4>
                  <p className="text-xs text-offblack/60 font-light leading-relaxed mt-1">
                    {language === "es" 
                      ? "Guarde o envíe esta cotización personalizada directamente a nuestro equipo de ventas." 
                      : "Proceed directly to download a copy of the high-res technical catalog and lot plan."}
                  </p>
                </div>
                <a 
                  href="#contacto-simulacion"
                  className="bg-gold text-forest py-3 px-6 font-sans uppercase font-bold tracking-widest text-[11px] hover:bg-forest hover:text-gold transition-all duration-300 text-center whitespace-nowrap cursor-pointer shadow-sm"
                >
                  {language === "es" ? "GUARDAR COTIZACIÓN" : "CONFIRM & EXPORT"}
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 3. BENTO PLAN DE INVERSIÓN & PRECIOS DETALLADOS (EXPOLAYATE CON ICONOS) */}
      <section className="py-20 md:py-28 bg-[#FCFBF7] border-t border-b border-forest/10" id="planes-info">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 space-y-16">
          
          {/* Section Header */}
          <div className="text-center max-w-4xl mx-auto">
            <span className="text-gold text-xs uppercase tracking-[0.25em] font-bold block mb-4">
              {language === "es" ? "PLAN EXCLUSIVO PARA INVERSIONISTAS" : "EXCLUSIVE PRE-SALE PORTFOLIO PROGRAM"}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-forest leading-none">
              {language === "es" ? "Oportunidades de Preventa Únicas" : "Pre-Sale Opportunities & Price Dossier"}
            </h2>
            <div className="w-20 h-[1.5px] bg-gold mx-auto my-6" />
            <p className="font-sans text-sm md:text-base text-offblack/70 leading-relaxed font-light">
              {language === "es" 
                ? "NATIVA presenta sus planes oficiales preferenciales para la asignación de los primeros 100 terrenos de 1000m² en la exuberante selva de Quintana Roo. El valor de lista inicial es de $1,250,000.00 pesos ($75,000.00 USD), aplicando descuentos históricos:"
                : "Official promotional conditions for the initial pre-sale reservation of 100 private pieces of paradise (10,763 sqft parcel units). The base valuation starts at $75,000 USD ($1,250,000 MXN), offering unprecedented pre-sale discount levels."}
            </p>
          </div>

          {/* Plan Grid Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* PLAN 1 WORKINGS */}
            <div className="bg-white border border-forest/15 p-6 md:p-10 hover:shadow-2xl transition-all relative flex flex-col justify-between group">
              
              <div className="space-y-6">
                
                {/* Header Card */}
                <div className="flex justify-between items-start border-b border-forest/10 pb-6">
                  <div>
                    <span className="bg-forest/5 text-forest text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 mb-2.5 inline-block">
                      {language === "es" ? "ADQUISICIÓN DE 1 A 2 TERRENOS" : "INDIVIDUAL YIELD (1 TO 2 LOTS)"}
                    </span>
                    <h3 className="font-serif text-3xl text-forest font-bold mb-1">
                      {language === "es" ? "Plan Uno (1)" : "Investment Plan One (1)"}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-mono text-gold font-bold">40% OFF</span>
                    <p className="text-[10px] text-offblack/50 uppercase tracking-widest font-semibold">{language === "es" ? "Descuento Directo" : "Direct Discount"}</p>
                  </div>
                </div>

                {/* Pricing Core List */}
                <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <span className="text-offblack/50 tracking-wide uppercase block text-[10px]">{language === "es" ? "Valor de Lista" : "List Value"}</span>
                    <strong className="text-base text-offblack/80 font-mono line-through block">{formatCurrency(valorInicialIndividual)}</strong>
                  </div>
                  <div>
                    <span className="text-gold tracking-wide uppercase block text-[10px]">{language === "es" ? "Valor de Preventa" : "Preferential Price"}</span>
                    <strong className="text-xl text-forest font-bold font-serif block">{formatCurrency(moneda === "MXN" ? 750000 : 750000 / TASA_CAMBIO)}</strong>
                  </div>
                </div>

                <div className="w-10 h-[1px] bg-forest/20 my-2" />

                {/* Bullet steps with icons */}
                <div className="space-y-4 font-sans text-xs">
                  
                  {/* Step 1 */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0 border border-gold/20">
                      <Percent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-forest font-bold uppercase text-[10px] tracking-wider">
                        {language === "es" ? "PAGO INICIAL INTEGRADO" : "DEPOSIT LEVEL"}
                      </h4>
                      <p className="text-offblack/70 mt-0.5 leading-relaxed">
                        {language === "es" 
                          ? `15% de enganche inicial equivalente a ${formatCurrency(moneda === "MXN" ? 112500 : 112500 / TASA_CAMBIO)} pesos.`
                          : `15% entry check amounting to equivalent of $6,750 USD.`}
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0 border border-gold/20">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-forest font-bold uppercase text-[10px] tracking-wider">
                        {language === "es" ? "CRÉDITO DIRECTO DE 4 AÑOS" : "FINANCE TIMELINE"}
                      </h4>
                      <p className="text-offblack/70 mt-0.5 leading-relaxed">
                        {language === "es" 
                          ? `Saldo a financiar de ${formatCurrency(moneda === "MXN" ? 637500 : 637500 / TASA_CAMBIO)} pesos sin intereses a liquidar en 48 meses.`
                          : `Outstanding debt of $38,250 USD financed interest-free over 48 calendar months.`}
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0 border border-gold/20">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-forest font-bold uppercase text-[10px] tracking-wider">
                        {language === "es" ? " MENSUALIDADES Y ANUALIDADES" : "MONTHLY & ANNUAL COUPLING"}
                      </h4>
                      <p className="text-offblack/70 mt-0.5 leading-relaxed">
                        {language === "es" 
                          ? `3 anualidades sugeridas de ${formatCurrency(moneda === "MXN" ? 50000 : 50000 / TASA_CAMBIO)} y 45 mensualidades fijas de ${formatCurrency(moneda === "MXN" ? 10833.33 : 10833.33 / TASA_CAMBIO)} pesos.`
                          : `3 negotiable annual check-ins of $3,000 USD and 45 fixed monthly sums of ~$650 USD.`}
                      </p>
                    </div>
                  </div>

                </div>

              </div>
              
              <div className="pt-6 border-t border-forest/10 mt-8 text-[11px] text-[#5d4201] italic flex items-center gap-1.5">
                <ShieldCheck className="w-4.5 h-4.5 text-gold shrink-0" />
                <span>{language === "es" ? "Ideal para inversiones de patrimonio familiar." : "Excellent asset class configuration for secure generational inheritance."}</span>
              </div>

            </div>

            {/* PLAN 2 WORKINGS */}
            <div className="bg-[#1F2E1F] text-white border border-gold/30 p-6 md:p-10 hover:shadow-2xl transition-all relative flex flex-col justify-between group">
              <div className="absolute top-0 right-0 bg-gold text-forest text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                {language === "es" ? "SÚPER PREFERENCIAL" : "MAX SAVINGS DEAL"}
              </div>

              <div className="space-y-6">
                
                {/* Header Card */}
                <div className="flex justify-between items-start border-b border-white/10 pb-6">
                  <div>
                    <span className="bg-gold/10 text-gold text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 mb-2.5 inline-block border border-gold/20">
                      {language === "es" ? "ADQUISICIÓN DE 3 O MÁS TERRENOS" : "PORTFOLIO YIELD (3+ LOTS)"}
                    </span>
                    <h3 className="font-serif text-3xl text-white font-bold mb-1">
                      {language === "es" ? "Plan Dos (2)" : "Investment Plan Two (2)"}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-mono text-gold font-bold">50% OFF</span>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-semibold">{language === "es" ? "A Mitad de Precio" : "Half Price"}</p>
                  </div>
                </div>

                {/* Pricing Core List */}
                <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <span className="text-white/50 tracking-wide uppercase block text-[10px]">{language === "es" ? "Valor de Lista" : "List Value"}</span>
                    <strong className="text-base text-white/40 font-mono line-through block">{formatCurrency(valorInicialIndividual)}</strong>
                  </div>
                  <div>
                    <span className="text-gold tracking-wide uppercase block text-[10px]">{language === "es" ? "Valor de Preventa" : "Preferential Price"}</span>
                    <strong className="text-xl text-gold font-bold font-serif block">{formatCurrency(moneda === "MXN" ? 625000 : 625000 / TASA_CAMBIO)}</strong>
                  </div>
                </div>

                <div className="w-10 h-[1px] bg-white/20 my-2" />

                {/* Bullet steps with icons */}
                <div className="space-y-4 font-sans text-xs">
                  
                  {/* Step 1 */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0 border border-gold/20">
                      <Percent className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-gold font-bold uppercase text-[10px] tracking-wider">
                        {language === "es" ? "PAGO INICIAL MINIMIZADO" : "DEPOSIT LEVEL"}
                      </h4>
                      <p className="text-white/80 mt-0.5 leading-relaxed">
                        {language === "es" 
                          ? `10% de enganche inicial equivalente a $62,500.00 pesos por terreno.`
                          : `Only 10% down payment equivalent to exact sum of $3,750 USD per lot.`}
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0 border border-gold/20">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-gold font-bold uppercase text-[10px] tracking-wider">
                        {language === "es" ? "CRÉDITO FLEXIBLE DE 4 AÑOS" : "FINANCE TIMELINE"}
                      </h4>
                      <p className="text-white/80 mt-0.5 leading-relaxed">
                        {language === "es" 
                          ? `Saldo de $562,500.00 pesos sin intereses diferido a un plazo cómodo de 48 meses.`
                          : `Outstanding debt of $33,750 USD amortized interest-free over 4 years.`}
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0 border border-gold/20">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-gold font-bold uppercase text-[10px] tracking-wider">
                        {language === "es" ? "MENSUALIDADES CONFORT" : "INSTALLMENT DEPLOYMENT"}
                      </h4>
                      <p className="text-white/80 mt-0.5 leading-relaxed">
                        {language === "es" 
                          ? `3 anualidades fijas de $50,000.00 y 45 mensualidades consecutivas de $12,500.00 pesos cada uno.`
                          : `3 annual deposits of $3,000 USD and 45 low monthly installments of $750 USD.`}
                      </p>
                    </div>
                  </div>

                </div>

              </div>
              
              <div className="pt-6 border-t border-white/10 mt-8 text-[11px] text-emerald-300 italic flex items-center gap-1.5">
                <Flame className="w-4.5 h-4.5 text-gold shrink-0" />
                <span>{language === "es" ? "Especial para portafolios corporativos e inversionistas de alto rendimiento." : "Perfect blueprint configuration for institutional developers and capital managers."}</span>
              </div>

            </div>

          </div>

          {/* TWO DUAL EXPOLAYED INFORMATION PANELS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 font-sans">
            
            {/* PANEL 1: IMPORTANT FLEXIBILITY NOTE */}
            <div className="bg-amber-50/50 border border-amber-200/60 p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-2.5 text-amber-800">
                <Info className="w-5.5 h-5.5 shrink-0" />
                <h4 className="text-xs uppercase tracking-widest font-bold">
                  {language === "es" ? "NOTAS DE FLEXIBILIDAD EN PAGO INICIAL Y PLAZOS" : "PAGO INICIAL & INSTALLMENT FLEXIBILITY GUIDELINES"}
                </h4>
              </div>
              <p className="text-xs text-amber-900/80 leading-relaxed font-light">
                {language === "es" ? (
                  <>
                    El pago del <strong>enganche o inversión inicial</strong> se podrá negociar y parcializar en algunos casos específicos de acuerdo con el perfil del inversionista a un <strong>plazo máximo de tres (3) meses</strong>.
                    <br /><br />
                    Asimismo, las <strong>anualidades fijas y el plan de mensualidades</strong> se podrán reconfigurar de manera mutua de acuerdo al volumen total de adquisición de la operación.
                  </>
                ) : (
                  <>
                    The initial <strong>downpayment or deposit check</strong> may be comfortably partialized or deferred upon request <strong>over a maximum horizon of three (3) months</strong> in select negotiations.
                    <br /><br />
                    Annual check-ins and monthly installments can be modified collaboratively based on the ultimate size of your parcel portfolio acquisition.
                  </>
                )}
              </p>
            </div>

            {/* PANEL 2: ADVISOR & BROKER COMMISSIONS PANEL */}
            <div className="bg-emerald-50/50 border border-emerald-200/60 p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-2.5 text-emerald-800">
                <Users className="w-5.5 h-5.5 shrink-0" />
                <h4 className="text-xs uppercase tracking-widest font-bold">
                  {language === "es" ? "MONTO DE COMISIÓN PARA ASESORES (INTERNOS & EXTERNOS)" : "ADVISOR & REAL ESTATE BROKER INCENTIVES"}
                </h4>
              </div>
              <p className="text-xs text-emerald-900/80 leading-relaxed font-light">
                {language === "es" ? (
                  <>
                    Se tomará como base de cálculo el plan de adquisición y enganche aportado de la siguiente manera:
                    <br /><br />
                    • <strong className="text-emerald-950">Plan 1</strong>: Comisión asignada al <strong>6.5%</strong>. Pago inicial de $112,500.00 MXN resulta en una comisión de <strong>$7,312.50 pesos</strong> por cada lote vendido.
                    <br />
                    • <strong className="text-emerald-950">Plan 2</strong>: Comisión asignada al <strong>7.0%</strong>. Pago inicial para 3 terrenos de $187,500.00 MXN resulta en una comisión de <strong>$13,125.00 pesos</strong> directos.
                  </>
                ) : (
                  <>
                    Sales broker commission payouts are computed based on the exact down payment deposited by the end-client:
                    <br /><br />
                    • <strong>Plan 1 (1-2 Lots)</strong>: <strong>6.5% Broker Yield</strong>. An initial payment of $112,500 MXN generates a premium payout of <strong>$7,312.50 MXN</strong> per slot.
                    <br />
                    • <strong>Plan 2 (3+ Lots)</strong>: <strong>7.0% Broker Yield</strong>. Combined downpayment package for 3 lots generates a commission check of <strong>$13,125.00 MXN</strong>.
                  </>
                )}
              </p>
            </div>

          </div>

          {/* SIGNATURE OF AUTHENTICITY BLOCK */}
          <div className="border-t border-forest/10 pt-8 flex justify-between items-center text-xs text-forest/60 font-sans tracking-wide">
            <div>
              <p className="font-semibold">{language === "es" ? "ELABORÓ:" : "PREPARED BY:"}</p>
              <p className="font-serif italic text-gold font-bold text-sm">Ignacio Gallo García</p>
            </div>
            <div className="text-right">
              <p className="font-mono">{language === "es" ? "JUNIO 2026" : "JUNE 2026"}</p>
              <p className="text-[10px]">{language === "es" ? "Oficinas Generales NATIVA" : "NATIVA General Corporate Headquarters"}</p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. ATRACTIVO VISUAL DE LA UBICACIÓN Y PRESENTACIÓN DE RESERVA */}
      <section className="py-20 md:py-24 bg-forest text-white" id="ubicacion-reserva">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual satellite text details */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-gold text-xs uppercase tracking-widest block font-bold">
                {language === "es" ? "Ubicación Satelital Privilegiada" : "Geographical Positioning Blueprint"}
              </span>
              <h3 className="font-serif text-3xl md:text-5xl font-medium tracking-tight text-white leading-tight">
                {language === "es" ? "Polígono El Agapito Quintana Roo" : "Exclusive Development Reserve Area"}
              </h3>
              <p className="text-sm text-white/70 font-light leading-relaxed">
                {language === "es"
                  ? "Emplazado de manera estratégica en el corredor de mayor crecimiento inmobiliario y turístico entre Cancún y Valladolid, contiguo a la ruta del Tren Maya. Este polígono catastral consolidado garantiza plusvalía inmediata por la rápida absorción de reservas residenciales."
                  : "NATIVA is located perfectly within the high-end growth axis close to Cancun and Valladolid, adjacent to the federal Mayan Train route for ultimate connection. This cadastral block protects your land holding and boosts compound appreciation."}
              </p>

              {/* Coordinates details */}
              <div className="space-y-4 pt-4 border-t border-white/5 font-mono text-xs text-white/65">
                <div className="flex justify-between items-center bg-black/40 p-3 border border-white/10">
                  <span>SATELLITE POSITIONING:</span>
                  <strong className="text-gold">20.8471° N, 87.2217° W</strong>
                </div>
                <div className="flex justify-between items-center bg-black/40 p-3 border border-white/10">
                  <span>CADASTRAL AREA REFERENCE:</span>
                  <strong className="text-gold">El Agapito Polygon</strong>
                </div>
              </div>

            </div>

            {/* Layout imagery and interactive zoom container */}
            <div className="lg:col-span-7 relative">
              <div className="relative border border-white/10 p-2 bg-black/20 group overflow-hidden">
                <img 
                  src="https://i.imgur.com/C320mbH.jpeg" 
                  alt="Official Nativa Satellite cadastral layout"
                  className="w-full aspect-video object-cover filter contrast-[1.03] saturate-[1.03] hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay details */}
                <div className="absolute top-5 right-5 text-xs text-white/90 bg-forest/90 px-3 py-1.5 border border-white/10 tracking-widest font-mono">
                  MAP RES-COORD
                </div>
                
                <p className="text-[10px] text-white/40 italic mt-3 text-center">
                  {language === "es" ? "*Imagen promocional ilustrativa que resguarda límites geodésicos del proyecto." : "*Promotional graphic outlining the official geodetic boundary landmarks."}
                </p>
              </div>
            </div>

          </div>

          {/* OFFICIAL PRESENTATION VIDEO COMPONENT WITH SOUND (Retained) */}
          <div className="max-w-4xl mx-auto bg-black/40 p-1 border border-gold/20 shadow-2xl" id="official-presentation-video-container">
            <div className="border border-gold/15 p-4 md:p-6 flex flex-col gap-4 text-white">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-white/10">
                <div>
                  <span className="text-[10px] text-gold uppercase tracking-[0.25em] font-bold block mb-1">
                    {language === "es" ? "VIDEO INFORMATIVO RESIDENCIAL" : "OFFICIAL PROJECT SHOWCASE VIDEO"}
                  </span>
                  <h3 className="font-serif text-lg md:text-xl font-medium tracking-wide text-white">
                    {language === "es" ? "Vuelo e Inmersión sobre Reserva NATIVA" : "Aerial Overview of NATIVA Eco Canopy"}
                  </h3>
                </div>
                <div className="flex items-center gap-2 bg-forest border border-white/10 px-3 py-1 text-[10px] font-mono tracking-widest text-gold uppercase rounded-none">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>{language === "es" ? "AUDIO Y SONIDO" : "SOUND PLAYBACK"}</span>
                </div>
              </div>

              <div className="relative aspect-video bg-black/80 overflow-hidden border border-white/5">
                {language === "es" ? (
                  <iframe
                    src="https://www.youtube.com/embed/JLo-tqGsHn4?si=MGWywfFaCTIy3EfX"
                    title="Reproductor de video comercial"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full h-full absolute top-0 left-0 border-0"
                  />
                ) : (
                  <iframe
                    src="https://www.youtube.com/embed/BSjIZ_FIx2Y?si=pFWBaUXZrRZMXmsq"
                    title="Nativa Drone Video Player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full h-full absolute top-0 left-0 border-0"
                  />
                )}
              </div>

              <p className="text-[11px] text-white/50 text-center italic mt-1 font-sans">
                {language === "es" 
                  ? "Recorrido con Dron en Alta Definición por la exhuberante selva alta y cenote sagrado." 
                  : "High Resolution Drone fly-by film exploring our sacred virgin waters cenote."}
              </p>

            </div>
          </div>

        </div>
      </section>

      {/* 5. FORMULARIO DE REGISTRO DE CONTACTO Y GUARDADO DE SIMULACIÓN */}
      <section id="contacto-simulacion" className="py-20 md:py-28 bg-forest text-white relative">
        <div className="absolute inset-x-0 bottom-0 top-[20%] pointer-events-none opacity-5 bg-[radial-gradient(#dbcbb0_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Call context & Contact descriptors */}
            <div className="lg:col-span-5 text-white/90 space-y-6">
              <span className="text-gold text-xs uppercase tracking-[0.25em] font-bold block">
                {language === "es" ? "RESERVE SU ASIGNACIÓN" : "LOCK PRE-SALE CONCESSIONS"}
              </span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-white font-medium">
                {language === "es" ? <>Registre su <span className="text-gold italic block mt-1">Simulación</span></> : <>Save Your <span className="text-gold italic block mt-1">Calculations</span></>}
              </h2>
              
              <p className="font-sans text-sm md:text-base text-white/70 font-light leading-relaxed">
                {language === "es" 
                  ? "Nuestros asesores patrimoniales e Ignacio Gallo García revisarán su estimación para estructurar el plan flexible óptimo sin intereses."
                  : "Register below and a certified NATIVA advisor will reach out with the comprehensive Master Plan PDF, pre-sale contracts, and technical maps."}
              </p>

              {/* Verified badges */}
              <div className="space-y-6 pt-4">
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-gold">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-white/50 tracking-wider block">{language === "es" ? "Contacte Directo" : "Direct Hotline"}</span>
                    <strong className="text-white text-base font-serif font-medium">+52 998 400 6052</strong>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-gold">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-white/50 tracking-wider block">Email</span>
                    <strong className="text-white text-base font-serif font-medium block">
                      ventas@nativaresidences.com
                    </strong>
                  </div>
                </div>

              </div>

            </div>

            {/* Direct lead submit card */}
            <div className="lg:col-span-7">
              <div className="bg-white text-offblack p-8 md:p-12 rounded-none border border-forest/10 relative overflow-hidden shadow-2xl">
                
                <AnimatePresence mode="wait">
                  {!formSubmitted ? (
                    <motion.form 
                      key="simulation-lead-form"
                      onSubmit={handleFormSubmit}
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6 animate-fade-in"
                    >
                      <div className="border-b border-forest/10 pb-4 mb-6">
                        <h4 className="font-serif text-2xl text-forest font-semibold mb-2">
                          {language === "es" ? "Dossier Informativo & Verificación" : "Request Executive Pre-Sale Dossier"}
                        </h4>
                        <p className="font-sans text-xs text-offblack/60 font-light">
                          {language === "es" 
                            ? "Complete el formulario para recibir la acreditación catastral oficial." 
                            : "Provide contact information to download the parcel layout directly."}
                        </p>
                      </div>

                      {/* Name */}
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-[#5d4201] font-bold mb-2">
                          {language === "es" ? "Nombre completo del inversionista *" : "Full Legal Name *"}
                        </label>
                        <input 
                          type="text"
                          required
                          name="name"
                          value={formData.name}
                          onChange={handleFormChange}
                          placeholder={language === "es" ? "p. ej. Alejandro Gallo" : "e.g., Alexander Gallo"}
                          className="w-full bg-[#F8F7F2]/40 border border-forest/10 focus:border-gold focus:outline-none px-4 py-3 text-sm transition-all rounded-none"
                        />
                      </div>

                      {/* Phone & Email Inputs Row */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-[#5d4201] font-bold mb-2">
                            {language === "es" ? "WhatsApp o Teléfono *" : "WhatsApp / Phone *"}
                          </label>
                          <input 
                            type="tel"
                            required
                            name="whatsapp"
                            value={formData.whatsapp}
                            onChange={handleFormChange}
                            placeholder="+52 998 400 6052"
                            className="w-full bg-[#F8F7F2]/40 border border-forest/10 focus:border-gold focus:outline-none px-4 py-3 text-sm transition-all rounded-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-widest text-[#5d4201] font-bold mb-2">
                            {language === "es" ? "Correo Electrónico *" : "Email Address *"}
                          </label>
                          <input 
                            type="email"
                            required
                            name="email"
                            value={formData.email}
                            onChange={handleFormChange}
                            placeholder="correo@ejemplo.com"
                            className="w-full bg-[#F8F7F2]/40 border border-forest/10 focus:border-gold focus:outline-none px-4 py-3 text-sm transition-all rounded-none"
                          />
                        </div>
                      </div>

                      {/* Summary fields displaying values from interactive slider */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-bone/70 p-4 border border-forest/5 text-xs text-forest">
                        <div>
                          <span className="block text-offblack/50 uppercase text-[9px] font-bold tracking-wider mb-1">
                            {language === "es" ? "PLAN SELECCIONADO INHERENTE" : "INFERRED SIMULATOR PROGRAM"}
                          </span>
                          <strong className="block text-sm text-forest font-bold font-serif leading-none">
                            {formData.planInterest}
                          </strong>
                        </div>
                        <div>
                          <span className="block text-offblack/50 uppercase text-[9px] font-bold tracking-wider mb-1">
                            {language === "es" ? "VOLUMEN DE TERRENOS ACORDADOS" : "LOT COUNT QUANTITY"}
                          </span>
                          <strong className="block text-sm text-gold font-bold font-mono leading-none">
                            {numTerrenos} {numTerrenos === 1 ? (language === "es" ? "Lote (1000m²)" : "Lot") : (language === "es" ? "Lotes (Combo)" : "Lots Package")}
                          </strong>
                        </div>
                      </div>

                      {/* Comments and Custom Negotiation Inputs */}
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-[#5d4201] font-bold mb-2">
                          {language === "es" ? "Comentarios o Propuesta de Negociación Opcional" : "Proposed Custom Terms or Negotiation Notes"}
                        </label>
                        <textarea 
                          name="negotiationNotes"
                          value={formData.negotiationNotes}
                          onChange={handleFormChange}
                          placeholder={language === "es" ? "Indique si desea negociar el enganche diferido a 3 meses..." : "Specify if you prompt partial down payment options..."}
                          rows={3}
                          className="w-full bg-[#F8F7F2]/40 border border-forest/10 focus:border-gold focus:outline-none px-4 py-3 text-sm transition-all rounded-none resize-none"
                        />
                      </div>

                      {/* Actions submit client */}
                      <button 
                        type="submit"
                        disabled={formLoading}
                        className="w-full bg-forest text-gold uppercase tracking-[0.25em] font-bold text-xs py-4 hover:bg-gold hover:text-forest transition-all flex items-center justify-center gap-3 shadow-lg cursor-pointer"
                      >
                        {formLoading ? (
                          <>
                            <span className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                            <span>{language === "es" ? "Validando Parámetros..." : "Processing Scenario..."}</span>
                          </>
                        ) : (
                          <>
                            <span>{language === "es" ? "ENVIAR SIMULACIÓN REGISTRADA" : "EXPORT PROJECT SIMULATION"}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                    </motion.form>
                  ) : (
                    <motion.div 
                      key="simulation-lead-success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12 px-6 space-y-6 flex flex-col items-center"
                    >
                      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4 border border-emerald-100">
                        <CheckCircle className="w-12 h-12" />
                      </div>
                      
                      <h3 className="font-serif text-3xl font-semibold text-forest">
                        {language === "es" ? "¡Simulación Registrada!" : "Scenario Saved!"}
                      </h3>
                      
                      <p className="font-sans text-sm text-offblack/70 max-w-sm leading-relaxed font-light">
                        {language === "es" ? (
                          <>Estimado(a) <strong>{formData.name}</strong>, hemos registrado su cotización preferencial para <strong>{numTerrenos} terrenos</strong> con un valor preventa de <strong>{formatCurrency(valorPreventaTotal)}</strong>.</>
                        ) : (
                          <>Dear <strong>{formData.name}</strong>, your preferential simulation for <strong>{numTerrenos} lots</strong> at a price of <strong>{formatCurrency(valorPreventaTotal)}</strong> was captured successfully.</>
                        )}
                      </p>

                      <div className="bg-bone p-5 border border-forest/5 text-left text-xs font-mono w-full max-w-sm space-y-3">
                        <div className="flex justify-between border-b border-forest/5 pb-2">
                          <span className="text-offblack/50">{language === "es" ? "Enganche:" : "Downpayment:"}</span>
                          <span className="font-bold text-forest">{formatCurrency(engancheTotal)} ({enganchePorcentaje}%)</span>
                        </div>
                        <div className="flex justify-between border-b border-forest/5 pb-2">
                          <span className="text-offblack/50">{language === "es" ? "Mensualidades:" : "Installments:"}</span>
                          <span className="font-bold text-forest">{formatCurrency(convertMXNToSelected(isPlan2 ? mensualidadStatedPlan2 : mensualidadStatedPlan1))} c/u</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-offblack/50">{language === "es" ? "Tasa Plusvalía:" : "Appreciation rate:"}</span>
                          <span className="font-bold text-gold font-serif italic">{tasaPlusvalia}% compounded</span>
                        </div>
                      </div>

                      <p className="font-sans text-xs text-offblack/50 max-w-sm leading-relaxed">
                        {language === "es" 
                          ? "Recibirá de inmediato el brochure técnico confidencial en PDF en su bandeja. Un asesor verificado le asistirá en breve vía WhatsApp."
                          : "We have prioritized your layout and sent the formal brochure to your email. An advisor will message you on WhatsApp."}
                      </p>

                      <button 
                        onClick={() => {
                          setFormSubmitted(false);
                          setFormData({
                            name: "",
                            email: "",
                            whatsapp: "",
                            planInterest: "Plan 1 (1-2 Terrenos)",
                            customLots: "1",
                            negotiationNotes: "",
                          });
                        }}
                        className="border border-forest text-forest hover:bg-forest hover:text-white px-8 py-3 rounded-none font-sans uppercase text-xs font-semibold tracking-wider transition-all cursor-pointer"
                      >
                        {language === "es" ? "Configurar otra Simulación" : "Reset Calculator"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER & COMPLIANCE DISCLOSURES */}
      <footer className="bg-forest text-white/90 border-t border-white/5 py-12 md:py-16 mt-auto">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-white/5">
            
            {/* Brand Column */}
            <div className="md:col-span-6 space-y-4">
              <div className="flex items-center gap-3 text-white">
                <img 
                  src="https://i.imgur.com/y3regni.png" 
                  alt="Nativa Logo" 
                  className="h-10 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
                <span className="font-serif font-bold tracking-[0.25em] text-lg text-white">
                  NATIVA
                </span>
              </div>
              <p className="font-sans text-xs text-white/55 leading-relaxed max-w-md">
                {language === "es" 
                  ? "NATIVA es un concepto residencial privado exclusivo y de baja densidad diseñado con los más estrictos lineamientos de sustentabilidad ambiental, conservación vegetal e infraestructura de bajo impacto en la selva de Quintana Roo."
                  : "NATIVA is a low-density private sanctuary developed under rigorous eco-preservation guidelines, stilted design frameworks, and green infrastructure certifications in Mexico."}
              </p>
            </div>

            {/* Quick Contacts & HQ */}
            <div className="md:col-span-6 space-y-4 font-sans text-xs md:text-right">
              <h5 className="text-[10px] uppercase text-gold tracking-widest font-bold">
                {language === "es" ? "OFICINA DE PREVENTA DIRECTA NATIVA" : "NATIVA DIRECT PRE-SALE DIVISION"}
              </h5>
              <p className="text-white/60 leading-relaxed font-light">
                {language === "es" ? "Quintana Roo, México" : "Quintana Roo, Mexico"} <br />
                {language === "es" ? "Teléfono:" : "Direct line:"} +52 998 400 6052 <br />
                Email: ventas@nativaresidences.com
              </p>
              
              <div className="flex items-center gap-4 text-white/50 pt-2 md:justify-end">
                <Instagram className="w-4 h-4 hover:text-gold transition-colors cursor-pointer" />
                <Facebook className="w-4 h-4 hover:text-gold transition-colors cursor-pointer" />
                <span className="text-[11px] tracking-wider text-gold font-serif">@nativaresidences</span>
              </div>
            </div>

          </div>

          {/* Compliance Bottom */}
          <div className="pt-2 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/35 font-sans gap-4">
            <div>
              &copy; {new Date().getFullYear()} NATIVA Residences. {language === "es" ? "Todos los derechos reservados. Planes preferenciales de Ignacio Gallo García." : "All rights reserved. Preferential models structured under Ignacio Gallo García plans."}
            </div>
            
            <div className="flex items-center gap-6 flex-wrap justify-center">
              <span>{language === "es" ? "Desarrollado en apego estricto a las Leyes Ambientales del Estado de Quintana Roo" : "Strict compliance with environmental protection regulations of Quintana Roo"}</span>
              <span className="text-gold font-bold">Luxury Ecological Living</span>
            </div>
          </div>

        </div>
      </footer>

      {/* WHATSAPP PERSISTENT FLOATING INQUIRY DIRECT CHAT */}
      <a 
        href="https://wa.me/529984006052" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-45 bg-[#25D366] text-white hover:bg-[#20ba5a] transition-all duration-300 p-3.5 rounded-full shadow-2xl flex items-center justify-center gap-0 group hover:gap-2 focus:ring-4 focus:ring-[#25D366]/20"
        title="Contact Advisor"
        id="persistent-whatsapp-help-trigger"
      >
        <img 
          src="https://i.imgur.com/XWh4057.png" 
          alt="WhatsApp Logo" 
          className="w-6 h-6 shrink-0 object-contain" 
          referrerPolicy="no-referrer"
        />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out text-xs font-bold uppercase tracking-widest pl-0 group-hover:pl-1 whitespace-nowrap">
          {language === "es" ? "Asesor Directo" : "Direct Help Desk"}
        </span>
      </a>

    </div>
  );
}
