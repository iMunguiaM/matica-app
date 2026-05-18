import { useEffect, useState } from 'react';
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
  Sparkles,
  Timer
} from 'lucide-react';
import { historyCapsules } from './data/historyCapsules';
import { generateQuestions } from './lib/generateQuestions';
import type { Question, View } from './types/app';

type GameMode = 'calm' | 'turbo';
type TurboSeconds = 5 | 10 | 15;

const TURBO_SECOND_OPTIONS: TurboSeconds[] = [5, 10, 15];


// --- COMPONENTE PRINCIPAL ---
export default function App() {
  const [view, setView] = useState<View>('landing');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [gameMode, setGameMode] = useState<GameMode>('calm');
  const [turboSeconds, setTurboSeconds] = useState<TurboSeconds>(10);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [timeExpired, setTimeExpired] = useState(false);
  const [fastAnswers, setFastAnswers] = useState(0);

  const selectedTimeLimit = gameMode === 'turbo' ? turboSeconds : 15;
  const currentQuestion = questions[currentQuestionIdx] ?? null;
  const timeProgress = gameMode === 'turbo'
    ? Math.max(0, Math.min(100, (timeLeft / selectedTimeLimit) * 100))
    : 100;

  useEffect(() => {
    setTimeLeft(selectedTimeLimit);
  }, [selectedTimeLimit]);

  useEffect(() => {
    if (gameMode !== 'turbo' || view !== 'quiz' || !currentQuestion || showFeedback) return;

    const timer = window.setInterval(() => {
      setTimeLeft((previousTime: number) => {
        if (previousTime <= 1) {
          window.clearInterval(timer);
          setSelectedOption(null);
          setIsCorrect(false);
          setTimeExpired(true);
          setAttempts((previousAttempts) => previousAttempts + 1);
          setShowFeedback(true);
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [gameMode, view, currentQuestion, showFeedback]);

  const resetTimer = () => {
    setTimeLeft(selectedTimeLimit);
    setTimeExpired(false);
  };

  const startQuiz = () => {
    const q = generateQuestions(selectedLevel);
    setQuestions(q);
    setScore(0);
    setFastAnswers(0);
    setCurrentQuestionIdx(0);
    setAttempts(0);
    setView('quiz');
    setShowFeedback(false);
    setSelectedOption(null);
    resetTimer();
  };

  const handleOptionClick = (opt: number) => {
    if (showFeedback || !currentQuestion) return;
    
    setSelectedOption(opt);
    setTimeExpired(false);
    const correct = opt === currentQuestion.a;
    setIsCorrect(correct);
    
    if (correct) {
      if (attempts === 0) {
        setScore(s => s + 1);
        if (gameMode === 'turbo' && timeLeft >= Math.ceil(selectedTimeLimit / 2)) {
          setFastAnswers((total) => total + 1);
        }
      }
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
      resetTimer();
      if (currentQuestionIdx + 1 < questions.length) {
        setCurrentQuestionIdx(prev => prev + 1);
      } else {
        setView('results');
      }
    } else {
      setShowFeedback(false);
      setSelectedOption(null);
      resetTimer();
    }
  };

  const resetToHome = () => {
    setView('landing');
    setSelectedOption(null);
    setShowFeedback(false);
    setAttempts(0);
    resetTimer();
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

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 max-w-3xl mx-auto">
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

          <div className="bg-white border-2 border-slate-100 p-3 rounded-[32px] shadow-sm max-w-2xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => setGameMode('calm')}
              className={`rounded-[24px] p-4 border-4 transition-all text-left flex items-center gap-4 ${
                gameMode === 'calm'
                  ? 'bg-green-50 border-green-400 shadow-sm'
                  : 'bg-slate-50 border-transparent hover:border-green-100'
              }`}
            >
              <span className="text-3xl">🐢</span>
              <span>
                <span className="block font-black text-slate-900 text-lg">Modo tranquilo</span>
                <span className="block text-slate-400 font-bold text-sm">Practica sin límite</span>
              </span>
            </button>

            <div
              className={`rounded-[24px] p-4 border-4 transition-all text-left ${
                gameMode === 'turbo'
                  ? 'bg-yellow-50 border-yellow-400 shadow-sm'
                  : 'bg-slate-50 border-transparent hover:border-yellow-100'
              }`}
            >
              <button
                type="button"
                onClick={() => setGameMode('turbo')}
                className="w-full flex items-center gap-4 text-left"
              >
                <span className="bg-yellow-400 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-md shrink-0">
                  <Zap size={26} fill="currentColor" />
                </span>

                <span className="flex-1">
                  <span className="block font-black text-slate-900 text-lg">Reto Relámpago</span>
                  <span className="block text-slate-400 font-bold text-sm">
                    {gameMode === 'turbo' ? `Velocidad: ${turboSeconds}s` : 'Elige tu velocidad'}
                  </span>
                </span>
              </button>

              {gameMode === 'turbo' && (
                <div className="mt-4 pt-4 border-t border-yellow-200 animate-in fade-in slide-in-from-top-1 duration-300">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-600 mb-3">
                    Elige tu velocidad
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    {TURBO_SECOND_OPTIONS.map((seconds) => (
                      <button
                        key={seconds}
                        type="button"
                        onClick={() => {
                          setGameMode('turbo');
                          setTurboSeconds(seconds);
                        }}
                        className={`py-3 rounded-2xl font-black text-sm transition-all border-2 ${
                          turboSeconds === seconds
                            ? 'bg-yellow-400 text-white border-yellow-500 shadow-md scale-[1.03]'
                            : 'bg-white text-slate-500 border-yellow-100 hover:border-yellow-300'
                        }`}
                      >
                        {seconds}s ⚡
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
            <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tight italic">
              Prepárate para el Nivel {selectedLevel}
            </h2>
            <div className={`inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full font-black text-sm ${gameMode === 'turbo' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'}`}>
              {gameMode === 'turbo' ? <><Timer size={18} /> Reto Relámpago: {selectedTimeLimit}s</> : <>🐢 Modo tranquilo</>}
            </div>
            
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
      {view === 'quiz' && !currentQuestion && (
        <div className="w-full max-w-xl bg-white rounded-[40px] p-10 text-center border-2 border-slate-100 shadow-sm">
          <h2 className="text-3xl font-black text-slate-900 mb-4">
            No hay ejercicios cargados
          </h2>
          <p className="text-slate-500 font-bold mb-8">
            Vuelve al inicio y comienza nuevamente el nivel.
          </p>
          <button
            onClick={resetToHome}
            className="bg-blue-600 text-white font-black py-4 px-10 rounded-[32px] shadow-[0_6px_0_0_#1e40af] active:translate-y-1 active:shadow-none transition-all"
          >
            VOLVER AL INICIO
          </button>
        </div>
      )}

      {view === 'quiz' && currentQuestion && (
        <div className="w-full max-w-2xl animate-in fade-in duration-300">
          {/* Barra de progreso */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex-1 bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="bg-green-500 h-full transition-all duration-1000 ease-out" 
                style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <span className="font-black text-slate-400 text-sm italic">{currentQuestionIdx + 1}/20</span>
          </div>

          {gameMode === 'turbo' && (
            <div className="bg-white rounded-[28px] border-2 border-slate-100 p-3 mb-6 shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-yellow-400 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-md">
                  <Timer size={22} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Energía relámpago</p>
                  <p className="text-lg font-black text-slate-800">{timeLeft}s restantes</p>
                </div>
                <span className="text-yellow-500 font-black text-xl">⚡</span>
              </div>
              <div className="bg-yellow-50 h-4 rounded-full overflow-hidden border border-yellow-100">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${timeLeft <= 5 ? 'bg-red-500' : 'bg-yellow-400'}`}
                  style={{ width: `${timeProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Tarjeta de Pregunta */}
          <div className="bg-white rounded-[56px] p-10 shadow-sm border-2 border-slate-100 text-center mb-8 relative overflow-hidden">
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mb-6">
              NIVEL {selectedLevel} • DESAFÍO {currentQuestionIdx + 1}
            </p>
            <h3 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-tight">
              {currentQuestion.q} = <span className="text-blue-600">?</span>
            </h3>
            <div className="flex justify-center gap-2 text-amber-500 font-bold text-sm bg-amber-50 py-2 px-4 rounded-full inline-flex items-center">
              <Lightbulb size={18} /> 
              <span>Recuerda la prioridad de signos</span>
            </div>
          </div>

          {/* Opciones de respuesta */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOptionClick(opt)}
                disabled={showFeedback}
                className={`p-8 rounded-[36px] text-4xl font-black border-4 transition-all hover:scale-105 active:scale-95 ${
                  selectedOption === opt
                    ? opt === currentQuestion.a
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
                : timeExpired
                  ? 'bg-yellow-500 border-yellow-700 text-white'
                  : 'bg-red-500 border-red-700 text-white'
              }`}>
                <div className="flex items-center gap-4 mb-4 text-left">
                  <div className="shrink-0">
                    {isCorrect ? <CheckCircle2 size={40} /> : timeExpired ? <Timer size={40} /> : <XCircle size={40} />}
                  </div>
                  <h4 className="text-3xl font-black uppercase italic leading-tight">
                    {isCorrect ? '¡Magnífico!' : timeExpired ? '¡Se acabó la energía!' : attempts >= 3 ? '¡Sigue aprendiendo!' : '¡Oops! Fíjate bien'}
                  </h4>
                </div>
                
                <p className="text-xl font-bold mb-8 leading-tight opacity-95 text-left leading-relaxed">
                  {isCorrect || attempts >= 3 
                    ? currentQuestion.solution 
                    : timeExpired
                      ? `Respira. Mira la pista y vuelve a intentarlo: ${currentQuestion.hint}`
                      : currentQuestion.hint
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
            
            <div className="flex gap-6 mb-8 text-left">
              <div className="flex-1 bg-blue-50 p-8 rounded-[40px] border-b-8 border-blue-200">
                <p className="text-blue-500 text-xs font-black uppercase mb-2 tracking-widest">Aciertos</p>
                <p className="text-5xl font-black text-blue-900">{score}/20</p>
              </div>
              <div className="flex-1 bg-green-50 p-8 rounded-[40px] border-b-8 border-green-200">
                <p className="text-green-600 text-xs font-black uppercase mb-2 tracking-widest">Precisión</p>
                <p className="text-5xl font-black text-blue-900">{Math.round((score/20)*100)}%</p>
              </div>
            </div>

            {gameMode === 'turbo' && (
              <div className="bg-yellow-50 border-2 border-yellow-100 rounded-[32px] p-5 mb-8 text-left flex items-center gap-4">
                <div className="bg-yellow-400 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-md shrink-0">
                  <Zap size={26} fill="currentColor" />
                </div>
                <div>
                  <p className="text-yellow-600 text-xs font-black uppercase tracking-widest">Reto Relámpago de {turboSeconds}s</p>
                  <p className="text-slate-800 font-black text-xl">{fastAnswers} respuestas súper rápidas</p>
                </div>
              </div>
            )}

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