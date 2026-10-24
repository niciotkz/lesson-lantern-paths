import { describe, expect, it } from "vitest";
import { CORE_HOURS, ELECTIVE_HOURS, TOTAL_HOURS, modules } from "@/data/course";
import { moduleOneContent, moduleOneWorkbookFields } from "@/data/module-one";
import { createWorkbookText } from "@/lib/module-workbook";

describe("Module 1 duration", () => {
  it("lasts exactly the requested 1.5 hours", () => {
    expect(modules.find((module) => module.id === 1)?.hours).toBe(1.5);
  });

  it("allocates exactly 90 minutes across all nine lessons", () => {
    const lessons = modules.find((module) => module.id === 1)?.lessons ?? [];
    expect(lessons).toHaveLength(9);
    expect(lessons.every((lesson) => typeof lesson.minutes === "number" && lesson.minutes > 0)).toBe(true);
    expect(lessons.reduce((sum, lesson) => sum + (lesson.minutes ?? 0), 0)).toBe(90);
  });

  it("propagates the shortened module into course totals", () => {
    expect(CORE_HOURS).toBe(107.5);
    expect(ELECTIVE_HOURS).toBe(20);
    expect(TOTAL_HOURS).toBe(127.5);
  });

  it("keeps theory, practice and checks within each lesson's allocation", () => {
    const lessons = modules.find((module) => module.id === 1)?.lessons ?? [];
    expect(moduleOneContent).toHaveLength(9);
    for (const lesson of lessons) {
      const content = moduleOneContent.find((item) => item.lessonId === lesson.id);
      expect(content).toBeDefined();
      expect((content?.timing.theory ?? 0) + (content?.timing.practice ?? 0) + (content?.timing.check ?? 0)).toBe(lesson.minutes);
    }
  });
});

describe("Module workbook", () => {
  it("exports entered answers across lessons without inventing unfilled answers", () => {
    const output = createWorkbookText(moduleOneWorkbookFields, { problem: "Конкретная проблема", next: "Провести интервью" });
    expect(output).toContain("Конкретная проблема");
    expect(output).toContain("Провести интервью");
    expect(output).toContain("[Не заполнено]");
    expect(new Set(moduleOneWorkbookFields.map((field) => field.id)).size).toBe(moduleOneWorkbookFields.length);
  });
});