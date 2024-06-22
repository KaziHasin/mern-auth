
import { Container,Alert, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Hero(props) {
  return (
    
<main className='mx-md-5 my-5'>
     
<Container >
       <Alert  variant='light' className='text-center shadow-sm py-5'>
          <h2>Mern Auth</h2>
          <p className='my-5 fs-5'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Debitis incidunt ducimus consequuntur ipsam vel alias nobis tempora sequi in. Atque, dolorem quae aperiam officiis sint consectetur, velit obcaecati ex non officia quos. Quasi, est iste commodi ratione optio voluptatum quis?</p>
          <LinkContainer to="/login">
          <Button variant='primary' className='me-3'>Sign In</Button>
          </LinkContainer>
          <LinkContainer to="/register">
          <Button variant='secondary' >Sign Up</Button>
          </LinkContainer>
        </Alert>
       </Container>
</main>
    
    
  );
}

export default Hero
