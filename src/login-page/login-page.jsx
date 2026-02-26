import React from 'react';
import { NavLink } from 'react-router-dom';
import { LoginState } from '../classes/login-state';
import { PageState } from '../classes/page-state';

export function LoginPage(username, loginState, temporaryUsernameStorage, temporaryPasscodeStorage, loginChangeFunc){

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
                    <form onSubmit={loginUser}>
                        <div>
                            <label htmlFor="new-user-id" className="flex text-xs">Username</label>
                            <input type="text" id="existing-user-id" name="esistingUser" required />
                        </div>
                        <div>
                            <label htmlFor="login-passcode-id" className="flex text-xs">Passcode</label>
                            <input type="text" id="login-passcode-id" name="loginPasscode" required />
                        </div>
                        <button className="h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" type="Submit">Log in</button>
                    </form>
                    <h2>Or create a new user</h2>
                    <form onSubmit={addNewUser}>
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
                            <input type="text" id="verify-new-passcode-id" name="'verify-new-passcode" required />
                        </div>
                        <button className="h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" type="Submit">Create Account</button>
                    </form>
                </main>
            </div>
        )
    }
    
    function addNewUser(inputObject){
        const newUsername = inputObject.target.elements.newUsername;
        const newPasscode = inputObject.target.elements.newPasscode;

        if (!temporaryUsernameStorage.includes(newUsername)){
            temporaryUsernameStorage.push(newUsername);
            temporaryPasscodeStorage.push(newPasscode);
            loginChangeFunc(newUsername, LoginState.LoggedIn);
            inputObject.setCustomValidity("");
        }
        else {
            inputObject.setCustomValidity("Username already used. Please select a different username");
        }
    }

    function loginUser(inputObject){
        const inputUsername = inputObject.target.elements.existingUser;
        const inputPasscode = inputObject.target.elements.loginPasscode;

        if (temporaryUsernameStorage.includes(inputUsername)){
            const usernameIndex = temporaryUsernameStorage.findIndex(finderFunction => finder === inputUsername);
            if (temporaryUsernameStorage[usernameIndex] === inputPasscode){
                loginChangeFunc(inputUsername, LoginState.LoggedIn);
                inputObject.setCustomValidity("");
            }
            else {
                inputObject.setCustomValidity("Incorrect passcode. Please try again");
            }
        }
        else {
            inputObject.setCustomValidity("That user doesn't exist in our database. Please create a new user");
        }
    }
}