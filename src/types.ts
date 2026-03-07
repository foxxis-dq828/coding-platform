export interface Task {
  id: number;
  data: {
    AB: string;
    [key: string]: any;
  };
  annotations?: Annotation[];
}

export interface Annotation {
  id?: number;
  result: AnnotationResult[];
  task?: number;
}

export interface AnnotationResult {
  id: string;
  type: string;
  from_name: string;
  to_name?: string;
  value: any;
  origin?: string;
}

export interface SpanResult extends AnnotationResult {
  type: 'labels';
  value: {
    start: number;
    end: number;
    text: string;
    labels: string[];
  };
}

export interface TextAreaResult extends AnnotationResult {
  type: 'textarea';
  value: {
    text: string[];
  };
}

export interface RelationResult extends AnnotationResult {
  type: 'relation';
  from_id: string;
  to_id: string;
  direction: string;
  labels?: string[];
}

export interface ParsedData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphNode {
  id: string;
  label: string;
  rawText: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  label: string;
  direction: string;
}

export interface LabelStudioConfig {
  url: string;
  token: string;
  refreshToken?: string;
  projectId: number;
  username?: string;
}

export interface ProjectCreateParams {
  title: string;
  label_config: string;
  description?: string;
}

export interface TaskImportData {
  AB: string;
  [key: string]: any;
}
