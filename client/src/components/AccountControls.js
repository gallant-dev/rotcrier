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

    const userLoggedout = () => {
        setIsLoggedIn(false);
        props.setLoggedOut()
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
        <UserSettings onLogout={userLoggedout}/>
    );
}

export default AccountControls;