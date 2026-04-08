import React from 'react';
import { GameReview } from '../classes/gameReview';
import { ChatEvent, GameChat } from '../gameChat';

export function GamePageTemplate({gameIdToLoad}){
    let [localGameCommentsStorage, setLocalGameCommentsStorage] = React.useState([]);
    let [localGameReviewStorage, setLocalGameReviewStorage] = React.useState([]);

    const [loadedGame, setLoadedGame] = React.useState({});

    React.useEffect(() => {
        let sillyWrapper = async () => {
            await handleGameLoading();
        }
        sillyWrapper();
    }, []);

    React.useEffect(() => {
        GameChat.addMessageHandler(handleMessageEvent);

        return () => {
            GameChat.removeMessageHandler(handleMessageEvent);
        }
    });
    
    return(
        <div className="game-page-template-container">
            <main>
                <div id="combo-box" className="flex justify-center">
                    <div id="game-info" className="flexbox content-center w-7/12 left-1/12 right-7/12">
                        <h2>{loadedGame?.gameName || 'Demo Name'}</h2>
                        <p>Put an appropriate game image here. For now, here is a demo image:</p>
                        <img alt="Image for demo of game" src={loadedGame?.gameImageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV3YMfbPBgXzxmZxsa2vb2LPyanOsR6iqY7g&s'} />
                        <p>Average Game Rating: {(loadedGame?.averageScore === undefined || loadedGame?.averageScore === -1) ? "No Ratings" : loadedGame.averageScore}</p>
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
                        {localGameReviewStorage.map((reviewItem) => (
                            <>
                                <p>{reviewItem.reviewerUsername}:</p>
                                <p>Score: {reviewItem.reviewScore}</p>
                                <p>Review: {reviewItem.reviewText}</p>
                                <p>&nbsp;</p>
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
                        {localGameCommentsStorage.map((commentItem) => (
                            <p>{commentItem}</p>
                            )
                        )}
                    </div>
                </div>
            </main>
        </div>
    )

    async function makeAndSendReviewUsingVariables(inputObject){
        inputObject.preventDefault();

        if (localStorage.getItem('username', '') !== ''){
            const reviewScore = parseFloat(inputObject.target.elements.gameScore.value);
            const reviewText = inputObject.target.elements.gameReview.value;
            const reviewToAdd = new GameReview(localStorage.getItem('username'), reviewScore, reviewText);
            await leaveReview(reviewToAdd);
        } else {
            const validityDisplayObject = inputObject.target.elements.gameScore;
            validityDisplayObject.setCustomValidity("Please log in before leaving a review");
        }
    }

    async function leaveReview(newReview){

        if (gameIdToLoad === -1){
            console.log("A valid game is not loaded. Id defaulted to -1.");
            return;
        };

        let reviewGameResponse = await fetch('/api/gameApi/addGameReview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                'gameId': gameIdToLoad,
                'gameReview': newReview
            })
        });

        await handleGameLoading();
    }

    function leaveComment(inputObject){
        inputObject.preventDefault();

        const newComment = inputObject.target.elements.commentBox.value
        GameChat.broadcastEvent(localStorage.getItem('username', 'guest'), loadedGame?.gameName || 'Demo Name', newComment, ChatEvent.SendMessage);
    }

    async function handleGameLoading(){
        console.log(`Id of game to load: ${gameIdToLoad}`);

        if (gameIdToLoad === -1){
            gameToLoad = {
                "gameName": "Dummy Game",
                "gameImageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV3YMfbPBgXzxmZxsa2vb2LPyanOsR6iqY7g&s",
                "gameSummary": "This is a dummy game. It's likely appearing becaue of an error determining which game to load.",
                "gameId": -1,
                "averageScore": 0
            }
            setLoadedGame(gameToLoad);
            setLocalGameReviewStorage([]);
        } else {
            let getGameInfoResponse = await fetch('/api/gameApi/getGameInfo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'gameId': gameIdToLoad })
            });

            let parsedGetGameInfoResponse = await getGameInfoResponse.json();

            console.log("Full response:", JSON.stringify(parsedGetGameInfoResponse, null, 2));
            console.log(`Output game info: ${parsedGetGameInfoResponse.gameName}`);

            setLoadedGame(parsedGetGameInfoResponse);
            if (loadedGame.gameReviews){
                setLocalGameReviewStorage(loadedGame.gameReviews);
            }
        };
    };

    function handleMessageEvent(messageEvent){
        if (messageEvent.broadcastType === ChatEvent.UpdateMainPage){
            let newComment = `For game: ${messageEvent.gamePage}, ${messageEvent.from} says: \n\t${messageEvent.message}`;
            setLocalGameCommentsStorage(prevList => [...prevList, newComment]);
        } else if (messageEvent.broadcastType === ChatEvent.UserConnected){
            let userJoinComment = `User ${messageEvent.from} joined chat in the game ${messageEvent.gamePage}`;
            setLocalGameCommentsStorage(prevList => [...prevList, userJoinComment]);
        } else if (messageEvent.broadcastType === ChatEvent.UserDisconnected) {
            let userLeaveComment = `User ${messageEvent.from} left the chat`;
            setLocalGameCommentsStorage(prevList => [...prevList, userLeaveComment]);
        } else {};
    }
}