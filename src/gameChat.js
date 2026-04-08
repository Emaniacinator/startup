const ChatEvent = {
    UserConnected: 'userConnected',
    UserDisconnected: 'userDisconnected',
    SendMessage: 'sendMessage',
    UpdateMainPage: 'updateMainPage'
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
            this.receiveEvent(new GameChatMessage('Simon', GameEvent.System, { msg: 'connected' }));
        };
        this.socket.onclose = (event) => {
            this.receiveEvent(new GameChatMessage('Simon', GameEvent.System, { msg: 'disconnected' }));
        };
        this.socket.onmessage = async (msg) => {
            try {
                const event = JSON.parse(await msg.data.text());
                this.receiveEvent(event);
            } catch {}
        };
    }

    broadcastEvent(from, gamePage, message, broadcastType) {
        const event = new GameChatMessage(from, gamePage, message, broadcastType);
        this.socket.send(JSON.stringify(event));
    }

    addMessageHandler(messageHandler) {
        this.messageHandlers.push(messageHandler);
    } 

    removeMessageHandler(messageHandler) {
        this.messageHandlers.filter((specificMessageHandler) => specificMessageHandler !== specificMessageHandler);
    }

    receiveMessageEvent(messageEvent){
        // Add the event to the list of comments if it matters
        if (messageEvent.broadcastType !== ChatEvent.UpdateMainPage) {
            this.messageEvents.push(messageEvent);
        };

        // Otherwise just send out the broadcast to allow for the updates
        this.messageEvents.forEach((specificMessageEvent) => {
            this.messageHandlers.forEach((specificMessageHandler) => {
                specificMessageHandler(specificMessageEvent);
            });
        });   
    }
}

const GameChat = new GameChatNotifier();
export { ChatEvent, GameChat };