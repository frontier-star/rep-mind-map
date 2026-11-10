import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { IPageGenerator, ProjectGraph } from "../shared/index.js";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "\"": return "&quot;";
      default: return "&#39;";
    }
  });
}

// Статичная SVG-заглушка вместо будущей интерактивной отрисовки Renderer.
function renderStaticGraph(projectGraph: ProjectGraph): string {
  const positions = new Map(projectGraph.nodes.map((node, index) => [
    node.id, { x: 40 + index * 260, y: 100 + (index % 2) * 120 },
  ]));
  const edges = projectGraph.edges.map((edge) => {
    const source = positions.get(edge.sourceId);
    const target = edge.targetId === null ? undefined : positions.get(edge.targetId);
    if (!source || !target) return "";

    return `<g class="graphView__edge"><line x1="${source.x + 200}" y1="${source.y + 32}"
      x2="${target.x}" y2="${target.y + 32}" marker-end="url(#arrow)" />
      <text x="${(source.x + 200 + target.x) / 2}" y="${(source.y + target.y) / 2 + 20}">${escapeHtml(edge.kind)}</text></g>`;
  }).join("");
  const nodes = projectGraph.nodes.map((node) => {
    const position = positions.get(node.id);
    if (!position) return "";

    return `<g class="graphView__node" transform="translate(${position.x}, ${position.y})">
      <title>${escapeHtml(node.filePath)}:${node.line}</title>
      <rect width="200" height="64" rx="8" />
      <text x="16" y="27">${escapeHtml(node.name)}</text>
      <text class="graphView__kind" x="16" y="49">${escapeHtml(node.kind)}</text></g>`;
  }).join("");

  return `<svg width="${Math.max(800, projectGraph.nodes.length * 260 + 40)}" height="360"
    role="img" aria-labelledby="graphTitle">
    <title id="graphTitle">Демонстрационный граф зависимостей</title>
    <defs><marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8"
      markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker></defs>
    ${edges}${nodes}</svg>`;
}

export class HtmlPageGenerator implements IPageGenerator {
  constructor() {}

  generatePage(projectGraph: ProjectGraph, outputPath: string): string {
    const pagePath = resolve(outputPath);
    // JSON находится внутри script: экранирование < не позволяет закрыть тег данными.
    const graphJson = JSON.stringify(projectGraph).replace(/</g, "\\u003c");
    const elements = projectGraph.nodes.map((node) => `<li><strong>${escapeHtml(node.name)}</strong>
      — ${escapeHtml(node.filePath)}:${node.line}</li>`).join("");
    const dependencies = projectGraph.edges.map((edge) => `<li>${escapeHtml(edge.sourceId)} →
      ${escapeHtml(edge.targetId ?? edge.targetReference)} · ${escapeHtml(edge.kind)} · ${escapeHtml(edge.state)}</li>`).join("");
    const html = `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>rep-mind-map — UC01</title>
  <style>
    body { margin: 0; padding: 32px; background: #f5f5f5; color: #222; font: 16px system-ui, sans-serif; }
    main { max-width: 1000px; margin: 0 auto; }
    h1 { margin: 0 0 16px; font-size: 32px; }
    p, li { line-height: 1.6; }
    .graphView { overflow: auto; border: 1px solid #ccc; border-radius: 12px; background: #fff; }
    .graphView__node rect { fill: #fff; stroke: #222; }
    .graphView__node text { fill: #222; font-size: 16px; }
    .graphView__node .graphView__kind { fill: #666; font-size: 13px; }
    .graphView__edge line { stroke: #666; stroke-width: 2px; }
    .graphView__edge text { fill: #666; font-size: 13px; text-anchor: middle; }
    li { overflow-wrap: anywhere; }
  </style>
</head>
<body>
  <main>
    <h1>rep-mind-map</h1>
    <p><strong>UC01 · Демонстрационный режим</strong></p>
    <p>Конвейер CLI → Parser → Graph Builder → HTML работает на заглушках.
      Это не результат анализа проекта. Масштабирование, перетаскивание и выбор узлов пока не реализованы.</p>
    <p>Элементов: ${projectGraph.nodes.length} · Связей: ${projectGraph.edges.length} · Циклов: ${projectGraph.cycles.length}</p>
    <section class="graphView" aria-label="Статический граф">${renderStaticGraph(projectGraph)}</section>
    <h2>Элементы</h2><ul>${elements}</ul>
    <h2>Зависимости</h2><ul>${dependencies}</ul>
  </main>
  <script id="projectGraph" type="application/json">${graphJson}</script>
</body>
</html>`;

    mkdirSync(dirname(pagePath), { recursive: true });
    writeFileSync(pagePath, html, "utf8");
    return pagePath;
  }
}
