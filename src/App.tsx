import { useState } from 'react';
import { 
  Zap, 
  Home, 
  Star, 
  Trophy, 
  BookOpen, 
  History, 
  Lightbulb, 
  ChevronRight,
  RotateCcw,
  XCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

// --- DATOS DE LA APLICACIÓN ---
const historyCapsules = [
  { title: "El Origen del Cero", character: "Sabios de la India", fact: "Hace más de 1,500 años se inventó el 'cero'. ¡Sin él, no habría internet!", emoji: "🇮🇳" },
  { title: "Pitágoras", character: "Escuela Griega", fact: "Creía que todo el universo estaba hecho de números. ¡Un club de genios!", emoji: "📐" },
  { title: "Ábaco Mágico", character: "Comerciantes", fact: "La primera calculadora. ¡Muchos expertos son más veloces que una computadora!", emoji: "🧮" },
  { title: "Ada Lovelace", character: "La Programadora", fact: "Creó las primeras instrucciones para máquinas. ¡Unió poesía y matemáticas!", emoji: "💻" }
];

// --- TIPOS ---
type View = 'landing' | 'learn' | 'learn_content' | 'quiz' | 'results';

type Question = {
  q: string;
  a: number;
  options: number[];
  hint: string;
  solution: string;
};

// --- COMPONENTE PRINCIPAL ---
export default function App() {
  const [view, setView] = useState<View>('landing');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);

  // Generador de ejercicios dinámicos por nivel
  const generateQuestions = (level: number): Question[] => {
    const qList: Question[] = [];
    for (let i = 0; i < 20; i++) {
      let q = '';
      let a = 0;
      let hint = '';
      let solution = '';
      
      switch(level) {
        case 1: { 
          const n1 = Math.floor(Math.random() * 30) + 10;
          const n2 = Math.floor(Math.random() * 5) + 2;
          const n3 = Math.floor(Math.random() * 5) + 2;
          q = `${n1} + ${n2} × ${n3}`;
          a = n1 + (n2 * n3);
          hint = `La multiplicación es como una "unión fuerte" entre números. Por eso, debes resolver ${n2} × ${n3} antes de sumar los demás.`;
          solution = `Primero resolvemos el bloque de multiplicación: ${n2} × ${n3} = ${n2*n3}. Luego sumamos ${n1} + ${n2*n3} para obtener ${a}.`;
          break;
        }
        case 2: {
          const n1 = Math.floor(Math.random() * 100) + 50;
          const n2 = Math.floor(Math.random() * 9) + 3;
          const n3 = Math.floor(Math.random() * 9) + 3;
          q = `${n1} + ${n2} × ${n3}`;
          a = n1 + (n2 * n3);
          hint = `¡No te dejes engañar por el orden! La multiplicación tiene más "fuerza" y debe resolverse antes que cualquier suma.`;
          solution = `Siguiendo la regla, resolvemos el bloque: ${n2} × ${n3} = ${n2*n3}. Finalmente sumamos ${n1} y obtenemos ${a}.`;
          break;
        }
        case 3: {
          const d2 = Math.floor(Math.random() * 5) + 2;
          const d1 = d2 * (Math.floor(Math.random() * 10) + 2);
          const add = Math.floor(Math.random() * 50) + 50;
          q = `${d1} ÷ ${d2} + ${add}`;
          a = (d1 / d2) + add;
          hint = `Dividir es repartir, y en matemáticas repartir es una prioridad. Calcula cuánto es ${d1} entre ${d2} antes de sumar.`;
          solution = `Primero repartimos: ${d1} ÷ ${d2} = ${d1/d2}. Ahora sumamos esa cantidad a ${add} para obtener ${a}.`;
          break;
        }
        case 4: {
          const sub = Math.floor(Math.random() * 100) + 200;
          const d2 = Math.floor(Math.random() * 7) + 2;
          const d1 = d2 * (Math.floor(Math.random() * 10) + 5);
          q = `${sub} - ${d1} ÷ ${d2}`;
          a = sub - (d1 / d2);
          hint = `La división siempre se resuelve antes que la resta. Necesitas saber el resultado de la repartición (${d1} ÷ ${d2}) para poder quitárselo a ${sub}.`;
          solution = `Calculamos la división prioritaria: ${d1} ÷ ${d2} = ${d1/d2}. Ahora restamos ese valor al número inicial: ${sub} - ${d1/d2} = ${a}.`;
          break;
        }
        case 5: {
          const sub = Math.floor(Math.random() * 200) + 300;
          const m1 = Math.floor(Math.random() * 12) + 5;
          const m2 = Math.floor(Math.random() * 10) + 5;
          q = `${sub} - ${m1} × ${m2}`;
          a = sub - (m1 * m2);
          hint = `En los desafíos grandes, la multiplicación crea un bloque inseparable. Resuelve ${m1} × ${m2} primero para saber qué cantidad restar.`;
          solution = `Resolvemos el bloque principal: ${m1} × ${m2} = ${m1*m2}. Luego realizamos la resta final: ${sub} - ${m1*m2} = ${a}.`;
          break;
        }
        default: break;
      }
      
      const options = [a];
      while (options.length < 4) {
        const wrong = a + (Math.floor(Math.random() * 40) - 20);
        if (!options.includes(wrong) && wrong > 0) options.push(wrong);
      }
      qList.push({ q, a, options: options.sort(() => Math.random() - 0.5), hint, solution });
    }
    return qList;
  };

  const startQuiz = () => {
    const q = generateQuestions(selectedLevel);
    setQuestions(q);
    setScore(0);
    setCurrentQuestionIdx(0);
    setAttempts(0);
    setView('quiz');
    setShowFeedback(false);
    setSelectedOption(null);
  };

  const handleOptionClick = (opt: number) => {
    if (showFeedback) return;
    
    setSelectedOption(opt);
    const correct = opt === questions[currentQuestionIdx].a;
    setIsCorrect(correct);
    
    if (correct) {
      if (attempts === 0) setScore(s => s + 1);
      setShowFeedback(true);
    } else {
      setAttempts(prev => prev + 1);
      setShowFeedback(true);
    }
  };

  const handleContinue = () => {
    if (isCorrect || attempts >= 3) {
      setShowFeedback(false);
      setSelectedOption(null);
      setAttempts(0);
      if (currentQuestionIdx + 1 < questions.length) {
        setCurrentQuestionIdx(prev => prev + 1);
      } else {
        setView('results');
      }
    } else {
      setShowFeedback(false);
      setSelectedOption(null);
    }
  };

  const resetToHome = () => {
    setView('landing');
    setSelectedOption(null);
    setShowFeedback(false);
    setAttempts(0);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex flex-col items-center justify-center p-4 font-sans">
      
      {/* Botón Home persistente */}
      {view !== 'landing' && (
        <button 
          onClick={resetToHome}
          className="fixed top-6 right-6 p-3 bg-white border-2 border-slate-100 rounded-full text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm z-50 hover:scale-110 active:scale-95"
        >
          <Home size={24} />
        </button>
      )}

      {/* VISTA 1: PORTADA Y SELECTOR DE NIVEL */}
      {view === 'landing' && (
        <div className="w-full max-w-4xl text-center animate-in fade-in zoom-in duration-500">
          <div className="mb-8 relative inline-block">
            <div className="bg-blue-600 p-6 rounded-[40px] shadow-2xl shadow-blue-200 relative z-10">
              <span className="text-white font-black text-7xl italic">M</span>
            </div>
            <div className="absolute -top-4 -right-4 bg-yellow-400 p-3 rounded-full animate-bounce shadow-lg">
              <Zap className="text-white fill-current" size={24} />
            </div>
          </div>
          
          <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tight uppercase">MÓDULO DE CÁLCULO</h1>
          <p className="text-xl text-slate-500 mb-10 max-w-md mx-auto leading-relaxed font-medium">
            Selecciona tu nivel y conviértete en un maestro del cálculo mental.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12 max-w-3xl mx-auto">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button 
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`p-6 rounded-[32px] border-4 transition-all flex flex-col items-center gap-3 group ${
                  selectedLevel === lvl 
                  ? 'bg-blue-50 border-blue-600 scale-105 shadow-xl shadow-blue-100' 
                  : 'bg-white border-slate-100 hover:border-blue-200'
                }`}
              >
                <div className={`p-3 rounded-full transition-colors ${
                  selectedLevel === lvl ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-300 group-hover:text-blue-400'
                }`}>
                  <Star size={24} fill="currentColor" />
                </div>
                <span className={`font-black text-lg ${selectedLevel === lvl ? 'text-blue-700' : 'text-slate-700'}`}>
                  Nivel {lvl}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => setView('learn')}
              className="w-full md:w-auto bg-white border-4 border-slate-100 hover:border-blue-200 text-slate-700 font-black py-4 px-10 rounded-[32px] text-lg transition-all flex items-center justify-center gap-2"
            >
              <History size={20} /> HISTORIA
            </button>
            <button 
              onClick={() => setView('learn_content')}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black py-6 px-16 rounded-[32px] text-2xl shadow-[0_8px_0_0_#1e40af] active:translate-y-2 active:shadow-none transition-all uppercase tracking-wider"
            >
              ¡EMPEZAR AHORA!
            </button>
          </div>
        </div>
      )}

      {/* VISTA 2: APRENDIZAJE / HISTORIA */}
      {view === 'learn' && (
        <div className="w-full max-w-4xl animate-in slide-in-from-right duration-500">
          <h2 className="text-4xl font-black text-slate-900 mb-8 flex items-center gap-3 italic">
            <History size={40} className="text-blue-600" /> Cápsulas del Tiempo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {historyCapsules.map((cap, i) => (
              <div key={i} className="bg-white p-8 rounded-[40px] border-2 border-slate-100 shadow-sm hover:border-blue-100 transition-all group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform inline-block">{cap.emoji}</div>
                <h4 className="text-2xl font-black text-slate-900 mb-1">{cap.title}</h4>
                <p className="text-blue-600 font-bold text-sm mb-4 uppercase tracking-widest">{cap.character}</p>
                <p className="text-slate-500 text-lg leading-relaxed">{cap.fact}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button 
              onClick={resetToHome} 
              className="bg-blue-600 text-white font-black py-5 px-16 rounded-[32px] text-xl shadow-[0_6px_0_0_#1e40af] hover:bg-blue-700 active:translate-y-1 transition-all"
            >
              VOLVER AL INICIO
            </button>
          </div>
        </div>
      )}

      {/* VISTA 3: CONTENIDO DE APRENDIZAJE ANTES DEL JUEGO */}
      {view === 'learn_content' && (
        <div className="w-full max-w-3xl animate-in fade-in duration-500">
          <div className="bg-white rounded-[56px] p-12 border-2 border-slate-100 shadow-sm text-center">
            <div className="bg-blue-50 p-6 rounded-full inline-block text-blue-600 mb-8">
              <BookOpen size={64} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tight italic">
              Prepárate para el Nivel {selectedLevel}
            </h2>
            
            <div className="bg-slate-50 p-8 rounded-[40px] border-2 border-slate-100 text-left mb-10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white font-black w-10 h-10 rounded-full flex items-center justify-center shrink-0">1</div>
                <p className="text-xl text-slate-700 font-bold">
                  Primero multiplicamos o dividimos. ¡Son los jefes!
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-green-500 text-white font-black w-10 h-10 rounded-full flex items-center justify-center shrink-0">2</div>
                <p className="text-xl text-slate-700 font-bold">
                  Luego sumamos o restamos lo que queda.
                </p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 mt-4 italic text-slate-500 font-medium leading-relaxed">
                "Si fallas, te daremos una pista sobre el porqué para que lo resuelvas tú mismo. ¡Solo mostramos la respuesta tras el tercer error!"
              </div>
            </div>

            <button 
              onClick={startQuiz}
              className="bg-green-500 hover:bg-green-600 text-white font-black py-6 px-16 rounded-[32px] text-2xl shadow-[0_8px_0_0_#16a34a] active:translate-y-2 transition-all flex items-center justify-center gap-3 mx-auto"
            >
              <Sparkles /> ¡A JUGAR!
            </button>
          </div>
        </div>
      )}

      {/* VISTA 4: QUIZ / EJERCICIOS */}
      {view === 'quiz' && (
        <div className="w-full max-w-2xl animate-in fade-in duration-300">
          {/* Barra de progreso */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex-1 bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="bg-green-500 h-full transition-all duration-1000 ease-out" 
                style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <span className="font-black text-slate-400 text-sm italic">{currentQuestionIdx + 1}/20</span>
          </div>

          {/* Tarjeta de Pregunta */}
          <div className="bg-white rounded-[56px] p-10 shadow-sm border-2 border-slate-100 text-center mb-8 relative overflow-hidden">
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mb-6">
              NIVEL {selectedLevel} • DESAFÍO {currentQuestionIdx + 1}
            </p>
            <h3 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
              {questions[currentQuestionIdx].q} = <span className="text-blue-600">?</span>
            </h3>
            <div className="flex justify-center gap-2 text-amber-500 font-bold text-sm bg-amber-50 py-2 px-4 rounded-full inline-flex items-center">
              <Lightbulb size={18} /> 
              <span>Recuerda la prioridad de signos</span>
            </div>
          </div>

          {/* Opciones de respuesta */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {questions[currentQuestionIdx].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOptionClick(opt)}
                disabled={showFeedback}
                className={`p-8 rounded-[36px] text-4xl font-black border-4 transition-all hover:scale-105 active:scale-95 ${
                  selectedOption === opt
                    ? opt === questions[currentQuestionIdx].a
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : 'bg-red-100 border-red-500 text-red-700 animate-bounce' // Pequeña animación de error
                    : 'bg-white border-slate-100 text-slate-700 hover:border-blue-300 shadow-[0_8px_0_0_#F1F5F9]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {/* MODAL DE AYUDA / FEEDBACK */}
          {showFeedback && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-300">
              <div className={`w-full max-w-md p-10 rounded-[48px] border-b-[12px] shadow-2xl animate-in slide-in-from-bottom-12 duration-500 ${
                isCorrect 
                ? 'bg-green-500 border-green-700 text-white' 
                : 'bg-red-500 border-red-700 text-white'
              }`}>
                <div className="flex items-center gap-4 mb-4 text-left">
                  <div className="shrink-0">
                    {isCorrect ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
                  </div>
                  <h4 className="text-3xl font-black uppercase italic leading-tight">
                    {isCorrect ? '¡Magnífico!' : attempts >= 3 ? '¡Sigue aprendiendo!' : '¡Oops! Fíjate bien'}
                  </h4>
                </div>
                
                <p className="text-xl font-bold mb-8 leading-tight opacity-95 text-left leading-relaxed">
                  {isCorrect || attempts >= 3 
                    ? questions[currentQuestionIdx].solution 
                    : questions[currentQuestionIdx].hint
                  }
                </p>

                <button 
                  onClick={handleContinue}
                  className="w-full bg-white text-slate-900 font-black py-5 rounded-[24px] shadow-xl hover:bg-slate-50 transition-all uppercase tracking-widest text-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  {isCorrect || attempts >= 3 ? (
                    <>Siguiente Ejercicio <ChevronRight size={24} /></>
                  ) : (
                    <>Intentar de nuevo <RotateCcw size={24} /></>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VISTA 5: RESULTADOS FINALES */}
      {view === 'results' && (
        <div className="text-center animate-in zoom-in duration-500 w-full max-w-lg px-4">
          <div className="bg-white rounded-[64px] p-12 border-2 border-slate-100 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-4 bg-blue-600"></div>
            
            <div className="bg-amber-100 w-40 h-40 rounded-full flex items-center justify-center mx-auto mb-10 border-[12px] border-white shadow-xl animate-bounce">
              <Trophy size={80} className="text-amber-500 drop-shadow-sm" />
            </div>
            
            <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tight">¡NIVEL {selectedLevel} COMPLETADO!</h2>
            <p className="text-slate-400 font-bold text-lg mb-10 italic">Tu mente es más rápida que un rayo.</p>
            
            <div className="flex gap-6 mb-12 text-left">
              <div className="flex-1 bg-blue-50 p-8 rounded-[40px] border-b-8 border-blue-200">
                <p className="text-blue-500 text-xs font-black uppercase mb-2 tracking-widest">Aciertos</p>
                <p className="text-5xl font-black text-blue-900">{score}/20</p>
              </div>
              <div className="flex-1 bg-green-50 p-8 rounded-[40px] border-b-8 border-green-200">
                <p className="text-green-600 text-xs font-black uppercase mb-2 tracking-widest">Precisión</p>
                <p className="text-5xl font-black text-blue-900">{Math.round((score/20)*100)}%</p>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={resetToHome}
                className="w-full bg-blue-600 text-white font-black py-6 rounded-[32px] shadow-[0_8px_0_0_#1e40af] text-2xl active:translate-y-2 active:shadow-none transition-all uppercase tracking-wider"
              >
                VOLVER AL INICIO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Edición Escolar */}
      <footer className="mt-12 text-slate-300 font-black uppercase text-xs tracking-[0.3em] pb-10">
        Mática ● Edición Escolar
      </footer>
    </div>
  );
}