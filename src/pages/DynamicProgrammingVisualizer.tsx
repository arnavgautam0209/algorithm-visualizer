import { useState } from 'react';
import './DynamicProgrammingVisualizer.css';

interface Cell {
  value: number | string;
  state: 'default' | 'computing' | 'computed' | 'result';
}

type Algorithm = 'fibonacci' | 'knapsack' | 'lcs' | 'coinchange';

const DynamicProgrammingVisualizer = () => {
  const [algorithm, setAlgorithm] = useState<Algorithm>('fibonacci');
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [table, setTable] = useState<Cell[][]>([]);
  const [result, setResult] = useState<string>('');
  
  // Fibonacci
  const [fibN, setFibN] = useState(10);
  
  // Knapsack
  const [capacity] = useState(50);
  const [weights] = useState([10, 20, 30]);
  const [values] = useState([60, 100, 120]);
  
  // LCS
  const [string1] = useState('ABCDGH');
  const [string2] = useState('AEDFHR');
  
  // Coin Change
  const [targetAmount, setTargetAmount] = useState(11);
  const [coins] = useState([1, 2, 5]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const fibonacciVisualization = async () => {
    setIsRunning(true);
    const n = fibN;
    const dp: Cell[][] = Array(n + 1).fill(null).map((_, i) => [{
      value: i === 0 ? 0 : i === 1 ? 1 : '?',
      state: 'default'
    }]);
    setTable(dp);
    await sleep(speed);

    for (let i = 2; i <= n; i++) {
      dp[i][0].state = 'computing';
      setTable([...dp]);
      await sleep(speed);

      const value = (dp[i-1][0].value as number) + (dp[i-2][0].value as number);
      dp[i][0].value = value;
      dp[i][0].state = 'computed';
      setTable([...dp]);
      await sleep(speed);
    }

    dp[n][0].state = 'result';
    setTable([...dp]);
    setResult(`Fibonacci(${n}) = ${dp[n][0].value}`);
    setIsRunning(false);
  };

  const knapsackVisualization = async () => {
    setIsRunning(true);
    const n = weights.length;
    const W = capacity;
    
    const dp: Cell[][] = Array(n + 1).fill(null).map(() => 
      Array(W + 1).fill(null).map(() => ({ value: 0, state: 'default' as const }))
    );
    setTable(dp);
    await sleep(speed);

    for (let i = 1; i <= n; i++) {
      for (let w = 1; w <= W; w++) {
        dp[i][w].state = 'computing';
        setTable([...dp]);
        await sleep(speed);

        if (weights[i-1] <= w) {
          dp[i][w].value = Math.max(
            dp[i-1][w].value as number,
            (dp[i-1][w - weights[i-1]].value as number) + values[i-1]
          );
        } else {
          dp[i][w].value = dp[i-1][w].value;
        }

        dp[i][w].state = 'computed';
        setTable([...dp]);
        await sleep(speed / 2);
      }
    }

    dp[n][W].state = 'result';
    setTable([...dp]);
    setResult(`Maximum value: ${dp[n][W].value}`);
    setIsRunning(false);
  };

  const lcsVisualization = async () => {
    setIsRunning(true);
    const m = string1.length;
    const n = string2.length;
    
    const dp: Cell[][] = Array(m + 1).fill(null).map(() => 
      Array(n + 1).fill(null).map(() => ({ value: 0, state: 'default' as const }))
    );
    setTable(dp);
    await sleep(speed);

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j].state = 'computing';
        setTable([...dp]);
        await sleep(speed);

        if (string1[i-1] === string2[j-1]) {
          dp[i][j].value = (dp[i-1][j-1].value as number) + 1;
        } else {
          dp[i][j].value = Math.max(
            dp[i-1][j].value as number,
            dp[i][j-1].value as number
          );
        }

        dp[i][j].state = 'computed';
        setTable([...dp]);
        await sleep(speed / 2);
      }
    }

    dp[m][n].state = 'result';
    setTable([...dp]);
    setResult(`LCS Length: ${dp[m][n].value}`);
    setIsRunning(false);
  };

  const coinChangeVisualization = async () => {
    setIsRunning(true);
    const amount = targetAmount;
    
    const dp: Cell[][] = Array(amount + 1).fill(null).map((_, i) => [{
      value: i === 0 ? 0 : Infinity,
      state: 'default' as const
    }]);
    setTable(dp);
    await sleep(speed);

    for (let i = 1; i <= amount; i++) {
      dp[i][0].state = 'computing';
      setTable([...dp]);
      await sleep(speed);

      for (const coin of coins) {
        if (coin <= i) {
          const prev = dp[i - coin][0].value as number;
          if (prev !== Infinity) {
            dp[i][0].value = Math.min(
              dp[i][0].value as number,
              prev + 1
            );
          }
        }
      }

      dp[i][0].state = 'computed';
      setTable([...dp]);
      await sleep(speed);
    }

    dp[amount][0].state = 'result';
    setTable([...dp]);
    const finalValue = dp[amount][0].value;
    setResult(
      finalValue === Infinity 
        ? `Cannot make amount ${amount}` 
        : `Minimum coins: ${finalValue}`
    );
    setIsRunning(false);
  };

  const runAlgorithm = () => {
    setResult('');
    switch (algorithm) {
      case 'fibonacci':
        fibonacciVisualization();
        break;
      case 'knapsack':
        knapsackVisualization();
        break;
      case 'lcs':
        lcsVisualization();
        break;
      case 'coinchange':
        coinChangeVisualization();
        break;
    }
  };

  const resetVisualization = () => {
    setTable([]);
    setResult('');
  };

  const getAlgorithmName = () => {
    switch (algorithm) {
      case 'fibonacci': return 'Fibonacci Sequence (DP)';
      case 'knapsack': return '0/1 Knapsack Problem';
      case 'lcs': return 'Longest Common Subsequence';
      case 'coinchange': return 'Coin Change Problem';
    }
  };

  const getDescription = () => {
    switch (algorithm) {
      case 'fibonacci': return `Computing Fibonacci(${fibN}) using dynamic programming`;
      case 'knapsack': return `Capacity: ${capacity}, Items: ${weights.length}`;
      case 'lcs': return `String 1: "${string1}", String 2: "${string2}"`;
      case 'coinchange': return `Target: ${targetAmount}, Coins: [${coins.join(', ')}]`;
    }
  };

  return (
    <div className="dp-visualizer">
      <div className="visualizer-header">
        <h1 className="page-title">Dynamic Programming Visualizer</h1>
        <p className="page-subtitle">Visualize classic DP problems and memoization tables</p>
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
              <option value="fibonacci">Fibonacci</option>
              <option value="knapsack">0/1 Knapsack</option>
              <option value="lcs">Longest Common Subsequence</option>
              <option value="coinchange">Coin Change</option>
            </select>
          </div>

          {algorithm === 'fibonacci' && (
            <div className="control-group">
              <label htmlFor="fibN">N Value</label>
              <input
                type="number"
                id="fibN"
                className="number-input"
                min="2"
                max="20"
                value={fibN}
                onChange={(e) => setFibN(Number(e.target.value))}
                disabled={isRunning}
              />
            </div>
          )}

          {algorithm === 'coinchange' && (
            <div className="control-group">
              <label htmlFor="target">Target Amount</label>
              <input
                type="number"
                id="target"
                className="number-input"
                min="1"
                max="50"
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                disabled={isRunning}
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
              {isRunning ? 'Running...' : 'Start Visualization'}
            </button>
            <button className="btn btn-secondary" onClick={resetVisualization} disabled={isRunning}>
              Reset
            </button>
          </div>
        </div>

        <div className="visualization-area">
          <h2 className="algorithm-name">{getAlgorithmName()}</h2>
          <p className="algorithm-description">{getDescription()}</p>
          
          {table.length > 0 && (
            <div className="dp-table-container">
              <table className="dp-table">
                <tbody>
                  {table.map((row, i) => (
                    <tr key={i}>
                      <td className="row-header">{i}</td>
                      {row.map((cell, j) => (
                        <td key={j} className={`dp-cell ${cell.state}`}>
                          {cell.value === Infinity ? '∞' : cell.value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {result && (
            <div className="result-display">
              <strong>Result:</strong> {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicProgrammingVisualizer;
