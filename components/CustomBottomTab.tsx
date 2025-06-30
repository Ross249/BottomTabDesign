import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const CustomBottomTab: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  // Calculate dynamic width for tabs to fill the container
  const containerPadding = 32; // 16px on each side
  const totalTabs = state.routes.length;
  const tabMargins = 4 * totalTabs; // 2px margin on each side per tab
  const availableWidth = width - 60 - containerPadding - tabMargins; // Account for margins
  const baseTabWidth = availableWidth / totalTabs;

  const getTabWidth = (index: number) => {
    return baseTabWidth; // All tabs have equal width now
  };

  // Create animated width values for each tab at the top level
  const tabWidth0 = useSharedValue(44);
  const tabWidth1 = useSharedValue(44);
  const tabWidth2 = useSharedValue(44);
  const tabWidths = [tabWidth0, tabWidth1, tabWidth2];

  // Update animated widths when active tab changes
  React.useEffect(() => {
    state.routes.forEach((_, index) => {
      if (tabWidths[index]) {
        const isActive = state.index === index;
        const targetWidth = isActive ? getTabWidth(index) : 44;

        tabWidths[index].value = withSpring(targetWidth, {
          damping: 20,
          stiffness: 200,
        });
      }
    });
  }, [state.index]);

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
              style={[
                styles.tab,
                {
                  width: tabWidths[index] ? tabWidths[index] : 44, // Use animated width
                  height: 44, // Fixed height for perfect circles
                  backgroundColor: isFocused ? '#000000' : 'transparent', // Black background for active
                  borderWidth: isFocused ? 0 : 1.5,
                  borderColor: isFocused ? 'transparent' : '#cccccc',
                  borderRadius: 22, // Always circular/pill shape
                  marginHorizontal: 2,
                },
              ]}
              activeOpacity={0.7}>
              <View
                style={[
                  styles.tabContent,
                  {
                    paddingHorizontal: isFocused ? 8 : 0,
                    paddingVertical: isFocused ? 0 : 0,
                  },
                ]}>
                <Animated.View key={`${route.key}-${isFocused}`} entering={FadeIn.duration(200)}>
                  <Ionicons
                    name={getTabIcon(route.name) as any}
                    size={20}
                    color={isFocused ? '#ffffff' : '#cccccc'}
                  />
                </Animated.View>
                {isFocused && (
                  <Animated.Text
                    style={[styles.tabLabel]}
                    entering={FadeIn.delay(150).duration(200)}
                    exiting={FadeOut.duration(150)}>
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
    backgroundColor: 'transparent',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
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
    color: '#ffffff',
    textAlign: 'center',
  },
});
