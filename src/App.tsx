import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Properties from './pages/Properties'
import MediaLibrary from './pages/MediaLibrary'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/media" element={<MediaLibrary />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App