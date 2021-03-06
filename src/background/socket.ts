let DataReceiver = {
	callbacks: new Map(),
	onDataReceived: (aSocketId, aData, aJSON) => {
		if (!DataReceiver.callbacks.has(aSocketId)) {
			return;
		}
		if (aJSON) {
			aData = JSON.parse(aData);
		}
		DataReceiver.callbacks.get(aSocketId)(aData);
	},
};

(browser as any).sockets.onDataReceived.addListener(
	DataReceiver.onDataReceived
);

let ListeningSockets = new Map();

export class ListeningSocket {
	callback: any;
	port: any;

	constructor(callback) {
		this.callback = callback;
	}

	async startListening() {
		this.port = await (browser as any).sockets.createServerSocket();
		DataReceiver.callbacks.set(this.port, this.callback);
		(browser as any).sockets.startListening(this.port);
		console.log("Listening on port " + this.port);
	}
}

export class SendingSocket {
	id: any;

	constructor() {}

	async connect(host, port) {
		this.id = await (browser as any).sockets.createSendingSocket();
		(browser as any).sockets.connect(this.id, host, port);
		console.log(`Connected to ${host}:${port}`);
	}

	send(aData, aJSON = true) {
		try {
			(browser as any).sockets.sendData(this.id, aData, !!aJSON);
			return true;
		} catch (err) {
			console.error(err, (err as any).message);
			return false;
		}
	}

	close() {
		(browser as any).sockets.close(this.id);
	}
}
