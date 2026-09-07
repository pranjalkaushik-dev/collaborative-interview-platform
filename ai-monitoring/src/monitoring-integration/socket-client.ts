import { io, type Socket } from "socket.io-client";

export interface MonitoringViolation {
  roomId: string;
  candidateId: string;
  violationType: string;
}

export interface MonitoringSocketClientOptions {
  serverUrl: string;
}

export class MonitoringSocketClient {
  private readonly socket: Socket;

  constructor(options: MonitoringSocketClientOptions) {
    this.socket = io(options.serverUrl, {
      autoConnect: false,
      transports: ["websocket"],
    });
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const handleConnect = () => {
        cleanup();
        resolve();
      };

      const handleError = (error: Error) => {
        cleanup();
        reject(error);
      };

      const cleanup = () => {
        this.socket.off("connect", handleConnect);
        this.socket.off("connect_error", handleError);
      };

      this.socket.once("connect", handleConnect);
      this.socket.once("connect_error", handleError);

      this.socket.connect();
    });
  }

  disconnect(): void {
    this.socket.disconnect();
  }

  joinRoom(roomId: string, userName: string): void {
    this.socket.emit("join-room", {
      roomId,
      userName,
    });
  }

  reportViolation(violation: MonitoringViolation): void {
    this.socket.emit("monitoring:violation", violation);
  }

  onViolationAlert(
    callback: (alert: {
      candidateId: string;
      violationType: string;
      timestamp: number;
    }) => void,
  ): () => void {
    this.socket.on("violation-alert", callback);

    return () => {
      this.socket.off("violation-alert", callback);
    };
  }
}