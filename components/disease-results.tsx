import { View, Text, Image, ScrollView, TouchableOpacity, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import type { DetectionResult } from '@/lib/plant-api';

interface DiseaseResultsProps {
  result: DetectionResult;
  imageUri: string | null;
}

const diseaseDetails: Record<string, {
  name: string;
  severity: 'high' | 'medium' | 'none';
  description: string;
  symptoms: string[];
  treatments: string[];
  prevention: string[];
}> = {
  early_blight: {
    name: 'Early Blight',
    severity: 'medium',
    description: 'Early blight is a fungal disease caused by Alternaria solani.',
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
    name: 'Late Blight',
    severity: 'high',
    description: 'Late blight is caused by Phytophthora infestans and is highly destructive.',
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
    name: 'Healthy',
    severity: 'none',
    description: 'Your potato plant appears to be in good health.',
    symptoms: ['Green, vigorous foliage', 'No visible lesions or discoloration', 'Normal growth pattern'],
    treatments: ['Continue regular care and monitoring'],
    prevention: [
      'Maintain proper watering schedule',
      'Provide adequate sunlight',
      'Monitor for early signs of disease',
      'Keep area free of weeds',
    ],
  },
};

function getSeverityColors(severity: string) {
  switch (severity) {
    case 'high':
      return { bg: 'bg-red-50', iconBg: 'bg-red-100', text: 'text-red-600', cardBorder: 'border-red-200' };
    case 'medium':
      return { bg: 'bg-amber-50', iconBg: 'bg-amber-100', text: 'text-amber-600', cardBorder: 'border-amber-200' };
    default:
      return { bg: 'bg-green-50', iconBg: 'bg-green-100', text: 'text-green-700', cardBorder: 'border-green-200' };
  }
}

function getConfidenceColors(pct: number) {
  if (pct >= 80) return { bar: '#16a34a', label: 'text-green-700', tag: 'High confidence' };
  if (pct >= 60) return { bar: '#d97706', label: 'text-amber-600', tag: 'Moderate confidence' };
  return { bar: '#dc2626', label: 'text-red-600', tag: 'Low confidence' };
}

export default function DiseaseResults({ result, imageUri }: DiseaseResultsProps) {
  const diseaseKey = result.class?.toLowerCase().replace(' ', '_') || 'healthy';
  const details = diseaseDetails[diseaseKey] || diseaseDetails.healthy;
  const confidence = Math.round((result.confidence || 0) * 100);
  const colors = getSeverityColors(details.severity);
  const confColors = getConfidenceColors(confidence);

  const handleShare = async () => {
    Haptics.selectionAsync();
    const treatmentList = details.treatments.map((t, i) => `  ${i + 1}. ${t}`).join('\n');
    const preventionList = details.prevention.map((p) => `  • ${p}`).join('\n');
    const message = [
      `🌿 CropGuard — Detection Report`,
      ``,
      `Result: ${details.name}`,
      `Confidence: ${confidence}% (${confColors.tag})`,
      ``,
      details.severity !== 'none' ? `Treatment Plan:\n${treatmentList}` : `Plant is healthy — no treatment needed.`,
      ``,
      `Prevention:\n${preventionList}`,
      ``,
      `Detected with CropGuard app`,
    ].join('\n');

    try {
      await Share.share({ message });
    } catch {
      Alert.alert('Share failed', 'Could not share the result.');
    }
  };

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="gap-4 pb-6">

        {/* Result Summary */}
        <View className={`rounded-2xl p-4 ${colors.bg} border ${colors.cardBorder}`}>
          <View className="flex-row gap-4 items-center">
            <View className={`rounded-xl p-3 ${colors.iconBg}`}>
              <Ionicons
                name={details.severity === 'none' ? 'checkmark-circle' : 'alert-circle'}
                size={32}
                color={details.severity === 'high' ? '#dc2626' : details.severity === 'medium' ? '#d97706' : '#16a34a'}
              />
            </View>
            <View className="flex-1">
              <Text className={`text-2xl font-bold ${colors.text}`}>{details.name}</Text>
              <Text className="text-sm text-gray-500 mt-1">{details.description}</Text>
            </View>
            {/* Share button */}
            <TouchableOpacity
              onPress={handleShare}
              className="bg-white/70 rounded-xl p-2.5"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="share-outline" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confidence Score */}
        <View className="bg-white rounded-2xl p-4 border border-gray-100">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-semibold text-gray-800">Detection Confidence</Text>
            <View className="flex-row items-center gap-2">
              <Text className={`text-xs font-medium ${confColors.label}`}>{confColors.tag}</Text>
              <Text className={`text-lg font-bold ${confColors.label}`}>{confidence}%</Text>
            </View>
          </View>
          {/* Colored progress bar */}
          <View className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <View
              className="h-2.5 rounded-full"
              style={{ width: `${confidence}%`, backgroundColor: confColors.bar }}
            />
          </View>
        </View>

        {/* Analyzed Image */}
        {imageUri && (
          <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <View className="p-4 pb-2">
              <Text className="text-base font-semibold text-gray-800">Analyzed Image</Text>
            </View>
            <Image
              source={{ uri: imageUri }}
              className="w-full aspect-square"
              resizeMode="cover"
            />
          </View>
        )}

        {/* Symptoms */}
        <View className="bg-white rounded-2xl p-4 border border-gray-100">
          <Text className="text-base font-semibold text-gray-800 mb-1">Symptoms</Text>
          <Text className="text-xs text-gray-400 mb-3">What to look for</Text>
          <View className="gap-2">
            {details.symptoms.map((symptom, idx) => (
              <View key={idx} className="flex-row gap-3 items-start">
                <View className="w-5 h-5 rounded-full bg-green-100 items-center justify-center flex-shrink-0 mt-0.5">
                  <Text className="text-xs font-semibold text-green-700">•</Text>
                </View>
                <Text className="text-sm text-gray-600 flex-1">{symptom}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Treatment Plan */}
        {details.severity !== 'none' && (
          <View className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <View className="flex-row items-center gap-2 mb-1">
              <Ionicons name="water-outline" size={18} color="#d97706" />
              <Text className="text-base font-semibold text-gray-800">Treatment Plan</Text>
            </View>
            <Text className="text-xs text-gray-400 mb-3">Recommended actions</Text>
            <View className="gap-3">
              {details.treatments.map((treatment, idx) => (
                <View key={idx} className="flex-row gap-3 items-start">
                  <View className="w-6 h-6 rounded-full bg-amber-200 items-center justify-center flex-shrink-0">
                    <Text className="text-xs font-semibold text-amber-700">{idx + 1}</Text>
                  </View>
                  <Text className="text-sm text-gray-600 flex-1">{treatment}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Prevention Tips */}
        <View className="bg-white rounded-2xl p-4 border border-gray-100">
          <View className="flex-row items-center gap-2 mb-1">
            <Ionicons name="leaf-outline" size={18} color="#16a34a" />
            <Text className="text-base font-semibold text-gray-800">Prevention Tips</Text>
          </View>
          <Text className="text-xs text-gray-400 mb-3">Protect your plants</Text>
          <View className="gap-2">
            {details.prevention.map((tip, idx) => (
              <View key={idx} className="flex-row gap-3 items-start">
                <View className="w-5 h-5 rounded-full bg-green-100 items-center justify-center flex-shrink-0 mt-0.5">
                  <Text className="text-xs font-semibold text-green-700">✓</Text>
                </View>
                <Text className="text-sm text-gray-600 flex-1">{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Care Guidelines */}
        <View className="bg-white rounded-2xl p-4 border border-gray-100">
          <Text className="text-base font-semibold text-gray-800 mb-3">Plant Care Guidelines</Text>
          <View className="flex-row gap-3">
            <View className="flex-1 flex-row gap-3 items-center rounded-xl border border-gray-100 bg-gray-50 p-3">
              <Ionicons name="sunny-outline" size={20} color="#d97706" />
              <View>
                <Text className="text-sm font-medium text-gray-800">Sunlight</Text>
                <Text className="text-xs text-gray-500">6-8 hours daily</Text>
              </View>
            </View>
            <View className="flex-1 flex-row gap-3 items-center rounded-xl border border-gray-100 bg-gray-50 p-3">
              <Ionicons name="water-outline" size={20} color="#16a34a" />
              <View>
                <Text className="text-sm font-medium text-gray-800">Water</Text>
                <Text className="text-xs text-gray-500">Consistent moisture</Text>
              </View>
            </View>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}
