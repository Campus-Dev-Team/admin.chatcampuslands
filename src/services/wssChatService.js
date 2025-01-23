import API_WEBSOCKET_URL from "./apiConfig";

class WebSocketService {
  constructor() {
    this.socket = null;
    this.messageHandlers = new Set();
    this.reconnectInterval = 5000; 
    this.isManuallyDisconnected = false; 
  }

  connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.log("WebSocket ya está conectado o en proceso de conexión.");
      return this.socket;
    }

    this.isManuallyDisconnected = false; 

    this.socket = new WebSocket(`${API_WEBSOCKET_URL}`);

    this.socket.onopen = () => {
      console.log("Conexión WebSocket establecida");
    };

    this.socket.onmessage = (event) => {
      this.messageHandlers.forEach((handler) => handler(event.data));
    };

    this.socket.onclose = () => {
      console.log("Conexión WebSocket cerrada");

      if (!this.isManuallyDisconnected) {
        console.log(`Intentando reconectar en ${this.reconnectInterval / 1000} segundos...`);
        setTimeout(() => this.connect(), this.reconnectInterval);
      }
    };

    this.socket.onerror = (error) => {
      console.error("Error en WebSocket:", error);
    };

    return this.socket;
  }

  disconnect() {
    this.isManuallyDisconnected = true; 
    if (this.socket) {
      this.socket.close();
    }
  }

  sendMessage(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket no está conectado");
    }
  }

  addMessageHandler(handler) {
    this.messageHandlers.add(handler);
  }

  removeMessageHandler(handler) {
    this.messageHandlers.delete(handler);
  }
}

export const wsService = new WebSocketService();
