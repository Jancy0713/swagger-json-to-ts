import {  writeFileSync } from "fs"
import { join } from "path"
import { IConfig, ISwagger2, ISwagger2Schema, Swagger2Type } from "./interfaces"
import { commentRender } from "./template/commentRender"
import { interfaceRender } from "./template/interfaceRender"
import { modelRender } from "./template/modelRender"
import { getFilterKey, judgementDir, readJson, typeAndFormat2TsType } from "./utils"

const ejs = require('ejs')

const configFileName = "config.json"
const config = readJson(configFileName) as IConfig
const mainJson = readJson(config.main) as ISwagger2

const info = mainJson.info
let api = ""


const createBaseDir = (): string => {
  const basePath = join(__dirname, "../" + (config.outputDir || "swagger"))
  const isDirectory = judgementDir(basePath)
  if (!isDirectory) { throw Error("输出目录异常")}
  return basePath
}

const createChildDir = (basePath: string, path: string): string => {
  const dirPath = join(basePath, `./${path}`)
  const isDirectory = judgementDir(dirPath)
  if (!isDirectory) { throw Error("model输出目录异常")}
  return dirPath
}

const createModelFileInterface = (path: string) => {
  const definitions = mainJson.definitions
  const info = mainJson.info
  Object.keys(definitions).forEach((key, index) => {
    const schema = definitions[key]
    const refList: string[] = []
    const filterKey = getFilterKey(key)
    const interfaceStr = Object.keys(schema.properties || {}).map((propertyKey) => {
      return getTypeRender(propertyKey, schema, refList, definitions)
    }).join("\n")
    const refImportStr = refList.filter((item) => item !== filterKey).map((item) => `import { ${item} } from './${item}';\n`).join("")
    const model = ejs.render(modelRender, {
      info, schema,
      title: getFilterKey(schema.title),
      comment: schema.description ? ejs.render(commentRender, { description: schema.description, indentLength: 0 }) : "",
      interfaceStr,
      refImportStr
    })
    writeFileSync(join(path, filterKey + ".ts"), model, {
      encoding: "utf-8",
    })
  })
}

const getTypeRender = (
  key: string,
  schema: ISwagger2Schema,
  refList: string[],
  definitions: { [x: string]: ISwagger2Schema}
): string => {
  const value = schema.properties[key]
  const { description, type } = getTypeRenderObject(value, refList, definitions)
  const comment = description ? ejs.render(commentRender, { description, indentLength: 2 }) : ""
  return ejs.render(interfaceRender, {
    key: getFilterKey(key),
    comment,
    isRequire: (schema.required || []).includes(key),
    type,
  })
}

const getTypeRenderObject = (
  value: ISwagger2Schema,
  refList: string[],
  definitions: { [x: string]: ISwagger2Schema}
): {
  description?: string
  type: string
} => {
  let type
  let description = value.description
  const originalRef = value.originalRef
  if (originalRef) {
    type = getFilterKey(originalRef)
    refList.push(type)
    description = description || definitions[originalRef].description
  } else if (value.type === Swagger2Type.ARRAY) {
    const children = getTypeRenderObject(value.items, refList, definitions)
    type = `Array<${children.type}>`
    description = description || definitions[children.type].description
  } else {
    type = typeAndFormat2TsType(value)
  }
  return {
    description,
    type,
  }
}



(
  function() {
    const basePath = createBaseDir()
    const modelDir = createChildDir(basePath, "model")
    createModelFileInterface(modelDir)
    const apiDir = createChildDir(basePath, "api")
  }
)()
// statSync
// // mkdir(config.output || "swagger/")
