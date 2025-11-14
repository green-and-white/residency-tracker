import './App.css'
import Main from './Pages/Main/page.tsx'
import Residency from './Pages/Residency/page.tsx'
import PublicView from './Pages/PublicView/page.tsx'
import EnterCode from './Pages/EnterCode/page.tsx'
import Admin from './Pages/Admin/page.tsx'
import GetCode from './Pages/GetCode/page.tsx'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from './components/ProtectedRoute.tsx'
import { useState, useEffect } from 'react'
import supabase from './utils/supabase.ts'
import type { Session } from '@supabase/supabase-js'

function App() {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setCurrentSession(session));
  
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentSession(session);
    });

    return () => subscription.unsubscribe(); 

  }, []);

  if (!currentSession) {
    console.log("No session in progress."); // TODO: Turn this into a component/error page
  } else {
    console.log("LOGGED IN AS:", currentSession.user.email);
  }

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
