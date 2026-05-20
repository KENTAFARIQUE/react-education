import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SideBar from './components/sideBar/SideBar';
import MainView from './views/mainView/MainView';
import OrderView from './views/orderView/OrderView'
import './App.css'

function App() {

  return (
    <>
    <BrowserRouter basename="react-education/">
    <SideBar/>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainView/>} />
          <Route path="/order" element={<OrderView/>} />
          <Route path="/order/:step" element={<OrderView/>} />
        </Routes>
      </div>
    </BrowserRouter>
    </>
  )
}

export default App
