import type { Question } from '../types/app';

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
