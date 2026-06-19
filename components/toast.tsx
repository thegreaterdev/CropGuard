import { useEffect, useRef, useState } from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ToastType = 'error' | 'success' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onHide: () => void;
}

const CONFIG = {
  error:   { bg: '#1f2937', icon: 'alert-circle',       iconColor: '#f87171', textColor: '#f9fafb' },
  success: { bg: '#14532d', icon: 'checkmark-circle',   iconColor: '#4ade80', textColor: '#f0fdf4' },
  info:    { bg: '#1e3a5f', icon: 'information-circle', iconColor: '#60a5fa', textColor: '#eff6ff' },
} as const;

export function Toast({ message, type = 'error', visible, onHide }: ToastProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const config = CONFIG[type];

  useEffect(() => {
    if (!visible) return;

    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 200 }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: -120, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(() => onHide());
    }, 3500);

    return () => clearTimeout(timer);
  }, [visible, message]);

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: insets.top + 12,
        left: 16,
        right: 16,
        zIndex: 999,
        transform: [{ translateY }],
        opacity,
      }}
    >
      <View
        style={{
          backgroundColor: config.bg,
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 14,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.25,
          shadowRadius: 16,
          elevation: 12,
        }}
      >
        <Ionicons name={config.icon as any} size={22} color={config.iconColor} />
        <Text style={{ flex: 1, color: config.textColor, fontSize: 14, fontWeight: '500', lineHeight: 20 }}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const show = (message: string, type: ToastType = 'error') => {
    setToast({ message, type });
  };

  const hide = () => setToast(null);

  return { toast, show, hide };
}
