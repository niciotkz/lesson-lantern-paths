import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flag, GraduationCap } from "lucide-react";
import {
  coreModules,
  electiveModules,
  CORE_HOURS,
  ELECTIVE_HOURS,
  CORE_END_ID,
  COURSE_TITLE,
   formatHours,
  type Module,
} from "@/data/course";
import { lessonKey, useProgress } from "@/lib/progress";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI-разработка: от идеи до стартапа — программа курса" },
      {
        name: "description",
        content: `Основная часть: 14 модулей, ${formatHours(CORE_HOURS)} часов. Первый модуль — Customer Development за 90 минут: теория, практика и проверка знаний.`,
      },
      { property: "og:title", content: "AI-разработка: от идеи до стартапа" },
      {
        property: "og:description",
        content: `14 модулей основной части (${formatHours(CORE_HOURS)} ч.) и 3 направления по выбору (${formatHours(ELECTIVE_HOURS)} ч.).`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  const done = useProgress();
  const coreTotal = coreModules.reduce((s, m) => s + m.lessons.length, 0);
  const coreDone = coreModules.reduce(
    (s, m) => s + m.lessons.filter((l) => done.includes(lessonKey(m.id, l.id))).length,
    0,
  );

  const card = (m: Module, elective: boolean) => {
    const d = m.lessons.filter((l) => done.includes(lessonKey(m.id, l.id))).length;
    return (
      <Link
        key={m.id}
        to="/lesson/$moduleId/$lessonId"
        params={{ moduleId: String(m.id), lessonId: "1" }}
        className="group rounded-lg border bg-card p-5 transition hover:border-primary"
      >
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-display text-primary">Модуль {String(m.id).padStart(2, "0")}</span>
          <span>{formatHours(m.hours)} ч. · {d}/{m.lessons.length}</span>
        </div>
        <h3 className="mt-2 text-base font-medium leading-snug group-hover:text-primary">
          {m.title}
          {elective && (
            <span className="ml-2 rounded-full border px-2 py-0.5 text-[10px] font-normal uppercase tracking-wide text-muted-foreground">
              по выбору
            </span>
          )}
        </h3>
        {m.id === 1 && (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-primary">
            <span className="font-medium">Материалы готовы</span>
            <span>90 мин · 9 уроков · паспорт идеи</span>
          </div>
        )}
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-accent" style={{ width: `${(d / m.lessons.length) * 100}%` }} />
        </div>
      </Link>
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 lg:px-12">
      <div className="text-xs uppercase tracking-widest text-primary">
        Силлабус · {formatHours(CORE_HOURS)} ч. основная часть + {formatHours(ELECTIVE_HOURS)} ч. по выбору
      </div>
      <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">{COURSE_TITLE}</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Практический курс: от CustDev и LLM до работающего продукта и апробации. Основная часть —
        модули 1–{CORE_END_ID}. После неё студент выбирает направление и занимается самостоятельно.
      </p>
      <Button asChild className="mt-6 h-auto whitespace-normal px-5 py-3">
      <Link
        to="/lesson/$moduleId/$lessonId"
        params={{ moduleId: "1", lessonId: "1" }}
      >
        Начать обучение <ArrowRight className="h-4 w-4" />
      </Link>
      </Button>
      <div className="mt-4 text-sm text-muted-foreground">
        Пройдено в основной части: {coreDone} из {coreTotal} уроков
      </div>

      <div className="mt-12">
        <div className="flex items-baseline justify-between border-b pb-3">
          <h2 className="font-display text-xl font-bold">Основная часть</h2>
          <span className="text-xs text-muted-foreground">
            модули 01–{String(CORE_END_ID).padStart(2, "0")} · {formatHours(CORE_HOURS)} ч.
          </span>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">{coreModules.map((m) => card(m, false))}</div>
      </div>

      <div className="mt-12 flex items-start gap-4 rounded-lg border bg-card p-5">
        <Flag className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <div className="font-display text-base font-bold">
            Курс завершён на модуле {CORE_END_ID}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Дальше студент выбирает одно или несколько направлений и работает самостоятельно:
            научная статья, коммерциализация или регистрация стартапа.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-baseline justify-between border-b pb-3">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <GraduationCap className="h-5 w-5 text-primary" />
            Направления по выбору
          </h2>
          <span className="text-xs text-muted-foreground">
            модули 15–17 · {formatHours(ELECTIVE_HOURS)} ч. · выбор студента
          </span>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">{electiveModules.map((m) => card(m, true))}</div>
        <p className="mt-4 text-sm text-muted-foreground">
          Направления не входят в обязательную часть: студент выбирает их сам и осваивает
          самостоятельно, отмечая пройденные уроки как обычно.
        </p>
      </div>
    </div>
  );
}
