import { Navbar, Nav, Form, FormControl, Button, Row, Container, } from 'react-bootstrap'
import { useState } from 'react'
import AccountControls from './AccountControls'
import Menu from './Menu'

function Header(props) {
    const isLoggedIn = props.isLoggedIn

    const focusHandler = (value) => {
        props.onFocusChange(value)
    }

    const loginHandler = () => {
        props.onLogin(true)
    }

    const logoutHandler  = () => {
        props.onLogin(false)
        focusHandler({type: 'menu', name: 'Home'})
        sessionStorage.clear()
    }

    const searchHandler = (event) => {
        event.preventDefault()
        focusHandler({type: 'search', name: 'Search'})
        props.onSearch(event.target.elements.params.value)
    }

    return (
    
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
        <Container>
        <Navbar.Brand href="#home">rotcrier</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
                <Menu isLoggedIn={isLoggedIn} onUpdateMemberSections={props.onUpdateMemberSections} onFocusChange={focusHandler} memberSections={props.memberSections} viewFocus={props.viewFocus} />
            </Nav>
            <Nav>
                <AccountControls isLoggedIn={isLoggedIn} onChangeFocus={focusHandler} onLogin={props.onLogin} onLogout={props.onLogout}/>
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
        </Container>
    </Navbar>
    );
}

export default Header;