import React from 'react';
import { GameReview } from '../classes/gameReview';
import { ChatEvent, GameChat } from '../gameChat';

export function GamePageTemplate({gameIdToLoad}){
    const [localGameCommentsStorage, setLocalGameCommentsStorage] = React.useState([]);
    const [localGameReviewStorage, setLocalGameReviewStorage] = React.useState([]);

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
                            <p className="whitespace-pre-wrap">{commentItem}</p>
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

        let usernameToDisplay = localStorage.getItem('username', '');
        if (usernameToDisplay === ''){
            usernameToDisplay = 'Guest';
        };

        const composedComment = (`For game: ${loadedGame?.gameName} You said:\n\t  ${newComment}`);
        setLocalGameCommentsStorage([...localGameCommentsStorage, composedComment]);

        GameChat.broadcastEvent(usernameToDisplay, loadedGame?.gameName || 'Demo Name', newComment, ChatEvent.SendMessage);
    }

    async function handleGameLoading(){

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

            setLoadedGame(parsedGetGameInfoResponse);
            if (parsedGetGameInfoResponse.gameReviews){
                setLocalGameReviewStorage(parsedGetGameInfoResponse.gameReviews);
            }
        };
    };

    function handleMessageEvent(messageEvent){
        console.log(`Handling message event from the user ${messageEvent.from}`);
        if (messageEvent.broadcastType === "sendMessage"){
            console.log("updating based on sendMessage command");
            let newComment = `For game: ${messageEvent.gamePage}, ${messageEvent.from} says:\n\t${messageEvent.message}`;
            setLocalGameCommentsStorage([...localGameCommentsStorage, newComment]);
        } else if (messageEvent.broadcastType === "userConnected"){
            console.log("updating based on userConnected command");
            let userJoinComment = `User ${messageEvent.from} joined chat in the game ${messageEvent.gamePage}`;
            setLocalGameCommentsStorage([...localGameCommentsStorage, userJoinComment]);
        } else if (messageEvent.broadcastType === "userDisconnected") {
            console.log("updating based on userDisconnected command");
            let userLeaveComment = `User ${messageEvent.from} left the chat`;
            setLocalGameCommentsStorage([...localGameCommentsStorage, userLeaveComment]);
        } else {
            console.log("Didn't hit any update states");
        };
        console.log("Game comment storage after event handling: ", localGameCommentsStorage);
    }
}