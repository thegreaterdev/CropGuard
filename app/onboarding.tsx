import { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  Extrapolation,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { IllustrationScan, IllustrationAI, IllustrationResult } from '@/components/illustrations';
import { markOnboardingDone } from '@/lib/storage';

const { width } = Dimensions.get('window');

// Background colours for each slide — subtle shift
const BG_COLORS = ['#ffffff', '#f0fdf4', '#f7fef9'];

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  Illustration: React.ComponentType<{ size?: number }>;
}

const SLIDES: Slide[] = [
  {
    id: '1',
    title: 'Scan Your Plants',
    subtitle:
      'Simply point your camera at any potato plant leaf. Our app instantly captures and prepares your image for analysis.',
    Illustration: IllustrationScan,
  },
  {
    id: '2',
    title: 'AI-Powered Analysis',
    subtitle:
      'Our deep learning model analyses the image with high accuracy to identify Early Blight, Late Blight, or a healthy plant.',
    Illustration: IllustrationAI,
  },
  {
    id: '3',
    title: 'Get Instant Results',
    subtitle:
      'Receive a detailed report with disease description, confidence score, treatment steps, and prevention tips.',
    Illustration: IllustrationResult,
  },
];

// ── Animated slide item ───────────────────────────────────────────────────────
function SlideItem({
  slide,
  index,
  scrollX,
}: {
  slide: Slide;
  index: number;
  scrollX: Animated.SharedValue<number>;
}) {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const illustrationStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollX.value, inputRange, [0.75, 1, 0.75], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP);
    const translateY = interpolate(scrollX.value, inputRange, [40, 0, 40], Extrapolation.CLAMP);
    return { transform: [{ scale }, { translateY }], opacity };
  });

  const textStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP);
    const translateY = interpolate(scrollX.value, inputRange, [30, 0, -20], Extrapolation.CLAMP);
    return { opacity, transform: [{ translateY }] };
  });

  const subtitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(scrollX.value, inputRange, [50, 0, -20], Extrapolation.CLAMP);
    return { opacity, transform: [{ translateY }] };
  });

  return (
    <View style={{ width }} className="flex-1 items-center justify-center px-8">
      <Animated.View style={illustrationStyle} className="mb-10">
        <slide.Illustration size={260} />
      </Animated.View>

      <Animated.Text
        style={textStyle}
        className="text-3xl font-bold text-gray-900 text-center mb-4 leading-tight"
      >
        {slide.title}
      </Animated.Text>

      <Animated.Text
        style={subtitleStyle}
        className="text-base text-gray-500 text-center leading-relaxed"
      >
        {slide.subtitle}
      </Animated.Text>
    </View>
  );
}

// ── Animated dot ──────────────────────────────────────────────────────────────
function Dot({ index, scrollX }: { index: number; scrollX: Animated.SharedValue<number> }) {
  const widthStyle = useAnimatedStyle(() => {
    const dotWidth = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [8, 28, 8],
      Extrapolation.CLAMP,
    );
    const bg = interpolateColor(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      ['#d1fae5', '#15803d', '#d1fae5'],
    );
    return { width: dotWidth, backgroundColor: bg };
  });

  return (
    <Animated.View style={[{ height: 8, borderRadius: 4 }, widthStyle]} />
  );
}

// ── Animated background ───────────────────────────────────────────────────────
function AnimatedBackground({ scrollX }: { scrollX: Animated.SharedValue<number> }) {
  const bgStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      scrollX.value,
      [0, width, width * 2],
      BG_COLORS,
    );
    return { backgroundColor: bg };
  });

  return <Animated.View style={[StyleSheet.absoluteFill, bgStyle]} />;
}

// ── Animated button ───────────────────────────────────────────────────────────
function AnimatedButton({
  onPress,
  label,
}: {
  onPress: () => void;
  label: string;
}) {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.95, { damping: 15 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
        className="bg-green-700 rounded-2xl py-4 items-center"
        activeOpacity={1}
      >
        <Text className="text-white font-bold text-base">{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useSharedValue(0);
  const isLast = activeIndex === SLIDES.length - 1;

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const handleMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / width);
      setActiveIndex(index);
    },
    [],
  );

  const handleNext = () => {
    if (isLast) {
      handleFinish();
    } else {
      scrollRef.current?.scrollTo({ x: (activeIndex + 1) * width, animated: true });
    }
  };

  const handleFinish = async () => {
    await markOnboardingDone();
    router.replace('/(TABS)');
  };

  return (
    <SafeAreaView className="flex-1">
      <StatusBar style="dark" />
      <AnimatedBackground scrollX={scrollX} />

      {/* Skip */}
      <View className="flex-row justify-end px-6 pt-2" style={{ height: 44 }}>
        {!isLast && (
          <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)}>
            <TouchableOpacity onPress={handleFinish} className="py-2 px-4">
              <Text className="text-gray-400 font-medium text-base">Skip</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      {/* Slides */}
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        onMomentumScrollEnd={handleMomentumEnd}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {SLIDES.map((slide, index) => (
          <SlideItem key={slide.id} slide={slide} index={index} scrollX={scrollX} />
        ))}
      </Animated.ScrollView>

      {/* Bottom */}
      <View className="px-6 pb-8" style={{ gap: 24 }}>
        {/* Dots */}
        <View className="flex-row justify-center" style={{ gap: 8 }}>
          {SLIDES.map((_, i) => (
            <Dot key={i} index={i} scrollX={scrollX} />
          ))}
        </View>

        {/* Button */}
        <AnimatedButton onPress={handleNext} label={isLast ? 'Get Started' : 'Next'} />

        {/* Sign in link — only on last slide */}
        <View style={{ height: 24, alignItems: 'center', justifyContent: 'center' }}>
          {isLast && (
            <Animated.View entering={FadeIn.delay(100).duration(400)}>
              <Text className="text-gray-500 text-sm">
                Already have an account?{' '}
                <Text
                  className="text-green-700 font-semibold"
                  onPress={handleFinish}
                >
                  Sign In
                </Text>
              </Text>
            </Animated.View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
