import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { clearDetections } from '@/lib/storage';

function ConfirmModal({ visible, onCancel, onConfirm }: {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onCancel} />
        <View style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingHorizontal: 24,
          paddingTop: 12,
          paddingBottom: insets.bottom + 16,
        }}>
          <View className="w-10 h-1 bg-gray-200 rounded-full self-center mb-6" />
          <View className="w-16 h-16 rounded-2xl bg-red-100 items-center justify-center self-center mb-4">
            <Ionicons name="trash-bin-outline" size={32} color="#dc2626" />
          </View>
          <Text className="text-xl font-bold text-gray-900 text-center mb-2">Clear All History</Text>
          <Text className="text-sm text-gray-500 text-center mb-8 leading-relaxed">
            This will permanently delete all your detection history from this device. This cannot be undone.
          </Text>
          <TouchableOpacity onPress={onConfirm} className="bg-red-500 rounded-2xl py-4 items-center mb-3" activeOpacity={0.85}>
            <Text className="text-white font-bold text-base">Clear All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancel} className="bg-gray-100 rounded-2xl py-4 items-center" activeOpacity={0.85}>
            <Text className="text-gray-700 font-semibold text-base">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function SettingsRow({ icon, label, value, color = '#374151', onPress }: {
  icon: string;
  label: string;
  value?: string;
  color?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      className="flex-row items-center px-4 py-4 bg-white border-b border-gray-50"
    >
      <View className="w-9 h-9 rounded-xl bg-gray-100 items-center justify-center mr-3">
        <Ionicons name={icon as any} size={18} color={color} />
      </View>
      <Text className="flex-1 text-sm font-medium text-gray-800">{label}</Text>
      {value ? (
        <Text className="text-sm text-gray-400">{value}</Text>
      ) : onPress ? (
        <Ionicons name="chevron-forward" size={16} color="#d1d5db" />
      ) : null}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const [showClearModal, setShowClearModal] = useState(false);

  const handleClearHistory = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setShowClearModal(true);
  };

  const confirmClear = async () => {
    await clearDetections();
    setShowClearModal(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <SafeAreaView className="flex-1 bg-green-700" edges={['top']}>
      <StatusBar style="light" />

      <ConfirmModal
        visible={showClearModal}
        onCancel={() => setShowClearModal(false)}
        onConfirm={confirmClear}
      />

      {/* Header */}
      <View className="px-5 pb-5 pt-2">
        <Text className="text-white text-2xl font-bold">Settings</Text>
        <Text className="text-green-200 text-sm mt-0.5">App preferences & info</Text>
      </View>

      <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>

        {/* App Identity */}
        <View className="mx-4 mt-5 rounded-2xl overflow-hidden bg-white shadow-sm">
          <View className="items-center py-8 px-4">
            <Image
              source={require('../../assets/images/icon.png')}
              style={{ width: 80, height: 80, borderRadius: 20, marginBottom: 16 }}
              resizeMode="contain"
            />
            <Text className="text-xl font-bold text-gray-900">CropGuard</Text>
            <Text className="text-sm text-gray-400 mt-1">AI-Powered Crop Disease Detection</Text>
            <View className="mt-3 px-3 py-1 bg-green-50 rounded-full">
              <Text className="text-xs text-green-700 font-medium">Version 1.0.0</Text>
            </View>
          </View>
        </View>

        {/* Model Info */}
        <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 mt-6 mb-2">
          Detection Model
        </Text>
        <View className="mx-4 rounded-2xl overflow-hidden bg-white shadow-sm">
          <SettingsRow icon="hardware-chip-outline" label="Model Architecture" value="MobileNetV2" />
          <SettingsRow icon="leaf-outline" label="Supported Crops" value="Potato" />
          <SettingsRow
            icon="medical-outline"
            label="Detectable Diseases"
            value="Early Blight, Late Blight"
          />
          <SettingsRow icon="server-outline" label="Inference" value="Cloud (Oracle VM)" />
        </View>

        {/* Data */}
        <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 mt-6 mb-2">
          Data
        </Text>
        <View className="mx-4 rounded-2xl overflow-hidden bg-white shadow-sm">
          <SettingsRow icon="phone-portrait-outline" label="Storage" value="On-device only" />
          <SettingsRow
            icon="trash-bin-outline"
            label="Clear Detection History"
            color="#dc2626"
            onPress={handleClearHistory}
          />
        </View>

        {/* Privacy */}
        <Text className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 mt-6 mb-2">
          Privacy
        </Text>
        <View className="mx-4 rounded-2xl overflow-hidden bg-white shadow-sm">
          <SettingsRow icon="shield-checkmark-outline" label="No account required" color="#15803d" />
          <SettingsRow icon="eye-off-outline" label="No data collected" color="#15803d" />
          <SettingsRow icon="cloud-offline-outline" label="Images not stored on server" color="#15803d" />
        </View>

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
