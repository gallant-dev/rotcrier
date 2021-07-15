import { NavDropdown } from 'react-bootstrap'
import { useState, useEffect } from 'react'

function Menu(props) {
    const alwaysVisibleSelections = [
        {type: 'menu', name: 'Home'}, 
        {type: 'menu', name: 'Top Posts'}, 
        {type: 'menu', name: 'New Posts'}
    ]
    const loggedInOnlySelections = [
        {type: 'menu', name: 'Create a new section'}, 
        {type: 'menu', name: 'Create a new post'}
    ]
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
                    const memberships = data.map(section => {
                        const item = {}
                        item.type = 'section'
                        item.name = section.title
                        return item
                    })
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
        <NavDropdown title={props.viewFocus.name} id="collapsible-nav-dropdown">
            {alwaysVisibleSelections.map( selection => selection !== props.viewFocus &&
                <NavDropdown.Item onClick={event => focusHandler(selection)}>{selection.name}</NavDropdown.Item> 
            )}
            {props.isLoggedIn && <NavDropdown.Divider />}
            {props.isLoggedIn && loggedInOnlySelections.map( selection => selection !== props.viewFocus &&
                <NavDropdown.Item onClick={event => focusHandler(selection)}>{selection.name}</NavDropdown.Item> 
            )}
            {memberSections.length > 0 && <NavDropdown.Divider />}
            {(memberSections.length > 0) && memberSections.map( section => section !== props.viewFocus &&
                <NavDropdown.Item onClick={event => focusHandler(section)}>{section.name}</NavDropdown.Item> 
            )}
        </NavDropdown>
    );
}

export default Menu