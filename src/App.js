import React from 'react'
import './App.css'
import Pathfinder from "./components/Pathfinder.js"
import Navbar from "./components/Navbar.js"
import { BrowserRouter as Router} from 'react-router-dom'

const App = () => {
  return (
    <Router>
      <Navbar />
      <Pathfinder />
    </Router>
  );
}

export default App
