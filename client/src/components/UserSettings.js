import { NavDropdown } from 'react-bootstrap'

function UserSettings(props) {
    let displayName = sessionStorage.getItem("displayName")
    const logout = async() => {
        await fetch('/users/logout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                displayName: sessionStorage.getItem('displayName'),
                sessionId: sessionStorage.getItem('session')
            }),
            credentials: 'include'
        })
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson && await response.json();
            

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }

            props.onLogout();
            console.log(data);
        })
        .catch(error => {
            console.error('Error! ', error);
        })
    }

    return(
        <NavDropdown title={displayName} id="collapsible-nav-dropdown">
            <NavDropdown.Item onClick={() => props.onChangeFocus({type: 'user', name: displayName})}>Profile</NavDropdown.Item>
            <NavDropdown.Item onClick={() => logout()}>Logout</NavDropdown.Item>
        </NavDropdown>
    );
}

export default UserSettings