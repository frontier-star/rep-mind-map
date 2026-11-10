import type {
  CodeElementKind,
  DependencyKind,
  DependencyState,
  GraphEdge,
  ProjectGraph,
} from "../shared/index.js";

export type ConnectionItem = {
  readonly elementName: string;
  readonly kind: DependencyKind;
  readonly state: DependencyState;
};

export type IGraphView = {
  highlightElements(selectedElementId: string, connectedElementIds: string[]): void;
  resetHighlight(): void;
};

export type IElementSelectionManager = {
  selectElement(elementId: string): void;
  clearSelection(): void;
};

export type IElementDetailsPanel = {
  showElementDetails(
    elementName: string,
    elementKind: CodeElementKind,
    filePath: string,
    line: number,
    incoming: ConnectionItem[],
    outgoing: ConnectionItem[],
  ): void;
  hide(): void;
};

export function getIncomingEdges(projectGraph: ProjectGraph, elementId: string): GraphEdge[] {
  return projectGraph.edges.filter((edge) => edge.targetId === elementId);
}

export function getOutgoingEdges(projectGraph: ProjectGraph, elementId: string): GraphEdge[] {
  return projectGraph.edges.filter((edge) => edge.sourceId === elementId);
}
