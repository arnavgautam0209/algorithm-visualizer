import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import SortingVisualizer from './pages/SortingVisualizer'
import SearchingVisualizer from './pages/SearchingVisualizer'
import GraphVisualizer from './pages/GraphVisualizer'
import TreeVisualizer from './pages/TreeVisualizer'
import DynamicProgrammingVisualizer from './pages/DynamicProgrammingVisualizer'
import RecursionVisualizer from './pages/RecursionVisualizer'

// Main layout wrapper - keeps navbar and footer consistent across all pages
function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

  return (
    <div className="app">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="logo-icon">⚡</span>
            <span className="logo-text">Algorithm Visualizer</span>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <a href="https://github.com/arnavgautam0209" target="_blank" rel="noopener noreferrer" className="nav-link github-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">© 2026 Algorithm Visualizer. Made with ❤️ by Arnav Gautam</p>
          <div className="footer-links">
            <a href="https://github.com/arnavgautam0209" target="_blank" rel="noopener noreferrer" className="footer-link">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/sorting" element={<Layout><SortingVisualizer /></Layout>} />
        <Route path="/searching" element={<Layout><SearchingVisualizer /></Layout>} />
        <Route path="/graph" element={<Layout><GraphVisualizer /></Layout>} />
        <Route path="/tree" element={<Layout><TreeVisualizer /></Layout>} />
        <Route path="/dynamic-programming" element={<Layout><DynamicProgrammingVisualizer /></Layout>} />
        <Route path="/recursion" element={<Layout><RecursionVisualizer /></Layout>} />
      </Routes>
    </Router>
  )
}

export default App
