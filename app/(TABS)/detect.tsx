import { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import DiseaseResults from '@/components/disease-results';
import { analyzePlantImage, type DetectionResult } from '@/lib/plant-api';
import { saveDetection } from '@/lib/storage';

export default function DetectScreen() {
  const insets = useSafeAreaInsets();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const analyze = useCallback(async (uri: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const detectionResult = await analyzePlantImage(uri);
      setResult(detectionResult);
      await saveDetection(detectionResult);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze image. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePickImage = async () => {
    Haptics.selectionAsync();
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photo library.');
      return;
    }
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
      allowsEditing: false,
    });
    if (!picked.canceled && picked.assets[0]) {
      const uri = picked.assets[0].uri;
      setImageUri(uri);
      analyze(uri);
    }
  };

  const handleOpenCamera = async () => {
    Haptics.selectionAsync();
    if (!cameraPermission?.granted) {
      const res = await requestCameraPermission();
      if (!res.granted) {
        Alert.alert('Permission required', 'Please allow camera access to take photos.');
        return;
      }
    }
    setIsCameraActive(true);
    setError(null);
  };

  const handleCapture = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
      if (photo) {
        setIsCameraActive(false);
        setImageUri(photo.uri);
        analyze(photo.uri);
      }
    } catch {
      setError('Failed to capture photo. Please try again.');
    }
  };

  const resetDetection = () => {
    Haptics.selectionAsync();
    setImageUri(null);
    setResult(null);
    setError(null);
    setLoading(false);
    if (isCameraActive) setIsCameraActive(false);
  };

  // ── Camera view ─────────────────────────────────────────────────────────────
  if (isCameraActive) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <StatusBar style="light" />
        {/* CameraView must have no children */}
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing={facing} />

        {/* Top controls — overlaid via absolute positioning, respects status bar */}
        <View style={{
          position: 'absolute', top: insets.top + 8,
          left: 16, right: 16,
          flexDirection: 'row', justifyContent: 'space-between',
        }}>
          <TouchableOpacity
            onPress={() => { Haptics.selectionAsync(); setIsCameraActive(false); }}
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 999, padding: 8 }}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { Haptics.selectionAsync(); setFacing(facing === 'back' ? 'front' : 'back'); }}
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 999, padding: 8 }}
          >
            <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Capture button — above home indicator */}
        <View style={{
          position: 'absolute', bottom: insets.bottom + 32,
          left: 0, right: 0, alignItems: 'center',
        }}>
          <TouchableOpacity
            onPress={handleCapture}
            style={{
              width: 80, height: 80, borderRadius: 40,
              borderWidth: 4, borderColor: '#fff',
              backgroundColor: 'rgba(255,255,255,0.3)',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#fff' }} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Results view ─────────────────────────────────────────────────────────────
  if (result) {
    return (
      <SafeAreaView className="flex-1 bg-green-700" edges={['top']}>
        <StatusBar style="light" />
        {/* Green header */}
        <View className="bg-green-700 px-4 pt-2 pb-5">
          <Text className="text-2xl font-bold text-white">Results</Text>
          <Text className="text-sm text-green-200">Detection analysis complete</Text>
        </View>
        {/* Body */}
        <View className="flex-1 bg-gray-50 rounded-t-3xl -mt-3 px-4 pt-4">
          <DiseaseResults result={result} imageUri={imageUri} />
          <TouchableOpacity
            onPress={resetDetection}
            className="mt-3 mb-4 py-4 rounded-2xl border border-gray-200 bg-white items-center"
          >
            <Text className="text-gray-700 font-semibold">Analyze Another Plant</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Main detect view ─────────────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-green-700" edges={['top']}>
      <StatusBar style="light" />

      {/* Green header */}
      <View className="bg-green-700 px-4 pt-2 pb-5">
        <View className="flex-row items-center gap-2 mb-1">
          <Ionicons name="scan-outline" size={22} color="#fff" />
          <Text className="text-2xl font-bold text-white">Detect</Text>
        </View>
        <Text className="text-sm text-green-200">Analyze your plant for diseases</Text>
      </View>

      {/* Gray body */}
      <View className="flex-1 bg-gray-50 rounded-t-3xl -mt-3">
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 32 }}
        >
          {/* Error banner */}
          {error && (
            <View className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 flex-row gap-3">
              <Ionicons name="alert-circle" size={20} color="#dc2626" style={{ marginTop: 1 }} />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-red-700">Error</Text>
                <Text className="text-sm text-red-600 mt-0.5">{error}</Text>
              </View>
            </View>
          )}

          {/* Try Again button — shown after any error so user isn't stuck */}
          {error && !loading && (
            <TouchableOpacity
              onPress={resetDetection}
              className="mt-1 mb-4 py-4 rounded-2xl border border-gray-200 bg-white items-center flex-row justify-center gap-2"
            >
              <Ionicons name="refresh-outline" size={18} color="#374151" />
              <Text className="text-gray-700 font-semibold">Try Again</Text>
            </TouchableOpacity>
          )}

          {/* Image preview with loading overlay */}
          {imageUri && !isCameraActive && (
            <View className="bg-white rounded-2xl border border-green-100 overflow-hidden mb-4">
              <Image source={{ uri: imageUri }} className="w-full aspect-square" resizeMode="cover" />
              {loading && (
                <View className="absolute inset-0 bg-black/50 items-center justify-center gap-3">
                  <ActivityIndicator size="large" color="#fff" />
                  <Text className="text-white text-sm font-medium">Analyzing with AI model...</Text>
                </View>
              )}
            </View>
          )}

          {/* Upload / camera options */}
          {!imageUri && !loading && (
            <>
              {/* Empty state prompt */}
              <View className="items-center mb-6 pt-2">
                <View className="bg-green-100 rounded-full p-4 mb-3">
                  <Ionicons name="leaf-outline" size={32} color="#15803d" />
                </View>
                <Text className="text-base font-semibold text-gray-800">No plant scanned yet</Text>
                <Text className="text-sm text-gray-400 text-center mt-1">
                  Take a photo or upload an image to get started
                </Text>
              </View>

              {/* Drop zone */}
              <TouchableOpacity
                onPress={handlePickImage}
                className="border-2 border-dashed border-green-300 bg-green-50 rounded-2xl py-12 items-center justify-center mb-4"
              >
                <View className="bg-green-100 rounded-xl p-3 mb-3">
                  <Ionicons name="cloud-upload-outline" size={28} color="#16a34a" />
                </View>
                <Text className="font-semibold text-gray-800">Upload an image</Text>
                <Text className="text-sm text-gray-500 mt-1">Tap to browse your gallery</Text>
              </TouchableOpacity>

              {/* Camera / Upload buttons */}
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={handleOpenCamera}
                  className="flex-1 h-24 bg-white rounded-2xl border border-gray-100 items-center justify-center gap-2"
                >
                  <Ionicons name="camera-outline" size={24} color="#16a34a" />
                  <Text className="text-sm font-semibold text-gray-700">Take Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handlePickImage}
                  className="flex-1 h-24 bg-white rounded-2xl border border-gray-100 items-center justify-center gap-2"
                >
                  <Ionicons name="images-outline" size={24} color="#16a34a" />
                  <Text className="text-sm font-semibold text-gray-700">Upload Image</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
