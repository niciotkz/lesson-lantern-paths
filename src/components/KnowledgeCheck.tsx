import { useState } from "react";
import { CheckCircle2, CircleHelp, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { KnowledgeQuestion } from "@/data/lesson-content.types";

export function KnowledgeCheck({ questions }: { questions: KnowledgeQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const ready = questions.every((question) => answers[question.id] !== undefined);
  const score = questions.filter((question) => Number(answers[question.id]) === question.answer).length;

  return (
    <section className="mt-10 border-t pt-8" aria-labelledby="knowledge-heading">
      <h2 id="knowledge-heading" className="flex items-center gap-2 text-lg font-bold"><CircleHelp className="h-5 w-5 shrink-0 text-primary" />Проверка понимания</h2>
      {questions.map((question, number) => (
        <fieldset key={question.id} className="mt-6 min-w-0">
          <legend className="text-sm font-semibold leading-relaxed">{number + 1}. {question.prompt}</legend>
          <RadioGroup className="mt-3 gap-2" value={answers[question.id] ?? ""} disabled={checked} onValueChange={(value) => setAnswers((current) => ({ ...current, [question.id]: value }))} aria-label={question.prompt}>
            {question.options.map((option, index) => (
              <label key={index} htmlFor={`${question.id}-${index}`} className="flex cursor-pointer items-start gap-3 rounded-md border px-3 py-3 text-sm leading-relaxed has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-secondary/50">
                <RadioGroupItem id={`${question.id}-${index}`} value={String(index)} className="mt-1 shrink-0" />
                <span>{option}</span>
              </label>
            ))}
          </RadioGroup>
          {checked && <div className="mt-3 border-l-2 border-primary pl-3 text-sm leading-relaxed" role="status"><span className="font-semibold">{Number(answers[question.id]) === question.answer ? "Верно. " : "Не совсем. "}</span>{question.explanation}</div>}
        </fieldset>
      ))}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!checked ? <Button disabled={!ready} onClick={() => setChecked(true)}><CheckCircle2 />Проверить ответы</Button> : <>
          <span className="text-sm font-medium" role="status">Результат: {score} из {questions.length}</span>
          <Button variant="outline" onClick={() => { setChecked(false); setAnswers({}); }}><RotateCcw />Ещё раз</Button>
        </>}
      </div>
    </section>
  );
}