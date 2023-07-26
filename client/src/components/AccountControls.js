import { ButtonGroup } from 'react-bootstrap'
import SignUp from './SignUp'
import Login from './Login'
import UserSettings from '../pages/UserSettings'

function AccountControls(props) {
    const isLoggedIn = props.isLoggedIn;

    const userLoggedout = () => {
        props.setLoggedOut()
    }

    if(!isLoggedIn){
        return (
            <ButtonGroup>
                <Login onLogin={props.onLogin}/>
                <SignUp onLogin={props.onLogout}/>
            </ButtonGroup>
        );
    }
    return (
        <UserSettings onChangeFocus={props.onChangeFocus} onLogout={props.onLogout}/>
    );
}

export default AccountControls;