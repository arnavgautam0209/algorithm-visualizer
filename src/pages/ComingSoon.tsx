import './ComingSoon.css'

interface ComingSoonProps {
  title: string
  description: string
  features: string[]
}

function ComingSoon({ title, description, features }: ComingSoonProps) {
  return (
    <div className="coming-soon">
      <div className="coming-soon-content">
        <h1 className="coming-soon-title">{title}</h1>
        <p className="coming-soon-description">{description}</p>
        
        <div className="features-list">
          <h3>Coming Soon:</h3>
          <ul>
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>

        <div className="under-construction">
          <span className="construction-icon">🚧</span>
          <p>This page is currently under construction</p>
        </div>
      </div>
    </div>
  )
}

export default ComingSoon
