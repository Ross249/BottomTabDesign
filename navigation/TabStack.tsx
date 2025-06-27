import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStack } from './RootStack';
import { ProfileStack } from './ProfileStack';
import { CreateFlowStack } from './CreateStack';

const Tab = createBottomTabNavigator();

const TabStack = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={RootStack} />
      <Tab.Screen name="CreateFlow" component={CreateFlowStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default TabStack;

const styles = StyleSheet.create({});
