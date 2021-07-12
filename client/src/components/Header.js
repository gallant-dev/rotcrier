import { Navbar, Nav, NavDropdown, Form, FormControl, Button, ButtonGroup } from 'react-bootstrap'
import { useState } from 'react'
import AccountControls from './AccountControls'

function Header(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const loginHandler = () => {
        setIsLoggedIn(true)
    }


    return (
<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  <Navbar.Brand href="#home">Rotcrier</Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="mr-auto">
        <NavDropdown title="Home" id="collapsible-nav-dropdown">
            <NavDropdown.Item href="#action/3.2">Top Posts</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">New Posts</NavDropdown.Item>
        </NavDropdown>
    </Nav>

    <Nav>
        <AccountControls setLoggedIn={loginHandler}/>
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