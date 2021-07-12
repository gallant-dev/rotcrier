import { NavDropdown } from 'react-bootstrap'

function UserSettings() {
    let displayName = sessionStorage.getItem("displayName")

    return(
        <NavDropdown title={displayName} id="collapsible-nav-dropdown">
            <NavDropdown.Item href="#action/3.2">History</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Settings</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Logout</NavDropdown.Item>
        </NavDropdown>
    );
}

export default UserSettings