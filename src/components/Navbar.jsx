import React, { useContext } from 'react'
import { Link,  Outlet, useLocation, useNavigate } from 'react-router-dom'
import '../App.css'
import {AuthContext} from '../context/AuthContext'

function Navbar() {

  const {state, dispatch} = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
  dispatch({ type: 'LOGOUT' });
  navigate('/'); 
  };

  const privatePages = ['/taskform', '/alltasks'];
  const showLogout = state.user && privatePages.includes(location.pathname);

  return (
    <div>
      <nav>
        <ul style={{listStyle:"none"}}>
            <li>
                 <Link style={{textDecoration:"none", color:"pink"}} to={"/taskform"}><p className='head'>Blogshelf</p></Link>
            </li>
            <li><Link to={"/alltasks"}><i className="fa-solid fa-bars"></i></Link></li>
            {showLogout && (
              <li><button onClick={handleLogout} className='logout-btn'>Logout</button></li>
            )}
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Navbar