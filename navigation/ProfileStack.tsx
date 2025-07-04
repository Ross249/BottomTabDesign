import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from 'screens/Profile';
const Stack = createNativeStackNavigator();

export const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="UserInfo" component={ProfileScreen} />
    </Stack.Navigator>
  );
};
