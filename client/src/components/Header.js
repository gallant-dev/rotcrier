import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap'
import { useState } from 'react'
import AccountControls from './AccountControls'
import Menu from './Menu'

function Header(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const focusHandler = (value) => {
        props.onFocusChange(value)
    }

    const loginHandler = () => {
        setIsLoggedIn(true)
    }

    const logoutHandler  = () => {
        setIsLoggedIn(false)
        sessionStorage.clear()
    }

    return (
<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  <Navbar.Brand href="#home">Rotcrier</Navbar.Brand>
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="mr-auto">
        <Menu isLoggedIn={isLoggedIn} onFocusChange={focusHandler} viewFocus={props.viewFocus} />
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