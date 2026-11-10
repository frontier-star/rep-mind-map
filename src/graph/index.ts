import type { IGraphBuilder, ParseResult, ProjectGraph } from "../shared/index.js";

// Заглушка UC01: ссылки уже содержат id, поиск циклов ещё не реализован.
export class GraphBuilder implements IGraphBuilder {
  constructor() {}

  buildGraph(parseResult: ParseResult): ProjectGraph {
    const elementIds = new Set(parseResult.elements.map((element) => element.id));

    return {
      nodes: [...parseResult.elements],
      edges: parseResult.dependencies.map((dependency, dependencyIndex) => {
        const targetExists = elementIds.has(dependency.targetReference);

        return {
          id: `dependency-${dependencyIndex + 1}`,
          sourceId: dependency.sourceId,
          targetId: targetExists ? dependency.targetReference : null,
          targetReference: dependency.targetReference,
          kind: dependency.kind,
          state: targetExists ? "valid" : "broken",
        };
      }),
      cycles: [],
    };
  }
}
