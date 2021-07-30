import { Nav, Button, ButtonGroup } from 'react-bootstrap'
import { useState, useEffect } from 'react'
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

    useEffect(() => {
        if(sessionStorage.getItem('session')){
            userLoggedIn();
        }

    }, [props.viewFocus])

    if(!isLoggedIn){
        return (
            <ButtonGroup>
                <Login onLogin={userLoggedIn}/>
                <SignUp onLogin={userLoggedIn}/>
            </ButtonGroup>
        );
    }
    return (
        <UserSettings onChangeFocus={props.onChangeFocus} onLogout={userLoggedout}/>
    );
}

export default AccountControls;