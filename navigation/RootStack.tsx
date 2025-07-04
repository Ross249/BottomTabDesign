import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from 'screens/Home';
const Stack = createNativeStackNavigator();

export const RootStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};
