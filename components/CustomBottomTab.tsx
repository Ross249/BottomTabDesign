import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
  Circle,
  Ellipse,
  Rect,
} from 'react-native-svg';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Glowing Background Component
const GlowingBackground = () => {
  const size = 60;
  const glowSize = 80;

  return (
    <View style={styles.glowContainer}>
      <Svg width={glowSize} height={glowSize} style={{ ...styles.glowSvg, zIndex: 42 }}>
        <Defs>
          <LinearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#000000" stopOpacity={0.1} />
            <Stop offset="10%" stopColor="rgba(69, 85, 108, 0.48)" stopOpacity={0.8} />
            <Stop offset="20%" stopColor="rgb(153, 161, 175)" stopOpacity={1} />
            <Stop offset="50%" stopColor="rgb(209, 213, 220)" stopOpacity={1} />
            <Stop offset="80%" stopColor="rgb(153, 161, 175)" stopOpacity={1} />
            <Stop offset="90%" stopColor="rgba(69, 85, 108, 0.48)" stopOpacity={0.8} />
            <Stop offset="100%" stopColor="#000000" stopOpacity={0.1} />
          </LinearGradient>
        </Defs>
        {/* Linear gradient line */}
        <Rect x={glowSize / 6} y={-1} width={glowSize / 1.5} height={3} fill="url(#lineGradient)" />
      </Svg>
      <Svg width={glowSize} height={glowSize} style={styles.glowSvg}>
        <Defs>
          <RadialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="10%" stopColor="#f3f4f666" stopOpacity={1} />
            <Stop offset="20%" stopColor="rgb(209, 213, 220)" stopOpacity={1} />
            <Stop offset="100%" stopColor="#000000" stopOpacity={1} />
          </RadialGradient>
        </Defs>
        {/* Outer glow */}
        <Ellipse
          cx={glowSize / 2}
          cy={glowSize / 5}
          rx={glowSize / 2.5}
          ry={glowSize / 2}
          fill="url(#glowGradient)"
        />
        {/* Inner bright core */}
        <Ellipse
          cx={glowSize / 2}
          cy={glowSize / 4}
          rx={size}
          ry={size / 2}
          fill="#000000"
          fillOpacity={0.1}
        />
      </Svg>
    </View>
  );
};

const CustomBottomTab: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  // Create animation values for each tab (assuming max 3 tabs)
  const tabScale0 = useSharedValue(state.index === 0 ? 1.1 : 1);
  const tabScale1 = useSharedValue(state.index === 1 ? 1.1 : 1);
  const tabScale2 = useSharedValue(state.index === 2 ? 1.1 : 1);
  const tabScales = [tabScale0, tabScale1, tabScale2];

  // Create translation Y values for moving tabs up when active
  const tabTranslateY0 = useSharedValue(state.index === 0 ? -4 : 0);
  const tabTranslateY1 = useSharedValue(state.index === 1 ? -4 : 0);
  const tabTranslateY2 = useSharedValue(state.index === 2 ? -4 : 0);
  const tabTranslateYs = [tabTranslateY0, tabTranslateY1, tabTranslateY2];

  // Update animations when active tab changes
  React.useEffect(() => {
    tabScales.forEach((scale, index) => {
      const isActive = state.index === index;
      scale.value = withSpring(isActive ? 1.1 : 1, {
        damping: 15,
        stiffness: 200,
      });
    });

    tabTranslateYs.forEach((translateY, index) => {
      const isActive = state.index === index;
      translateY.value = withSpring(isActive ? -4 : 0, {
        damping: 15,
        stiffness: 200,
      });
    });
  }, [state.index]);

  // Create animated styles at component level
  const animatedTab0Style = useAnimatedStyle(() => ({
    transform: [{ scale: tabScale0.value }, { translateY: tabTranslateY0.value }],
  }));
  const animatedTab1Style = useAnimatedStyle(() => ({
    transform: [{ scale: tabScale1.value }, { translateY: tabTranslateY1.value }],
  }));
  const animatedTab2Style = useAnimatedStyle(() => ({
    transform: [{ scale: tabScale2.value }, { translateY: tabTranslateY2.value }],
  }));
  const animatedTabStyles = [animatedTab0Style, animatedTab1Style, animatedTab2Style];

  const getTabIcon = (routeName: string, isFocused: boolean) => {
    let iconName: keyof typeof Ionicons.glyphMap;

    switch (routeName) {
      case 'Index':
        iconName = isFocused ? 'home' : 'home-outline';
        break;
      case 'CreateFlow':
        iconName = isFocused ? 'add-circle' : 'add-circle-outline';
        break;
      case 'Profile':
        iconName = isFocused ? 'person' : 'person-outline';
        break;
      default:
        iconName = isFocused ? 'home' : 'home-outline';
    }

    return iconName;
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
      <View style={styles.tabContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            // Quick press animation (separate from active state animation)
            if (tabScales[index]) {
              const currentScale = tabScales[index].value;
              tabScales[index].value = withSpring(currentScale * 0.9, { duration: 80 }, () => {
                tabScales[index].value = withSpring(isFocused ? 1.1 : 1, { duration: 120 });
              });
            }

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <AnimatedTouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={`tab-${route.name}`}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[styles.tab, animatedTabStyles[index]]}
              activeOpacity={0.7}>
              {isFocused && (
                <Animated.View
                  style={styles.glowingBackgroundContainer}
                  entering={FadeIn.duration(300).springify()}
                  exiting={FadeOut.duration(200)}>
                  <GlowingBackground />
                </Animated.View>
              )}
              <View style={styles.tabContent}>
                <Ionicons
                  name={getTabIcon(route.name, isFocused)}
                  size={24}
                  color={isFocused ? '#ffffff' : '#888888'}
                />
                {isFocused && (
                  <Animated.View
                    style={styles.indicator}
                    entering={FadeIn.duration(200).springify()}
                    exiting={FadeOut.duration(150)}
                  />
                )}
              </View>
            </AnimatedTouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CustomBottomTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#333333',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
    zIndex: 50,
  },
  glowingBackgroundContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -40,
    marginLeft: -40,
    zIndex: 0,
  },
  glowContainer: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 40,
    // backgroundColor: 'red',
  },
  glowSvg: {
    position: 'absolute',
    top: 18,
    zIndex: 40,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    zIndex: 1,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
    marginTop: 2,
  },
});
