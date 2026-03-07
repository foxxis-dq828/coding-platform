import {
  AnnotationResult,
  SpanResult,
  TextAreaResult,
  RelationResult,
  ParsedData,
  GraphNode,
  GraphEdge,
} from '../types';

export class ResultParser {
  parse(results: AnnotationResult[]): ParsedData {
    // Build maps
    const spansMap = new Map<string, { text: string }>();
    const namesMap = new Map<string, string>();
    const edges: GraphEdge[] = [];

    // First pass: collect spans and names
    for (const result of results) {
      if (result.type === 'labels' && result.from_name === 'var_label') {
        const span = result as SpanResult;
        spansMap.set(span.id, { text: span.value.text });
      } else if (result.type === 'textarea' && result.from_name === 'var_name') {
        const textarea = result as TextAreaResult;
        const name = textarea.value.text?.[0];
        if (name) {
          namesMap.set(textarea.id, name);
        }
      } else if (result.type === 'relation') {
        const relation = result as RelationResult;
        edges.push({
          from: relation.from_id,
          to: relation.to_id,
          label: relation.labels?.[0] || 'relation',
          direction: relation.direction,
        });
      }
    }

    // Build nodes list
    const nodes: GraphNode[] = [];
    for (const [id, span] of spansMap.entries()) {
      const label = namesMap.get(id) || span.text;
      nodes.push({
        id,
        label,
        rawText: span.text,
      });
    }

    return { nodes, edges };
  }

  // Deep equality check for detecting changes
  isEqual(a: any, b: any): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }
}
