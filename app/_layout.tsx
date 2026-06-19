import { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import './globals.css';
import { hasSeenOnboarding } from '@/lib/storage';

function SplashScreen() {
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 120 });
    opacity.value = withTiming(1, { duration: 400 });
    textOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: (1 - textOpacity.value) * 12 }],
  }));

  return (
    <View className="flex-1 bg-green-700 items-center justify-center gap-5">
      <StatusBar style="light" />
      <Animated.View style={logoStyle}>
        <Image
          source={require('../assets/images/icon.png')}
          style={{ width: 120, height: 120, borderRadius: 28 }}
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.View style={textStyle} className="items-center gap-1">
        <Text className="text-white text-3xl font-bold">CropGuard</Text>
        <Text className="text-green-200 text-sm">AI Disease Detection</Text>
      </Animated.View>
    </View>
  );
}

export default function RootLayout() {
  const splashOpacity = useSharedValue(1);

  const splashStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
    pointerEvents: splashOpacity.value > 0 ? 'auto' : 'none',
  }));

  useEffect(() => {
    const navigate = (path: string) => {
      splashOpacity.value = withDelay(
        900,
        withTiming(0, { duration: 350 }, () => {
          runOnJS(router.replace)(path as any);
        })
      );
    };

    hasSeenOnboarding().then((seen) => {
      if (!seen) navigate('/onboarding');
      else navigate('/(TABS)');
    });
  }, []);

  return (
    <View className="flex-1">
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(TABS)" />
      </Stack>

      {/* Splash overlay — fades out once route is ready */}
      <Animated.View style={[splashStyle, { position: 'absolute', inset: 0 }]}>
        <SplashScreen />
      </Animated.View>
    </View>
  );
}
