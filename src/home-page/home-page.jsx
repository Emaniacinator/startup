import React from 'react';
import { NavLink } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="home-page-container">
        <div className="website-banner">
            <h1 className="website-name">Video Game Voting</h1>
            <img alt="Demo banner for website" src=".\website-banner.png" />
            <nav className="" id="login-links">
                <NavLink className="nav-link h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" id="login-link" to="LoginPage">Login / Username</NavLink>
                <NavLink className= "nav-link h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" id="game-creation-link" to="GameCreationPage">Add Game</NavLink>
            </nav>
        </div>
        <main>
            <div id="combo-box" className="flex justify-center">
                <nav id ="top-games" className="flexbox content-center w-5/12 left-1/12 right-7/12">
                    <h2 className="flex justify-center text-2xl">Top Rated Games</h2>
                    <p className="flex justify-center">(This will be populated by a database)</p>
                    <table className="grid table-fixed border-2 w-full">
                        <tr className="grid grid-cols-3">
                            <th className="relative text-center w-1/2">Name</th>
                            <th className="relative text-center w-1/4">Rating</th>
                            <th className="relative text-center w-1/4">Release Date</th>
                        </tr>
                        <tr className="grid grid-cols-3 justify-center gap-5 bg-white">
                            <td className="relative text-center w-1/2"><NavLink className="nav-link" to="GamePageTemplate">Game 1</NavLink></td>
                            <td className="relative text-center w-1/4">95</td>
                            <td className="relative text-center w-1/4">1/1/1001</td>
                        </tr>
                        <tr className="grid grid-cols-3 justify-center gap-5 bg-gray-300">
                            <td className="relative text-center w-1/2"><NavLink className="nav-link" to="GamePageTemplate">Game 2</NavLink></td>
                            <td className="relative text-center w-1/4">80</td>
                            <td className="relative text-center w-1/4">2/2/2002</td>
                        </tr>
                        <tr className="grid grid-cols-3 justify-center gap-5 bg-white">
                            <td className="relative text-center w-1/2"><NavLink className="nav-link" to="GamePageTemplate">Game 3</NavLink></td>
                            <td className="relative text-center w-1/4">72</td>
                            <td className="relative text-center w-1/4">3/3/3003</td>
                        </tr>          
                    </table>
                </nav>
                <div id="divider" className="flexbox w-1/12"></div>
                <nav id="newly-added" className="flexbox w-5/12 left-7/12 right-1/12">
                    <h2 className="flex justify-center">Newly Added Games</h2>
                    <p className="flex justify-center">(This will be live updated by websocket for logged in users as people add new games to the website, in a chat-like fashion)</p>
                    <div className="border-2 rounded">
                        <li><NavLink className="nav-link" to="GamePageTemplate">Game 1</NavLink></li>
                        <li><NavLink className="nav-link" to="GamePageTemplate">Game 2</NavLink></li>
                        <li><NavLink className="nav-link" to="GamePageTemplate">Game 3</NavLink></li>
                    </div>
                </nav>
            </div>
            <nav id="game-list" className="flexbox justify-center content-center">
                <h2 className="flex justify-center">All Games</h2>
                <p className="flex justify-center">(This will be a list of all of the games that have a review page)</p>
                <li className="flex justify-center"><NavLink className="nav-link" to="GamePageTemplate">Game 1</NavLink></li>
                <li className="flex justify-center"><NavLink className="nav-link" to="GamePageTemplate">Game 2</NavLink></li>
                <li className="flex justify-center"><NavLink className="nav-link" to="GamePageTemplate">Game 3</NavLink></li>
            </nav>
        </main>
    </div>
  );
}