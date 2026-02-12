import React from 'react';
import { NavLink } from 'react-router-dom';

export function GamePageTemplate(){
    return(
        <div className="game-page-template-container">
            <div className="website-banner">
                <h1 className="website-name">Video Game Voting</h1>
                <img alt="Demo banner for website" src=".\website-banner.png" />
                <nav className="" id="login-links">
                    <NavLink className="nav-link h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" id="login-link" to="../LoginPage">Login / Username</NavLink>
                    <p></p>
                    <NavLink className="nav-link h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" id="game-creation-link" to="../GameCreationPage">Add Game</NavLink>
                </nav>
            </div>
            <main>
                <div id="combo-box" className="flex justify-center">
                    <div id="game-info" className="flexbox content-center w-7/12 left-1/12 right-7/12">
                        <h2>Game Name Here!</h2>
                        <p>Put an appropriate game image here. For now, here is a demo image:</p>
                        <img alt="Image for demo of game" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV3YMfbPBgXzxmZxsa2vb2LPyanOsR6iqY7g&s" />
                        <p>Average Game Rating: 0/100 (pull from a database)</p>
                    </div>
                    <div id="game-review-stuff" className="flexbox content-center w-3/12 left-1/12 right-7/12">
                        <h2>Leave a game review</h2>
                        <form>
                            <div className="flexbox">
                                <label className="text-xs" for="game-score-id">Score the game out of 100</label>
                                <input id="game-score-id" name="game-score" type="number" max="100" required />
                            </div>
                            <div className="flexbox">
                                <label className="text-xs" for="game-review-id">Leave a review</label>
                                <textarea id="game-review-id" name="game-review" required></textarea>
                            </div>
                            <button type="Submit">Leave Review</button>
                        </form>
                    </div>
                </div>
                <div id="combo-box" className="flex justify-center">
                    <div className="flexbox content-center w-7/12 left-1/12 right-7/12">
                        <h2>Reviews</h2>
                        <p>Username of a reviewer</p>
                        <p>Score of review</p>
                        <p>The text of the review</p>
                        <p>(There will be more reviews after this)</p>
                    </div>
                    <div id="live-chat" className="flexbox content-center w-3/12 left-1/12 right-7/12">
                        <h2>Live Chat About Game</h2>
                        <p className="text-xs">(This is where there will be a live chat about the game, using websocket)</p>
                        <form>
                            <label for="comment-box-id" className="text-xs">Leave a comment in chat</label>
                            <textarea id="comment-box-id" name="comment-box" required></textarea>
                            <button type="Submit">Comment</button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}