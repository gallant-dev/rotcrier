import { Navbar, Nav, Form, FormControl, Button, Row, } from 'react-bootstrap'
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
        focusHandler({type: 'menu', name: 'Home'})
        sessionStorage.clear()
    }

    const searchHandler = (event) => {
        event.preventDefault()
        focusHandler({type: 'search', name: 'Search'})
        props.onSearch(event.target.elements.params.value)
    }

    return (
    
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="#home">Rotcrier</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
                <Menu isLoggedIn={isLoggedIn} onUpdateMemberSections={props.onUpdateMemberSections} onFocusChange={focusHandler} memberSections={props.memberSections} viewFocus={props.viewFocus} />
            </Nav>
            <Nav>
                <AccountControls setLoggedIn={loginHandler} setLoggedOut={logoutHandler}/>
            </Nav>
        </Navbar.Collapse>
        <Nav>
            <Form className="d-flex" onSubmit={event => searchHandler(event)}>
                <Form.Group className="me-1" controlId="params">
                    <FormControl
                        type="search"
                        placeholder="Search"
                        className="mr-sm-2 me-1 "
                        aria-label="Search"
                    />
                    </Form.Group>
                    <Button variant="primary" type="submit">Search</Button>
            </Form>
        </Nav>
    </Navbar>
    );
}

export default Header;