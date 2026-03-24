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
import { PageState } from './classes/page-state';
import { Game } from './classes/game';
import { renderToStaticMarkup } from 'react-dom/server';

export default function App() {
    const [username, setUsername] = React.useState(localStorage.getItem('username') || '');
    const [passcode, setPasscode] = React.useState(localStorage.getItem('passcode' || ''));
    const currentLoginState = username ? LoginState.LoggedIn : LoginState.LoggedOut;
    const [loginState, setLoginState] = React.useState(currentLoginState);
    const [currentPage, setCurrentPage] = React.useState(PageState.HomePage);
    const [temporaryUsernameStorage, setTemporaryUsernameStorage] = React.useState([]);
    const [temporaryPasscodeStorage, setTemporaryPasscodeStorage] = React.useState([]);
    let [temporaryGameListStorage, setTemporaryGameListStorage] = React.useState([]);
    let [temporaryNewGameListInfo, setTemporaryNewGameListInfo] = React.useState([]);
    const location = useLocation();
    const [idOfGameToLoad, setIdOfGameToLoad] = React.useState(-6);

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

    /// This next section is nasty and is just to create a fake top games database to read from
    const temporaryTopGameList = [new Game("Top Game", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV3YMfbPBgXzxmZxsa2vb2LPyanOsR6iqY7g&s", "The best rated game", -1, 100, "1/1/1001"),
                                new Game("Second Game", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV3YMfbPBgXzxmZxsa2vb2LPyanOsR6iqY7g&s", "The second best rated game", -2, 90, "2/2/2002"),
                                new Game("Third Game", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV3YMfbPBgXzxmZxsa2vb2LPyanOsR6iqY7g&s", "The third best rated game", -3, 80, "3/3/3003"),
                                new Game("Fourth Game", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV3YMfbPBgXzxmZxsa2vb2LPyanOsR6iqY7g&s", "The fourth best rated game", -4, 70, "4/4/4004"),
                                new Game("Fifth Game", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV3YMfbPBgXzxmZxsa2vb2LPyanOsR6iqY7g&s", "The fifth best rated game", -5, 60, "5/5/5005")]
    /// Okay, the section is over and we can go back to the normal code
    
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
                    gameToLoad={temporaryGameListStorage[idOfGameToLoad]}
                    />} 
                />
                <Route path='/GameCreationPage' element={<GameCreationPage 
                    temporaryGameListStorage={temporaryGameListStorage}
                    newGameListUpdateFunc={updateNewGameList}
                    addGameFunc={addNewGame}
                    />} 
                />
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

    function logoutFunction(){
        setUsername();
        setLoginState(LoginState.LoggedOut);
        localStorage.setItem('username', '');
        localStorage.setItem('passcode', '');
    }

    function updateNewGameList(newlyMadeGame){
        if (temporaryNewGameListInfo.length > 4){
            temporaryNewGameListInfo.shift();
        }
        temporaryNewGameListInfo.push(newlyMadeGame)
    }

    function addUsernameAndPasscodeFunc(usernameToAdd, passcodeToAdd){
        setTemporaryUsernameStorage(prevList => [...prevList, usernameToAdd]);
        setTemporaryPasscodeStorage(prevList => [...prevList, passcodeToAdd]);
    }

    function addNewGame(gameToAdd){
        setTemporaryGameListStorage(prevList => [...prevList, gameToAdd])
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

