import React from 'react';
import { useLocation } from 'react-router-dom';
import 'tailwindcss';
import "tailwindcss/preflight";
import "./app.css";
import { Route, Routes, NavLink } from 'react-router-dom';
import { HomePage } from './home-page/home-page'
import { LoginPage } from './login-page/login-page';
import { GamePageTemplate } from './game-page-template/game-page-template';
import { GameCreationPage } from './game-creation-page/game-creation-page';
import { LoginState } from './classes/login-state';
import { ChatEvent, GameChat } from './gameChat';

export default function App() {
    const [username, setUsername] = React.useState(localStorage.getItem('username') || '');
    const currentLoginState = username ? LoginState.LoggedIn : LoginState.LoggedOut;
    const [loginState, setLoginState] = React.useState(currentLoginState);
    const location = useLocation();
    const [idOfGameToLoad, setIdOfGameToLoad] = React.useState(-1);

    React.useEffect(() => {

        let credentialHelper = async () => {
            await fetch('/api/igdbDatabase/getAuthorization', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
        }

        credentialHelper();

    }, [])
    
    return (
        <> 
            <div className="website-banner">
                <h1 className="website-name">Video Game Voting</h1>
                <img alt="Demo banner for website" src="../../public/website-banner.png" />
                <nav className="" id="login-links">
                    {loginState === LoginState.LoggedIn && (
                        <>
                            {location.pathname === '/' && (
                                <>
                                <NavLink className= "nav-link h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" id="game-creation-link" to="GameCreationPage">Add Game</NavLink>
                                <NavLink className="nav-link h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" id="login-link" onClick={logoutFunction}>{username} - Logout</NavLink>
                                </>
                            )}
                            {location.pathname !== '/' && (
                                <>
                                    <NavLink className= "nav-link h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" id="return-home-link" to="..">Return to home</NavLink>
                                    <NavLink className="nav-link h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" id="login-link" onClick={logoutFunction}>{username} - Logout</NavLink>
                                </>
                            )}
                        </>
                    )}
                    {loginState === LoginState.LoggedOut && (
                        <>
                            {location.pathname === '/' && (
                                <NavLink className="nav-link h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" id="login-link" to="LoginPage">Login</NavLink>
                            )}
                            {location.pathname !== '/' && (
                                <>
                                    <NavLink className= "nav-link h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" id="return-home-link" to="..">Return to home</NavLink>
                                    <NavLink className="nav-link h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" id="login-link" to="../LoginPage">Login</NavLink>
                                </>
                            )}
                        </>
                    )}
                </nav>
            </div>
            <Routes>
                <Route path='/' element={<HomePage 
                    setGameToLoadFunc={setIdOfGameToLoad}
                    />} 
                />
                <Route path='/LoginPage' element={<LoginPage 
                    username={username}
                    loginState={loginState}
                    loginChangeFunc={onLoginChange}
                    />} 
                />
                <Route path='/GamePageTemplate' element={<GamePageTemplate 
                    gameIdToLoad={idOfGameToLoad}
                    />} 
                />
                <Route path='/GameCreationPage' element={<GameCreationPage />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
            <footer>
                <p>Eric Vinton - CS 260</p>
                <a href="https://github.com/Emaniacinator/startup">Click here for Github repo</a>
            </footer>
        </>
    );


    function onLoginChange(username, loginState){
        setUsername(username);
        setLoginState(loginState);
        localStorage.setItem('username', username);
    }

    async function logoutFunction(){

        let logoutResponse = await fetch('/api/auth/logout', {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });

        setUsername();
        setLoginState(LoginState.LoggedOut);
        localStorage.setItem('username', '');
        localStorage.setItem('passcode', '');
    };

    function NotFound(){
        return (
            <div className="page-not-found-container">
                <div className="website-banner">
                    <h1 className="website-name">Video Game Voting</h1>
                    <img alt="Demo banner for website" src="../../public/website-banner.png" />
                    <nav className="" id="login-links">
                        <NavLink className= "nav-link h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" id="return-home-link" to="..">Return to home</NavLink>
                    </nav>
                </div>
                <main className="bg-gray-500 text-red-700 justify-center items-center text-5xl">
                    404 Error: Page Not Found  
                </main>
            </div>
        )
    }
}

