import './App.css'
import Main from './Pages/Main/page.tsx'
import Residency from './Pages/Residency/page.tsx'
import PublicView from './Pages/PublicView/page.tsx'
import EnterCode from './Pages/EnterCode/page.tsx'
import Admin from './Pages/Admin/page.tsx'
import GetCode from './Pages/GetCode/page.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'

import supabase from './utils/supabase.ts'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState, useEffect, createContext } from 'react'
import type { Session } from '@supabase/supabase-js'

export const SessionContext = createContext<Session | null >(null);

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
      <SessionContext.Provider value={currentSession}>
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
      </SessionContext.Provider>
    </>
  )
}

export default App
