import './App.css'
import MainView from './views/mainView/MainView'
import SideBar from './components/sideBar/SideBar'

function App() {
  return (
    <>
    <SideBar/>
    <div className="App">
      <MainView/>
    </div>
    </>
  )
}

export default App
