import * as React from 'react'
import Stack from 'react-bootstrap/Stack'
import Button from 'react-bootstrap/Button'
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from 'react-flow-renderer'
import Navbar from "./navbar"
import dagre from 'dagre';

const onInit = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance);

const row = {
  display: 'flex'
}

const column = {
  float: 'left'
}

const left = {
  width: '15%',
  background: '#d1d1d1'
}

const right = {
  width: '85%'
}

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 172;
const nodeHeight = 36;

const Graph = () => {
    
    React.useEffect(() => {
        //Clear the programs and credits drop down
        let majorDropdown = document.getElementById('MajorSelector');
        if (majorDropdown.options.length > 1) return;

        // Create query string with method and headers
        // Parameters are school
        const queryString = '/api/search/getMajors';
        const searchRequest = new Request(queryString, {
            method: 'GET',
            headers: queryHeaders,
        });
        // Fetch request to api/search which deals with using the parameters to use program to search
        fetch(searchRequest)
            .then(response => response.json())
            .then(results => {
                for (const major in results) {
                    majorDropdown.options[majorDropdown.options.length] = new Option(results[major], results[major]);
                }
            })
    });

    const getLayoutedElements = (nodes, edges) => {
    dagreGraph.setGraph({ rankdir: 'LR' });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = 'left';
      node.sourcePosition = 'right';

      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
      return node;
    });

    return { nodes, edges };
  };

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = React.useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true }, eds)),
    []
  );

    // Query Headers
    const queryHeaders = { 'Accept': 'application/json', 'Content-Type': 'application/json' }

    const [Major, setMajor] = React.useState('');
    // Dynamic change of Credits based on University

  const generateGraph = (e) => {
    e.preventDefault();
    if (Major === '') return;
    const queryString = '/api/graph?type=major&school=uog&programName=&majorName=' + Major.toString();
    const searchRequest = new Request(queryString, {
      method: 'GET',
      headers: queryHeaders,
    });
    fetch(searchRequest)
      .then(response => response.json())
      .then(results => {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
          results['nodes'],
          results['edges']
        );
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      })
    return;
  }

  return (
    <div>
      {Navbar('/majorGraph')}
      <div style={row}>
        <div style={column && left}>
          <Stack gap={3}>
            <h1 className="text-center">Guelph Major Graph Generator</h1>
            <div className="input-group mb-3">
              <select className="form-select" id="MajorSelector" title="Major" onChange={(e) => setMajor(e.currentTarget.value)}>
                <option value=''>Major</option>
              </select>
            </div>
            <div className="text-center d-grid">
              <Button variant="info" type="submit" onClick={generateGraph}>Create Graph</Button>{' '}
            </div>
          </Stack>
        </div>
        <div style={column && right} className="layoutFlow">
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              connectionLineType="smoothstep"
              onInit={onInit}
              style={{ width: '100%', height: 'calc(100vh - 86px)' }}
              fitView
            >

              <MiniMap
                nodeStrokeColor={(n) => {
                  if (n.style?.background) return n.style.background;
                  if (n.type === 'input') return '#0041d0';
                  if (n.type === 'output') return '#ff0072';
                  if (n.type === 'default') return '#1a192b';
                  return '#eee';
                }}
                nodeColor={(n) => {
                  if (n.style?.background) return n.style.background;
                  return '#fff';
                }}
                nodeBorderRadius={2}
              />
              <Controls />
              <Background color="#aaa" gap={16} />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
};

export default Graph;