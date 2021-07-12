import { Nav, Button, ButtonGroup } from 'react-bootstrap'
import { useState } from 'react'
import SignUp from './SignUp'
import Login from './Login'
import UserSettings from './UserSettings'

function AccountControls(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const userLoggedIn = () => {
        setIsLoggedIn(true);
        props.setLoggedIn()
    }

    if(!isLoggedIn){
        return (
            <ButtonGroup>
                <Login onLogin={userLoggedIn}/>
                <SignUp onLogin={userLoggedIn}/>
            </ButtonGroup>
        );
    }
    return (
        <UserSettings />
    );
}

export default AccountControls;