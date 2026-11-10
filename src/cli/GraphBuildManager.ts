import type {
  IBrowserLauncher,
  IConsoleView,
  IGraphBuilder,
  IGraphBuildManager,
  IPageGenerator,
  IProjectParser,
} from "../shared/index.js";

export class GraphBuildManager implements IGraphBuildManager {
  private projectParser: IProjectParser;
  private graphBuilder: IGraphBuilder;
  private pageGenerator: IPageGenerator;
  private browserLauncher: IBrowserLauncher;
  private consoleView: IConsoleView;
  private outputPath: string;

  constructor(
    projectParser: IProjectParser,
    graphBuilder: IGraphBuilder,
    pageGenerator: IPageGenerator,
    browserLauncher: IBrowserLauncher,
    consoleView: IConsoleView,
    outputPath: string,
  ) {
    this.projectParser = projectParser;
    this.graphBuilder = graphBuilder;
    this.pageGenerator = pageGenerator;
    this.browserLauncher = browserLauncher;
    this.consoleView = consoleView;
    this.outputPath = outputPath;
  }

  buildProjectGraph(projectPath: string): void {
    this.consoleView.start(projectPath);
    const parseResult = this.projectParser.parseProject(projectPath);
    const fileCount = new Set(parseResult.elements.map((element) => element.filePath)).size;
    this.consoleView.showFilesFound(fileCount);

    const projectGraph = this.graphBuilder.buildGraph(parseResult);
    this.consoleView.showAnalysisSummary(
      projectGraph.nodes.length,
      projectGraph.edges.length,
      projectGraph.cycles.length,
      parseResult.parseErrors.length,
    );

    const pagePath = this.pageGenerator.generatePage(projectGraph, this.outputPath);
    console.log(`Страница сохранена: ${pagePath}`);
    if (!this.browserLauncher.openInBrowser(pagePath)) {
      console.warn("Не удалось открыть браузер автоматически. Откройте сохранённый HTML вручную.");
      return;
    }
    console.log("Команда открытия страницы передана браузеру.");
  }
}
