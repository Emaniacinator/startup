import React, { useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChatEvent, GameChat } from '../gameChat';

export function HomePage({setGameToLoadFunc}) {
    const [localGameList, setLocalGameList] = React.useState([]);
    const [localNewGameList, setLocalNewGameList] = React.useState([]);
    const [localTopFiveGameList, setLocalTopFiveGameList] = React.useState([]);

    const pageLoadHelper = useCallback(async () => {
            await loadPageData();
    });

    React.useEffect(() => {
        GameChat.addMessageHandler(handlePageReloadOnNewInfo);

        return ()=> {
            GameChat.removeMessageHandler(handlePageReloadOnNewInfo);
        }
    });

    React.useEffect(() => {

        pageLoadHelper();

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
                            </thead>
                            {localTopFiveGameList.map((gameItem) => (
                                    <tbody className="grid grid-cols-3 bg-white">
                                        <tr>
                                            <li><NavLink className='nav-link' to="GamePageTemplate" gameid={gameItem.gameId} onClick={() => setGameToLoadFunc(gameItem.gameId)}>{gameItem.gameName}</NavLink></li>
                                     </tr>
                                        <tr>
                                            <td className="relative text-center w-1/10">{gameItem.averageScore}</td>
                                        </tr>
                                    </tbody>
                                )
                            )}         
                        </table>
                    </nav>
                    <div id="divider" className="flexbox w-1/12"></div>
                    <nav id="newly-added" className="flexbox w-5/12 left-7/12 right-1/12">
                        <h2 className="flex justify-center">Newly Added Games</h2>
                        <p className="flex justify-center">(This will be live updated as people add new games to the website)</p>
                        <div className="outline-2 rounded list-inside">
                            {localNewGameList.map((gameItem) => (
                                    <li><NavLink className='nav-link' to="GamePageTemplate" gameid={gameItem.gameId} onClick={() => setGameToLoadFunc(gameItem.gameId)}>{gameItem.gameName}</NavLink></li>
                                )
                            )}
                        </div>
                    </nav>
                </div>
                <nav id="game-list" className="flexbox justify-center content-center">
                    <h2 className="flex justify-center">All Games</h2>
                    <p className="flex justify-center">(This will be a list of all of the games that have a review page)</p>
                    {localGameList.map((gameItem) => (
                            <li><NavLink className='nav-link' to="GamePageTemplate" gameid={gameItem.gameId} onClick={() => setGameToLoadFunc(gameItem.gameId)}>{gameItem.gameName}</NavLink></li>
                        )
                    )}
                </nav>
            </main>
        </div>
    );

    function handlePageReloadOnNewInfo(messageEvent){
        if (messageEvent.broadcastType === ChatEvent.UpdateMainPage){
            const anotherPageLoadHelper = useCallback(async () => {
                await loadPageData();
            });

            anotherPageLoadHelper();
        };
    }

    async function loadPageData(){
        const returnedListsResponse = await fetch('/api/gameApi/getGameLists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });

        const returnedLists = await returnedListsResponse.json();
        setLocalGameList(returnedLists.gameList);
        setLocalNewGameList(returnedLists.newGameList);
        setLocalTopFiveGameList(returnedLists.topFiveGameList);
    }
}