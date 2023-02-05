import * as t from "proto-parser";
import { describe, expect, it } from "vitest";
import { transformMessage } from "./message";

const createDummyMessageWithFields = (fields: any[]) => {
  return {
    name: "EventCreateRequest",
    fullName: ".event.EventCreateRequest",
    comment: null,
    syntaxType: "MessageDefinition",
    fields: fields.reduce((acc, field) => {
      acc[field.name] = field;
      return acc;
    }, {} as Record<string, t.FieldDefinition>),
  };
};

const createDummyMessageWithConfig = (config: {
  required?: boolean;
  optional?: boolean;
  repeated?: boolean;
  map?: boolean;
}) => {
  return createDummyMessageWithFields([
    {
      name: "Name",
      options: {
        json_name: "name",
      },
      fullName: ".event.EventCreateRequest.Name",
      comment: undefined,
      type: {
        value: "string",
        syntaxType: t.SyntaxType.BaseType,
      },
      id: 1,
      required: config.required || false,
      optional: config.optional || false,
      repeated: config.repeated || false,
      map: config.map || false,
    },
  ]);
};

describe("Message transformer", () => {
  it("transform optional string field", () => {
    const dummyMessage = createDummyMessageWithConfig({
      optional: true,
    });

    const expected = `export const EventCreateRequest = z.object({
  name: z.string().optional(),
});\n\n`;

    const result = transformMessage(
      dummyMessage as unknown as t.MessageDefinition
    );
    expect(result).toBe(expected);
  });

  it("transform required string field", () => {
    const dummyMessage = createDummyMessageWithConfig({
      required: true,
    });

    const expected = `export const EventCreateRequest = z.object({
  name: z.string(),
});\n\n`;

    const result = transformMessage(
      dummyMessage as unknown as t.MessageDefinition
    );
    expect(result).toBe(expected);
  });

  it("transform repeated required string field", () => {
    const dummyMessage = createDummyMessageWithConfig({
      repeated: true,
      required: true,
    });

    const expected = `export const EventCreateRequest = z.object({
  name: z.string().array(),
});\n\n`;

    const result = transformMessage(
      dummyMessage as unknown as t.MessageDefinition
    );

    expect(result).toBe(expected);
  });
});
