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

  // Get node color based on type
  const getNodeColor = (type?: string) => {
    const colors: Record<string, { bg: string; border: string }> = {
      Variable: { bg: '#ffa726', border: '#f57c00' },           // orange
      Sample: { bg: '#64b5f6', border: '#1976d2' },             // blue
      Boundary_Condition: { bg: '#80cbc4', border: '#00695c' }, // teal
      Control: { bg: '#f48fb1', border: '#c2185b' },            // pink
    };
    return colors[type || 'Variable'] || colors.Variable;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Prepare nodes for vis-network
    const nodes = new DataSet(
      data.nodes.map(node => {
        const nodeColor = getNodeColor(node.type);
        return {
          id: node.id,
          label: node.label,
          title: `${node.rawText}\nType: ${node.type || 'Variable'}`,
          color: {
            background: nodeColor.bg,
            border: nodeColor.border,
            highlight: {
              background: nodeColor.bg,
              border: nodeColor.border,
            },
          },
          font: {
            color: '#000000',
            size: 14,
          },
        };
      })
    );

    // Prepare edges for vis-network
    const edges = new DataSet(
      data.edges.map((edge, idx) => {
        const edgeColor = getEdgeColor(edge.type || edge.label);
        return {
          id: `edge-${idx}`,
          from: edge.from,
          to: edge.to,
          label: edge.label,
          arrows: edge.direction === 'right' ? 'to' : edge.direction === 'left' ? 'from' : 'to',
          color: {
            color: edgeColor,
            highlight: edgeColor,
          },
          font: {
            size: 12,
            align: 'middle',
          },
          title: edge.type || edge.label, // Show full type on hover
        };
      })
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

  const getEdgeColor = (relationType: string): string => {
    // Detailed color mapping for all relation types
    const colors: Record<string, string> = {
      // Moderation
      'moderation__validated': '#ffd54f',
      'moderation__hypothesized': '#ffe082',
      'moderation__null': '#fff3c4',
      'moderation': '#ffd54f', // fallback

      // Direction
      'direction__validated': '#90caf9',
      'direction__hypothesized': '#bbdefb',
      'direction__null': '#e3f2fd',
      'direction': '#90caf9', // fallback

      // Correlation
      'correlation__validated': '#a5d6a7',
      'correlation__hypothesized': '#c8e6c9',
      'correlation__null': '#e8f5e9',
      'correlation': '#a5d6a7', // fallback

      // Hierarchy
      'hierarchy': '#b39ddb',
    };
    return colors[relationType] || '#999999';
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
                const fullType = edge.type || edge.label;
                return (
                  <tr key={idx}>
                    <td>{fromNode?.label || edge.from}</td>
                    <td>
                      <span
                        className="relation-badge"
                        style={{ backgroundColor: getEdgeColor(fullType) }}
                        title={fullType}
                      >
                        {edge.label}
                        {edge.type && edge.type !== edge.label && (
                          <small style={{ opacity: 0.8, marginLeft: '4px' }}>
                            ({edge.type.split('__')[1]})
                          </small>
                        )}
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
