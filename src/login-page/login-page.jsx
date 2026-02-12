import React from 'react';
import { NavLink } from 'react-router-dom';

export function LoginPage(){
    return(
        <div className="login-page-container">
            <div className="website-banner">
                <h1 className="website-name">Video Game Voting</h1>
                <img alt="Demo banner for website" src=".\website-banner.png" />
                <nav className="" id="login-links">
                    <NavLink className= "nav-link h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" id="return-home-link" to="..">Return to home</NavLink>
                </nav>
            </div>
            <main>
                <h2>Login</h2>
                <form>
                    <div>
                        <label for="new-user-id" className="flex text-xs">Username</label>
                        <input type="text" id="existing-user-id" name="esisting-user" required />
                    </div>
                    <div>
                        <label for="login-passcode-id" className="flex text-xs">Passcode</label>
                        <input type="text" id="login-passcode-id" name="login-passcode" required />
                    </div>
                    <button className="h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" type="Submit">Log in</button>
                </form>
                <h2>Or create a new user</h2>
                <form>
                    <div>
                        <label className="flex text-xs" for="new-user-id">Create a New User</label>
                        <input type="text" id="new-user-id" name="new-user" required />
                    </div>
                    <div>
                        <label className="flex text-xs" for="new-passcode-id">Create a passcode</label>
                        <input type="text" id="new-passcode-id" name="new-passcode" required />
                    </div>
                    <div>
                        <label className="flex text-xs" for="verify-new-passcode-id">Verify your passcode</label>
                        <input type="text" id="verify-new-passcode-id" name="'verify-new-passcode" required />
                    </div>
                    <button className="h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" type="Submit">Create Account</button>
                </form>
            </main>
        </div>
    )
}