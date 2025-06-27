import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateFlowScreen from 'screens/CreateFlow';
const Stack = createNativeStackNavigator();

export const CreateFlowStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="CreateFlow" component={CreateFlowScreen} />
    </Stack.Navigator>
  );
};
