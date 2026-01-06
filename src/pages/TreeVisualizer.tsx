import { useState, useEffect, useRef } from 'react';
import './TreeVisualizer.css';

// Binary Search Trees are cool! Took me a while to get the drawing right though
// TODO: Add AVL tree balancing visualization
// TODO: Add delete operation (it's tricky with the animation)

interface TreeNode {
  value: number;
  x?: number;
  y?: number;
  left?: TreeNode | null;
  right?: TreeNode | null;
  state: 'default' | 'visiting' | 'visited' | 'found';
}

type Algorithm = 'insert' | 'search' | 'inorder' | 'preorder' | 'postorder' | 'levelorder';

const TreeVisualizer = () => {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [algorithm, setAlgorithm] = useState<Algorithm>('insert');
  const [inputValue, setInputValue] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [traversalPath, setTraversalPath] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Start with some pre-populated values for better initial visualization
  useEffect(() => {
    const initialValues = [50, 30, 70, 20, 40, 60, 80];
    let tempRoot: TreeNode | null = null;
    initialValues.forEach(val => {
      tempRoot = insertNode(tempRoot, val);
    });
    setRoot(tempRoot);
  }, []);

  useEffect(() => {
    drawTree();
  }, [root]);

  // Standard BST insertion - recursively find the right spot
  const insertNode = (node: TreeNode | null, value: number): TreeNode => {
    if (!node) {
      return { value, left: null, right: null, state: 'default' };
    }
    if (value < node.value) {
      node.left = insertNode(node.left || null, value);
    } else if (value > node.value) {
      node.right = insertNode(node.right || null, value);
    }
    // If value equals node.value, we don't insert (no duplicates)
    return node;
  };

  const calculatePositions = (node: TreeNode | null, x: number, y: number, xOffset: number): void => {
    if (!node) return;
    node.x = x;
    node.y = y;
    if (node.left) calculatePositions(node.left, x - xOffset, y + 80, xOffset / 2);
    if (node.right) calculatePositions(node.right, x + xOffset, y + 80, xOffset / 2);
  };

  const drawTree = () => {
    const canvas = canvasRef.current;
    if (!canvas || !root) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    calculatePositions(root, canvas.width / 2, 40, canvas.width / 4);

    // Light background to match theme
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const drawNode = (node: TreeNode | null) => {
      if (!node || node.x === undefined || node.y === undefined) return;

      if (node.left && node.left.x !== undefined && node.left.y !== undefined) {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(node.left.x, node.left.y);
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 2;
        ctx.stroke();
        drawNode(node.left);
      }

      if (node.right && node.right.x !== undefined && node.right.y !== undefined) {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(node.right.x, node.right.y);
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 2;
        ctx.stroke();
        drawNode(node.right);
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
      
      switch (node.state) {
        case 'visiting': ctx.fillStyle = '#888888'; break;
        case 'visited': ctx.fillStyle = '#cccccc'; break;
        case 'found': ctx.fillStyle = '#000000'; break;
        default: ctx.fillStyle = '#e0e0e0';
      }
      
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.stroke();

      // White text for dark nodes (found, visiting, visited), black text for light nodes
      ctx.fillStyle = (node.state === 'found' || node.state === 'visiting') ? '#ffffff' : '#000000';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.value.toString(), node.x, node.y);
    };

    drawNode(root);
  };

  const resetTreeStates = (node: TreeNode | null): TreeNode | null => {
    if (!node) return null;
    return {
      ...node,
      state: 'default',
      left: resetTreeStates(node.left || null),
      right: resetTreeStates(node.right || null)
    };
  };

  const insertVisualization = async () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    setIsRunning(true);
    setTraversalPath([]);
    
    let currentNode = root;
    let path: TreeNode[] = [];

    while (currentNode) {
      path.push(currentNode);
      currentNode.state = 'visiting';
      setRoot({ ...root! });
      drawTree();
      await sleep(speed);

      if (value < currentNode.value) {
        if (!currentNode.left) {
          currentNode.left = { value, left: null, right: null, state: 'found' };
          break;
        }
        currentNode = currentNode.left;
      } else if (value > currentNode.value) {
        if (!currentNode.right) {
          currentNode.right = { value, left: null, right: null, state: 'found' };
          break;
        }
        currentNode = currentNode.right;
      } else {
        currentNode.state = 'found';
        break;
      }
    }

    setRoot({ ...root! });
    drawTree();
    await sleep(speed * 2);

    setRoot(resetTreeStates(root));
    drawTree();
    setIsRunning(false);
    setInputValue('');
  };

  const searchVisualization = async () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    setIsRunning(true);
    setTraversalPath([]);
    let currentNode = root;

    while (currentNode) {
      currentNode.state = 'visiting';
      setRoot({ ...root! });
      drawTree();
      await sleep(speed);

      if (value === currentNode.value) {
        currentNode.state = 'found';
        break;
      } else if (value < currentNode.value) {
        currentNode.state = 'visited';
        currentNode = currentNode.left || null;
      } else {
        currentNode.state = 'visited';
        currentNode = currentNode.right || null;
      }

      setRoot({ ...root! });
      drawTree();
    }

    await sleep(speed * 2);
    setRoot(resetTreeStates(root));
    drawTree();
    setIsRunning(false);
  };

  const inorderTraversal = async (node: TreeNode | null, path: number[] = []): Promise<number[]> => {
    if (!node) return path;

    await inorderTraversal(node.left || null, path);
    
    node.state = 'visiting';
    setRoot({ ...root! });
    drawTree();
    await sleep(speed);
    path.push(node.value);
    setTraversalPath([...path]);
    
    node.state = 'visited';
    setRoot({ ...root! });
    drawTree();

    await inorderTraversal(node.right || null, path);
    return path;
  };

  const preorderTraversal = async (node: TreeNode | null, path: number[] = []): Promise<number[]> => {
    if (!node) return path;

    node.state = 'visiting';
    setRoot({ ...root! });
    drawTree();
    await sleep(speed);
    path.push(node.value);
    setTraversalPath([...path]);
    
    node.state = 'visited';
    setRoot({ ...root! });
    drawTree();

    await preorderTraversal(node.left || null, path);
    await preorderTraversal(node.right || null, path);
    return path;
  };

  const postorderTraversal = async (node: TreeNode | null, path: number[] = []): Promise<number[]> => {
    if (!node) return path;

    await postorderTraversal(node.left || null, path);
    await postorderTraversal(node.right || null, path);
    
    node.state = 'visiting';
    setRoot({ ...root! });
    drawTree();
    await sleep(speed);
    path.push(node.value);
    setTraversalPath([...path]);
    
    node.state = 'visited';
    setRoot({ ...root! });
    drawTree();

    return path;
  };

  const levelorderTraversal = async () => {
    if (!root) return;
    
    const queue: TreeNode[] = [root];
    const path: number[] = [];

    while (queue.length > 0) {
      const node = queue.shift()!;
      
      node.state = 'visiting';
      setRoot({ ...root! });
      drawTree();
      await sleep(speed);
      
      path.push(node.value);
      setTraversalPath([...path]);
      
      node.state = 'visited';
      setRoot({ ...root! });
      drawTree();

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  };

  const runAlgorithm = async () => {
    setRoot(resetTreeStates(root));
    setTraversalPath([]);
    setIsRunning(true);

    switch (algorithm) {
      case 'insert':
        await insertVisualization();
        break;
      case 'search':
        await searchVisualization();
        break;
      case 'inorder':
        await inorderTraversal(root);
        await sleep(speed);
        setRoot(resetTreeStates(root));
        drawTree();
        break;
      case 'preorder':
        await preorderTraversal(root);
        await sleep(speed);
        setRoot(resetTreeStates(root));
        drawTree();
        break;
      case 'postorder':
        await postorderTraversal(root);
        await sleep(speed);
        setRoot(resetTreeStates(root));
        drawTree();
        break;
      case 'levelorder':
        await levelorderTraversal();
        await sleep(speed);
        setRoot(resetTreeStates(root));
        drawTree();
        break;
    }

    setIsRunning(false);
  };

  const resetTree = () => {
    setRoot(resetTreeStates(root));
    setTraversalPath([]);
    drawTree();
  };

  const generateNewTree = () => {
    const values = Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10);
    let tempRoot: TreeNode | null = null;
    values.forEach(val => {
      tempRoot = insertNode(tempRoot, val);
    });
    setRoot(tempRoot);
    setTraversalPath([]);
  };

  const getAlgorithmName = () => {
    switch (algorithm) {
      case 'insert': return 'Insert Node';
      case 'search': return 'Search Node';
      case 'inorder': return 'Inorder Traversal (Left-Root-Right)';
      case 'preorder': return 'Preorder Traversal (Root-Left-Right)';
      case 'postorder': return 'Postorder Traversal (Left-Right-Root)';
      case 'levelorder': return 'Level Order Traversal (BFS)';
    }
  };

  return (
    <div className="tree-visualizer">
      <div className="visualizer-header">
        <h1 className="page-title">Binary Search Tree Visualizer</h1>
        <p className="page-subtitle">Visualize BST operations and tree traversals</p>
      </div>

      <div className="visualizer-content">
        <div className="controls-sidebar">
          <div className="control-group">
            <label htmlFor="algorithm">Operation</label>
            <select
              id="algorithm"
              className="algorithm-select"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
              disabled={isRunning}
            >
              <option value="insert">Insert Node</option>
              <option value="search">Search Node</option>
              <option value="inorder">Inorder Traversal</option>
              <option value="preorder">Preorder Traversal</option>
              <option value="postorder">Postorder Traversal</option>
              <option value="levelorder">Level Order Traversal</option>
            </select>
          </div>

          {(algorithm === 'insert' || algorithm === 'search') && (
            <div className="control-group">
              <label htmlFor="value">Value</label>
              <input
                type="number"
                id="value"
                className="number-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isRunning}
                placeholder="Enter value"
              />
            </div>
          )}

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

          <div className="button-group">
            <button className="btn btn-primary" onClick={runAlgorithm} disabled={isRunning}>
              {isRunning ? 'Running...' : 'Start'}
            </button>
            <button className="btn btn-secondary" onClick={resetTree} disabled={isRunning}>
              Reset
            </button>
            <button className="btn btn-danger" onClick={generateNewTree} disabled={isRunning}>
              New Tree
            </button>
          </div>
        </div>

        <div className="visualization-area">
          <h2 className="algorithm-name">{getAlgorithmName()}</h2>
          <canvas ref={canvasRef} width={800} height={400} className="tree-canvas" />
          {traversalPath.length > 0 && (
            <div className="traversal-result">
              <strong>Traversal Path:</strong> {traversalPath.join(' → ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreeVisualizer;
