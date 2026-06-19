export interface DetectionResult {
  class: string;
  confidence: number;
  description: string;
}

export const diseaseDatabase = {
  early_blight: {
    scientificName: 'Alternaria solani',
    severity: 'medium',
    symptoms: [
      'Brown circular spots with concentric rings (target-like pattern)',
      'Spots appear first on lower leaves',
      'Yellow halo around infected areas',
      'Spots can reach 1 cm in diameter',
      'Affected leaves eventually yellow and drop',
    ],
    treatments: [
      'Remove affected lower leaves',
      'Apply copper or chlorothalonil fungicide',
      'Ensure good air circulation',
      'Avoid overhead watering',
      'Space plants properly',
    ],
    prevention: [
      'Use disease-resistant varieties',
      'Rotate crops',
      'Remove dead plant material',
      'Monitor plant health regularly',
      'Reduce humidity in growing area',
    ],
  },
  late_blight: {
    scientificName: 'Phytophthora infestans',
    severity: 'high',
    symptoms: [
      'Water-soaked lesions on leaves and stems',
      'Lesions start at leaf tips and margins',
      'White fungal growth on leaf undersides',
      'Rapid spread in cool, wet conditions',
      'Can destroy entire plants in days',
    ],
    treatments: [
      'Apply systemic fungicides immediately',
      'Remove affected plant parts',
      'Destroy infected plant material',
      'Apply protective fungicides',
      'Consider removing entire plant if heavily infected',
    ],
    prevention: [
      'Plant resistant varieties',
      'Use disease-free seed potatoes',
      'Maintain proper spacing',
      'Avoid excess moisture',
      'Monitor weather for favorable conditions',
    ],
  },
  healthy: {
    scientificName: 'Solanum tuberosum (Healthy)',
    severity: 'none',
    symptoms: [
      'Green, vigorous foliage',
      'No visible lesions or discoloration',
      'Normal growth pattern',
    ],
    treatments: ['Continue regular care and monitoring'],
    prevention: [
      'Maintain proper watering schedule',
      'Provide adequate sunlight',
      'Monitor for early signs of disease',
      'Keep area free of weeds',
    ],
  },
};

// localhost works for Expo web. For physical device/Expo Go, use your Mac's LAN IP.
export const API_BASE_URL = 'http://145.241.252.245/seno';

export async function analyzePlantImage(uri: string): Promise<DetectionResult> {
  const formData = new FormData();

  if (uri.startsWith('blob:') || uri.startsWith('data:')) {
    const res = await fetch(uri);
    const blob = await res.blob();
    formData.append('file', blob, 'plant.jpg');
  } else {
    formData.append('file', { uri, name: 'plant.jpg', type: 'image/jpeg' } as unknown as Blob);
  }

  const apiResponse = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!apiResponse.ok) {
    const errorData = await apiResponse.json().catch(() => ({}));
    throw new Error(errorData.error || `API error (${apiResponse.status})`);
  }

  const data = await apiResponse.json();

  if (!data.success) {
    if (data.error === 'not_a_plant') {
      throw new Error(data.message || 'No potato leaf detected. Please take a clear photo of a potato plant leaf.');
    }
    throw new Error(data.error || 'Prediction failed');
  }

  return {
    class: data.disease,
    confidence: data.confidence / 100,
    description: generateDescription(data.disease, data.confidence, data.probabilities),
  };
}

function generateDescription(
  disease: string,
  confidence: number,
  probabilities?: Record<string, number>
): string {
  const confidenceLevel =
    confidence >= 80 ? 'high confidence' : confidence >= 60 ? 'moderate confidence' : 'low confidence';

  if (disease.toLowerCase().includes('early blight')) {
    return `Detected Early Blight with ${confidenceLevel} (${confidence}% confidence). Look for brown circular spots with concentric rings on lower leaves.`;
  } else if (disease.toLowerCase().includes('late blight')) {
    return `Detected Late Blight with ${confidenceLevel} (${confidence}% confidence). Watch for water-soaked lesions and rapid spread in wet conditions.`;
  } else if (disease.toLowerCase().includes('healthy')) {
    return `Plant appears Healthy with ${confidenceLevel} (${confidence}% confidence). Continue regular monitoring.`;
  }
  return `Analysis complete: ${disease} detected with ${confidence}% confidence.`;
}

export function getDiseaseDetails(detectedClass: string) {
  const key = detectedClass.toLowerCase().replace(' ', '_') as keyof typeof diseaseDatabase;

  if (diseaseDatabase[key]) return diseaseDatabase[key];

  if (detectedClass.toLowerCase().includes('early')) return diseaseDatabase.early_blight;
  if (detectedClass.toLowerCase().includes('late')) return diseaseDatabase.late_blight;
  if (detectedClass.toLowerCase().includes('health')) return diseaseDatabase.healthy;

  return null;
}

export async function testApiConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return data.status === 'healthy';
  } catch {
    return false;
  }
}
