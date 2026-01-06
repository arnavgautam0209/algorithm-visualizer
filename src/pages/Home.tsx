import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  const algorithmCards = [
    {
      title: 'Sorting Algorithms',
      description: 'Watch Bubble Sort, Quick Sort, Merge Sort, and more organize data right before your eyes. It\'s oddly satisfying, trust me!',
      icon: '📊',
      path: '/sorting'
    },
    {
      title: 'Searching Algorithms',
      description: 'See why Binary Search is so much faster than Linear Search. Spoiler alert: it\'s pretty cool!',
      icon: '🔍',
      path: '/searching'
    },
    {
      title: 'Graph Algorithms',
      description: 'Ever wondered how GPS finds the shortest route? Let\'s visualize BFS, DFS, Dijkstra\'s and more!',
      icon: '🗺️',
      path: '/graph'
    },
    {
      title: 'Tree Algorithms',
      description: 'Trees aren\'t just for forests! Explore how Binary Search Trees work with visual traversals.',
      icon: '🌳',
      path: '/tree'
    },
    {
      title: 'Dynamic Programming',
      description: 'DP used to scare me. Not anymore! Watch these optimization problems solve themselves step by step.',
      icon: '💡',
      path: '/dynamic-programming'
    },
    {
      title: 'Recursion & Backtracking',
      description: 'See the call stack in action! N-Queens, Sudoku solving, and other mind-bending recursive algorithms.',
      icon: '🔄',
      path: '/recursion'
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Algorithm Visualizer</h1>
            <p className="hero-description">
              Ever tried to learn algorithms from a textbook and felt confused? Yeah, me too. 
              That's why I built this - to actually <em>see</em> how these algorithms work, 
              step by step. No more guessing, just visual learning that actually makes sense! 🚀
            </p>
            <p className="hero-subtitle">
              Pick an algorithm below and watch the magic happen ✨
            </p>
          </div>
          <div className="hero-image">
            <svg className="graph-logo" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
              {/* Edges */}
              <line x1="200" y1="80" x2="120" y2="180" stroke="#ffffff" strokeWidth="4" className="graph-edge edge-1" strokeLinecap="round" />
              <line x1="200" y1="80" x2="280" y2="180" stroke="#ffffff" strokeWidth="4" className="graph-edge edge-2" strokeLinecap="round" />
              <line x1="120" y1="180" x2="80" y2="300" stroke="#ffffff" strokeWidth="4" className="graph-edge edge-3" strokeLinecap="round" />
              <line x1="120" y1="180" x2="200" y2="300" stroke="#ffffff" strokeWidth="4" className="graph-edge edge-4" strokeLinecap="round" />
              <line x1="280" y1="180" x2="200" y2="300" stroke="#ffffff" strokeWidth="4" className="graph-edge edge-5" strokeLinecap="round" />
              <line x1="280" y1="180" x2="320" y2="300" stroke="#ffffff" strokeWidth="4" className="graph-edge edge-6" strokeLinecap="round" />
              
              {/* Nodes - Background circles for depth */}
              <circle cx="200" cy="80" r="35" fill="#ffffff" opacity="0.1" className="graph-node-shadow" />
              <circle cx="120" cy="180" r="35" fill="#ffffff" opacity="0.1" className="graph-node-shadow" />
              <circle cx="280" cy="180" r="35" fill="#ffffff" opacity="0.1" className="graph-node-shadow" />
              <circle cx="80" cy="300" r="35" fill="#ffffff" opacity="0.1" className="graph-node-shadow" />
              <circle cx="200" cy="300" r="35" fill="#ffffff" opacity="0.1" className="graph-node-shadow" />
              <circle cx="320" cy="300" r="35" fill="#ffffff" opacity="0.1" className="graph-node-shadow" />
              
              {/* Nodes - Main circles */}
              <circle cx="200" cy="80" r="32" fill="#ffffff" stroke="#ffffff" strokeWidth="3" className="graph-node node-1" />
              <circle cx="120" cy="180" r="32" fill="#ffffff" stroke="#ffffff" strokeWidth="3" className="graph-node node-2" />
              <circle cx="280" cy="180" r="32" fill="#ffffff" stroke="#ffffff" strokeWidth="3" className="graph-node node-3" />
              <circle cx="80" cy="300" r="32" fill="#ffffff" stroke="#ffffff" strokeWidth="3" className="graph-node node-4" />
              <circle cx="200" cy="300" r="32" fill="#ffffff" stroke="#ffffff" strokeWidth="3" className="graph-node node-5" />
              <circle cx="320" cy="300" r="32" fill="#ffffff" stroke="#ffffff" strokeWidth="3" className="graph-node node-6" />
              
              {/* Node Labels */}
              <text x="200" y="88" textAnchor="middle" fill="#000000" fontSize="18" fontWeight="700" className="node-label">A</text>
              <text x="120" y="188" textAnchor="middle" fill="#000000" fontSize="18" fontWeight="700" className="node-label">B</text>
              <text x="280" y="188" textAnchor="middle" fill="#000000" fontSize="18" fontWeight="700" className="node-label">C</text>
              <text x="80" y="308" textAnchor="middle" fill="#000000" fontSize="18" fontWeight="700" className="node-label">D</text>
              <text x="200" y="308" textAnchor="middle" fill="#000000" fontSize="18" fontWeight="700" className="node-label">E</text>
              <text x="320" y="308" textAnchor="middle" fill="#000000" fontSize="18" fontWeight="700" className="node-label">F</text>
            </svg>
          </div>
        </div>
      </section>

      {/* Algorithm Cards Grid */}
      <section className="algorithms-section">
        <div className="algorithms-container">
          <div className="algorithms-grid">
            {algorithmCards.map((card, index) => (
              <div 
                key={index} 
                className="algorithm-card"
                onClick={() => navigate(card.path)}
              >
                <div className="card-icon">{card.icon}</div>
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
