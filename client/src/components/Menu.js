import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap'
import { useState } from 'react'

function Menu(props) {
    const [alwaysVisibleSelections, setAlwaysVisibleSelection] = useState(["Home", "Top Posts", "New Posts"])
    const [loggedInOnlySelections, setLoggedInOnlySelections] = useState(["Create a new section", "Create a new post"])
    

    const focusHandler = (value) => {
        props.onFocusChange(value)
    }

    return(
        <NavDropdown title={props.viewFocus} id="collapsible-nav-dropdown">
            {alwaysVisibleSelections.map( selection => selection != props.viewFocus &&
                <NavDropdown.Item onClick={event => focusHandler(selection)}>{selection}</NavDropdown.Item> 
            )}
            {props.isLoggedIn && <NavDropdown.Divider />}
            {props.isLoggedIn && loggedInOnlySelections.map( selection => selection != props.viewFocus &&
                <NavDropdown.Item onClick={event => focusHandler(selection)}>{selection}</NavDropdown.Item> 
            )}
        </NavDropdown>
    );
}

export default Menu