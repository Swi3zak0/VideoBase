import '../CSS/Styles.css';
import { Button} from "react-bootstrap";
import logo from "../Images/logo.png"
import { Link, useNavigate } from "react-router-dom";
import { Search } from './Search';
import { Logout } from './Logout';


function Navbar(){

    const isLoggedIn = localStorage.getItem('isLoggedIn') ==='true';
    const  {logout} = Logout();
    
    return(
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to='/home' className="logo-link-home" >
                    <img src={logo} width="50" height="50" alt="logo"></img>
                        VideoBase
                    </Link>
                    {/* <Search/> */}
                    <ul className="nav">
                        {!isLoggedIn && (
                            <>
                                <li className="nav-item">
                                    <Link to='/login' className="nav-links">
                                        Sign In
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to='/register' className="nav-links">
                                        Sign Up
                                    </Link>
                                </li>
                            </>
                        )}
                        {isLoggedIn && (
                        <li className="nav-item">
                            <Button onClick={logout} className="button" type="button">Logout</Button>
                        </li>
                        )}  
                    </ul>
                </div>
            </nav>
        </>
    )
}
export default Navbar;
