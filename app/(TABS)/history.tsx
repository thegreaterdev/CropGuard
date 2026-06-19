import { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from 'expo-router';
import { loadDetections, deleteDetection, clearDetections, type Detection } from '@/lib/storage';

function ConfirmModal({ visible, icon, title, message, confirmLabel, onCancel, onConfirm }: {
  visible: boolean;
  icon: string;
  title: string;
  message: string;
  confirmLabel: string;
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
            <Ionicons name={icon as any} size={32} color="#dc2626" />
          </View>
          <Text className="text-xl font-bold text-gray-900 text-center mb-2">{title}</Text>
          <Text className="text-sm text-gray-500 text-center mb-8 leading-relaxed">{message}</Text>
          <TouchableOpacity onPress={onConfirm} className="bg-red-500 rounded-2xl py-4 items-center mb-3" activeOpacity={0.85}>
            <Text className="text-white font-bold text-base">{confirmLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancel} className="bg-gray-100 rounded-2xl py-4 items-center" activeOpacity={0.85}>
            <Text className="text-gray-700 font-semibold text-base">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const FILTER_OPTIONS = [
  { label: 'All Results', value: 'all' },
  { label: 'Healthy', value: 'healthy' },
  { label: 'Early Blight', value: 'early blight' },
  { label: 'Late Blight', value: 'late blight' },
];

function formatDate(timestamp: string) {
  const date = new Date(timestamp);
  return {
    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
}

function confidenceColors(pct: number) {
  if (pct >= 80) return { bg: 'bg-green-100', text: 'text-green-700' };
  if (pct >= 60) return { bg: 'bg-amber-100', text: 'text-amber-700' };
  return { bg: 'bg-red-100', text: 'text-red-600' };
}

export default function HistoryScreen() {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);

  const refresh = useCallback(() => {
    loadDetections().then(setDetections);
  }, []);

  useFocusEffect(refresh);

  const handleDelete = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await deleteDetection(deleteId);
    setDeleteId(null);
    refresh();
  };

  const handleClearAll = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setShowClearModal(true);
  };

  const confirmClearAll = async () => {
    await clearDetections();
    setShowClearModal(false);
    refresh();
  };

  const filtered =
    filterType === 'all'
      ? detections
      : detections.filter((d) => d.class.toLowerCase().includes(filterType.toLowerCase()));

  const avgConfidence =
    detections.length > 0
      ? Math.round((detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length) * 100)
      : 0;

  return (
    <SafeAreaView className="flex-1 bg-green-700" edges={['top']}>
      <StatusBar style="light" />

      <ConfirmModal
        visible={!!deleteId}
        icon="trash-outline"
        title="Delete Detection"
        message="Remove this detection from your history? This cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />

      <ConfirmModal
        visible={showClearModal}
        icon="trash-bin-outline"
        title="Clear All History"
        message="This will permanently delete all your detection history. This cannot be undone."
        confirmLabel="Clear All"
        onCancel={() => setShowClearModal(false)}
        onConfirm={confirmClearAll}
      />

      {/* Green header */}
      <View className="bg-green-700 px-4 pt-2 pb-5">
        <View className="flex-row items-center gap-2 mb-1">
          <Ionicons name="time-outline" size={22} color="#fff" />
          <Text className="text-2xl font-bold text-white">History</Text>
        </View>
        <Text className="text-sm text-green-200">Your past detection results</Text>
      </View>

      {/* Gray body */}
      <View className="flex-1 bg-gray-50 rounded-t-3xl -mt-3">
        {detections.length === 0 ? (
          <View className="flex-1 items-center justify-center px-4">
            <View className="bg-gray-100 rounded-2xl p-5 mb-4">
              <Ionicons name="time-outline" size={32} color="#9ca3af" />
            </View>
            <Text className="font-semibold text-gray-700 text-base">No detections yet</Text>
            <Text className="text-sm text-gray-400 text-center mt-1">
              Go to the Detect tab to analyze your first plant image
            </Text>
          </View>
        ) : (
          <ScrollView
            className="flex-1 px-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 20, paddingBottom: 32 }}
          >
            {/* Stats */}
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1 bg-white rounded-2xl p-4 border border-green-100">
                <Text className="text-xs font-medium text-gray-500 mb-1">Total Scans</Text>
                <Text className="text-2xl font-bold text-green-700">{detections.length}</Text>
              </View>
              <View className="flex-1 bg-white rounded-2xl p-4 border border-amber-100">
                <Text className="text-xs font-medium text-gray-500 mb-1">Avg. Confidence</Text>
                <Text className={`text-2xl font-bold ${confidenceColors(avgConfidence).text}`}>
                  {avgConfidence}%
                </Text>
              </View>
            </View>

            {/* Filter tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
              contentContainerStyle={{ gap: 8 }}
            >
              {FILTER_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setFilterType(opt.value);
                  }}
                  className={`px-4 py-2 rounded-full border ${
                    filterType === opt.value
                      ? 'bg-green-700 border-green-700'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      filterType === opt.value ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Detection list */}
            {filtered.length === 0 ? (
              <View className="bg-white rounded-2xl p-6 border border-gray-100 items-center mb-4">
                <Text className="text-sm text-gray-400">No results match your filter</Text>
              </View>
            ) : (
              <View className="gap-3 mb-4">
                {filtered.map((detection) => {
                  const { date, time } = formatDate(detection.timestamp);
                  const confidence = Math.round(detection.confidence * 100);
                  const isHealthy = detection.class.toLowerCase().includes('healthy');
                  const conf = confidenceColors(confidence);

                  return (
                    <View key={detection.id} className="bg-white rounded-2xl border border-gray-100 p-4">
                      <View className="flex-row items-start gap-3">
                        <View className="mt-0.5">
                          <Ionicons
                            name={isHealthy ? 'checkmark-circle' : 'alert-circle'}
                            size={22}
                            color={isHealthy ? '#16a34a' : '#d97706'}
                          />
                        </View>
                        <View className="flex-1">
                          <View className="flex-row items-center gap-2 flex-wrap">
                            <Text className="font-semibold text-gray-800">{detection.class}</Text>
                            <View className={`${conf.bg} px-2 py-0.5 rounded-full`}>
                              <Text className={`text-xs font-semibold ${conf.text}`}>
                                {confidence}%
                              </Text>
                            </View>
                          </View>
                          <Text className="text-xs text-gray-400 mt-1">
                            {date} at {time}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleDelete(detection.id)}
                          className="p-1"
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Ionicons name="trash-outline" size={18} color="#9ca3af" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Clear all */}
            <TouchableOpacity
              onPress={handleClearAll}
              className="mb-6 py-4 rounded-2xl border border-red-200 bg-red-50 items-center"
            >
              <Text className="text-red-600 font-semibold">Clear All History</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
