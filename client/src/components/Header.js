import { Navbar, Nav, NavDropdown, Form, FormControl, Button, ButtonGroup } from 'react-bootstrap'
import SignUp from './SignUp'
import Login from './Login'
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

    <Nav className>
        <ButtonGroup>
            <Login />
            <SignUp />
        </ButtonGroup>
    </Nav>
    </Navbar.Collapse>
    <Nav>
        <Form className="d-flex">
            <FormControl
                type="search"
                placeholder="Search"
                className="mr-sm-2 me-1 "
                aria-label="Search"
            />
            <Button variant="primary">Search</Button>
        </Form>
    </Nav>
</Navbar>
    );
}

export default Header;