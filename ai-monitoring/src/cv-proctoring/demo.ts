import {
  CvProctoringController,
} from "./proctoring-controller.js";

import type {
  CvViolation,
} from "./types.js";

const video =
  document.querySelector<HTMLVideoElement>(
    "#camera",
  );

const statusElement =
  document.querySelector<HTMLElement>(
    "#status",
  );

const faceCountElement =
  document.querySelector<HTMLElement>(
    "#face-count",
  );

const startButton =
  document.querySelector<HTMLButtonElement>(
    "#start",
  );

const stopButton =
  document.querySelector<HTMLButtonElement>(
    "#stop",
  );

const violationsElement =
  document.querySelector<HTMLElement>(
    "#violations",
  );

if (
  !video ||
  !statusElement ||
  !faceCountElement ||
  !startButton ||
  !stopButton ||
  !violationsElement
) {
  throw new Error(
    "Required demo elements are missing",
  );
}

function formatViolationType(
  type: CvViolation["type"],
): string {
  switch (type) {
    case "CANDIDATE_ABSENT":
      return "Candidate absent";

    case "MULTIPLE_PEOPLE":
      return "Multiple people detected";

    case "PROHIBITED_OBJECT":
      return "Prohibited object detected";

    default:
      return type;
  }
}

function addViolation(
  violation: CvViolation,
): void {
  if (!violationsElement) {
    return;
  }

  const emptyMessage =
    violationsElement.querySelector(
      ".empty",
    );

  emptyMessage?.remove();

  const element =
    document.createElement("div");

  element.className =
    "violation";

  const typeElement =
    document.createElement("div");

  typeElement.className =
    "violation-type";

  typeElement.textContent =
    `⚠ ${formatViolationType(
      violation.type,
    )}`;

  const detailsElement =
    document.createElement("div");

  if (
    violation.metadata?.objectType
  ) {
    detailsElement.textContent =
      `Object: ${violation.metadata.objectType}`;
  } else if (
    violation.metadata?.faceCount !==
    undefined
  ) {
    detailsElement.textContent =
      `Faces detected: ${violation.metadata.faceCount}`;
  }

  const timeElement =
    document.createElement("div");

  timeElement.className =
    "violation-time";

  timeElement.textContent =
    new Date(
      violation.occurredAt,
    ).toLocaleTimeString();

  element.appendChild(
    typeElement,
  );

  if (detailsElement.textContent) {
    element.appendChild(
      detailsElement,
    );
  }

  element.appendChild(
    timeElement,
  );

  violationsElement.prepend(
    element,
  );
}

const controller =
  new CvProctoringController({
    detectionIntervalMs: 500,

    minDetectionConfidence: 0.5,

    objectDetectionConfidence: 0.5,

    maxObjectResults: 5,

    violationPersistenceMs: 2000,

    callbacks: {
      onDetection: (result) => {
        statusElement.textContent =
          result.status;

        faceCountElement.textContent =
          `Faces detected: ${result.faceCount}`;
      },

      onViolation: (violation) => {
        console.warn(
          "CV VIOLATION:",
          violation,
        );

        addViolation(
          violation,
        );
      },
    },
  });

startButton.addEventListener(
  "click",
  async () => {
    if (controller.isRunning()) {
      return;
    }

    try {
      statusElement.textContent =
        "STARTING";

      faceCountElement.textContent =
        "Faces detected: 0";

      await controller.start(
        video,
      );

      statusElement.textContent =
        "WAITING_FOR_FACE";
    } catch (error) {
      console.error(
        "Failed to start CV proctoring:",
        error,
      );

      statusElement.textContent =
        "CAMERA_ERROR";

      faceCountElement.textContent =
        "Faces detected: 0";
    }
  },
);

stopButton.addEventListener(
  "click",
  () => {
    controller.stop();

    statusElement.textContent =
      "STOPPED";

    faceCountElement.textContent =
      "Faces detected: 0";
  },
);