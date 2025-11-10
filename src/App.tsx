import './App.css'
import Main from './Pages/Main/page.tsx'
import Residency from './Pages/Residency/page.tsx'
import PublicView from './Pages/PublicView/page.tsx'
import EnterCode from './Pages/EnterCode/page.tsx'
import Admin from './Pages/Admin/page.tsx'
import GetCode from './Pages/GetCode/page.tsx'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from './components/ProtectedRoute.tsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Main/>}/>
          <Route path='/residency' element={<ProtectedRoute><Residency/></ProtectedRoute>}/>
          <Route path='/publicview' element={<PublicView/>}/>
          <Route path='/entercode' element={<EnterCode/>}/>
          <Route path='/admin' element={<Admin/>}/>
          <Route path='/getcode' element={<ProtectedRoute><GetCode/></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
