import type { WorkbookField } from "@/lib/module-workbook";

export type LessonSource = { id: string; title: string; publisher: string; url: string; note: string };
export type LessonSection = { title: string; paragraphs: string[]; bullets?: string[] };
export type KnowledgeQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};
export type LessonContent = {
  lessonId: number;
  summary: string;
  outcome: string;
  timing: { theory: number; practice: number; check: number };
  sections: LessonSection[];
  example: { title: string; paragraphs: string[] };
  exercise: { title: string; instructions: string[]; fields: WorkbookField[] };
  questions: KnowledgeQuestion[];
  takeaways: string[];
  sourceIds: string[];
  caution?: string;
};