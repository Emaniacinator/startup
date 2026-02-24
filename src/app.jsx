import React from 'react';
import 'tailwindcss';
import "tailwindcss/preflight";
import "./app.css";
import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';
import { HomePage } from './home-page/home-page'
import { LoginPage } from './login-page/login-page';
import { GamePageTemplate } from './game-page-template/game-page-template';
import { GameCreationPage } from './game-creation-page/game-creation-page';
import { LoginState } from './classes/login-state';
import { PageState } from './classes/page-state';

export default function App() {
    const [username, setUsername] = React.useState(localStorage.getItem('username') || '');
    const currentLoginState = username ? LoginState.LoggedIn : LoginState.LoggedOut;
    const [loginState, setLoginState] = React.useState(localStoreage.useState(currentLoginState));
    const pageLocation = React.useLocation();
    const [currentPage, setCurrentPage] = React.useState(PageState.HomePage);
    let temporaryUsernameStorage = [];
    let temporaryPasscodeStorage = [];
    let temporaryGameListStorage = [];

    React.useEffect(() => {
        if (pageLocation.pathname === ('' || '/')){
            setCurrentPage(PageState.HomePage);
        }
        else {
            setCurrentPage(PageState.OtherPage);
        }
    }, [pageLocation.pathname])

    return (
        <BrowserRouter>
            <div className="website-banner">
                <h1 className="website-name">Video Game Voting</h1>
                <img alt="Demo banner for website" src="../../public/website-banner.png" />
                <nav className="" id="login-links">
                    {loginState === LoginState.LoggedIn && (
                        <>
                            {currentPage === PageState.HomePage && (
                                <>
                                <NavLink className= "nav-link h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" id="game-creation-link" to="GameCreationPage">Add Game</NavLink>
                                <NavLink className="nav-link h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" id="login-link" to="LoginPage">{username} - Logout</NavLink>
                                </>
                            )}
                            {currentPage === PageState.OtherPage && (
                                <>
                                    <NavLink className= "nav-link h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" id="return-home-link" to="..">Return to home</NavLink>
                                    <NavLink className="nav-link h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" id="login-link" to="../LoginPage">{username} - Logout</NavLink>
                                </>
                            )}
                        </>
                    )}
                    {loginState === LoginState.LoggedOut && (
                        <>
                            {currentPage === PageState.HomePage && (
                                <NavLink className="nav-link h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" id="login-link" to="LoginPage">Login</NavLink>
                            )}
                            {currentPage === PageState.OtherPage && (
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
                <Route path='/' element={<HomePage />} exact />
                <Route path='/LoginPage' element={<LoginPage 
                    username={username}
                    loginState={loginState}
                    temporaryUsernameStorage={temporaryUsernameStorage}
                    temporaryPasscodeStorage={temporaryPasscodeStorage} 
                    loginChangFunc={onLoginChange} />} 
                />
                <Route path='/GamePageTemplate' element={<GamePageTemplate />} />
                <Route path='/GameCreationPage' element={<GameCreationPage />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
            <footer>
                <p>Eric Vinton - CS 260</p>
                <a href="https://github.com/Emaniacinator/startup">Click here for Github repo</a>
            </footer>
        </BrowserRouter>
    );


    function onLoginChange(username, loginState){
        setUsername(username);
        setLoginState(loginState);
    }

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

