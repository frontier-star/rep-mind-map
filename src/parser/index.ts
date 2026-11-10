import type { IProjectParser, ParseResult } from "../shared/index.js";

// Заглушка UC01: реальные файлы проекта пока не читаются.
export class ProjectParser implements IProjectParser {
  constructor() {}

  parseProject(projectPath: string): ParseResult {
    return {
      elements: [
        { id: "main", name: "main.ts", kind: "module", filePath: `${projectPath}/demo/main.ts`, line: 1, parentId: null },
        { id: "run", name: "run", kind: "function", filePath: `${projectPath}/demo/main.ts`, line: 3, parentId: "main" },
        { id: "helper", name: "helper", kind: "function", filePath: `${projectPath}/demo/helper.ts`, line: 1, parentId: null },
      ],
      dependencies: [
        { sourceId: "main", targetReference: "helper", kind: "import" },
        { sourceId: "run", targetReference: "helper", kind: "call" },
      ],
      parseErrors: [],
    };
  }
}
