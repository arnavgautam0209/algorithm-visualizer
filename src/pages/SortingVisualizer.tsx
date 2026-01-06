import { useState, useEffect, useRef } from 'react'
import './SortingVisualizer.css'

// TODO: Add more sorting algorithms (Radix, Counting Sort?)
// TODO: Maybe add sound effects? Would be cool to hear the sorts

interface ArrayBar {
  value: number
  state: 'default' | 'comparing' | 'swapping' | 'sorted'
}

function SortingVisualizer() {
  const [array, setArray] = useState<ArrayBar[]>([])
  const [arraySize, setArraySize] = useState(20)
  const [speed, setSpeed] = useState(50)
  const [algorithm, setAlgorithm] = useState('bubble')
  const [isVisualizing, setIsVisualizing] = useState(false)
  const stopVisualizationRef = useRef(false)

  // Generate array on mount and when size changes
  useEffect(() => {
    generateRandomArray()
  }, [arraySize])

  const generateRandomArray = () => {
    const newArray: ArrayBar[] = []
    // Random values between 50 and 350 for better visualization
    for (let i = 0; i < arraySize; i++) {
      newArray.push({
        value: Math.floor(Math.random() * 300) + 50,
        state: 'default'
      })
    }
    setArray(newArray)
  }

  // Simple delay function - this controls animation speed
  const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  const updateArray = (newArray: ArrayBar[]) => {
    setArray([...newArray])
  }

  // Bubble Sort - Classic! Started with this one because it's the easiest to visualize
  const bubbleSort = async () => {
    const arr = [...array]
    const n = arr.length

    for (let i = 0; i < n - 1; i++) {
      if (stopVisualizationRef.current) break

      for (let j = 0; j < n - i - 1; j++) {
        if (stopVisualizationRef.current) break

        // Mark comparing
        arr[j].state = 'comparing'
        arr[j + 1].state = 'comparing'
        updateArray(arr)
        await sleep(101 - speed)

        if (arr[j].value > arr[j + 1].value) {
          // Mark swapping
          arr[j].state = 'swapping'
          arr[j + 1].state = 'swapping'
          updateArray(arr)
          await sleep(101 - speed)

          // Swap
          const temp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = temp
        }

        // Reset to default
        arr[j].state = 'default'
        arr[j + 1].state = 'default'
        updateArray(arr)
      }

      // Mark as sorted
      arr[n - i - 1].state = 'sorted'
      updateArray(arr)
    }

    if (!stopVisualizationRef.current) {
      arr[0].state = 'sorted'
      updateArray(arr)
    }
  }

  // Quick Sort
  const quickSort = async () => {
    const arr = [...array]
    await quickSortHelper(arr, 0, arr.length - 1)
    
    if (!stopVisualizationRef.current) {
      arr.forEach(item => item.state = 'sorted')
      updateArray(arr)
    }
  }

  const quickSortHelper = async (arr: ArrayBar[], low: number, high: number) => {
    if (low < high && !stopVisualizationRef.current) {
      const pi = await partition(arr, low, high)
      await quickSortHelper(arr, low, pi - 1)
      await quickSortHelper(arr, pi + 1, high)
    }
  }

  const partition = async (arr: ArrayBar[], low: number, high: number) => {
    const pivot = arr[high].value
    let i = low - 1

    for (let j = low; j < high; j++) {
      if (stopVisualizationRef.current) break

      arr[j].state = 'comparing'
      arr[high].state = 'comparing'
      updateArray(arr)
      await sleep(101 - speed)

      if (arr[j].value < pivot) {
        i++
        arr[i].state = 'swapping'
        arr[j].state = 'swapping'
        updateArray(arr)
        await sleep(101 - speed)

        const temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
      }

      arr[j].state = 'default'
      updateArray(arr)
    }

    arr[i + 1].state = 'swapping'
    arr[high].state = 'swapping'
    updateArray(arr)
    await sleep(101 - speed)

    const temp = arr[i + 1]
    arr[i + 1] = arr[high]
    arr[high] = temp

    arr[i + 1].state = 'sorted'
    arr[high].state = 'default'
    updateArray(arr)

    return i + 1
  }

  // Merge Sort
  const mergeSort = async () => {
    const arr = [...array]
    await mergeSortHelper(arr, 0, arr.length - 1)
    
    if (!stopVisualizationRef.current) {
      arr.forEach(item => item.state = 'sorted')
      updateArray(arr)
    }
  }

  const mergeSortHelper = async (arr: ArrayBar[], left: number, right: number) => {
    if (left < right && !stopVisualizationRef.current) {
      const mid = Math.floor((left + right) / 2)
      await mergeSortHelper(arr, left, mid)
      await mergeSortHelper(arr, mid + 1, right)
      await merge(arr, left, mid, right)
    }
  }

  const merge = async (arr: ArrayBar[], left: number, mid: number, right: number) => {
    const leftArr = arr.slice(left, mid + 1)
    const rightArr = arr.slice(mid + 1, right + 1)

    let i = 0, j = 0, k = left

    while (i < leftArr.length && j < rightArr.length && !stopVisualizationRef.current) {
      arr[k].state = 'comparing'
      updateArray(arr)
      await sleep(101 - speed)

      if (leftArr[i].value <= rightArr[j].value) {
        arr[k] = { ...leftArr[i], state: 'swapping' }
        i++
      } else {
        arr[k] = { ...rightArr[j], state: 'swapping' }
        j++
      }
      updateArray(arr)
      await sleep(101 - speed)
      arr[k].state = 'default'
      k++
    }

    while (i < leftArr.length && !stopVisualizationRef.current) {
      arr[k] = { ...leftArr[i], state: 'default' }
      updateArray(arr)
      await sleep(101 - speed)
      i++
      k++
    }

    while (j < rightArr.length && !stopVisualizationRef.current) {
      arr[k] = { ...rightArr[j], state: 'default' }
      updateArray(arr)
      await sleep(101 - speed)
      j++
      k++
    }
  }

  // Insertion Sort
  const insertionSort = async () => {
    const arr = [...array]
    const n = arr.length

    for (let i = 1; i < n; i++) {
      if (stopVisualizationRef.current) break

      const key = arr[i]
      let j = i - 1

      arr[i].state = 'comparing'
      updateArray(arr)
      await sleep(101 - speed)

      while (j >= 0 && arr[j].value > key.value && !stopVisualizationRef.current) {
        arr[j].state = 'swapping'
        arr[j + 1].state = 'swapping'
        updateArray(arr)
        await sleep(101 - speed)

        arr[j + 1] = arr[j]
        arr[j].state = 'default'
        j--
        updateArray(arr)
      }

      arr[j + 1] = { ...key, state: 'default' }
      updateArray(arr)
    }

    if (!stopVisualizationRef.current) {
      arr.forEach(item => item.state = 'sorted')
      updateArray(arr)
    }
  }

  // Selection Sort
  const selectionSort = async () => {
    const arr = [...array]
    const n = arr.length

    for (let i = 0; i < n - 1; i++) {
      if (stopVisualizationRef.current) break

      let minIdx = i
      arr[minIdx].state = 'comparing'
      updateArray(arr)

      for (let j = i + 1; j < n; j++) {
        if (stopVisualizationRef.current) break

        arr[j].state = 'comparing'
        updateArray(arr)
        await sleep(101 - speed)

        if (arr[j].value < arr[minIdx].value) {
          arr[minIdx].state = 'default'
          minIdx = j
          arr[minIdx].state = 'comparing'
        } else {
          arr[j].state = 'default'
        }
        updateArray(arr)
      }

      if (minIdx !== i) {
        arr[i].state = 'swapping'
        arr[minIdx].state = 'swapping'
        updateArray(arr)
        await sleep(101 - speed)

        const temp = arr[i]
        arr[i] = arr[minIdx]
        arr[minIdx] = temp
      }

      arr[i].state = 'sorted'
      if (minIdx !== i) arr[minIdx].state = 'default'
      updateArray(arr)
    }

    if (!stopVisualizationRef.current) {
      arr[n - 1].state = 'sorted'
      updateArray(arr)
    }
  }

  const handleVisualize = async () => {
    if (isVisualizing) {
      stopVisualizationRef.current = true
      return
    }

    stopVisualizationRef.current = false
    setIsVisualizing(true)

    // Reset array states
    const resetArray = array.map(item => ({ ...item, state: 'default' as const }))
    setArray(resetArray)

    switch (algorithm) {
      case 'bubble':
        await bubbleSort()
        break
      case 'quick':
        await quickSort()
        break
      case 'merge':
        await mergeSort()
        break
      case 'insertion':
        await insertionSort()
        break
      case 'selection':
        await selectionSort()
        break
    }

    setIsVisualizing(false)
    stopVisualizationRef.current = false
  }

  const getAlgorithmName = () => {
    const names: { [key: string]: string } = {
      bubble: 'Bubble Sort',
      quick: 'Quick Sort',
      merge: 'Merge Sort',
      insertion: 'Insertion Sort',
      selection: 'Selection Sort'
    }
    return names[algorithm]
  }

  return (
    <div className="sorting-visualizer">
      <div className="visualizer-header">
        <h1 className="page-title">Sorting Algorithms Visualizer</h1>
        <p className="page-subtitle">Watch different sorting algorithms in action</p>
      </div>

      <div className="visualizer-content">
        <div className="controls-sidebar">
          <div className="control-group">
            <label>Array Size: {arraySize}</label>
            <input
              type="range"
              min="5"
              max="100"
              value={arraySize}
              onChange={(e) => setArraySize(parseInt(e.target.value))}
              disabled={isVisualizing}
              className="slider"
            />
          </div>

          <div className="control-group">
            <label>Speed: {speed}</label>
            <input
              type="range"
              min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            disabled={isVisualizing}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label>Algorithm:</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={isVisualizing}
            className="algorithm-select"
          >
            <option value="bubble">Bubble Sort</option>
            <option value="quick">Quick Sort</option>
            <option value="merge">Merge Sort</option>
            <option value="insertion">Insertion Sort</option>
            <option value="selection">Selection Sort</option>
          </select>
        </div>

        <div className="button-group">
          <button
            onClick={generateRandomArray}
            disabled={isVisualizing}
            className="btn btn-secondary"
          >
            Randomize
          </button>
          <button
            onClick={handleVisualize}
            className={`btn ${isVisualizing ? 'btn-danger' : 'btn-primary'}`}
          >
            {isVisualizing ? 'Stop' : 'Visualize'}
          </button>
        </div>
      </div>

      <div className="visualization-area">
        <div className="algorithm-name">{getAlgorithmName()}</div>
        <div className="array-container">
          {array.map((item, idx) => (
            <div
              key={idx}
              className={`array-bar ${item.state}`}
              style={{
                height: `${item.value}px`
              }}
            >
              {arraySize <= 20 && <span className="bar-value">{item.value}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  )
}

export default SortingVisualizer
