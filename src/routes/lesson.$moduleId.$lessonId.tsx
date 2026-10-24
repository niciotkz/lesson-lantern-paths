import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, FileText, BookOpen } from "lucide-react";
import { modules, isElective, CORE_END_ID, COURSE_TITLE } from "@/data/course";
import { lessonKey, toggleLesson, useProgress } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { LessonMaterials } from "@/components/LessonMaterials";
import { moduleOneContent, moduleOneSources, moduleOneWorkbookFields } from "@/data/module-one";

export const Route = createFileRoute("/lesson/$moduleId/$lessonId")({
  validateSearch: (search: Record<string, unknown>): { slide?: number } => {
    const slide = Number(search['slide']);
    return Number.isInteger(slide) && slide >= 1 && slide <= 8 ? { slide } : {};
  },
  loader: ({ params }) => {
    const m = modules.find((x) => x.id === Number(params.moduleId));
    const l = m?.lessons.find((x) => x.id === Number(params.lessonId));
    if (!m || !l) throw notFound();
    return { m, l };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.l.title} — ${COURSE_TITLE}` : `Урок — ${COURSE_TITLE}` },
      { name: "description", content: loaderData?.m.id === 1 ? moduleOneContent.find((content) => content.lessonId === loaderData.l.id)?.summary ?? loaderData.m.title : loaderData?.m.title ?? COURSE_TITLE },
      { property: "og:title", content: loaderData ? `${loaderData.l.title} — ${COURSE_TITLE}` : COURSE_TITLE },
      { property: "og:description", content: loaderData?.m.id === 1 ? moduleOneContent.find((content) => content.lessonId === loaderData.l.id)?.summary ?? loaderData.m.title : loaderData?.m.title ?? COURSE_TITLE },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LessonPage,
});

function LessonPage() {
  const { m, l } = Route.useLoaderData();
  const done = useProgress();
  const key = lessonKey(m.id, l.id);
  const isDone = done.includes(key);
  const content = m.id === 1 ? moduleOneContent.find((item) => item.lessonId === l.id) : undefined;

  const flat = modules.flatMap((mm) => mm.lessons.map((ll) => ({ m: mm.id, l: ll.id })));
  const idx = flat.findIndex((x) => x.m === m.id && x.l === l.id);
  const prev = flat[idx - 1];
  const next = flat[idx + 1];

  return (
    <div className={`mx-auto ${m.id === 1 && l.id === 1 ? "max-w-7xl" : "max-w-4xl"} px-5 py-8 sm:px-8 lg:px-12 lg:py-12`}>
      {content && <Button asChild variant="link" className="mb-5 h-auto p-0 text-xs"><Link to="/"><BookOpen />Программа курса</Link></Button>}
      <div className="text-xs uppercase tracking-widest text-primary">
        Модуль {m.id} · Урок {l.id} из {m.lessons.length}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{m.title}</div>
      <h1 className="mt-4 break-words text-2xl font-bold leading-snug sm:text-3xl">{l.title}</h1>

      {isElective(m.id) && (
        <div className="mt-6 rounded-lg border border-dashed bg-card px-4 py-3 text-sm text-muted-foreground">
          Направление по выбору. Основная часть курса завершена на модуле {CORE_END_ID} —
          этот модуль студент выбрал сам и осваивает самостоятельно.
        </div>
      )}


      {content ? <LessonMaterials key={l.id} content={content} sources={moduleOneSources} allFields={moduleOneWorkbookFields} /> : <div className="mt-10 flex flex-col items-center rounded-lg border border-dashed bg-card px-6 py-16 text-center">
        <FileText className="h-8 w-8 text-muted-foreground" />
        <p className="mt-3 font-medium">Материалы урока скоро появятся</p>
        <p className="mt-1 text-sm text-muted-foreground">Здесь будут видео, конспект и задания.</p>
      </div>}

      <Button
        onClick={() => toggleLesson(key)}
        variant={isDone ? "secondary" : "default"}
        aria-pressed={isDone}
        className={
          isDone
            ? "mt-8 h-auto whitespace-normal bg-accent px-5 py-3 text-accent-foreground"
            : "mt-8 h-auto whitespace-normal px-5 py-3"
        }
      >
        <Check className="h-4 w-4" /> {isDone ? "Урок пройден" : "Отметить как пройденный"}
      </Button>

      <div className="mt-12 flex justify-between border-t pt-6 text-sm">
        {prev ? (
          <Button asChild variant="ghost" className="px-2"><Link to="/lesson/$moduleId/$lessonId" params={{ moduleId: String(prev.m), lessonId: String(prev.l) }}>
            <ArrowLeft className="h-4 w-4" /> Предыдущий
          </Link></Button>
        ) : <span />}
        {next && (
          <Button asChild variant="ghost" className="px-2"><Link to="/lesson/$moduleId/$lessonId" params={{ moduleId: String(next.m), lessonId: String(next.l) }}>
            Следующий <ArrowRight className="h-4 w-4" />
          </Link></Button>
        )}
      </div>
    </div>
  );
}
