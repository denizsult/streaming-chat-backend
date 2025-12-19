export function resolveResumeIndex(params: {
  storedNextIndex: number;
  clientFromIndex: number | null;
  clientLastIndex: number | null;
}) {
  const { storedNextIndex, clientFromIndex, clientLastIndex } = params;

  //*  If client explicitly requests a resume position, honor it within backend bounds
  if (clientFromIndex !== null) {
    return Math.max(0, Math.min(storedNextIndex, clientFromIndex));
  }

  //* If client reports the last received chunk, resume from the next one
  if (clientLastIndex !== null) {
    return Math.max(0, Math.min(storedNextIndex, clientLastIndex + 1));
  }

  //* Otherwise, resume from backend-known progress
  return storedNextIndex;
}

export function parseIndexParam(value: unknown): number | null {
  if (typeof value !== "string") return null;

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}
