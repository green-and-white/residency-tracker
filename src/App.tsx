import './App.css'
import Main from './Pages/Main/page.tsx'
import Residency from './Pages/Residency/page.tsx'
import PublicView from './Pages/PublicView/page.tsx'
import Admin from './Pages/Admin/page.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SessionProvider } from './components/ui/auth.tsx'

function App() {
  return (
    <>
      <SessionProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Main/>}/>
            <Route path='/residency' element={<ProtectedRoute><Residency/></ProtectedRoute>}/>
            <Route path='/publicview' element={<PublicView/>}/>
            {/* <Route path='/admin' element={<Admin/>}/> */}
          </Routes>
        </BrowserRouter>
      </SessionProvider>
    </>
  )
}

export default App
