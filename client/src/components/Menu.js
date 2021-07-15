import { NavDropdown } from 'react-bootstrap'
import { useState, useEffect } from 'react'

function Menu(props) {
    const [alwaysVisibleSelections, setAlwaysVisibleSelection] = useState(["Home", "Top Posts", "New Posts"])
    const [loggedInOnlySelections, setLoggedInOnlySelections] = useState(["Create a new section", "Create a new post"])
    const [memberSections, setMemberSections] = useState([])

    useEffect(() => {
        if(props.isLoggedIn){
            const displayName = sessionStorage.getItem('displayName')
            const fetchData = async() => {
                await fetch('/sections/'+displayName+'/memberships', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
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
                    const memberships = data.map(section => section.title)
                    setMemberSections(memberships)
                    console.log(memberships);
                })
                .catch(error => {
                    console.error('Error! ', error);
                })
            }
            fetchData();
        }
        setMemberSections([])
    }, [props.isLoggedIn, props.viewFocus])
    

    const focusHandler = (value) => {
        props.onFocusChange(value)
    }

    return(
        <NavDropdown title={props.viewFocus} id="collapsible-nav-dropdown">
            {alwaysVisibleSelections.map( selection => selection !== props.viewFocus &&
                <NavDropdown.Item onClick={event => focusHandler(selection)}>{selection}</NavDropdown.Item> 
            )}
            {props.isLoggedIn && <NavDropdown.Divider />}
            {props.isLoggedIn && loggedInOnlySelections.map( selection => selection !== props.viewFocus &&
                <NavDropdown.Item onClick={event => focusHandler(selection)}>{selection}</NavDropdown.Item> 
            )}
            {memberSections.length > 0 && <NavDropdown.Divider />}
            {(memberSections.length > 0) && memberSections.map( section => section !== props.viewFocus &&
                <NavDropdown.Item onClick={event => focusHandler(section)}>{section}</NavDropdown.Item> 
            )}
        </NavDropdown>
    );
}

export default Menu