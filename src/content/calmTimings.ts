// Start time in seconds of each paragraph of a session script, taken from a whisper pass over the audio.
// Regenerate after re-recording a session.
export const TIMINGS: Record<string, number[]> = {
  "au-01": [0, 12.1, 20.5, 30.1, 40.1, 53.1, 61.8, 78.8, 98.0, 101.3, 109.5, 116.2, 131.6],
  "au-02": [0, 9.8, 20.0, 24.5, 40.6, 49.3, 53.6, 60.1, 63.8, 77.6, 90.1, 106.4],
  "au-03": [0, 11.0, 34.6, 57.5, 81.4, 108.7, 116.9],
};
