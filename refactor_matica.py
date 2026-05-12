from pathlib import Path
import json
import re

SRC = Path("src")
(SRC / "types").mkdir(parents=True, exist_ok=True)
(SRC / "data").mkdir(parents=True, exist_ok=True)
(SRC / "lib").mkdir(parents=True, exist_ok=True)

# 1) Tipos separados
(SRC / "types" / "app.ts").write_text("""export type View = 'landing' | 'learn' | 'learn_content' | 'quiz' | 'results';

export type Question = {
  q: string;
  a: number;
  options: number[];
  hint: string;
  solution: string;
};

export type HistoryCapsule = {
  title: string;
  character: string;
  fact: string;
  emoji: string;
};
""", encoding="utf-8")

# 2) Datos históricos separados
(SRC / "data" / "historyCapsules.ts").write_text("""import type { HistoryCapsule } from '../types/app';

export const historyCapsules: HistoryCapsule[] = [
  {
    title: "El Origen del Cero",
    character: "Sabios de la India",
    fact: "Hace más de 1,500 años se inventó el 'cero'. ¡Sin él, no habría internet!",
    emoji: "🇮🇳",
  },
  {
    title: "Pitágoras",
    character: "Escuela Griega",
    fact: "Creía que todo el universo estaba hecho de números. ¡Un club de genios!",
    emoji: "📐",
  },
  {
    title: "Ábaco Mágico",
    character: "Comerciantes",
    fact: "La primera calculadora. ¡Muchos expertos son más veloces que una computadora!",
    emoji: "🧮",
  },
  {
    title: "Ada Lovelace",
    character: "La Programadora",
    fact: "Creó las primeras instrucciones para máquinas. ¡Unió poesía y matemáticas!",
    emoji: "💻",
  },
];
""", encoding="utf-8")

# 3) Generador de preguntas separado
(SRC / "lib" / "generateQuestions.ts").write_text("""import type { Question } from '../types/app';

export function generateQuestions(level: number): Question[] {
  const qList: Question[] = [];

  for (let i = 0; i < 20; i++) {
    let q = '';
    let a = 0;
    let hint = '';
    let solution = '';

    switch (level) {
      case 1: {
        const n1 = Math.floor(Math.random() * 30) + 10;
        const n2 = Math.floor(Math.random() * 5) + 2;
        const n3 = Math.floor(Math.random() * 5) + 2;
        q = `${n1} + ${n2} × ${n3}`;
        a = n1 + n2 * n3;
        hint = `La multiplicación es como una "unión fuerte" entre números. Por eso, debes resolver ${n2} × ${n3} antes de sumar los demás.`;
        solution = `Primero resolvemos el bloque de multiplicación: ${n2} × ${n3} = ${n2 * n3}. Luego sumamos ${n1} + ${n2 * n3} para obtener ${a}.`;
        break;
      }

      case 2: {
        const n1 = Math.floor(Math.random() * 100) + 50;
        const n2 = Math.floor(Math.random() * 9) + 3;
        const n3 = Math.floor(Math.random() * 9) + 3;
        q = `${n1} + ${n2} × ${n3}`;
        a = n1 + n2 * n3;
        hint = `¡No te dejes engañar por el orden! La multiplicación tiene más "fuerza" y debe resolverse antes que cualquier suma.`;
        solution = `Siguiendo la regla, resolvemos el bloque: ${n2} × ${n3} = ${n2 * n3}. Finalmente sumamos ${n1} y obtenemos ${a}.`;
        break;
      }

      case 3: {
        const d2 = Math.floor(Math.random() * 5) + 2;
        const d1 = d2 * (Math.floor(Math.random() * 10) + 2);
        const add = Math.floor(Math.random() * 50) + 50;
        q = `${d1} ÷ ${d2} + ${add}`;
        a = d1 / d2 + add;
        hint = `Dividir es repartir, y en matemáticas repartir es una prioridad. Calcula cuánto es ${d1} entre ${d2} antes de sumar.`;
        solution = `Primero repartimos: ${d1} ÷ ${d2} = ${d1 / d2}. Ahora sumamos esa cantidad a ${add} para obtener ${a}.`;
        break;
      }

      case 4: {
        const sub = Math.floor(Math.random() * 100) + 200;
        const d2 = Math.floor(Math.random() * 7) + 2;
        const d1 = d2 * (Math.floor(Math.random() * 10) + 5);
        q = `${sub} - ${d1} ÷ ${d2}`;
        a = sub - d1 / d2;
        hint = `La división siempre se resuelve antes que la resta. Necesitas saber el resultado de la repartición (${d1} ÷ ${d2}) para poder quitárselo a ${sub}.`;
        solution = `Calculamos la división prioritaria: ${d1} ÷ ${d2} = ${d1 / d2}. Ahora restamos ese valor al número inicial: ${sub} - ${d1 / d2} = ${a}.`;
        break;
      }

      case 5: {
        const sub = Math.floor(Math.random() * 200) + 300;
        const m1 = Math.floor(Math.random() * 12) + 5;
        const m2 = Math.floor(Math.random() * 10) + 5;
        q = `${sub} - ${m1} × ${m2}`;
        a = sub - m1 * m2;
        hint = `En los desafíos grandes, la multiplicación crea un bloque inseparable. Resuelve ${m1} × ${m2} primero para saber qué cantidad restar.`;
        solution = `Resolvemos el bloque principal: ${m1} × ${m2} = ${m1 * m2}. Luego realizamos la resta final: ${sub} - ${m1 * m2} = ${a}.`;
        break;
      }

      default:
        break;
    }

    const options = [a];

    while (options.length < 4) {
      const wrong = a + (Math.floor(Math.random() * 40) - 20);
      if (!options.includes(wrong) && wrong > 0) {
        options.push(wrong);
      }
    }

    qList.push({
      q,
      a,
      options: options.sort(() => Math.random() - 0.5),
      hint,
      solution,
    });
  }

  return qList;
}
""", encoding="utf-8")

# 4) Ajustar App.tsx sin cambiar diseño visual
app_path = SRC / "App.tsx"
app = app_path.read_text(encoding="utf-8")

app = app.replace(
    "} from 'lucide-react';",
    "} from 'lucide-react';\nimport { historyCapsules } from './data/historyCapsules';\nimport { generateQuestions } from './lib/generateQuestions';\nimport type { Question, View } from './types/app';"
)

app = re.sub(
    r"\n// --- DATOS DE LA APLICACIÓN ---\nconst historyCapsules = \[.*?\];\n\n// --- TIPOS ---\ntype View = .*?\n\ntype Question = \{.*?\};\n",
    "\n",
    app,
    flags=re.S,
)

app = re.sub(
    r"\n  // Generador de ejercicios dinámicos por nivel\n  const generateQuestions = \(level: number\): Question\[\] => \{.*?\n  \};\n\n  const startQuiz =",
    "\n  const startQuiz =",
    app,
    flags=re.S,
)

app = app.replace(
    "  const handleOptionClick = (opt: number) => {\n    if (showFeedback) return;",
    "  const handleOptionClick = (opt: number) => {\n    if (showFeedback || !currentQuestion) return;"
)

app = app.replace("questions[currentQuestionIdx].q", "currentQuestion.q")
app = app.replace("questions[currentQuestionIdx].a", "currentQuestion.a")
app = app.replace("questions[currentQuestionIdx].options", "currentQuestion.options")
app = app.replace("questions[currentQuestionIdx].hint", "currentQuestion.hint")
app = app.replace("questions[currentQuestionIdx].solution", "currentQuestion.solution")

app = app.replace(
    "  const resetToHome = () => {\n    setView('landing');\n    setSelectedOption(null);\n    setShowFeedback(false);\n    setAttempts(0);\n  };\n\n  return (",
    "  const resetToHome = () => {\n    setView('landing');\n    setSelectedOption(null);\n    setShowFeedback(false);\n    setAttempts(0);\n  };\n\n  const currentQuestion = questions[currentQuestionIdx] ?? null;\n\n  return ("
)

app = app.replace(
    "      {/* VISTA 4: QUIZ / EJERCICIOS */}\n      {view === 'quiz' && (",
    """      {/* VISTA 4: QUIZ / EJERCICIOS */}
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

      {view === 'quiz' && currentQuestion && ("""
)

app_path.write_text(app, encoding="utf-8")

# 5) Agregar script typecheck sin afectar deploy
pkg_path = Path("package.json")
pkg = json.loads(pkg_path.read_text(encoding="utf-8"))
pkg.setdefault("scripts", {})
pkg["scripts"]["typecheck"] = "tsc -b"
pkg_path.write_text(json.dumps(pkg, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

print("Refactor mínimo aplicado correctamente.")
