import React from 'react';
import { NavLink } from 'react-router-dom';
import { Game } from '../classes/game';
import { PageState } from '../classes/page-state';

export function GameCreationPage(temporaryGameListStorage, newGameListUpdateFunc){

    return (
        <div className="game-creation-page-container">
            <main>
                <h2 className="flex justify-center">Add a new game here!</h2>
                <p className="flex justify-center">To add a new game, please fill out the following info:</p>
                <form className="flexbox justify-center" onSubmit={handleGameCreation}>
                    <div className="flexbox">
                        <p>Note that a 3rd party API will verify the existence of this game before allowing it to be submitted</p>
                        <label className="flexbox text-xs" htmlFor="game-name-id">Game Name</label>
                        <input type="text" id="game-name-id" name="gameName" required />
                    </div>       
                    <div className="flexbox">
                        <label className="flexbox text-xs" htmlFor="game-photo-url-id">Cover Photo Url</label>
                        <input type="url" id="game-photo-url-id" name="gamePhotoUrl" required />
                    </div>  
                    <div className="flexbox">
                        <label className="text-xs" htmlFor="game-summary-id">Sumary of Premise</label>
                        <textarea id="game-summary-id" name="gameSummary" required></textarea>
                    </div>       
                    <button className="h-[5vh] bg-green-500 hover:bg-green-300 text-white py-1 px-2 rounded" type="Submit">Submit</button>
                </form>
            </main>
        </div>
    )

    function handleGameCreation(inputObject){
        const newGameName = inputObject.target.elements.gameName;
        const newGamePhoto = inputObject.target.elements.gamePhotoUrl;
        const newGameSummary = inputObject.target.elements.gameSummary;

        let gameExistenceChecker = false;
        for (i = 0; i < temporaryGameListStorage.length; i++){
            if (newGameName === temporaryGameListStorage[i].returnGameName){
                gameExistenceChecker = true;
            }
        }

        if (!gameExistenceChecker === true) {
            gameToAdd = new Game(gameName=newGameName, gameImageUrl=newGamePhoto, gameSummary=newGameSummary, gameId=temporaryGameListStorage.length);
            mockApiCheckForExistence = mockApiCall();
            if (mockApiCheckForExistence === true){
                temporaryGameListStorage.push(gameToAdd);
                newGameListUpdateFunc(gameToAdd);
                inputObject.setCustomValidity("");
            }
            else{
                inputObject.setCustomValidity("This is mocking the game not existing in an API database. Sorry for the random interruption");
            }
        }
        else {
            inputObject.setCustomValidity("That game is already in our database. Please consider leaving a review instead");
        }
    }

    function mockApiCall(){
        if (Math.random() < 0.5){
            return false;
        }
        else {
            return true;
        }
    }
}