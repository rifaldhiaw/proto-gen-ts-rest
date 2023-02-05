import * as t from "proto-parser";
import { describe, expect, it } from "vitest";
import { enumError } from "../constants/error";
import { transformEnum } from "./enum";

describe("EnumDefinition transformer", () => {
  it("transform EnumDefinition to Zod Enum", () => {
    const dummyEnum: t.EnumDefinition = {
      name: "Status",
      fullName: ".event.Status",
      syntaxType: t.SyntaxType.EnumDefinition,
      values: {
        None: 0,
        Wait: 1,
        Created: 2,
        Live: 3,
      },
    };
    const expected = `export const Status = z.enum(["None", "Wait", "Created", "Live"]);\n\n`;

    const result = transformEnum(dummyEnum);
    expect(result).toBe(expected);
  });

  it("throw error if EnumDefinition has no values", () => {
    const dummyEnum: t.EnumDefinition = {
      name: "Status",
      fullName: ".event.Status",
      syntaxType: t.SyntaxType.EnumDefinition,
      values: {},
    };

    expect(() => transformEnum(dummyEnum)).toThrowError(enumError.NO_VALUES);
  });
});
