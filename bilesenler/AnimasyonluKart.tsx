import React from 'react';
import { ViewStyle } from 'react-native';
import Animated, { FadeInDown, FadeInRight, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface AnimasyonluKartProps {
  children: React.ReactNode;
  index?: number;
  style?: ViewStyle | ViewStyle[];
  animasyonTuru?: 'fadeDown' | 'fadeRight' | 'scale';
  gecikme?: number;
}

export const AnimasyonluKart: React.FC<AnimasyonluKartProps> = ({
  children,
  index = 0,
  style,
  animasyonTuru = 'fadeDown',
  gecikme,
}) => {
  const hesaplananGecikme = gecikme ?? index * 80;

  const girisAnimasyonu =
    animasyonTuru === 'fadeRight'
      ? FadeInRight.delay(hesaplananGecikme).springify().damping(18)
      : FadeInDown.delay(hesaplananGecikme).springify().damping(18);

  return (
    <Animated.View entering={girisAnimasyonu} style={style}>
      {children}
    </Animated.View>
  );
};

// Dokunma animasyonlu sarmalayıcı
interface BasilabilirAnimasyonProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export const BasilabilirAnimasyon: React.FC<BasilabilirAnimasyonProps> = ({ children, style }) => {
  const olcek = useSharedValue(1);

  const animasyonluStil = useAnimatedStyle(() => ({
    transform: [{ scale: olcek.value }],
  }));

  return (
    <Animated.View
      style={[animasyonluStil, style]}
      onTouchStart={() => {
        olcek.value = withSpring(0.96, { damping: 15, stiffness: 300 });
      }}
      onTouchEnd={() => {
        olcek.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
      onTouchCancel={() => {
        olcek.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
    >
      {children}
    </Animated.View>
  );
};
