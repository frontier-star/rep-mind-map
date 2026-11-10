export type CodeElementKind = "module" | "class" | "function" | "method";
export type DependencyKind = "import" | "call";
export type DependencyState = "valid" | "broken" | "cyclic";

export type CodeElement = {
  readonly id: string;
  readonly name: string;
  readonly kind: CodeElementKind;
  readonly filePath: string;
  readonly line: number;
  readonly parentId: string | null;
};

// На диаграмме узлы графа представлены теми же элементами кода.
export type GraphNode = CodeElement;

export type Dependency = {
  readonly sourceId: string;
  readonly targetReference: string;
  readonly kind: DependencyKind;
};

export type ParseError = {
  readonly filePath: string;
  readonly line: number;
  readonly message: string;
};

export type ParseResult = {
  readonly elements: CodeElement[];
  readonly dependencies: Dependency[];
  readonly parseErrors: ParseError[];
};

export type GraphEdge = {
  readonly id: string;
  readonly sourceId: string;
  // null означает, что целевой элемент не удалось разрешить.
  readonly targetId: string | null;
  readonly targetReference: string;
  readonly kind: DependencyKind;
  state: DependencyState;
};

export type DependencyCycle = {
  readonly edgeIds: string[];
};

// Только JSON-данные; операции поиска связей находятся в Renderer.
export type ProjectGraph = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  cycles: DependencyCycle[];
};

export type IProjectParser = {
  parseProject(projectPath: string): ParseResult;
};

export type IGraphBuilder = {
  buildGraph(parseResult: ParseResult): ProjectGraph;
};

export type IPageGenerator = {
  generatePage(projectGraph: ProjectGraph, outputPath: string): string;
};

export type IBrowserLauncher = {
  openInBrowser(pagePath: string): boolean;
};

export type IGraphBuildManager = {
  buildProjectGraph(projectPath: string): void;
};

export type IConsoleView = {
  start(projectPath: string): void;
  showFilesFound(fileCount: number): void;
  showAnalysisSummary(
    elementCount: number,
    dependencyCount: number,
    cycleCount: number,
    parseErrorCount: number,
  ): void;
};
