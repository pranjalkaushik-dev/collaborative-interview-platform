import { CvCamera } from "./camera.js";

import {
  CvFaceDetector,
} from "./face-detector.js";

import {
  FaceDetectionLoop,
} from "./detection-loop.js";

import {
  CvObjectDetector,
} from "./object-detector.js";

import {
  ObjectDetectionLoop,
} from "./object-detection-loop.js";

import {
  detectProhibitedObjects,
} from "./object-rules.js";

import {
  CvViolationTracker,
} from "./violation-tracker.js";

import {
  ObjectViolationTracker,
} from "./object-violation-tracker.js";

import type {
  CvProctoringCallbacks,
  CvViolation,
  FaceDetectionResult,
} from "./types.js";

import type {
  ObjectDetectionResult,
} from "./object-detector.js";

export interface CvProctoringControllerOptions {
  callbacks?: CvProctoringCallbacks;

  detectionIntervalMs?: number;

  minDetectionConfidence?: number;

  violationPersistenceMs?: number;

  objectDetectionConfidence?: number;

  maxObjectResults?: number;
}

export class CvProctoringController {
  private readonly camera: CvCamera;

  private readonly callbacks:
    CvProctoringCallbacks;

  private readonly detectionIntervalMs: number;

  private readonly minDetectionConfidence:
    number | undefined;

  private readonly violationPersistenceMs:
    number;

  private readonly objectDetectionConfidence:
    number | undefined;

  private readonly maxObjectResults:
    number | undefined;

  private readonly violationTracker:
    CvViolationTracker;

  private readonly objectViolationTracker:
    ObjectViolationTracker;

  private faceDetector:
    CvFaceDetector | undefined;

  private objectDetector:
    CvObjectDetector | undefined;

  private faceLoop:
    FaceDetectionLoop | undefined;

  private objectLoop:
    ObjectDetectionLoop | undefined;

  private video:
    HTMLVideoElement | undefined;

  private running = false;

  constructor(
    options: CvProctoringControllerOptions = {},
  ) {
    this.camera = new CvCamera();

    this.callbacks =
      options.callbacks ?? {};

    this.detectionIntervalMs =
      options.detectionIntervalMs ?? 500;

    this.minDetectionConfidence =
      options.minDetectionConfidence;

    this.violationPersistenceMs =
      options.violationPersistenceMs ?? 2000;

    this.objectDetectionConfidence =
      options.objectDetectionConfidence;

    this.maxObjectResults =
      options.maxObjectResults;

    this.violationTracker =
      new CvViolationTracker({
        persistenceMs:
          this.violationPersistenceMs,

        onViolation: (
          violation: CvViolation,
        ) => {
          this.callbacks
            .onViolation
            ?.(
              violation,
            );
        },
      });

    this.objectViolationTracker =
      new ObjectViolationTracker({
        persistenceMs:
          this.violationPersistenceMs,

        onViolation: (
          violation: CvViolation,
        ) => {
          this.callbacks
            .onViolation
            ?.(
              violation,
            );
        },
      });
  }

  async start(
    video: HTMLVideoElement,
  ): Promise<void> {
    if (this.running) {
      return;
    }

    this.video = video;

    await this.camera.start();

    this.camera.attachToVideo(video);

    const faceDetectorOptions =
      this.minDetectionConfidence !==
      undefined
        ? {
            minDetectionConfidence:
              this.minDetectionConfidence,
          }
        : {};

    this.faceDetector =
      await CvFaceDetector.create(
        faceDetectorOptions,
      );

    const objectDetectorOptions: {
      minDetectionConfidence?: number;
      maxResults?: number;
    } = {};

    if (
      this.objectDetectionConfidence !==
      undefined
    ) {
      objectDetectorOptions
        .minDetectionConfidence =
        this.objectDetectionConfidence;
    }

    if (
      this.maxObjectResults !==
      undefined
    ) {
      objectDetectorOptions
        .maxResults =
        this.maxObjectResults;
    }

    this.objectDetector =
      await CvObjectDetector.create(
        objectDetectorOptions,
      );

    this.faceLoop =
      new FaceDetectionLoop(
        this.faceDetector,
        video,
        {
          intervalMs:
            this.detectionIntervalMs,

          onDetection: (
            result: FaceDetectionResult,
          ) => {
            this.handleDetection(
              result,
            );
          },
        },
      );

    this.objectLoop =
      new ObjectDetectionLoop(
        this.objectDetector,
        video,
        {
          intervalMs:
            this.detectionIntervalMs,

          onDetection: (
            result: ObjectDetectionResult,
          ) => {
            this.handleObjectDetection(
              result,
            );
          },
        },
      );

    this.running = true;

    this.faceLoop.start();

    this.objectLoop.start();
  }

  stop(): void {
    this.running = false;

    this.faceLoop?.stop();

    this.objectLoop?.stop();

    this.faceLoop = undefined;

    this.objectLoop = undefined;

    this.faceDetector?.close();

    this.objectDetector?.close();

    this.faceDetector = undefined;

    this.objectDetector = undefined;

    this.violationTracker.clearAll();

    this.objectViolationTracker.clear();

    this.camera.stop();

    if (this.video) {
      this.video.srcObject = null;
    }

    this.video = undefined;
  }

  isRunning(): boolean {
    return this.running;
  }

  isCameraActive(): boolean {
    return this.camera.isActive();
  }

  processDetection(
    result: FaceDetectionResult,
  ): void {
    this.handleDetection(result);
  }

  processObjectDetection(
    result: ObjectDetectionResult,
  ): void {
    this.handleObjectDetection(
      result,
    );
  }

  private handleDetection(
    result: FaceDetectionResult,
  ): void {
    this.callbacks
      .onDetection
      ?.(
        result,
      );

    if (
      result.status === "NO_FACE"
    ) {
      this.violationTracker.clear(
        "MULTIPLE_PEOPLE",
      );

      this.violationTracker.update(
        "CANDIDATE_ABSENT",
        result.detectedAt,
        result.faceCount,
      );

      return;
    }

    if (
      result.status ===
      "MULTIPLE_FACES"
    ) {
      this.violationTracker.clear(
        "CANDIDATE_ABSENT",
      );

      this.violationTracker.update(
        "MULTIPLE_PEOPLE",
        result.detectedAt,
        result.faceCount,
      );

      return;
    }

    this.violationTracker.clear(
      "CANDIDATE_ABSENT",
    );

    this.violationTracker.clear(
      "MULTIPLE_PEOPLE",
    );
  }

  private handleObjectDetection(
    result: ObjectDetectionResult,
  ): void {
    const prohibitedObjects =
      detectProhibitedObjects(
        result.objects,
      );

    const object =
      prohibitedObjects[0];

    if (!object) {
      this.objectViolationTracker
        .clear();

      return;
    }

    this.objectViolationTracker
      .update(
        result.detectedAt,
        object.label,
        object.score,
      );
  }
}