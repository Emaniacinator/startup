export function GameCreationPage(){

    return (
        <div className="game-creation-page-container">
            <main>
                <h2 className="flex justify-center">Add a new game here!</h2>
                <p className="flex justify-center">To add a new game, please fill out the following info:</p>
                <form className="flexbox justify-center" onSubmit={handleGameCreation} onChange={(focus) => focus.target.setCustomValidity("")}>
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

    async function handleGameCreation(inputObject){
        inputObject.preventDefault();

        const newGameName = inputObject.target.elements.gameName.value;
        const newGamePhoto = inputObject.target.elements.gamePhotoUrl.value;
        const newGameSummary = inputObject.target.elements.gameSummary.value;

        const validityDisplayObject = inputObject.target.elements.gameName;

        let gameExistenceChecker = await fetch('/api/gameApi/checkGameExists', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'gameName': newGameName })
        });

        if (( await gameExistenceChecker.json()) === false) {
            let apiCheckForExistence = await determineIfGameIsReal(newGameName);
            if (apiCheckForExistence === true){
                let gameListResponse = await fetch('/api/gameApi/getGameLists', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({})
                });

                let parsedResponse = await gameListResponse.json();
                let gameList = parsedResponse.gameList;

                let createGameResponse = await fetch('/api/gameApi/createGame', {
                    credentials: 'include',
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'gameName': newGameName,
                            'gameImageUrl': newGamePhoto,
                            'gameSummary': newGameSummary,
                            'gameId': gameList.length + 1,
                            'averageScore': null
                            })
                });

                if (createGameResponse.ok){
                    validityDisplayObject.setCustomValidity("Game Added! Thank you!");
                }
                else {
                    validityDisplayObject.setCustomValidity("It seems like you failed the authorization check. Please log out and then back in");
                }

                
            }
            else{
                validityDisplayObject.setCustomValidity("It seems like that game isn't a real game. Please try again and check your spelling");
            }
        }
        else {
            validityDisplayObject.setCustomValidity("That game is already in our database. Please consider leaving a review instead");
        }
    }

    async function determineIfGameIsReal(gameToSearchFor){;

        const response = await fetch('/api/igdbDatabase/checkIfGameIsReal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({gameName: gameToSearchFor})
        });

        let formattedResponse = await response.json(); 

        if (!response.ok){
            console.error(formattedResponse.msg)
        }
        else {
            return formattedResponse
        }
    }
}