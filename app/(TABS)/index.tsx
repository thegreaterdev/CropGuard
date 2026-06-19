import { useCallback, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { loadDetections } from '@/lib/storage';

export default function HomeScreen() {
  const [detectionCount, setDetectionCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadDetections().then((d) => setDetectionCount(d.length));
    }, [])
  );

  return (
    // SafeAreaView is green so the status bar region blends with the header
    <SafeAreaView className="flex-1 bg-green-700" edges={['top']}>
      <StatusBar style="light" />

      {/* Green header block */}
      <View className="bg-green-700 px-4 pt-2 pb-5">
        <View className="flex-row items-center gap-2 mb-1">
          <Text className="text-2xl font-bold text-white">CropGuard</Text>
        </View>
        <Text className="text-sm text-green-200">AI-powered disease detection</Text>
      </View>

      {/* Gray body — rounded top corners overlap header slightly */}
      <View className="flex-1 bg-gray-50 rounded-t-3xl -mt-3">
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 32 }}
        >
          {/* Hero Card */}
          <View className="bg-green-700 rounded-2xl p-5 mb-4">
            <View className="flex-row items-center gap-3 mb-2">
              <Ionicons name="leaf" size={24} color="#fff" />
              <Text className="text-lg font-bold text-white">Welcome to CropGuard</Text>
            </View>
            <Text className="text-green-100 text-sm leading-relaxed">
              Detect potato plant diseases using AI-powered image analysis. Take a photo or upload
              an image to get instant disease detection and treatment recommendations.
            </Text>
          </View>

          {/* Quick Stats */}
          <View className="flex-row gap-3 mb-4">
            <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-100">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="bg-green-100 rounded-lg p-2">
                  <Ionicons name="trending-up" size={18} color="#16a34a" />
                </View>
                <Text className="text-xs font-medium text-gray-500">Detections</Text>
              </View>
              <Text className="text-3xl font-bold text-gray-900">{detectionCount}</Text>
            </View>

            <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-100">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="bg-amber-100 rounded-lg p-2">
                  <Ionicons name="checkmark-circle" size={18} color="#d97706" />
                </View>
                <Text className="text-xs font-medium text-gray-500">Status</Text>
              </View>
              <Text className="text-lg font-bold text-gray-900">Ready</Text>
            </View>
          </View>

          {/* How It Works */}
          <View className="bg-white rounded-2xl p-4 border border-gray-100 mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-1">How It Works</Text>
            <Text className="text-xs text-gray-400 mb-4">3 simple steps to detect disease</Text>

            {[
              {
                step: '1',
                title: 'Capture or Upload',
                desc: 'Take a photo with your camera or upload an existing image of a potato plant leaf.',
              },
              {
                step: '2',
                title: 'AI Analysis',
                desc: 'Our deep learning model analyzes the image to detect diseases and assess plant health.',
              },
              {
                step: '3',
                title: 'Get Recommendations',
                desc: 'Receive detailed disease information and treatment recommendations for your plant.',
              },
            ].map((item) => (
              <View key={item.step} className="flex-row gap-4 mb-4">
                <View className="w-10 h-10 rounded-xl bg-green-700 items-center justify-center flex-shrink-0">
                  <Text className="text-white font-bold text-base">{item.step}</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">{item.title}</Text>
                  <Text className="text-sm text-gray-500 mt-0.5 leading-relaxed">{item.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Common Diseases */}
          <View className="bg-white rounded-2xl p-4 border border-gray-100">
            <Text className="text-lg font-semibold text-gray-800 mb-1">Common Potato Diseases</Text>
            <Text className="text-xs text-gray-400 mb-4">What we can detect</Text>

            <View className="gap-2">
              <View className="flex-row gap-3 items-start rounded-xl border border-green-100 bg-green-50 p-3">
                <Ionicons name="alert-circle" size={20} color="#16a34a" style={{ marginTop: 1 }} />
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-800">Early Blight</Text>
                  <Text className="text-xs text-gray-500">
                    Brown spots with concentric rings on lower leaves
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-3 items-start rounded-xl border border-red-100 bg-red-50 p-3">
                <Ionicons name="alert-circle" size={20} color="#dc2626" style={{ marginTop: 1 }} />
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-800">Late Blight</Text>
                  <Text className="text-xs text-gray-500">
                    Water-soaked lesions that spread rapidly in wet conditions
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-3 items-start rounded-xl border border-green-100 bg-green-50 p-3">
                <Ionicons name="checkmark-circle" size={20} color="#16a34a" style={{ marginTop: 1 }} />
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-800">Healthy</Text>
                  <Text className="text-xs text-gray-500">
                    No disease detected - plant is in good condition
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
