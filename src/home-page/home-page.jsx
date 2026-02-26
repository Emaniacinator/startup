import React from 'react';
import { NavLink } from 'react-router-dom';
import { Game } from '../classes/game';

export function HomePage({temporaryGameListStorage, temporaryNewGameListInfo, temporaryTopGameList, addDummyGameToMockOtherUsers}) {
    const [firstMostRecentGame, setFirstMostRecentGame] = React.useState(null);
    const [secondMostRecentGame, setSecondMostRecentGame] = React.useState(null);
    const [thirdMostRecentGame, setThirdMostRecentGame] = React.useState(null);
    const [fourthMostRecentGame, setFourthMostRecentGame] = React.useState(null);
    const [fifthMostRecentGame, setFifthMostRecentGame] = React.useState(null);

    React.useEffect(() =>{
        // Update or populate the complete game list
        const fullGameList = document.getElementById("game-list");
        temporaryGameListStorage.forEach(gameItem => {
            // Create the new items
            const newListItem = document.createElement("li");
            const newNavLink = document.createElement("NavLink");
            // Give them the correct properties
            newNavLink.setAttribute('className', 'nav-link')
            newNavLink.setAttribute('to', 'GamePageTemplate');
            newNavLink.textContent = gameItem.gameName
            // Add the NavLink to the li item and the li item to the actual game-list
            newListItem.appendChild(newNavLink)
            fullGameList.appendChild(newListItem);
        });

        // Then update or populate the new game list
        if (temporaryNewGameListInfo.length >= 5){
            setFirstMostRecentGame(temporaryNewGameListInfo[4]);
            setSecondMostRecentGame(temporaryNewGameListInfo[3]);
            setThirdMostRecentGame(temporaryNewGameListInfo[2]);
            setFourthMostRecentGame(temporaryNewGameListInfo[1]);
            setFifthMostRecentGame(temporaryNewGameListInfo[0]);
        }
        else if (temporaryNewGameListInfo.length == 4){
            setFirstMostRecentGame(temporaryNewGameListInfo[3]);
            setSecondMostRecentGame(temporaryNewGameListInfo[2]);
            setThirdMostRecentGame(temporaryNewGameListInfo[1]);
            setFourthMostRecentGame(temporaryNewGameListInfo[0]);
        }
        else if (temporaryNewGameListInfo.length == 3){
            setFirstMostRecentGame(temporaryNewGameListInfo[2]);
            setSecondMostRecentGame(temporaryNewGameListInfo[1]);
            setThirdMostRecentGame(temporaryNewGameListInfo[0]);
        }
        else if (temporaryNewGameListInfo.length == 2){
            setFirstMostRecentGame(temporaryNewGameListInfo[1]);
            setSecondMostRecentGame(temporaryNewGameListInfo[0]);
        }
        else if (temporaryNewGameListInfo.length == 1){
            setFirstMostRecentGame(temporaryNewGameListInfo[0]);
        }
        
    }, [temporaryGameListStorage.length]);

    // In theory, this is going to make it so that there is new dummy game data every 5 seconds
    const [dummyUserTimer, setDummyUserTimer] = React.useState(0);
    
    React.useEffect(() => {
        const intervalIncrementer = setInterval(() => {
            setDummyUserTimer(prevCount => prevCount + 1);
        }, 3000);
        let dummyGame = new Game("A *NEW* Dummy Game", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV3YMfbPBgXzxmZxsa2vb2LPyanOsR6iqY7g&s", "This is just a dummy to illustrate functionality", temporaryGameListStorage.length)
        temporaryGameListStorage.push(dummyGame);
        updateNewGameList(dummyGame);
        return (() => clearInterval(intervalIncrementer));
    }, []);

    return (
        <div className="home-page-container">
            <main>
                <div id="combo-box" className="flex justify-center">
                    <nav id ="top-games" className="flexbox content-center w-5/12 left-1/12 right-7/12">
                        <h2 className="flex justify-center text-2xl">Top Rated Games</h2>
                        <p className="flex justify-center">(This will be updated and populated by a database when the page is loaded)</p>
                        <table className="grid outline-2 table-fixed w-full">
                            <thead className="grid grid-cols-3">
                                <tr>
                                    <th className="relative text-center w-1/4">Name</th>
                                </tr>
                                <tr>
                                    <th className="relative text-center w-1/4">Rating</th>
                                </tr>
                                <tr>
                                    <th className="relative text-center w-1/4">Release Date</th>
                                </tr>
                            </thead>
                            <tbody className="grid grid-cols-3 bg-white">
                                <tr>
                                    <td className="relative text-center w-1/4"><NavLink className="nav-link" to="GamePageTemplate">{temporaryTopGameList[0].gameName}</NavLink></td>
                                </tr>
                                <tr>
                                    <td className="relative text-center w-1/10">{temporaryTopGameList[0].averageScore}</td>
                                </tr>
                                <tr>
                                    <td className="relative text-center w-1/4">{temporaryTopGameList[0].releaseDate}</td>
                                </tr>
                            </tbody>
                            <tbody className="grid grid-cols-3 bg-gray-300">
                                <tr>
                                    <td className="relative text-center w-1/4"><NavLink className="nav-link" to="GamePageTemplate">{temporaryTopGameList[1].gameName}</NavLink></td>
                                </tr>
                                <tr>
                                    <td className="relative text-center w-1/10">{temporaryTopGameList[1].averageScore}</td>
                                </tr>
                                <tr>
                                    <td className="relative text-center w-1/4">{temporaryTopGameList[1].releaseDate}</td>
                                </tr>
                            </tbody>
                            <tbody className="grid grid-cols-3 bg-white">
                                <tr>
                                    <td className="relative text-center w-1/4"><NavLink className="nav-link" to="GamePageTemplate">{temporaryTopGameList[2].gameName}</NavLink></td>
                                </tr>
                                <tr>
                                    <td className="relative text-center w-1/10">{temporaryTopGameList[2].averageScore}</td>
                                </tr>
                                <tr>
                                    <td className="relative text-center w-1/4">{temporaryTopGameList[2].releaseDate}</td>
                                </tr>
                            </tbody>
                            <tbody className="grid grid-cols-3 bg-white">
                                <tr>
                                    <td className="relative text-center w-1/4"><NavLink className="nav-link" to="GamePageTemplate">{temporaryTopGameList[3].gameName}</NavLink></td>
                                </tr>
                                <tr>
                                    <td className="relative text-center w-1/10">{temporaryTopGameList[3].averageScore}</td>
                                </tr>
                                <tr>
                                    <td className="relative text-center w-1/4">{temporaryTopGameList[3].releaseDate}</td>
                                </tr>
                            </tbody>    
                            <tbody className="grid grid-cols-3 bg-white">
                                <tr>
                                    <td className="relative text-center w-1/4"><NavLink className="nav-link" to="GamePageTemplate">{temporaryTopGameList[4].gameName}</NavLink></td>
                                </tr>
                                <tr>
                                    <td className="relative text-center w-1/10">{temporaryTopGameList[4].averageScore}</td>
                                </tr>
                                <tr>
                                    <td className="relative text-center w-1/4">{temporaryTopGameList[4].releaseDate}</td>
                                </tr>
                            </tbody>            
                        </table>
                    </nav>
                    <div id="divider" className="flexbox w-1/12"></div>
                    <nav id="newly-added" className="flexbox w-5/12 left-7/12 right-1/12">
                        <h2 className="flex justify-center">Newly Added Games</h2>
                        <p className="flex justify-center">(This will be live updated as people add new games to the website)</p>
                        <div className="outline-2 rounded list-inside">
                            {firstMostRecentGame !== null && <li><NavLink className="nav-link" to="GamePageTemplate">{firstMostRecentGame.gameName}</NavLink></li>}
                            {secondMostRecentGame !== null && <li><NavLink className="nav-link" to="GamePageTemplate">{secondMostRecentGame.gameName}</NavLink></li>}
                            {thirdMostRecentGame !== null && <li><NavLink className="nav-link" to="GamePageTemplate">{thirdMostRecentGame.gameName}</NavLink></li>}
                            {fourthMostRecentGame !== null && <li><NavLink className="nav-link" to="GamePageTemplate">{fourthMostRecentGame.gameName}</NavLink></li>}
                            {fifthMostRecentGame !== null && <li><NavLink className="nav-link" to="GamePageTemplate">{fifthMostRecentGame.gameName}</NavLink></li>}
                        </div>
                    </nav>
                </div>
                <nav id="game-list" className="flexbox justify-center content-center">
                    <h2 className="flex justify-center">All Games</h2>
                    <p className="flex justify-center">(This will be a list of all of the games that have a review page)</p>
                </nav>
            </main>
        </div>
    );

    function updateNewGameList(newlyMadeGame){
        if (temporaryNewGameListInfo.length > 4){
            temporaryNewGameListInfo.shift();
        }
        temporaryNewGameListInfo.push(newlyMadeGame)
    }
}