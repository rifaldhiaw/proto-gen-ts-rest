import * as t from "proto-parser";
import { messageError } from "../constants/error";

const typeMap: Record<string, string> = {
  string: "z.string()",
  int32: "z.number()",
  int64: "z.number()",
  bool: "z.boolean()",
  float: "z.number()",
  double: "z.number()",
  bytes: "z.string()",
};

const IdentifierMap: Record<string, string> = {
  "google.protobuf.Timestamp": "z.string()",
};

export const transformMessage = (message: t.MessageDefinition) => {
  let result = "";

  result += `export const ${message.name} = z.object({`;

  if (!message.fields) {
    throw new Error(messageError.NO_FIELDS);
  }

  Object.values(message.fields).forEach((field) => {
    if (!field.type) {
      throw new Error(messageError.NO_TYPE);
    }

    const name = field?.options?.json_name || field.name;
    const isOptional = field.optional || !field.required;
    const isRepeated = field.repeated;

    switch (field.type.syntaxType) {
      case t.SyntaxType.BaseType:
        result += `\n  ${name}: ${typeMap[field.type.value]}`;
        if (isOptional) {
          result += ".optional()";
        }
        if (isRepeated) {
          result += ".array()";
        }
        result += ",";
        break;

      case t.SyntaxType.Identifier:
        const type = IdentifierMap[field.type.value] || field.type.value;
        result += `\n  ${name}: ${type},`;

      default:
        break;
    }
  });

  result += `\n});\n\n`;

  return result;
};
