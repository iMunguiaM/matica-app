export type View = 'landing' | 'learn' | 'learn_content' | 'quiz' | 'results';

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
