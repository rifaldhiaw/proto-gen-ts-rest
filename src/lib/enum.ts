import * as t from "proto-parser";
import { enumError } from "../constants/error";

export const transformEnum = (enumDef: t.EnumDefinition) => {
  let result = `export const ${enumDef.name} = z.enum([`;

  if (!enumDef.values || Object.keys(enumDef.values).length === 0) {
    throw new Error(enumError.NO_VALUES);
  }

  const values = Object.keys(enumDef.values)
    .map((key) => `"${key}"`)
    .join(", ");

  result += `${values}`;
  result += `]);\n\n`;

  return result;
};
