import { Form } from "react-router-dom"

function FormGroup() {
  return (
    <Form.Group className="my-2" controlId="email">
    <Form.Label>Email Address</Form.Label>
    <Form.Control
    type="email" value={email} placeholder="Enter Email" onChange={(e)=>{setEmail(e.target.value)}}>
    </Form.Control>
    </Form.Group>
  )
}

export default FormGroup
