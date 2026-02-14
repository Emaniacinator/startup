import React from 'react';
import { NavLink } from 'react-router-dom';

export function GameCreationPage(){
    return(
        <div className="game-creation-page-container">
            <div className="website-banner">
                <h1 className="website-name">Video Game Voting</h1>
                <img alt="Demo banner for website" src="../../public/website-banner.png" />
                <nav className="" id="login-links">
                    <NavLink className= "nav-link h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" id="login-link" to="../LoginPage">Logout / Username</NavLink>
                    <NavLink className= "nav-link h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" id="return-home-link" to="..">Return to home</NavLink>
                </nav>
            </div>
            <main>
                <h2 className="flex justify-center">Add a new game here!</h2>
                <p className="flex justify-center">To add a new game, please fill out the following info:</p>
                <form className="flexbox justify-center">
                    <div className="flexbox">
                        <p>Note that a 3rd party API will verify the existence of this game before allowing it to be submitted</p>
                        <label className="flexbox text-xs" for="game-name-id">Game Name</label>
                        <input type="text" id="game-name-id" name="game-name" required />
                    </div>       
                    <div className="flexbox">
                        <label className="flexbox text-xs" for="game-photo-url-id">Cover Photo Url</label>
                        <input type="url" id="game-photo-url-id" name="game-photo-url" required />
                    </div>  
                    <div className="flexbox">
                        <label className="text-xs" for="game-summary-id">Sumary of Premise</label>
                        <textarea id="game-summary-id" name="game-summary" required></textarea>
                    </div>       
                    <button className="h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" type="Submit">Submit</button>
                </form>
            </main>
        </div>
    )
}