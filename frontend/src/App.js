import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import AiChat from './pages/AiChat'
import Home from './pages/Home'
import Login from './pages/Login'
import NewTicket from './pages/NewTicket'
import Register from './pages/Register'
import Ticket from './pages/Ticket'
import Tickets from './pages/Tickets'

function AppLayout() {
  const { pathname } = useLocation()
  const isAiChat = pathname === '/ai'

  return (
    <>
      <a href='#main' className='skip-link'>
        Skip to content
      </a>
      <Header />
      <main
        id='main'
        className={`main${isAiChat ? ' main-ai-chat' : ''}`}
        tabIndex={-1}>
        <div className={`container${isAiChat ? ' container-ai-chat' : ''}`}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/new-ticket' element={<PrivateRoute />}>
              <Route path='/new-ticket' element={<NewTicket />} />
            </Route>
            <Route path='/tickets' element={<PrivateRoute />}>
              <Route path='/tickets' element={<Tickets />} />
            </Route>
            <Route path='/ticket/:ticketId' element={<PrivateRoute />}>
              <Route path='/ticket/:ticketId' element={<Ticket />} />
            </Route>
            <Route path='/ai' element={<PrivateRoute />}>
              <Route path='/ai' element={<AiChat />} />
            </Route>
          </Routes>
        </div>
      </main>
    </>
  )
}

function App() {
  return (
    <>
      <Router>
        <AppLayout />
      </Router>
      <ToastContainer
        position='bottom-center'
        autoClose={3000}
        hideProgressBar
        closeButton={false}
        newestOnTop
        pauseOnFocusLoss={false}
        draggable={false}
      />
    </>
  )
}

export default App
