const ChatEvent = {
    UserConnected: 'userConnected',
    UserDisconnected: 'userDisconnected',
    SendMessage: 'sendMessage',
    SystemMessage: 'systemMessage'
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

    constructor() {
        let port = window.location.port;
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
        this.socket.onopen = (event) => {
            this.receiveEvent(new EventMessage('Simon', GameEvent.System, { msg: 'connected' }));
        };
        this.socket.onclose = (event) => {
            this.receiveEvent(new EventMessage('Simon', GameEvent.System, { msg: 'disconnected' }));
        };
        this.socket.onmessage = async (msg) => {
        try {
            const event = JSON.parse(await msg.data.text());
            this.receiveEvent(event);
        } catch {}
        };
    }
}