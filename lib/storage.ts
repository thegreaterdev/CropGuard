import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DetectionResult } from './plant-api';

// ── Detection history (AsyncStorage, per-device) ──────────────────────────────

const DETECTIONS_KEY = 'cropguard-detections';

export interface Detection {
  id: number;
  timestamp: string;
  class: string;
  confidence: number;
}

export async function loadDetections(): Promise<Detection[]> {
  try {
    const raw = await AsyncStorage.getItem(DETECTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveDetection(result: DetectionResult): Promise<void> {
  const detections = await loadDetections();
  detections.unshift({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    class: result.class,
    confidence: result.confidence,
  });
  await AsyncStorage.setItem(DETECTIONS_KEY, JSON.stringify(detections));
}

export async function deleteDetection(id: number): Promise<void> {
  const detections = await loadDetections();
  await AsyncStorage.setItem(
    DETECTIONS_KEY,
    JSON.stringify(detections.filter((d) => d.id !== id))
  );
}

export async function clearDetections(): Promise<void> {
  await AsyncStorage.removeItem(DETECTIONS_KEY);
}

// ── Onboarding (AsyncStorage) ─────────────────────────────────────────────────

const ONBOARDING_KEY = 'onboarding_done';

export async function hasSeenOnboarding(): Promise<boolean> {
  return (await AsyncStorage.getItem(ONBOARDING_KEY)) === 'true';
}

export async function markOnboardingDone(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}
