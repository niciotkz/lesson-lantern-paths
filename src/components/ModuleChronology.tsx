import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock3, Maximize, Minimize, Search, Users, Lightbulb, FlaskConical, PanelsTopLeft, ScanSearch, Combine, NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { moduleOneCase, moduleOneCaseFields, moduleOneSources, moduleOneTimeline } from "@/data/module-one";
import { cn } from "@/lib/utils";

const icons = [Search, Users, Lightbulb, FlaskConical, PanelsTopLeft, ScanSearch, Combine, NotebookPen];
const labels = ["Проблема", "Аудитория", "Гипотезы", "Спрос", "Прототип", "Аналоги", "Новизна", "Паспорт"];

export function ModuleChronology() {
  const search = useSearch({ strict: false }) as { slide?: number };
  const navigate = useNavigate();
  const index = Math.min(moduleOneTimeline.length - 1, Math.max(0, (search.slide ?? 1) - 1));
  const step = moduleOneTimeline[index];
  const Icon = icons[index] ?? Search;
  const container = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setScale(Math.min(entry.contentRect.width / 1920, entry.contentRect.height / 1080));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const changed = () => setFullscreen(document.fullscreenElement === container.current);
    document.addEventListener("fullscreenchange", changed);
    return () => document.removeEventListener("fullscreenchange", changed);
  }, []);

  const go = (next: number) => {
    if (next < 0 || next >= moduleOneTimeline.length) return;
    void navigate({ to: "/lesson/$moduleId/$lessonId", params: { moduleId: "1", lessonId: "1" }, search: { slide: next + 1 }, replace: true, resetScroll: false });
  };
  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await container.current?.requestFullscreen();
    } catch { setFullscreen(false); }
  };
  if (!step) return null;

  return (
    <section ref={container} className={cn("chronology mt-8 border-y bg-card", fullscreen && "chronology-fullscreen")} aria-label="Презентация: хронология модуля"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          go(index + (event.key === "ArrowRight" ? 1 : -1));
        }
      }}>
      <header className="flex items-center justify-between gap-3 border-b px-4 py-3">
        <div className="min-w-0"><h2 className="text-sm font-semibold">Хронология модуля</h2><p className="mt-1 text-xs text-muted-foreground">Customer Development · 8 тем · 90 минут</p></div>
        <Button variant="ghost" size="icon" onClick={toggleFullscreen} title={fullscreen ? "Выйти из презентации" : "На весь экран"} aria-label={fullscreen ? "Выйти из презентации" : "На весь экран"}>{fullscreen ? <Minimize /> : <Maximize />}</Button>
      </header>

      <div ref={canvas} className="chronology-canvas"
        onTouchStart={(event) => { const point = event.touches[0]; if (point) touch.current = { x: point.clientX, y: point.clientY }; }}
        onTouchEnd={(event) => {
          const point = event.changedTouches[0];
          if (point && touch.current) {
            const dx = point.clientX - touch.current.x;
            const dy = point.clientY - touch.current.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1));
          }
          touch.current = null;
        }}>
        <article key={index} className="chronology-slide" style={{ "--slide-scale": scale } as React.CSSProperties} aria-label={`Страница ${index + 1}: ${step.title}`}>
          <div className="chronology-kicker text-muted-foreground"><span>МОДУЛЬ 01 · CUSTOMER DEVELOPMENT</span><span className="chronology-duration"><Clock3 />{step.minutes} мин</span></div>
          <div className="chronology-heading">
            <div className="chronology-symbol bg-primary text-primary-foreground"><Icon strokeWidth={1.5} /></div>
            <h3 className="chronology-title">{step.title}</h3>
            <span className="chronology-number text-primary" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          </div>
          {step.lessonId === 9 ? <dl className="chronology-content chronology-passport" aria-label="Паспорт идеи">
            {moduleOneCaseFields.map((field) => <div key={field.label}>
              <dt className="chronology-label text-primary">{field.label}</dt>
              <dd>{field.value}</dd>
            </div>)}
          </dl> : <div className="chronology-content">
            <section className="chronology-principle" aria-label="Главная мысль">
              <h4 className="chronology-label text-primary">Главная мысль</h4>
              <p className="chronology-essence">{step.essence}</p>
              <p className="chronology-definition text-muted-foreground">{step.definition}</p>
              {step.frameworks && step.frameworks.length > 0 && <dl className="chronology-frameworks" aria-label="Ключевые понятия темы">
                {step.frameworks.map((framework) => {
                  const source = moduleOneSources.find((item) => item.id === framework.sourceId);
                  return <div key={framework.term} className="chronology-framework">
                    <dt className="chronology-framework-term text-primary">{framework.term}</dt>
                    <dd className="chronology-framework-note text-muted-foreground">{framework.note}{source && <> (<a href={source.url} target="_blank" rel="noopener noreferrer" title={source.title} className="underline underline-offset-4 hover:text-primary">{source.publisher}</a>)</>}</dd>
                  </div>;
                })}
              </dl>}
            </section>
            <section className="chronology-method" aria-label="Как делается">
              <h4 className="chronology-label text-primary">Как делается</h4>
              <ol className="chronology-steps">
                {step.how.split(";").map((instruction, position) => <li key={instruction}><span className="chronology-step-number text-primary" aria-hidden="true">{String(position + 1).padStart(2, "0")}</span><p>{instruction.trim().replace(/^./, (letter) => letter.toUpperCase())}</p></li>)}
              </ol>
              <div className="chronology-example bg-secondary text-secondary-foreground">
                <h4 className="chronology-label text-primary">Учебный пример</h4>
                <p>{step.example}</p>
              </div>
            </section>
          </div>}
          <aside className="chronology-importance" aria-label="Почему это важно для стартапа">
            <h4 className="chronology-label text-primary">Почему это важно<br className="chronology-desktop-break" /> для стартапа</h4>
            <p>{step.importance}</p>
          </aside>
          <footer className="chronology-slide-footer">
            <div className="chronology-sources text-muted-foreground"><span>Источники:</span>{Array.from(new Set([...step.importanceSourceIds, ...(step.frameworks ?? []).map((framework) => framework.sourceId)])).map((id) => {
              const source = moduleOneSources.find((item) => item.id === id);
              return source ? <a key={id} href={source.url} target="_blank" rel="noopener noreferrer" title={source.title} className="underline underline-offset-4 hover:text-primary">{source.publisher}</a> : null;
            })}</div>
            <Button asChild variant="link" className="chronology-lesson-link"><Link to="/lesson/$moduleId/$lessonId" params={{ moduleId: "1", lessonId: String(step.lessonId) }} onClick={() => { if (document.fullscreenElement) void document.exitFullscreen(); }}>К уроку <ArrowUpRight /></Link></Button>
          </footer>
        </article>
      </div>

      <nav className="chronology-track flex border-y px-3 py-4" aria-label="Темы хронологии">
        {moduleOneTimeline.map((item, position) => <div key={item.lessonId} className="relative min-w-0 flex-1 text-center">
          {position < moduleOneTimeline.length - 1 && <div className={cn("absolute left-1/2 right-[-50%] top-4 h-px", position < index ? "bg-primary" : "bg-border")} />}
          <Button variant={position === index ? "default" : "outline"} className="relative z-10 size-8 rounded-full p-0 text-xs" aria-label={`Страница ${position + 1}: ${item.title}`} aria-current={position === index ? "step" : undefined} onClick={() => go(position)}>{position + 1}</Button>
          <span className={cn("mt-2 block text-[10px] sm:text-xs", position === index ? "font-semibold text-primary" : "text-muted-foreground")}>{labels[position]}</span>
        </div>)}
      </nav>
      <div className="flex items-center justify-between px-4 py-3">
        <Button variant="outline" size="icon" disabled={index === 0} onClick={() => go(index - 1)} title="Предыдущая страница" aria-label="Предыдущая страница"><ArrowLeft /></Button>
        <span className="text-xs tabular-nums text-muted-foreground" role="status" aria-live="polite">Страница <span className="font-semibold text-foreground">{index + 1}</span> / {moduleOneTimeline.length}</span>
        <Button size="icon" disabled={index === moduleOneTimeline.length - 1} onClick={() => go(index + 1)} title="Следующая страница" aria-label="Следующая страница"><ArrowRight /></Button>
      </div>
    </section>
  );
}