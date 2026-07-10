import { LearningModule, Lesson } from "@/types/domain";
import { BudgetingModule  } from "./Modules/Budgeting";
import { SavingsModule } from "./Modules/Savings";
import { CreditModule } from "./Modules/Credit";
import { RetirementModule } from "./Modules/Retirement";
import { InvestingModule } from "./Modules/Investing";

export const learningModules: LearningModule[] = [
  BudgetingModule,
  SavingsModule,
  CreditModule,
  RetirementModule,
  InvestingModule
];

console.log(learningModules)

export function findLesson(id: string | undefined): Lesson | undefined {
  return learningModules
    .flatMap((module) => module.lessons)
    .find((lesson) => lesson.id === id);
}
