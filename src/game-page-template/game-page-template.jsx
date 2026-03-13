import React from 'react';
import { NavLink } from 'react-router-dom';
import { PageState } from '../classes/page-state';
import { GameReview } from '../classes/gameReview';

export function GamePageTemplate(gameToLoad){
    let [temporaryGameCommentsStorage, setTemporaryGameCommentsStorage] = React.useState([]);
    let [temporaryGameReviewStorage, setTemporaryGameReviewStorage] = React.useState([]);
    const [dummyUserTimer, setDummyUserTimer] = React.useState(0);
    const [secondDummyUserTimer, setSecondDummyUserTimer] = React.useState(0);

    const [loadedGame, setLoadedGame] = React.useState({});

    React.useEffect(() => {
        handleGameLoading();
    }, []);

    // Leaves a new review every 6 seconds
    React.useEffect(() => {
            const intervalIncrementer = setInterval(() => {
                setDummyUserTimer(prevCount => prevCount + 1);
                let dummyReview = new GameReview('Dummy User', '50', 'Dummy Review. It was alright I guess');
                leaveReview(dummyReview);
            }, 6000);
            return (() => clearInterval(intervalIncrementer));
        }, []);

    // Leaves a new comment every 2 seconds
    React.useEffect(() => {
            const intervalIncrementer = setInterval(() => {
                let comment = 'WOW! A *dummy* comment!'
                setSecondDummyUserTimer(prevCount => prevCount + 1);
                setTemporaryGameCommentsStorage(prevList => [...prevList, comment])
            }, 2000);
            return (() => clearInterval(intervalIncrementer));
        }, []);
    
    return(
        <div className="game-page-template-container">
            <main>
                <div id="combo-box" className="flex justify-center">
                    <div id="game-info" className="flexbox content-center w-7/12 left-1/12 right-7/12">
                        <h2>{loadedGame.gameName}</h2>
                        <p>Put an appropriate game image here. For now, here is a demo image:</p>
                        <img alt="Image for demo of game" src={loadedGame.gameImageUrl} />
                        <p>Average Game Rating: {loadedGame.averageScore}/100 (pull from a database)</p>
                    </div>
                    <div id="game-review-stuff" className="flexbox content-center w-3/12 left-1/12 right-7/12">
                        <h2>Leave a game review</h2>
                        <form onSubmit={makeAndSendReviewUsingVariables} onChange={((focus) => focus.target.setCustomValidity(""))}>
                            <div className="flexbox">
                                <label className="text-xs" htmlFor="game-score-id">Score the game out of 100</label>
                                <input id="game-score-id" name="gameScore" type="number" max="100" required />
                            </div>
                            <div className="flexbox">
                                <label className="text-xs" htmlFor="game-review-id">Leave a review</label>
                                <textarea id="game-review-id" name="gameReview" required></textarea>
                            </div>
                            <button className="h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" type="Submit">Leave Review</button>
                        </form>
                    </div>
                </div>
                <div id="combo-box" className="flex justify-center">
                    <div className="flexbox content-center w-7/12 left-1/12 right-7/12">
                        <h2>Reviews</h2>
                        {temporaryGameReviewStorage.map((reviewItem) => (
                            <>
                                <p>{reviewItem.reviewerUsername}:</p>
                                <p>Score: {reviewItem.reviewScore}</p>
                                <p>Review: {reviewItem.reviewText}</p>
                            </>
                            )
                        )}
                    </div>
                    <div id="live-chat" className="flexbox content-center w-3/12 left-1/12 right-7/12">
                        <h2>Live Chat About Game</h2>
                        <p className="text-xs">(This is where there will be a live chat about the game, using websocket)</p>
                        <form onSubmit={leaveComment}>
                            <label htmlFor="comment-box-id" className="text-xs">Leave a comment in chat</label>
                            <textarea id="comment-box-id" name="commentBox" required></textarea>
                            <button type="Submit">Comment</button>
                        </form>
                        {temporaryGameCommentsStorage.map((commentItem) => (
                            <p>{commentItem}</p>
                            )
                        )}
                    </div>
                </div>
            </main>
        </div>
    )

    function makeAndSendReviewUsingVariables(inputObject){
        if (localStorage.getItem('username', '') !== ''){
            const reviewScore = inputObject.target.elements.gameScore.value;
            const reviewText = inputObject.target.elements.gameReview.value;
            const reviewToAdd = new GameReview(localStorage.getItem('username'), reviewScore, reviewText);
            leaveReview(reviewToAdd);
        } else {
            const validityDisplayObject = inputObject.target.elements.gameScore;
            validityDisplayObject.setCustomValidity("Please log in before leaving a review");
        }
    }

    function leaveReview(newReview){
        inputObject.preventDefault();

        setTemporaryGameReviewStorage(prevList => [...prevList, newReview])
    }

    function leaveComment(inputObject){
        inputObject.preventDefault();

        const newComment = inputObject.target.elements.commentBox.value
        setTemporaryGameCommentsStorage(prevList => [...prevList, newComment])
    }

    async function handleGameLoading(){
        setLoadedGame(await fetch('/gameApi/getGameInfo', {
            method: POST,
            headers: { 'Content-Type': 'application/json' },
            body: { 'gameId': gameToLoad }
        }));
    };
}