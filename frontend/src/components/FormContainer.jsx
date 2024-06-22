import { Container, Row, Col } from "react-bootstrap";

function FormContainer({children}) {
  return (
   <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col sm={12} md={6} className="card shadow border-0 ">
            {children}
        </Col>
      </Row>

   </Container>
  )
}

export default FormContainer
