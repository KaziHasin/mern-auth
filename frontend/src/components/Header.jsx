import {Container,Navbar,Nav, NavDropdown, Badge, Image} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap'
import { FaSignInAlt,FaSignOutAlt, FaUser, FaUserSecret } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom'
import {toast } from 'react-toastify';
import { useEffect } from 'react';
import {useLogoutMutation} from '../slices/authApiSlice'
import {removeCredentials} from '../slices/authSlice'



const Header =() =>{ 
 
  const dispatch = useDispatch();
  const navigate = useNavigate();
 const [logoutApiCall] = useLogoutMutation();

 const logoutHandler = async (e) => {
  e.preventDefault();
  try {
    await logoutApiCall().unwrap();
    dispatch(removeCredentials());
    navigate('/')
  } catch (error) {
    console.log(error);
  }
 }

  const { userInfo } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (userInfo) {
      const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (storedUserInfo && storedUserInfo.message) {
        toast.success(storedUserInfo.message);
        delete storedUserInfo.message;
        localStorage.setItem("userInfo", JSON.stringify(storedUserInfo));
      }
    }
  }, [userInfo]);
  return (
    <header>
     
        <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <LinkContainer to='/'>
        <Navbar.Brand>Mern Auth</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className='justify-end'>
          <Nav className="ms-auto">
            {userInfo ? (
              <>
              {userInfo.data.profileImage ? <>
                <Image  src={`http://localhost:4000/${userInfo.data.profileImage}`} roundedCircle  width="30px" height="30px" className='mt-1'/>
              </> : <><span>No Image</span></>}
              <NavDropdown title={userInfo.data.username} id='username'>
              <LinkContainer to='/user'>
                <NavDropdown.Item className='my-3'><FaUser/> Profile</NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Item onClick={logoutHandler}><FaSignOutAlt/> Logout</NavDropdown.Item>
              </NavDropdown>
              </>
            ) : (
              <>
              <LinkContainer to='/login'>
            <Nav.Link><FaSignInAlt/> Sign In</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/register'>
            <Nav.Link><FaSignOutAlt/>Sign Up</Nav.Link>
            </LinkContainer>
              </>
            )}
          
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </header>
  );
}

export default Header;