import { describe, expect, it } from "vitest";
import { moduleOneSources, moduleOneTimeline } from "@/data/module-one";
import { Route } from "@/routes/lesson.$moduleId.$lessonId";

describe("Chronology page navigation", () => {
  const validator = Route.options.validateSearch;
  const validate = (search: Record<string, unknown>) => {
    if (typeof validator !== "function") throw new Error("Expected slide search validation");
    return validator(search);
  };

  it("opens the first topic by default and keeps the second topic on page 2", () => {
    expect(validate({})).toEqual({});
    expect(moduleOneTimeline[0]?.lessonId).toBe(2);
    expect(validate({ slide: 2 })).toEqual({ slide: 2 });
    expect(moduleOneTimeline[1]?.lessonId).toBe(3);
  });

  it("keeps shared or refreshed page numbers within the eight-topic sequence", () => {
    expect(validate({ slide: "8" })).toEqual({ slide: 8 });
    expect(validate({ slide: 9 })).toEqual({});
    expect(validate({ slide: 0 })).toEqual({});
    expect(validate({ slide: 1.5 })).toEqual({});
  });
});

describe("Chronology key concepts", () => {
  const termsOn = (lessonId: number) =>
    (moduleOneTimeline.find((step) => step.lessonId === lessonId)?.frameworks ?? []).map((framework) => framework.term);

  it("places each named concept on its matching topic", () => {
    expect(termsOn(2)).toEqual(["No market need", "Problem Statement"]);
    expect(termsOn(3)).toEqual(["Jobs To Be Done (JTBD)"]);
    expect(termsOn(4)).toEqual(["HMW («How Might We»)"]);
  });

  it("resolves every concept citation against the shared source catalog", () => {
    const sourceIds = new Set(moduleOneSources.map((source) => source.id));
    for (const step of moduleOneTimeline) {
      for (const framework of step.frameworks ?? []) {
        expect(framework.note.length).toBeGreaterThan(0);
        expect(sourceIds.has(framework.sourceId)).toBe(true);
      }
    }
  });
});