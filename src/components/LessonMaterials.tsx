import { useState } from "react";
import { Clock3, Target, PencilLine, BookOpen, ArrowUpRight, Download, CheckCircle2, Search, Users, FlaskConical, Lightbulb } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { KnowledgeCheck } from "@/components/KnowledgeCheck";
import { createWorkbookText, useModuleWorkbook, type WorkbookField } from "@/lib/module-workbook";
import { modules } from "@/data/course";
import { ModuleChronology } from "@/components/ModuleChronology";
import type { LessonContent, LessonSource } from "@/data/lesson-content.types";

export function LessonMaterials({ content, sources, allFields }: { content: LessonContent; sources: LessonSource[]; allFields: WorkbookField[] }) {
  const { answers, updateAnswer } = useModuleWorkbook();
  const [downloaded, setDownloaded] = useState(false);
  const final = content.lessonId === 9;
  const total = content.timing.theory + content.timing.practice + content.timing.check;
  const filled = allFields.filter((field) => answers[field.id]?.trim()).length;
  const module = modules.find((item) => item.id === 1);

  const downloadWorkbook = () => {
    const blob = new Blob(["\uFEFF", createWorkbookText(allFields, answers)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "custdev-pasport-idei.txt";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  };

  return (
    <>
      <p className="mt-5 text-base leading-relaxed text-muted-foreground">{content.summary}</p>
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y py-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 font-semibold text-primary"><Clock3 className="h-4 w-4" />{total} мин</span>
        <span>Разбор · {content.timing.theory} мин</span>
        <span>Практика · {content.timing.practice} мин</span>
        <span>Проверка · {content.timing.check} мин</span>
      </div>

      {content.lessonId === 1 && <ModuleChronology />}

      {content.lessonId === 2 && (
        <section className="mt-7 border-b pb-7" aria-label="Программа первого модуля">
          <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-base font-bold">От наблюдения к проверяемой идее</h2><span className="text-xs font-medium text-primary">1,5 часа · 9 уроков</span></div>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[{ icon: Search, title: "Проблема", text: "Конкретный эпизод" }, { icon: Users, title: "Люди", text: "Сегмент и интервью" }, { icon: Lightbulb, title: "Гипотеза", text: "Ценность и отличие" }, { icon: FlaskConical, title: "Проверка", text: "Эксперимент и критерий" }].map((step) => <div key={step.title} className="border-l-2 border-primary pl-3"><step.icon className="h-6 w-6 text-primary" /><div className="mt-2 text-sm font-semibold">{step.title}</div><div className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.text}</div></div>)}
          </div>
          <ol className="mt-5 space-y-2">
            {module?.lessons.map((lesson) => <li key={lesson.id} className="flex items-start justify-between gap-3 text-xs leading-relaxed"><Link to="/lesson/$moduleId/$lessonId" params={{ moduleId: "1", lessonId: String(lesson.id) }} className="min-w-0 text-muted-foreground underline-offset-4 hover:text-primary hover:underline">{lesson.id}. {lesson.title}</Link><span className="shrink-0 text-primary">{lesson.minutes} мин</span></li>)}
          </ol>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">90 минут — чтение, учебные упражнения и подготовка паспорта идеи. Реальные интервью, поиск респондентов и проверка спроса проводятся после занятия; рынок за 90 минут не валидируется.</p>
        </section>
      )}

      <div className="mt-7 flex items-start gap-3 bg-secondary/60 px-4 py-4">
        <Target className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div><div className="text-xs font-semibold uppercase tracking-wide text-primary">Результат урока</div><p className="mt-1 text-sm leading-relaxed">{content.outcome}</p></div>
      </div>

      <article className="mt-9 space-y-8">
        {content.sections.map((section, index) => <section key={section.title}>
          <h2 className="text-lg font-bold leading-relaxed"><span className="mr-2 text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>{section.title}</h2>
          <div className="mt-3 space-y-3 text-sm leading-7">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
          {section.bullets && <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 marker:text-primary">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
        </section>)}
      </article>

      <section className="mt-9 border-l-4 border-primary bg-muted/50 px-5 py-5">
        <div className="text-xs font-semibold uppercase tracking-wide text-primary">Учебный кейс · все данные условные</div>
        <h2 className="mt-2 text-base font-bold leading-relaxed">{content.example.title}</h2>
        <div className="mt-3 space-y-3 text-sm leading-7">{content.example.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      </section>

      {content.caution && <p className="mt-5 border-l-2 border-border pl-4 text-xs leading-relaxed text-muted-foreground">{content.caution}</p>}

      <section className="mt-10 border-t pt-8" aria-labelledby="practice-heading">
        <div className="flex flex-wrap items-center justify-between gap-2"><h2 id="practice-heading" className="flex items-center gap-2 text-lg font-bold"><PencilLine className="h-5 w-5 shrink-0 text-primary" />{content.exercise.title}</h2><span className="text-xs text-muted-foreground">{content.timing.practice} мин</span></div>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed marker:text-primary">{content.exercise.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}</ol>
        <div className="mt-5 space-y-5">{content.exercise.fields.map((field) => <div key={field.id}><label htmlFor={field.id} className="text-sm font-semibold">{field.label}</label><Textarea id={field.id} rows={4} value={answers[field.id] ?? ""} onChange={(event) => updateAnswer(field.id, event.target.value)} placeholder={field.placeholder} className="mt-2 resize-y text-sm leading-relaxed" /></div>)}</div>
        <div className="mt-4 flex flex-wrap items-center gap-3"><Button variant="outline" className="h-auto whitespace-normal py-2" onClick={downloadWorkbook}><Download />{final ? "Скачать паспорт идеи" : "Скачать рабочие заметки"}</Button><span className="text-xs text-muted-foreground" role="status">{downloaded ? "Файл скачан" : `${filled}/${allFields.length} полей заполнено`}</span></div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Черновик сохраняется только до перезагрузки страницы. В скачанном файле — ответы из всех уроков этого модуля.</p>
      </section>

      <KnowledgeCheck key={content.lessonId} questions={content.questions} />

      <section className="mt-9 border-t pt-7"><h2 className="text-base font-bold">Главное из урока</h2><ul className="mt-3 space-y-3">{content.takeaways.map((takeaway) => <li key={takeaway} className="flex items-start gap-2 text-sm leading-relaxed"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{takeaway}</span></li>)}</ul></section>

      <section className="mt-9 border-t pt-7"><h2 className="flex items-center gap-2 text-base font-bold"><BookOpen className="h-4 w-4 shrink-0 text-primary" />Источники и дальнейшее чтение</h2><ul className="mt-4 space-y-4">{sources.filter((source) => content.sourceIds.includes(source.id)).map((source) => <li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1 text-sm font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary">{source.title}<ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0" /></a><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{source.publisher} · {source.note}</p></li>)}</ul><p className="mt-4 text-xs text-muted-foreground">Материалы адаптированы на русском языке; дополнительное чтение не входит в 90 минут.</p></section>
    </>
  );
}