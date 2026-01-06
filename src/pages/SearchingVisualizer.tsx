import { useState, useEffect, useRef } from 'react'
import './SearchingVisualizer.css'

interface ArrayItem {
  value: number
  state: 'default' | 'searching' | 'found' | 'not-found'
}

function SearchingVisualizer() {
  const [array, setArray] = useState<ArrayItem[]>([])
  const [arraySize, setArraySize] = useState(15)
  const [searchValue, setSearchValue] = useState(0)
  const [speed, setSpeed] = useState(50)
  const [algorithm, setAlgorithm] = useState('linear')
  const [isVisualizing, setIsVisualizing] = useState(false)
  const stopVisualizationRef = useRef(false)

  useEffect(() => {
    generateSortedArray()
  }, [arraySize])

  const generateSortedArray = () => {
    const newArray: ArrayItem[] = []
    for (let i = 0; i < arraySize; i++) {
      newArray.push({
        value: (i + 1) * 10,
        state: 'default'
      })
    }
    setArray(newArray)
    setSearchValue(newArray[Math.floor(Math.random() * newArray.length)].value)
  }

  const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  const updateArray = (newArray: ArrayItem[]) => {
    setArray([...newArray])
  }

  // Linear Search
  const linearSearch = async () => {
    const arr = [...array]
    
    for (let i = 0; i < arr.length; i++) {
      if (stopVisualizationRef.current) break

      arr[i].state = 'searching'
      updateArray(arr)
      await sleep(101 - speed)

      if (arr[i].value === searchValue) {
        arr[i].state = 'found'
        updateArray(arr)
        return
      }

      arr[i].state = 'not-found'
      updateArray(arr)
    }
  }

  // Binary Search
  const binarySearch = async () => {
    const arr = [...array]
    let left = 0
    let right = arr.length - 1

    while (left <= right && !stopVisualizationRef.current) {
      const mid = Math.floor((left + right) / 2)

      // Highlight the range being searched
      for (let i = left; i <= right; i++) {
        arr[i].state = 'searching'
      }
      updateArray(arr)
      await sleep(101 - speed)

      if (arr[mid].value === searchValue) {
        arr[mid].state = 'found'
        // Mark others as not found
        for (let i = 0; i < arr.length; i++) {
          if (i !== mid && arr[i].state === 'searching') {
            arr[i].state = 'not-found'
          }
        }
        updateArray(arr)
        return
      }

      if (arr[mid].value < searchValue) {
        // Mark left side as not found
        for (let i = left; i <= mid; i++) {
          arr[i].state = 'not-found'
        }
        left = mid + 1
      } else {
        // Mark right side as not found
        for (let i = mid; i <= right; i++) {
          arr[i].state = 'not-found'
        }
        right = mid - 1
      }
      updateArray(arr)
      await sleep(101 - speed)
    }
  }

  // Jump Search
  const jumpSearch = async () => {
    const arr = [...array]
    const n = arr.length
    const step = Math.floor(Math.sqrt(n))
    let prev = 0

    // Jump through blocks
    while (prev < n && arr[Math.min(step, n) - 1].value < searchValue && !stopVisualizationRef.current) {
      // Highlight the jump
      for (let i = prev; i < Math.min(prev + step, n); i++) {
        arr[i].state = 'searching'
      }
      updateArray(arr)
      await sleep(101 - speed)

      // Mark as not found
      for (let i = prev; i < Math.min(prev + step, n); i++) {
        arr[i].state = 'not-found'
      }
      prev += step
      updateArray(arr)
    }

    // Linear search in the block
    for (let i = prev; i < Math.min(prev + step, n); i++) {
      if (stopVisualizationRef.current) break

      arr[i].state = 'searching'
      updateArray(arr)
      await sleep(101 - speed)

      if (arr[i].value === searchValue) {
        arr[i].state = 'found'
        updateArray(arr)
        return
      }

      arr[i].state = 'not-found'
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
      case 'linear':
        await linearSearch()
        break
      case 'binary':
        await binarySearch()
        break
      case 'jump':
        await jumpSearch()
        break
    }

    setIsVisualizing(false)
    stopVisualizationRef.current = false
  }

  const getAlgorithmName = () => {
    const names: { [key: string]: string } = {
      linear: 'Linear Search',
      binary: 'Binary Search',
      jump: 'Jump Search'
    }
    return names[algorithm]
  }

  return (
    <div className="searching-visualizer">
      <div className="visualizer-header">
        <h1 className="page-title">Searching Algorithms Visualizer</h1>
        <p className="page-subtitle">Explore different searching techniques</p>
      </div>

      <div className="visualizer-content">
        <div className="controls-sidebar">
          <div className="control-group">
            <label>Array Size: {arraySize}</label>
            <input
              type="range"
              min="5"
              max="30"
              value={arraySize}
              onChange={(e) => setArraySize(parseInt(e.target.value))}
              disabled={isVisualizing}
              className="slider"
            />
          </div>

          <div className="control-group">
            <label>Search Value: {searchValue}</label>
            <input
              type="number"
              value={searchValue}
              onChange={(e) => setSearchValue(parseInt(e.target.value))}
              disabled={isVisualizing}
              className="number-input"
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
              <option value="linear">Linear Search</option>
              <option value="binary">Binary Search</option>
              <option value="jump">Jump Search</option>
            </select>
          </div>

          <div className="button-group">
            <button
              onClick={generateSortedArray}
              disabled={isVisualizing}
              className="btn btn-secondary"
            >
              Reset Array
            </button>
            <button
              onClick={handleVisualize}
              className={`btn ${isVisualizing ? 'btn-danger' : 'btn-primary'}`}
            >
              {isVisualizing ? 'Stop' : 'Search'}
            </button>
          </div>
        </div>

        <div className="visualization-area">
          <div className="algorithm-name">{getAlgorithmName()}</div>
          <div className="search-info">
            Searching for: <span className="search-value">{searchValue}</span>
          </div>
          <div className="array-container">
            {array.map((item, idx) => (
              <div
                key={idx}
                className={`array-item ${item.state}`}
              >
                <div className="item-value">{item.value}</div>
                <div className="item-index">Index: {idx}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchingVisualizer
