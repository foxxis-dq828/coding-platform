import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore - vis-network type definitions
import { Network, DataSet } from 'vis-network/standalone';
import { ParsedData } from '../types';
import './GraphPanel.css';

interface GraphPanelProps {
  data: ParsedData;
}

export const GraphPanel: React.FC<GraphPanelProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Prepare nodes for vis-network
    const nodes = new DataSet(
      data.nodes.map(node => ({
        id: node.id,
        label: node.label,
        title: node.rawText,
        color: {
          background: '#ffa726',
          border: '#f57c00',
          highlight: {
            background: '#ff9800',
            border: '#e65100',
          },
        },
        font: {
          color: '#000000',
          size: 14,
        },
      }))
    );

    // Prepare edges for vis-network
    const edges = new DataSet(
      data.edges.map((edge, idx) => ({
        id: `edge-${idx}`,
        from: edge.from,
        to: edge.to,
        label: edge.label,
        arrows: edge.direction === 'right' ? 'to' : edge.direction === 'left' ? 'from' : 'to',
        color: {
          color: getEdgeColor(edge.label),
          highlight: getEdgeColor(edge.label),
        },
        font: {
          size: 12,
          align: 'middle',
        },
      }))
    );

    const options = {
      nodes: {
        shape: 'box',
        margin: 10,
        widthConstraint: {
          maximum: 150,
        },
      },
      edges: {
        smooth: {
          type: 'cubicBezier',
          forceDirection: 'horizontal',
          roundness: 0.4,
        },
        width: 2,
      },
      physics: {
        enabled: true,
        stabilization: {
          iterations: 200,
        },
        barnesHut: {
          gravitationalConstant: -2000,
          springConstant: 0.04,
          springLength: 150,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
      },
      layout: {
        hierarchical: {
          enabled: false,
        },
      },
    };

    // Create network
    if (networkRef.current) {
      networkRef.current.destroy();
    }

    const network = new Network(containerRef.current, { nodes, edges }, options);
    networkRef.current = network;

    // Handle node selection
    network.on('selectNode', (params: any) => {
      if (params.nodes.length > 0) {
        setSelectedNode(params.nodes[0]);
      }
    });

    network.on('deselectNode', () => {
      setSelectedNode(null);
    });

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [data]);

  const getEdgeColor = (label: string): string => {
    const colors: Record<string, string> = {
      moderation: '#ffd54f',
      direction: '#90caf9',
      correlation: '#a5d6a7',
      hierarchy: '#b39ddb',
    };
    return colors[label] || '#999999';
  };

  const selectedNodeData = data.nodes.find(n => n.id === selectedNode);

  return (
    <div className="graph-panel">
      <div className="graph-header">
        <h3>Relationship Network</h3>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          📊 {data.nodes.length} nodes, {data.edges.length} edges
        </div>
        {selectedNodeData && (
          <div className="selected-node">
            <strong>Selected:</strong> {selectedNodeData.label}
            {selectedNodeData.label !== selectedNodeData.rawText && (
              <span className="raw-text"> (raw: {selectedNodeData.rawText})</span>
            )}
          </div>
        )}
      </div>

      <div ref={containerRef} className="graph-container" />

      <div className="edges-table">
        <h4>Relations</h4>
        {data.edges.length === 0 ? (
          <p className="no-data">No relations created yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>Type</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              {data.edges.map((edge, idx) => {
                const fromNode = data.nodes.find(n => n.id === edge.from);
                const toNode = data.nodes.find(n => n.id === edge.to);
                return (
                  <tr key={idx}>
                    <td>{fromNode?.label || edge.from}</td>
                    <td>
                      <span
                        className="relation-badge"
                        style={{ backgroundColor: getEdgeColor(edge.label) }}
                      >
                        {edge.label}
                      </span>
                    </td>
                    <td>{toNode?.label || edge.to}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
