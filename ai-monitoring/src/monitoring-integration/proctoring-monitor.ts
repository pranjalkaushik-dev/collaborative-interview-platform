import type { CvViolation } from "../cv-proctoring/types.js";
import { MonitoringSocketClient } from "./socket-client.js";

export interface ProctoringMonitorOptions {
  serverUrl: string;
  roomId: string;
  candidateId: string;
  userName: string;
}

export class ProctoringMonitor {
  private readonly client: MonitoringSocketClient;
  private readonly roomId: string;
  private readonly candidateId: string;
  private readonly userName: string;

  constructor(options: ProctoringMonitorOptions) {
    this.client = new MonitoringSocketClient({
      serverUrl: options.serverUrl,
    });

    this.roomId = options.roomId;
    this.candidateId = options.candidateId;
    this.userName = options.userName;
  }

  async start(): Promise<void> {
    await this.client.connect();

    this.client.joinRoom(this.roomId, this.userName);
  }

  stop(): void {
    this.client.disconnect();
  }

  reportViolation(violation: CvViolation): void {
    this.client.reportViolation({
      roomId: this.roomId,
      candidateId: this.candidateId,
      violationType: violation.type,
    });
  }

  onViolationAlert(
    callback: (alert: {
      candidateId: string;
      violationType: string;
      timestamp: number;
    }) => void,
  ): () => void {
    return this.client.onViolationAlert(callback);
  }
}