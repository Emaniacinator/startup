import React from 'react';
import { NavLink } from 'react-router-dom';
import { LoginState } from '../classes/login-state';
import { PageState } from '../classes/page-state';

export function LoginPage({username, setUsernameFunc, loginState, loginChangeFunc}){

    if (loginState === LoginState.LoggedIn) {
        return (
            <div className="login-page-container">
                <h1>Already logged in as {username}, please return to home page</h1>
            </div>
        )
    }
    else {
        return (
            <div className="login-page-container">
                <main>
                    <h2>Login</h2>
                    <form onSubmit={loginUser} onChange={clearCustomValidity}>
                        <div>
                            <label htmlFor="new-user-id" className="flex text-xs">Username</label>
                            <input type="text" id="existing-user-id" name="existingUser" required />
                        </div>
                        <div>
                            <label htmlFor="login-passcode-id" className="flex text-xs">Passcode</label>
                            <input type="text" id="login-passcode-id" name="loginPasscode" required />
                        </div>
                        <button className="h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" type="Submit">Log in</button>
                    </form>
                    <h2>Or create a new user</h2>
                    <form onSubmit={addNewUser} onChange={clearCustomValidity}>
                        <div>
                            <label className="flex text-xs" htmlFor="new-user-id">Create a new Username</label>
                            <input type="text" id="new-user-id" name="newUsername" required />
                        </div>
                        <div>
                            <label className="flex text-xs" htmlFor="new-passcode-id">Create a passcode</label>
                            <input type="text" id="new-passcode-id" name="newPasscode" required />
                        </div>
                        <div>
                            <label className="flex text-xs" htmlFor="verify-new-passcode-id">Verify your passcode</label>
                            <input type="text" id="verify-new-passcode-id" name="'verifyNewPasscode" required />
                        </div>
                        <button className="h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" type="Submit">Create Account</button>
                    </form>
                </main>
            </div>
        )
    }
    
    async function addNewUser(inputObject){

        inputObject.preventDefault();
        
        const newUsername = inputObject.target.elements.newUsername.value;
        const newPasscode = inputObject.target.elements.newPasscode.value;
        const validityDisplayObject = inputObject.target.elements.newUsername;

        addUserResponse = await fetch('/auth/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: {
                username: newUsername,
                passcode: newPasscode
            }
        })

        if (addUserResponse.status.ok){
            loginChangeFunc(LoginState.LoggedIn);
            setUsernameFunc(loginResponse.body.username);
            validityDisplayObject.setCustomValidity("");
        }
        else {
            validityDisplayObject.setCustomValidity("Username already used. Please select a different username");
        }
    }

    async function loginUser(inputObject){

        inputObject.preventDefault();
        const inputUsername = inputObject.target.elements.existingUser.value;
        const inputPasscode = inputObject.target.elements.loginPasscode.value;
        const validityDisplayObject = inputObject.target.elements.existingUser;

        loginResponse = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: { 
                username: inputUsername,
                passcode: inputPasscode
            }
        }); 

        if (loginResponse.status.ok){
                loginChangeFunc(LoginState.LoggedIn);
                setUsernameFunc(loginResponse.body.username);
                validityDisplayObject.setCustomValidity("");
        }
        else if (loginResponse.status === 401){
            validityDisplayObject.setCustomValidity("Incorrect passcode. Please try again");
        }
        else {
            validityDisplayObject.setCustomValidity("That user doesn't exist in our database. Please create a new user");
        };
    }

    function clearCustomValidity(focus){
        focus.target.setCustomValidity("");
    }
}