const ChatEvent = {
    UserConnected: 'userConnected',
    UserDisconnected: 'userDisconnected',
    SendMessage: 'sendMessage',
    UpdateMainPage: 'updateMainPage',
    SystemEvent: 'systemEvent'
}

class GameChatMessage {
    constructor(from, gamePage, message, broadcastType){
        this.from = from;
        this.gamePage = gamePage;
        this.message = message;
        this.broadcastType = broadcastType;
    }
}

class GameChatNotifier {
    messageEvents = [];
    messageHandlers = [];

    constructor() {
        let port = window.location.port;
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
        this.socket.onopen = (event) => {
            this.receiveMessageEvent(new GameChatMessage('System', ChatEvent.SystemEvent, { msg: 'connected' }));
        };
        this.socket.onclose = (event) => {
            this.receiveMessageEvent(new GameChatMessage('System', ChatEvent.SystemEvent, { msg: 'disconnected' }));
        };
        this.socket.onmessage = async (msg) => {
            try {
                const event = JSON.parse(await msg.data.text());
                this.receiveMessageEvent(event);
            } catch {}
        };
    }

    broadcastEvent(from, gamePage, message, broadcastType) {
        console.log("An event *should* be broadcast");
        const event = new GameChatMessage(from, gamePage, message, broadcastType);
        this.socket.send(JSON.stringify(event));
    }

    addMessageHandler(messageHandler) {
        console.log("Added a message handler");
        this.messageHandlers.push(messageHandler);
    } 

    removeMessageHandler(messageHandler) {
        console.log("Removed a message handler");
        this.messageHandlers.filter((specificMessageHandler) => specificMessageHandler !== specificMessageHandler);
    }

    receiveMessageEvent(messageEvent){
        // Add the event to the list of comments if it matters
        console.log("Message event received by a user of the type", messageEvent.broadcastType);

        if (messageEvent.broadcastType !== "updateMainPage") {
            console.log("Pushing the message to the messageEvents list");
            this.messageEvents.push(messageEvent);

            this.messageEvents.forEach((specificMessageEvent) => {
                this.messageHandlers.forEach((specificMessageHandler) => {
                    console.log("Called the message handler for this event one time");
                    specificMessageHandler(specificMessageEvent);
                });
            });  
        } else { 
            console.log("Called the message handler for this event one time");
            specificMessageHandler(specificMessageEvent);
        };
    }
}

const GameChat = new GameChatNotifier();
export { ChatEvent, GameChat };