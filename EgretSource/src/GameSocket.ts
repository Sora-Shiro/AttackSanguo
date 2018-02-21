class GameSocket extends egret.WebSocket {

  private static gameSocket: GameSocket;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.gameSocket && this.gameSocket.connected) {
      return this.gameSocket;
    }
    this.gameSocket = new GameSocket();
    return this.gameSocket;
  }
}