import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  FadeInRight,
  FadeOutLeft,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const CustomBottomTab: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const tabWidth = (width - 60) / state.routes.length; // 60 for padding
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    // Account for the container's left padding (10px) to center the indicator
    const indicatorPosition = 10 + state.index * tabWidth;
    translateX.value = withSpring(indicatorPosition, {
      damping: 20,
      stiffness: 200,
    });
  }, [state.index, tabWidth]);

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const getTabIcon = (routeName: string) => {
    switch (routeName) {
      case 'Index':
        return 'home';
      case 'CreateFlow':
        return 'add';
      case 'Profile':
        return 'person';
      default:
        return 'home';
    }
  };

  const getTabLabel = (routeName: string) => {
    switch (routeName) {
      case 'Index':
        return 'Home';
      case 'CreateFlow':
        return 'Create';
      case 'Profile':
        return 'Profile';
      default:
        return routeName;
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabContainer}>
        {/* Animated background indicator */}
        <Animated.View
          style={[styles.activeIndicator, { width: tabWidth }, animatedIndicatorStyle]}
        />

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
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
              style={[styles.tab, { width: tabWidth }]}
              activeOpacity={0.7}>
              <View style={styles.tabContent}>
                <Ionicons
                  name={getTabIcon(route.name) as any}
                  size={22}
                  color={isFocused ? '#000000' : '#ffffff'}
                />
                {isFocused && (
                  <Animated.Text
                    style={[styles.tabLabel, { color: isFocused ? '#000000' : '#ffffff' }]}
                    entering={FadeInRight.duration(200)}
                    exiting={FadeOutLeft.duration(150)}>
                    {getTabLabel(route.name)}
                  </Animated.Text>
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
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 10,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  activeIndicator: {
    position: 'absolute',
    top: 8,
    bottom: 8,
    left: 0,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    zIndex: 1,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    zIndex: 2,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
