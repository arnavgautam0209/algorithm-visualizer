import { useState, useEffect, useRef } from 'react';
import './GraphVisualizer.css';

// TODO: Add A* pathfinding algorithm
// TODO: Add ability to manually add/remove nodes by clicking
// NOTE: The canvas drawing could probably be optimized, but it works for now

interface Node {
  id: number;
  x: number;
  y: number;
  state: 'default' | 'visiting' | 'visited' | 'path';
}

interface Edge {
  from: number;
  to: number;
  weight: number;
  state: 'default' | 'visiting' | 'visited' | 'path';
}

type Algorithm = 'bfs' | 'dfs' | 'dijkstra' | 'prims';

const GraphVisualizer = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [algorithm, setAlgorithm] = useState<Algorithm>('bfs');
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [startNode, setStartNode] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Initialize with a random graph on component mount
  useEffect(() => {
    generateRandomGraph();
  }, []);

  // Redraw whenever nodes or edges change
  useEffect(() => {
    drawGraph();
  }, [nodes, edges]);

  const generateRandomGraph = () => {
    const nodeCount = 8; // Sweet spot for visualization
    const newNodes: Node[] = [];
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 60;

    // Arrange nodes in a circle for better visualization
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i * 2 * Math.PI) / nodeCount;
      const x = width / 2 + Math.cos(angle) * (Math.min(width, height) / 2 - padding);
      const y = height / 2 + Math.sin(angle) * (Math.min(width, height) / 2 - padding);
      newNodes.push({ id: i, x, y, state: 'default' });
    }

    const newEdges: Edge[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const connections = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < connections; j++) {
        const to = Math.floor(Math.random() * nodeCount);
        if (to !== i && !newEdges.some(e => (e.from === i && e.to === to) || (e.from === to && e.to === i))) {
          newEdges.push({ from: i, to, weight: Math.floor(Math.random() * 9) + 1, state: 'default' });
        }
      }
    }

    setNodes(newNodes);
    setEdges(newEdges);
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Light background to match theme
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return;

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      
      switch (edge.state) {
        case 'visiting': ctx.strokeStyle = '#888888'; ctx.lineWidth = 3; break;
        case 'visited': ctx.strokeStyle = '#cccccc'; ctx.lineWidth = 2; break;
        case 'path': ctx.strokeStyle = '#000000'; ctx.lineWidth = 4; break;
        default: ctx.strokeStyle = '#e0e0e0'; ctx.lineWidth = 2;
      }
      ctx.stroke();

      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(edge.weight.toString(), midX, midY);
    });

    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
      
      switch (node.state) {
        case 'visiting': ctx.fillStyle = '#888888'; break;
        case 'visited': ctx.fillStyle = '#cccccc'; break;
        case 'path': ctx.fillStyle = '#000000'; break;
        default: ctx.fillStyle = '#e0e0e0';
      }
      
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();

      // White text for dark nodes, black text for light nodes
      ctx.fillStyle = (node.state === 'path' || node.state === 'visiting' || node.state === 'visited') ? '#ffffff' : '#000000';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.id.toString(), node.x, node.y);
    });
  };

  const resetGraph = () => {
    setNodes(nodes.map(n => ({ ...n, state: 'default' })));
    setEdges(edges.map(e => ({ ...e, state: 'default' })));
  };

  const bfsVisualization = async () => {
    resetGraph();
    setIsRunning(true);
    const visited = new Set<number>();
    const queue: number[] = [startNode];
    visited.add(startNode);

    while (queue.length > 0) {
      const current = queue.shift()!;
      setNodes(prev => prev.map(n => n.id === current ? { ...n, state: 'visiting' } : n));
      await sleep(speed);

      const neighbors = edges
        .filter(e => e.from === current || e.to === current)
        .map(e => e.from === current ? e.to : e.from)
        .filter(n => !visited.has(n));

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          setEdges(prev => prev.map(e => 
            ((e.from === current && e.to === neighbor) || (e.from === neighbor && e.to === current))
              ? { ...e, state: 'visiting' } : e
          ));
          await sleep(speed / 2);
        }
      }

      setNodes(prev => prev.map(n => n.id === current ? { ...n, state: 'visited' } : n));
      setEdges(prev => prev.map(e => 
        ((e.from === current || e.to === current) && e.state === 'visiting')
          ? { ...e, state: 'visited' } : e
      ));
    }
    setIsRunning(false);
  };

  const dfsVisualization = async () => {
    resetGraph();
    setIsRunning(true);
    const visited = new Set<number>();
    
    const dfs = async (nodeId: number) => {
      visited.add(nodeId);
      setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, state: 'visiting' } : n));
      await sleep(speed);

      const neighbors = edges
        .filter(e => e.from === nodeId || e.to === nodeId)
        .map(e => e.from === nodeId ? e.to : e.from)
        .filter(n => !visited.has(n));

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          setEdges(prev => prev.map(e => 
            ((e.from === nodeId && e.to === neighbor) || (e.from === neighbor && e.to === nodeId))
              ? { ...e, state: 'visiting' } : e
          ));
          await sleep(speed / 2);
          await dfs(neighbor);
        }
      }

      setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, state: 'visited' } : n));
      setEdges(prev => prev.map(e => 
        ((e.from === nodeId || e.to === nodeId) && e.state === 'visiting')
          ? { ...e, state: 'visited' } : e
      ));
    };

    await dfs(startNode);
    setIsRunning(false);
  };

  const dijkstraVisualization = async () => {
    resetGraph();
    setIsRunning(true);
    const distances = new Map<number, number>();
    const previous = new Map<number, number | null>();
    const unvisited = new Set<number>();

    nodes.forEach(node => {
      distances.set(node.id, Infinity);
      previous.set(node.id, null);
      unvisited.add(node.id);
    });
    distances.set(startNode, 0);

    while (unvisited.size > 0) {
      let current = -1;
      let minDist = Infinity;
      unvisited.forEach(nodeId => {
        const dist = distances.get(nodeId)!;
        if (dist < minDist) {
          minDist = dist;
          current = nodeId;
        }
      });

      if (current === -1 || minDist === Infinity) break;
      unvisited.delete(current);

      setNodes(prev => prev.map(n => n.id === current ? { ...n, state: 'visiting' } : n));
      await sleep(speed);

      const neighborEdges = edges.filter(e => 
        (e.from === current && unvisited.has(e.to)) || 
        (e.to === current && unvisited.has(e.from))
      );

      for (const edge of neighborEdges) {
        const neighbor = edge.from === current ? edge.to : edge.from;
        const altDistance = distances.get(current)! + edge.weight;
        setEdges(prev => prev.map(e => e === edge ? { ...e, state: 'visiting' } : e));
        await sleep(speed / 2);

        if (altDistance < distances.get(neighbor)!) {
          distances.set(neighbor, altDistance);
          previous.set(neighbor, current);
        }
        setEdges(prev => prev.map(e => e === edge ? { ...e, state: 'default' } : e));
      }

      setNodes(prev => prev.map(n => n.id === current ? { ...n, state: 'visited' } : n));
    }

    nodes.forEach(node => {
      if (node.id !== startNode) {
        let current: number | null = node.id;
        while (current !== null && current !== startNode) {
          const prev = previous.get(current);
          if (prev !== null && prev !== undefined) {
            setEdges(prevEdges => prevEdges.map(e => 
              ((e.from === current && e.to === prev) || (e.from === prev && e.to === current))
                ? { ...e, state: 'path' } : e
            ));
          }
          current = prev ?? null;
        }
      }
    });

    setIsRunning(false);
  };

  const primsVisualization = async () => {
    resetGraph();
    setIsRunning(true);
    const inMST = new Set<number>();
    inMST.add(startNode);
    setNodes(prev => prev.map(n => n.id === startNode ? { ...n, state: 'visited' } : n));
    await sleep(speed);

    while (inMST.size < nodes.length) {
      let minEdge = null as Edge | null;
      let minWeight = Infinity;

      edges.forEach(edge => {
        const fromInMST = inMST.has(edge.from);
        const toInMST = inMST.has(edge.to);
        if (fromInMST !== toInMST && edge.weight < minWeight) {
          minWeight = edge.weight;
          minEdge = edge;
        }
      });

      if (!minEdge) break;
      
      const edgeFrom = minEdge.from;
      const edgeTo = minEdge.to;
      const newNode = inMST.has(edgeFrom) ? edgeTo : edgeFrom;
      inMST.add(newNode);

      const currentEdge = minEdge;
      setEdges(prev => prev.map(e => e === currentEdge ? { ...e, state: 'visiting' } : e));
      await sleep(speed);
      setNodes(prev => prev.map(n => n.id === newNode ? { ...n, state: 'visited' } : n));
      setEdges(prev => prev.map(e => e === currentEdge ? { ...e, state: 'path' } : e));
      await sleep(speed);
    }
    setIsRunning(false);
  };

  const runAlgorithm = () => {
    switch (algorithm) {
      case 'bfs': bfsVisualization(); break;
      case 'dfs': dfsVisualization(); break;
      case 'dijkstra': dijkstraVisualization(); break;
      case 'prims': primsVisualization(); break;
    }
  };

  const getAlgorithmName = () => {
    switch (algorithm) {
      case 'bfs': return 'Breadth-First Search (BFS)';
      case 'dfs': return 'Depth-First Search (DFS)';
      case 'dijkstra': return "Dijkstra's Shortest Path";
      case 'prims': return "Prim's Minimum Spanning Tree";
    }
  };

  return (
    <div className="graph-visualizer">
      <div className="visualizer-header">
        <h1 className="page-title">Graph Algorithm Visualizer</h1>
        <p className="page-subtitle">Visualize graph traversal and pathfinding algorithms</p>
      </div>

      <div className="visualizer-content">
        <div className="controls-sidebar">
          <div className="control-group">
            <label htmlFor="algorithm">Algorithm</label>
            <select
              id="algorithm"
              className="algorithm-select"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
              disabled={isRunning}
            >
              <option value="bfs">Breadth-First Search</option>
              <option value="dfs">Depth-First Search</option>
              <option value="dijkstra">Dijkstra's Algorithm</option>
              <option value="prims">Prim's Algorithm</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="speed">Speed: {speed}ms</label>
            <input
              type="range"
              id="speed"
              className="slider"
              min="100"
              max="2000"
              step="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={isRunning}
            />
          </div>

          <div className="control-group">
            <label htmlFor="startNode">Start Node</label>
            <input
              type="number"
              id="startNode"
              className="number-input"
              min="0"
              max={nodes.length - 1}
              value={startNode}
              onChange={(e) => setStartNode(Number(e.target.value))}
              disabled={isRunning}
            />
          </div>

          <div className="button-group">
            <button className="btn btn-primary" onClick={runAlgorithm} disabled={isRunning}>
              {isRunning ? 'Running...' : 'Start Visualization'}
            </button>
            <button className="btn btn-secondary" onClick={resetGraph} disabled={isRunning}>
              Reset
            </button>
            <button className="btn btn-danger" onClick={generateRandomGraph} disabled={isRunning}>
              New Graph
            </button>
          </div>
        </div>

        <div className="visualization-area">
          <h2 className="algorithm-name">{getAlgorithmName()}</h2>
          <canvas ref={canvasRef} width={800} height={500} className="graph-canvas" />
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;
