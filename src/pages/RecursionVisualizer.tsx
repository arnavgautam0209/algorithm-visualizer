import { useState, useRef, useEffect } from 'react';
import './RecursionVisualizer.css';

interface CallStackFrame {
  id: number;
  function: string;
  params: string;
  state: 'active' | 'completed';
}

type Algorithm = 'hanoi' | 'nqueens' | 'factorial' | 'permutation';

const RecursionVisualizer = () => {
  const [algorithm, setAlgorithm] = useState<Algorithm>('hanoi');
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [callStack, setCallStack] = useState<CallStackFrame[]>([]);
  const [result, setResult] = useState<string>('');
  
  // Tower of Hanoi
  const [numDisks, setNumDisks] = useState(3);
  const [towers, setTowers] = useState<number[][]>([[3, 2, 1], [], []]);
  
  // N-Queens
  const [boardSize, setBoardSize] = useState(4);
  const [queensBoard, setQueensBoard] = useState<number[][]>([]);
  
  // Factorial
  const [factN, setFactN] = useState(5);
  
  // Permutation
  const [permString] = useState('ABC');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIdCounter = useRef(0);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    if (algorithm === 'hanoi') {
      drawHanoi();
    } else if (algorithm === 'nqueens') {
      drawQueensBoard();
    }
  }, [towers, queensBoard]);

  const addToCallStack = (func: string, params: string) => {
    const frame: CallStackFrame = {
      id: frameIdCounter.current++,
      function: func,
      params,
      state: 'active'
    };
    setCallStack(prev => [...prev, frame]);
    return frame.id;
  };

  const removeFromCallStack = (id: number) => {
    setCallStack(prev => prev.map(f => 
      f.id === id ? { ...f, state: 'completed' } : f
    ));
    setTimeout(() => {
      setCallStack(prev => prev.filter(f => f.id !== id));
    }, speed / 2);
  };

  const drawHanoi = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Light background to match theme
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const towerWidth = canvas.width / 3;
    const baseY = canvas.height - 40;
    
    towers.forEach((tower, towerIndex) => {
      const towerX = towerWidth * towerIndex + towerWidth / 2;
      
      // Draw pole - darker for visibility
      ctx.fillStyle = '#666666';
      ctx.fillRect(towerX - 5, baseY - 200, 10, 200);
      
      // Draw base
      ctx.fillRect(towerX - 80, baseY, 160, 10);
      
      // Draw disks
      tower.forEach((disk, diskIndex) => {
        const diskWidth = disk * 30;
        const diskHeight = 20;
        const diskY = baseY - (diskIndex + 1) * diskHeight - 10;
        
        ctx.fillStyle = '#e0e0e0';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.fillRect(towerX - diskWidth / 2, diskY, diskWidth, diskHeight);
        ctx.strokeRect(towerX - diskWidth / 2, diskY, diskWidth, diskHeight);
        
        // Draw disk number
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(disk.toString(), towerX, diskY + diskHeight / 2);
      });
      
      // Draw tower label
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(['A', 'B', 'C'][towerIndex], towerX, baseY + 25);
    });
  };

  const drawQueensBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas || queensBoard.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Light background to match theme
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const n = queensBoard.length;
    const cellSize = Math.min(canvas.width, canvas.height) / (n + 1);
    const offsetX = (canvas.width - cellSize * n) / 2;
    const offsetY = (canvas.height - cellSize * n) / 2;

    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        // Chess board pattern with light colors
        ctx.fillStyle = (row + col) % 2 === 0 ? '#e0e0e0' : '#ffffff';
        ctx.fillRect(offsetX + col * cellSize, offsetY + row * cellSize, cellSize, cellSize);
        
        if (queensBoard[row][col] === 1) {
          ctx.fillStyle = '#000000';
          ctx.font = `${cellSize * 0.6}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('♛', offsetX + col * cellSize + cellSize / 2, offsetY + row * cellSize + cellSize / 2);
        }
      }
    }
  };

  const hanoiVisualization = async (n: number, from: number, to: number, aux: number) => {
    if (n === 0) return;

    const frameId = addToCallStack('hanoi', `n=${n}, ${['A', 'B', 'C'][from]} → ${['A', 'B', 'C'][to]}`);
    await sleep(speed);

    await hanoiVisualization(n - 1, from, aux, to);

    setTowers(prev => {
      const newTowers = prev.map(t => [...t]);
      const disk = newTowers[from].pop()!;
      newTowers[to].push(disk);
      return newTowers;
    });
    await sleep(speed);

    await hanoiVisualization(n - 1, aux, to, from);

    removeFromCallStack(frameId);
  };

  const solveNQueens = async (row: number, currentBoard: number[][], solutions: number[][][]) => {
    if (row === currentBoard.length) {
      solutions.push(currentBoard.map(r => [...r]));
      setQueensBoard(currentBoard.map(r => [...r]));
      await sleep(speed * 2);
      return;
    }

    const frameId = addToCallStack('solveNQueens', `row=${row}`);
    await sleep(speed);

    for (let col = 0; col < currentBoard.length; col++) {
      if (isSafe(currentBoard, row, col)) {
        currentBoard[row][col] = 1;
        setQueensBoard(currentBoard.map(r => [...r]));
        await sleep(speed);

        await solveNQueens(row + 1, currentBoard, solutions);

        currentBoard[row][col] = 0;
        setQueensBoard(currentBoard.map(r => [...r]));
        await sleep(speed / 2);
      }
    }

    removeFromCallStack(frameId);
  };

  const isSafe = (board: number[][], row: number, col: number): boolean => {
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 1) return false;
    }
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 1) return false;
    }
    for (let i = row - 1, j = col + 1; i >= 0 && j < board.length; i--, j++) {
      if (board[i][j] === 1) return false;
    }
    return true;
  };

  const factorialVisualization = async (n: number): Promise<number> => {
    const frameId = addToCallStack('factorial', `n=${n}`);
    await sleep(speed);

    if (n === 0 || n === 1) {
      removeFromCallStack(frameId);
      return 1;
    }

    const result = n * await factorialVisualization(n - 1);
    removeFromCallStack(frameId);
    return result;
  };

  const permutationVisualization = async (str: string, prefix: string = '', results: string[] = []) => {
    const frameId = addToCallStack('permute', `"${prefix}" + "${str}"`);
    await sleep(speed);

    if (str.length === 0) {
      results.push(prefix);
      setResult(prev => prev + (prev ? ', ' : '') + prefix);
      removeFromCallStack(frameId);
      return;
    }

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      const remaining = str.slice(0, i) + str.slice(i + 1);
      await permutationVisualization(remaining, prefix + char, results);
    }

    removeFromCallStack(frameId);
  };

  const runAlgorithm = async () => {
    setIsRunning(true);
    setCallStack([]);
    setResult('');
    frameIdCounter.current = 0;

    switch (algorithm) {
      case 'hanoi':
        const initialTowers: number[][] = [[], [], []];
        for (let i = numDisks; i >= 1; i--) {
          initialTowers[0].push(i);
        }
        setTowers(initialTowers);
        await sleep(speed);
        await hanoiVisualization(numDisks, 0, 2, 1);
        setResult(`Solved Tower of Hanoi with ${numDisks} disks!`);
        break;

      case 'nqueens':
        const emptyBoard = Array(boardSize).fill(null).map(() => Array(boardSize).fill(0));
        setQueensBoard(emptyBoard);
        const solutions: number[][][] = [];
        await solveNQueens(0, emptyBoard, solutions);
        setResult(`Found ${solutions.length} solution(s) for ${boardSize}-Queens`);
        break;

      case 'factorial':
        const factResult = await factorialVisualization(factN);
        setResult(`${factN}! = ${factResult}`);
        break;

      case 'permutation':
        await permutationVisualization(permString);
        break;
    }

    setIsRunning(false);
  };

  const resetVisualization = () => {
    setCallStack([]);
    setResult('');
    setTowers([[3, 2, 1], [], []]);
    setQueensBoard([]);
  };

  const getAlgorithmName = () => {
    switch (algorithm) {
      case 'hanoi': return 'Tower of Hanoi';
      case 'nqueens': return 'N-Queens Problem';
      case 'factorial': return 'Factorial (Recursive)';
      case 'permutation': return 'String Permutations';
    }
  };

  return (
    <div className="recursion-visualizer">
      <div className="visualizer-header">
        <h1 className="page-title">Recursion Visualizer</h1>
        <p className="page-subtitle">Visualize recursive algorithms and call stacks</p>
      </div>

      <div className="visualizer-content">
        <div className="controls-sidebar">
          <div className="control-group">
            <label htmlFor="algorithm">Algorithm</label>
            <select
              id="algorithm"
              className="algorithm-select"
              value={algorithm}
              onChange={(e) => {
                setAlgorithm(e.target.value as Algorithm);
                resetVisualization();
              }}
              disabled={isRunning}
            >
              <option value="hanoi">Tower of Hanoi</option>
              <option value="nqueens">N-Queens</option>
              <option value="factorial">Factorial</option>
              <option value="permutation">Permutations</option>
            </select>
          </div>

          {algorithm === 'hanoi' && (
            <div className="control-group">
              <label htmlFor="disks">Number of Disks</label>
              <input type="number" id="disks" className="number-input" min="2" max="5"
                value={numDisks} onChange={(e) => setNumDisks(Number(e.target.value))} disabled={isRunning} />
            </div>
          )}

          {algorithm === 'nqueens' && (
            <div className="control-group">
              <label htmlFor="boardsize">Board Size</label>
              <input type="number" id="boardsize" className="number-input" min="4" max="8"
                value={boardSize} onChange={(e) => setBoardSize(Number(e.target.value))} disabled={isRunning} />
            </div>
          )}

          {algorithm === 'factorial' && (
            <div className="control-group">
              <label htmlFor="factn">N Value</label>
              <input type="number" id="factn" className="number-input" min="1" max="10"
                value={factN} onChange={(e) => setFactN(Number(e.target.value))} disabled={isRunning} />
            </div>
          )}

          <div className="control-group">
            <label htmlFor="speed">Speed: {speed}ms</label>
            <input type="range" id="speed" className="slider" min="100" max="2000" step="100"
              value={speed} onChange={(e) => setSpeed(Number(e.target.value))} disabled={isRunning} />
          </div>

          <div className="button-group">
            <button className="btn btn-primary" onClick={runAlgorithm} disabled={isRunning}>
              {isRunning ? 'Running...' : 'Start Visualization'}
            </button>
            <button className="btn btn-secondary" onClick={resetVisualization} disabled={isRunning}>
              Reset
            </button>
          </div>
        </div>

        <div className="visualization-container">
          <div className="visualization-area">
            <h2 className="algorithm-name">{getAlgorithmName()}</h2>
            {(algorithm === 'hanoi' || algorithm === 'nqueens') && (
              <canvas ref={canvasRef} width={600} height={350} className="recursion-canvas" />
            )}
            {result && <div className="result-display"><strong>Result:</strong> {result}</div>}
          </div>

          <div className="call-stack-panel">
            <h3>Call Stack</h3>
            <div className="call-stack">
              {callStack.length === 0 && <p className="empty-stack">Call stack is empty</p>}
              {callStack.map((frame, index) => (
                <div key={frame.id} className={`stack-frame ${frame.state}`}>
                  <div className="frame-number">{callStack.length - index}</div>
                  <div className="frame-content">
                    <div className="frame-function">{frame.function}</div>
                    <div className="frame-params">{frame.params}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecursionVisualizer;
