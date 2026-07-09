export const quizQuestions: Record<
  string,
  Array<{
    id: string;
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>
> = {
  "budgeting-expected-actual": [
    {
      id: "q1",
      prompt: "Why compare expected spending with actual spending?",
      options: ["To shame yourself for mistakes", "To find useful habit patterns", "To calculate a credit score"],
      correctIndex: 1,
      explanation: "The gap is a learning signal. It helps explain what changed."
    },
    {
      id: "q2",
      prompt: "Which action should earn fertilizer in this app?",
      options: ["Logging a budget", "Buying a stock", "Skipping a lesson"],
      correctIndex: 0,
      explanation: "Budget logging is a practice habit, so it earns fertilizer."
    }
  ],
  default: [
    {
      id: "q1",
      prompt: "What does this app reward most?",
      options: ["High income", "Consistency and learning", "Net worth"],
      correctIndex: 1,
      explanation: "The app intentionally rewards learning behaviors, not wealth."
    }
  ]
};
