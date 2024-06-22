import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {Form, Button, Row, Col} from "react-bootstrap"
import FormContainer from "../FormContainer";
import { useRegisterMutation } from "../../slices/authApiSlice";
import { setCredentials } from "../../slices/authSlice";
import {toast } from 'react-toastify';
import Loader from "../Loader";


import React from 'react'

function RegisterScreen() {

    const [username, setUsername] = useState(''); 
    const [email, setEmail] = useState(''); 
    const [image, setImage] = useState()
    const [password, setPassword] = useState(''); 
    const [confirmPassword, setConfirmPassword] = useState(''); 

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [register, {isLoading}] = useRegisterMutation();
    const { userInfo } = useSelector((state) => state.auth)
    
    useEffect(() =>{
      if(userInfo) {
        navigate('/');
      }
    },[navigate, userInfo])



    const submitHandler = async (e) => {
        e.preventDefault();
        if(password !== confirmPassword) {
          toast.error("Passwords didn't match");
          return false;
        }
        const formData = new FormData();
        formData.append('username', username)
        formData.append('email', email)
        formData.append('password', password)
        formData.append('image', image)
        try {
          const res = await register(formData).unwrap();
       
          dispatch(setCredentials({...res}))
          navigate('/')

        } catch (error) {
          toast.error(error.data.message || res.data);
        }
    }
  return (
  <FormContainer>
    <h2 className="mt-3 ms-3">Sign Up</h2>
     <Form onSubmit={submitHandler} className="p-3 pt-1">

     <Form.Group className="my-3" controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control
        type="text" value={username} placeholder="Enter Username" onChange={(e)=>{setUsername(e.target.value)}}>
        </Form.Control>
      </Form.Group>
      
      <Form.Group className="my-3" controlId="email">
        <Form.Label>Email Address</Form.Label>
        <Form.Control
        type="email" value={email} placeholder="Enter Email" onChange={(e)=>{setEmail(e.target.value)}}>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="image" className="my-3">
        <Form.Label>Image Upload</Form.Label>
        <Form.Control type="file" onChange={(e) => {setImage(e.target.files[0])}}/>
      </Form.Group>
      <Form.Group className="my-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
        type="password" value={password} placeholder="Enter Password" onChange={(e)=>{setPassword(e.target.value)}}>
        </Form.Control>
      </Form.Group>
      <Form.Group className="my-3" controlId="confirm-password">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
        type="password" value={confirmPassword} placeholder="Enter confirm Password" onChange={(e)=>{setConfirmPassword(e.target.value)}}>
        </Form.Control>
      </Form.Group>
      <Button type="submit" variant="primary" className="mt-3">Register {isLoading && <Loader/>}</Button>
      <Row className="py-3">
        <Col>
       
         Have an account? <Link to="/login">Sign In</Link>
       
        </Col>
      </Row>

   </Form>
  </FormContainer>
  )
}

export default RegisterScreen
