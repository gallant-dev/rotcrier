import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap'
import SignUp from './SignUp'
import { useState } from 'react'

function Header(props) {
    const [loggedIn, setLoggedIn] = useState(false)


    return (
<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  <Navbar.Brand href="#home">Rotcrier</Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="mr-auto">
        <NavDropdown title="Home" id="collasible-nav-dropdown">
            <NavDropdown.Item href="#action/3.2">Top Posts</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">New Posts</NavDropdown.Item>
        </NavDropdown>
    </Nav>

    <Nav className="justify-content-end">
      <Nav.Item>
        <Nav.Link href="#sign-in">Sign in</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <SignUp />
      </Nav.Item>
    </Nav>
    </Navbar.Collapse>
    <Nav className="content-justify-center">
    <Form className="d-flex">
      <FormControl
        type="search"
        placeholder="Search"
        className="mr-2"
        aria-label="Search"
      />
      <Button variant="outline-success">Search</Button>
    </Form>
    </Nav>


</Navbar>
    );
}

export default Header;