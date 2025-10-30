import './App.css'
import Main from './Pages/Main/page.tsx'
import Residency from './Pages/Residency/page.tsx'
import PublicView from './Pages/PublicView/page.tsx'
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Main/>}/>
          <Route path='/residency' element={<Residency/>}/>
          <Route path='/publicview' element={<PublicView/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
