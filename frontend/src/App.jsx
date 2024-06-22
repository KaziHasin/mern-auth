import React from 'react'
import { Outlet } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { useDispatch,useSelector } from 'react-redux'
import Header from './components/Header'
import FormContainer from './components/FormContainer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {removeCredentials} from './slices/authSlice';

export default function App() {

  const dispatch = useDispatch()

  const tokenExpiration = useSelector((state) => state.auth.userInfo?.tokenExpiration);
  console.log(tokenExpiration);
  return (
    <>
    <Header/>
    <ToastContainer />
    <Container>
    <Outlet/>
    </Container>
    <FormContainer/>
   
  
    </>
  )
}
