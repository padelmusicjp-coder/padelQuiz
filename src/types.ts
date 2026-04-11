export interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  categoryId: string;
  difficulty: number;
  question: string;
  choices: Choice[];
  explanation: string;
  tags: string[];
}
