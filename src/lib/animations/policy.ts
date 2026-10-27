export interface SceneCapabilities {
  reducedMotion: boolean;
  width: number;
  saveData: boolean;
  memory?: number;
  cores?: number;
}

export function sceneQuality({ reducedMotion, width, saveData, memory, cores }: SceneCapabilities): "poster" | "balanced" | "high" {
  if (reducedMotion || width < 768 || saveData || (memory !== undefined && memory <= 2) || (cores !== undefined && cores <= 2)) return "poster";
  return width >= 1200 && (memory === undefined || memory >= 8) && (cores === undefined || cores >= 8) ? "high" : "balanced";
}

export function pointerOffset(x: number, y: number, width: number, height: number, limit = 8) {
  const clamp = (value: number) => Math.max(-1, Math.min(1, value));
  return { x: clamp((x / Math.max(1, width) - .5) * 2) * limit, y: clamp((y / Math.max(1, height) - .5) * 2) * limit };
}
