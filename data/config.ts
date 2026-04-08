export const dashboardConfig = {
  examDate: new Date(2024, 5, 15), // June 15, 2024
  imageSlideDurationMs: 30000, // 30 seconds per image
  tickerSpeed: 'fast' as const, // CSS animation speed
  fullscreenEnabled: true,
  clockUpdateIntervalMs: 1000, // Update clock every second
  youtubeErrorTimeoutMs: 8000, // Fallback timeout for YouTube errors
};
