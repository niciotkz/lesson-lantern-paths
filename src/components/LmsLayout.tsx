import { Link, useParams } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { ChevronDown, CheckCircle2, Circle, Menu, X, GraduationCap } from "lucide-react";
import {
  coreModules,
  electiveModules,
  CORE_HOURS,
  ELECTIVE_HOURS,
  CORE_END_ID,
  isElective,
  COURSE_TITLE,
   formatHours,
  type Module,
} from "@/data/course";
import { lessonKey, useProgress } from "@/lib/progress";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function LmsLayout({ children }: { children: ReactNode }) {
  const params = useParams({ strict: false }) as { moduleId?: string; lessonId?: string };
  const activeM = Number(params.moduleId);
  const activeL = Number(params.lessonId);
  const done = useProgress();
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [mobile, setMobile] = useState(false);

  const coreTotal = coreModules.reduce((s, m) => s + m.lessons.length, 0);
  const coreKeys = new Set(
    coreModules.flatMap((m) => m.lessons.map((l) => lessonKey(m.id, l.id))),
  );
  const coreDone = done.filter((k) => coreKeys.has(k)).length;
  const electiveDone = done.filter((k) => !coreKeys.has(k)).length;
  const pct = Math.round((coreDone / coreTotal) * 100);

  const renderModule = (m: Module) => {
    const isOpen = open[m.id] ?? m.id === activeM;
    const mDone = m.lessons.filter((l) => done.includes(lessonKey(m.id, l.id))).length;
    return (
      <div key={m.id} className="mb-1">
        <Button
          variant="ghost"
          onClick={() => setOpen((o) => ({ ...o, [m.id]: !isOpen }))}
          className={cn(
            "flex h-auto w-full items-start justify-start gap-3 whitespace-normal rounded-md px-3 py-2.5 text-left text-sm hover:bg-sidebar-accent hover:text-sidebar-foreground",
            m.id === activeM && "bg-sidebar-accent",
          )}
        >
          <span className="mt-0.5 font-display text-xs text-sidebar-primary">
            {String(m.id).padStart(2, "0")}
          </span>
          <span className="flex-1 font-medium leading-snug">
            {m.title}
            {isElective(m.id) && (
              <span className="ml-1 rounded-full border border-sidebar-border px-1.5 py-0.5 text-[10px] font-normal uppercase tracking-wide opacity-70">
                по выбору
              </span>
            )}
            <span className="mt-0.5 block text-xs font-normal opacity-60">
              {mDone}/{m.lessons.length} · {formatHours(m.hours)} ч.
            </span>
          </span>
          <ChevronDown className={cn("mt-0.5 h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-180")} />
        </Button>
        {isOpen && (
          <ul className="ml-6 border-l border-sidebar-border py-1 pl-2">
            {m.lessons.map((l) => {
              const isDone = done.includes(lessonKey(m.id, l.id));
              const active = m.id === activeM && l.id === activeL;
              return (
                <li key={l.id}>
                  <Link
                    to="/lesson/$moduleId/$lessonId"
                    params={{ moduleId: String(m.id), lessonId: String(l.id) }}
                    onClick={() => setMobile(false)}
                    className={cn(
                      "flex items-start gap-2 rounded-md px-2 py-1.5 text-xs leading-snug opacity-80 hover:bg-sidebar-accent hover:opacity-100",
                      active && "bg-sidebar-primary text-sidebar-primary-foreground opacity-100 hover:bg-sidebar-primary",
                    )}
                  >
                    {isDone ? (
                      <CheckCircle2 className="mt-px h-3.5 w-3.5 shrink-0" />
                    ) : (
                      <Circle className="mt-px h-3.5 w-3.5 shrink-0" />
                    )}
                    <span className="min-w-0 flex-1">{l.title}{l.minutes && <span className="mt-1 block opacity-60">{l.minutes} мин</span>}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-80 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          mobile ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="border-b border-sidebar-border p-5">
          <Link to="/" onClick={() => setMobile(false)} className="block">
            <div className="text-xs uppercase tracking-widest text-sidebar-primary">
              Курс · {formatHours(CORE_HOURS)} ч. + {formatHours(ELECTIVE_HOURS)} ч. по выбору
            </div>
            <div className="mt-1 font-display text-lg font-bold leading-tight text-sidebar-accent-foreground">
              {COURSE_TITLE}
            </div>
          </Link>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-sidebar-accent">
            <div className="h-full bg-sidebar-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-1.5 text-xs opacity-70">
            {coreDone >= coreTotal
              ? "Основная часть пройдена — выберите направление"
              : `Основная часть: ${coreDone} из ${coreTotal} · ${pct}%`}
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {coreModules.map(renderModule)}
          <div className="mt-5 border-t border-sidebar-border px-3 pb-3 pt-4">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-sidebar-primary">
              <GraduationCap className="h-3.5 w-3.5 shrink-0" />
              Направление по выбору
            </div>
            <p className="mt-1.5 text-[11px] leading-snug opacity-60">
              Курс завершён на модуле {CORE_END_ID}. Дальше студент выбирает сам и занимается
              самостоятельно.
            </p>
            <p className="mt-1 text-[11px] opacity-60">Пройдено уроков по выбору: {electiveDone}</p>
          </div>
          {electiveModules.map(renderModule)}
        </nav>
      </aside>
      {mobile && <div className="fixed inset-0 z-30 bg-foreground/40 lg:hidden" onClick={() => setMobile(false)} />}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobile(!mobile)} aria-label="Меню" aria-expanded={mobile}>
            {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <span className="font-display text-sm font-bold">{COURSE_TITLE}</span>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
