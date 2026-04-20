import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import MainView from './views/mainView/MainView'
import SideBar from './components/sideBar/SideBar'

function App() {
  return (
    <>
    <BrowserRouter basename="react-education/">
    <SideBar/>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainView/>} />
        </Routes>
      </div>
    </BrowserRouter>
    </>
  )
}

export default App
