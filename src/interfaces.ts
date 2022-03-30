export interface IConfig {
  main: string
  outputDir?: string
}

export interface ISwagger2 {
  swagger: string
  info: ISwagger2Info
  host: string
  basePath: string
  definitions: { [x: string]: ISwagger2Schema }
}

export interface ISwagger2Info {
  title: string
  description: string
  termsOfService: string
  contact: ISwagger2Contact
  license: ISwagger2License
  version: string
}

export interface ISwagger2Contact {
  name: string
  email: string
  url: string
}

export interface ISwagger2License {
  name: string
  url: string
}

export interface ISwagger2Schema {
  type: Swagger2Type
  format: Swagger2Format
  title: string
  description: string
  originalRef: string
  $ref: string
  properties: { [x: string]: ISwagger2Schema }
  required: string[]
  items: ISwagger2Schema
}

export enum Swagger2Type {
  OBJECT = "object",
  ARRAY = "array",
  INTEGER = "integer",
  NUMBER = "number",
  STRING = "string",
  BOOLEAN = "boolean",
}

export enum Swagger2Format {
  INT32 = "int32",
  INT64 = "int64",
  FLOAT = "float",
  DOUBLE = "double",
  BYTE = "byte",
  BINARY = "binary",
  DATE = "date",
  DATE_TIME = "date-time",
  PASSWORD = "password",
}

export enum TsType {
  NUMBER = "number",
  STRING = "string",
  BOOLEAN = "boolean",
  DATE = "Date",
  ARRAY = "Array",
}
