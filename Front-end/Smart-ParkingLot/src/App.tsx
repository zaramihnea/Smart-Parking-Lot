import './App.css'
import Homepage from './Homepage'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'

function App() {
  return (
    <>
      <Homepage />
      <SearchBar />
      <Navbar/>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
    </>
  )
}

export default App
