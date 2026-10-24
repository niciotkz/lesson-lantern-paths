import { createContext, useContext, useState, type ReactNode } from "react";

type WorkbookContextValue = {
  answers: Record<string, string>;
  updateAnswer: (key: string, value: string) => void;
};

const WorkbookContext = createContext<WorkbookContextValue | null>(null);

export function ModuleWorkbookProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const updateAnswer = (key: string, value: string) => {
    setAnswers((current) => ({ ...current, [key]: value }));
  };
  return <WorkbookContext.Provider value={{ answers, updateAnswer }}>{children}</WorkbookContext.Provider>;
}

export function useModuleWorkbook() {
  const workbook = useContext(WorkbookContext);
  if (!workbook) throw new Error("ModuleWorkbookProvider is required");
  return workbook;
}

export type WorkbookField = { id: string; label: string; placeholder: string };

export function createWorkbookText(fields: WorkbookField[], answers: Record<string, string>) {
  return [
    "МОДУЛЬ 1 · CUSTOMER DEVELOPMENT",
    "Паспорт идеи и план проверки · 90 минут",
    "Статус: гипотезы и учебная подготовка, не подтверждение рыночного спроса.",
    "",
    ...fields.flatMap((field) => [field.label, answers[field.id]?.trim() || "[Не заполнено]", ""]),
  ].join("\n");
}