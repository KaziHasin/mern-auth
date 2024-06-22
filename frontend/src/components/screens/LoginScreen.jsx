import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {Form, Button, Row, Col} from "react-bootstrap"
import FormContainer from "../FormContainer";
import { useLoginMutation } from "../../slices/authApiSlice";
import { setCredentials } from "../../slices/authSlice";
import {toast } from 'react-toastify';
import Loader from "../Loader";

function LoginScreen() {

    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [login, {isLoading}] = useLoginMutation();
     
    const { userInfo } = useSelector((state) => state.auth)
     
    useEffect(() =>{
      if(userInfo) {
        navigate('/');
      }
    },[navigate, userInfo])

    const submitHandler = async (e) => {
       e.preventDefault();
      try {
        const res = await login({email, password}).unwrap();
        dispatch(setCredentials({...res}));
        navigate('/');
      } catch (error) {
        toast.error(error.data.message || res.data);
      }
    }
  return (
  <FormContainer>
    <h2 className="mt-3 ms-3">Sign In</h2>
     <Form onSubmit={submitHandler} className="p-3 pt-1">
      
      <Form.Group className="my-3" controlId="email">
        <Form.Label>Email Address</Form.Label>
        <Form.Control
        type="email" value={email} placeholder="Enter Email" onChange={(e)=>{setEmail(e.target.value)}}>
        </Form.Control>
      </Form.Group>
      <Form.Group className="my-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
        type="password" value={password} placeholder="Enter Password" onChange={(e)=>{setPassword(e.target.value)}}>
        </Form.Control>
      </Form.Group>
      <Button type="submit" variant="primary" className="mt-3">Sign In {isLoading && <Loader/>}</Button>
      <Row className="py-3">
        <Col>
       
         New user? <Link to="/register">Register</Link>
       
        </Col>
      </Row>

   </Form>
  </FormContainer>
  )
}

export default LoginScreen
