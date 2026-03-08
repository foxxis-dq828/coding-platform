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
    const spansMap = new Map<string, { text: string; type: string }>();
    const namesMap = new Map<string, string>();
    const edges: GraphEdge[] = [];

    // First pass: collect spans and names
    for (const result of results) {
      if (result.type === 'labels' && result.from_name === 'var_label') {
        const span = result as SpanResult;
        // Save the label type (Variable, Sample, Boundary_Condition, Control)
        const labelType = span.value.labels?.[0] || 'Variable';
        spansMap.set(span.id, { text: span.value.text, type: labelType });
      } else if (result.type === 'textarea' && result.from_name === 'var_name') {
        const textarea = result as TextAreaResult;
        const name = textarea.value.text?.[0];
        if (name) {
          namesMap.set(textarea.id, name);
        }
      } else if (result.type === 'relation') {
        const relation = result as RelationResult;
        const fullType = relation.labels?.[0] || 'relation';
        // Extract base type for display label (e.g., "moderation__validated" -> "moderation")
        const displayLabel = fullType.split('__')[0];
        edges.push({
          from: relation.from_id,
          to: relation.to_id,
          label: displayLabel,
          direction: relation.direction,
          type: fullType, // Keep full type for coloring
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
        type: span.type, // Add node type
      });
    }

    return { nodes, edges };
  }

  // Deep equality check for detecting changes
  isEqual(a: any, b: any): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }
}
