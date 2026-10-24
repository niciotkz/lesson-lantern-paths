import { describe, expect, it } from "vitest";
import { moduleOneTimeline } from "@/data/module-one";
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