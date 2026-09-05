import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  CvProctoringController,
} from "../proctoring-controller.js";

import type {
  FaceDetectionResult,
} from "../types.js";

import type {
  ObjectDetectionResult,
} from "../object-detector.js";

const mocks = vi.hoisted(() => ({
  cameraStart: vi.fn(),
  cameraAttach: vi.fn(),
  cameraStop: vi.fn(),
  cameraIsActive: vi.fn(),

  faceDetectorCreate: vi.fn(),
  faceDetectorClose: vi.fn(),

  objectDetectorCreate: vi.fn(),
  objectDetectorClose: vi.fn(),

  faceLoopStart: vi.fn(),
  faceLoopStop: vi.fn(),

  objectLoopStart: vi.fn(),
  objectLoopStop: vi.fn(),

  detectProhibitedObjects: vi.fn(),
}));

vi.mock("../camera.js", () => ({
  CvCamera: vi.fn(
    class {
      start = mocks.cameraStart;
      attachToVideo = mocks.cameraAttach;
      stop = mocks.cameraStop;
      isActive = mocks.cameraIsActive;
    },
  ),
}));

vi.mock("../face-detector.js", () => ({
  CvFaceDetector: {
    create: mocks.faceDetectorCreate,
  },
}));

vi.mock("../detection-loop.js", () => ({
  FaceDetectionLoop: vi.fn(
    class {
      start = mocks.faceLoopStart;
      stop = mocks.faceLoopStop;
    },
  ),
}));

vi.mock("../object-detector.js", () => ({
  CvObjectDetector: {
    create: mocks.objectDetectorCreate,
  },
}));

vi.mock("../object-detection-loop.js", () => ({
  ObjectDetectionLoop: vi.fn(
    class {
      start = mocks.objectLoopStart;
      stop = mocks.objectLoopStop;
    },
  ),
}));

vi.mock("../object-rules.js", () => ({
  detectProhibitedObjects:
    mocks.detectProhibitedObjects,
}));

describe(
  "CvProctoringController",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();

      mocks.cameraIsActive.mockReturnValue(
        true,
      );

      mocks.cameraStart.mockResolvedValue(
        undefined,
      );

      mocks.faceDetectorCreate.mockResolvedValue(
        {
          close:
            mocks.faceDetectorClose,
          detect: vi.fn(),
        },
      );

      mocks.objectDetectorCreate.mockResolvedValue(
        {
          close:
            mocks.objectDetectorClose,
          detect: vi.fn(),
        },
      );

      mocks.detectProhibitedObjects.mockImplementation(
        (objects: Array<{
          label: string;
          score: number;
        }>) =>
          objects
            .filter(
              (object) =>
                object.label
                  .toLowerCase() ===
                "cell phone",
            )
            .map(
              (object) => ({
                type: "CELL_PHONE",
                label: object.label,
                score: object.score,
              }),
            ),
      );
    });

    afterEach(() => {
      vi.useRealTimers();
      vi.restoreAllMocks();
    });

    it(
      "starts camera and both detection pipelines",
      async () => {
        const controller =
          new CvProctoringController();

        const video =
          document.createElement(
            "video",
          );

        await controller.start(
          video,
        );

        expect(
          mocks.cameraStart,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          mocks.cameraAttach,
        ).toHaveBeenCalledWith(
          video,
        );

        expect(
          mocks.faceDetectorCreate,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          mocks.objectDetectorCreate,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          mocks.faceLoopStart,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          mocks.objectLoopStart,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          controller.isRunning(),
        ).toBe(true);
      },
    );

    it(
      "does not start twice",
      async () => {
        const controller =
          new CvProctoringController();

        const video =
          document.createElement(
            "video",
          );

        await controller.start(
          video,
        );

        await controller.start(
          video,
        );

        expect(
          mocks.cameraStart,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          mocks.faceDetectorCreate,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          mocks.objectDetectorCreate,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );

    it(
      "stops both detection pipelines",
      async () => {
        const controller =
          new CvProctoringController();

        const video =
          document.createElement(
            "video",
          );

        await controller.start(
          video,
        );

        controller.stop();

        expect(
          mocks.faceLoopStop,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          mocks.objectLoopStop,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          mocks.faceDetectorClose,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          mocks.objectDetectorClose,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          mocks.cameraStop,
        ).toHaveBeenCalledTimes(
          1,
        );

        expect(
          controller.isRunning(),
        ).toBe(false);
      },
    );

    it(
      "passes custom face confidence",
      async () => {
        const controller =
          new CvProctoringController({
            minDetectionConfidence:
              0.7,
          });

        const video =
          document.createElement(
            "video",
          );

        await controller.start(
          video,
        );

        expect(
          mocks.faceDetectorCreate,
        ).toHaveBeenCalledWith({
          minDetectionConfidence:
            0.7,
        });
      },
    );

    it(
      "passes custom object settings",
      async () => {
        const controller =
          new CvProctoringController({
            objectDetectionConfidence:
              0.6,
            maxObjectResults: 3,
          });

        const video =
          document.createElement(
            "video",
          );

        await controller.start(
          video,
        );

        expect(
          mocks.objectDetectorCreate,
        ).toHaveBeenCalledWith({
          minDetectionConfidence:
            0.6,
          maxResults: 3,
        });
      },
    );

    it(
      "reports candidate absent after persistence",
      () => {
        vi.useFakeTimers();

        const onViolation =
          vi.fn();

        const controller =
          new CvProctoringController({
            violationPersistenceMs:
              2000,
            callbacks: {
              onViolation,
            },
          });

        const result: FaceDetectionResult =
          {
            status:
              "NO_FACE",
            faceCount: 0,
            detectedAt:
              "2026-09-06T10:00:00.000Z",
          };

        controller.processDetection(
          result,
        );

        vi.advanceTimersByTime(
          2000,
        );

        controller.processDetection(
          result,
        );

        expect(
          onViolation,
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            type:
              "CANDIDATE_ABSENT",
          }),
        );
      },
    );

    it(
      "does not report violation for one face",
      () => {
        const onViolation =
          vi.fn();

        const controller =
          new CvProctoringController({
            callbacks: {
              onViolation,
            },
          });

        controller.processDetection({
          status:
            "ONE_FACE",
          faceCount: 1,
          detectedAt:
            "2026-09-06T10:00:00.000Z",
        });

        expect(
          onViolation,
        ).not.toHaveBeenCalled();
      },
    );

    it(
      "reports multiple people after persistence",
      () => {
        vi.useFakeTimers();

        const onViolation =
          vi.fn();

        const controller =
          new CvProctoringController({
            violationPersistenceMs:
              2000,
            callbacks: {
              onViolation,
            },
          });

        const result: FaceDetectionResult =
          {
            status:
              "MULTIPLE_FACES",
            faceCount: 2,
            detectedAt:
              "2026-09-06T10:00:00.000Z",
          };

        controller.processDetection(
          result,
        );

        vi.advanceTimersByTime(
          2000,
        );

        controller.processDetection(
          result,
        );

        expect(
          onViolation,
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            type:
              "MULTIPLE_PEOPLE",
          }),
        );
      },
    );

    it(
      "reports prohibited object after persistence",
      () => {
        vi.useFakeTimers();

        const onViolation =
          vi.fn();

        const controller =
          new CvProctoringController({
            violationPersistenceMs:
              2000,
            callbacks: {
              onViolation,
            },
          });

        mocks.detectProhibitedObjects.mockReturnValue(
          [
            {
              type:
                "CELL_PHONE",
              label:
                "cell phone",
              score: 0.91,
            },
          ],
        );

        const result:
          ObjectDetectionResult =
          {
            objects: [
              {
                label:
                  "cell phone",
                score: 0.91,
              },
            ],
            detectedAt:
              "2026-09-06T10:00:00.000Z",
          };

        controller.processObjectDetection(
          result,
        );

        vi.advanceTimersByTime(
          2000,
        );

        controller.processObjectDetection(
          result,
        );

        expect(
          onViolation,
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            type:
              "PROHIBITED_OBJECT",
            metadata:
              expect.objectContaining({
                objectType:
                  "cell phone",
                confidence: 0.91,
              }),
          }),
        );
      },
    );

    it(
      "does not report a phone if it disappears",
      () => {
        vi.useFakeTimers();

        const onViolation =
          vi.fn();

        const controller =
          new CvProctoringController({
            violationPersistenceMs:
              2000,
            callbacks: {
              onViolation,
            },
          });

        mocks.detectProhibitedObjects
          .mockReturnValueOnce([
            {
              type:
                "CELL_PHONE",
              label:
                "cell phone",
              score: 0.9,
            },
          ])
          .mockReturnValueOnce([])
          .mockReturnValueOnce([
            {
              type:
                "CELL_PHONE",
              label:
                "cell phone",
              score: 0.9,
            },
          ]);

        controller.processObjectDetection({
          objects: [
            {
              label:
                "cell phone",
              score: 0.9,
            },
          ],
          detectedAt:
            "2026-09-06T10:00:00.000Z",
        });

        vi.advanceTimersByTime(
          1000,
        );

        controller.processObjectDetection({
          objects: [],
          detectedAt:
            "2026-09-06T10:00:01.000Z",
        });

        vi.advanceTimersByTime(
          1000,
        );

        controller.processObjectDetection({
          objects: [
            {
              label:
                "cell phone",
              score: 0.9,
            },
          ],
          detectedAt:
            "2026-09-06T10:00:02.000Z",
        });

        expect(
          onViolation,
        ).not.toHaveBeenCalled();
      },
    );
  },
);