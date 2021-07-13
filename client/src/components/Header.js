import { Navbar, Nav, NavDropdown, Form, FormControl, Button, ButtonGroup } from 'react-bootstrap'
import { useState } from 'react'
import AccountControls from './AccountControls'

function Header(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [focus, setFocus] = useState("Home")

    const loginHandler = () => {
        setIsLoggedIn(true)
    }

    const logoutHandler  = () => {
        setIsLoggedIn(false)
        sessionStorage.clear()
    }

    const focusHandler = (value) => {
        setFocus(value)
    }


    return (
<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  <Navbar.Brand href="#home">Rotcrier</Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="mr-auto">
        <NavDropdown title={focus} id="collapsible-nav-dropdown">
            {focus != "Home" && <NavDropdown.Item onClick={event => focusHandler("Home")}>Home</NavDropdown.Item>}
            <NavDropdown.Item onClick={event => focusHandler("Top Posts")}>Top Posts</NavDropdown.Item>
            <NavDropdown.Item  onClick={event => focusHandler("New Posts")}>New Posts</NavDropdown.Item>
        </NavDropdown>
    </Nav>

    <Nav>
        <AccountControls setLoggedIn={loginHandler} setLoggedOut={logoutHandler}/>
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