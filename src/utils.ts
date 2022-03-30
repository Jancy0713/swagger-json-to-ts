import { existsSync, mkdirSync, readFileSync, statSync } from "fs"
import { ISwagger2Schema, Swagger2Format, Swagger2Type, TsType } from "./interfaces";

export const readJson = (fileName: string): Object => {
  return JSON.parse(readFileSync(fileName, {
    encoding: "utf-8"
  }) || "{}")
}

export const judgementDir = (dirPath: string): boolean => {
  const outputExist = existsSync(dirPath);
  if (!outputExist) {
    mkdirSync(dirPath)
  }
  return statSync(dirPath).isDirectory()
}

export const typeAndFormat2TsType = (schema: ISwagger2Schema): string => {
  if (schema.type === Swagger2Type.INTEGER || schema.type === Swagger2Type.NUMBER) {
    return TsType.NUMBER
  } else if (schema.type === Swagger2Type.BOOLEAN) {
    return TsType.BOOLEAN
  }
  if (schema.format === Swagger2Format.DATE || schema.format === Swagger2Format.DATE_TIME) {
    return TsType.DATE
  } else {
    return TsType.STRING
  }
  return ""
}

export const getFilterKey = (str: string) => {
  return str.replace(/[^a-zA-Z0-9]/g, "")
}
