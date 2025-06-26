import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, TextInput, StyleSheet } from 'react-native';
import { useAuthStore } from './components/authStore';

import './global.css';

export default function App() {
  const { token, setToken, clearToken } = useAuthStore();
  const [tokenInput, setTokenInput] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zustand Auth Token Example</Text>
      <Text>Current Token:</Text>
      <Text style={styles.token}>{token || 'No token set'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a new token"
        value={tokenInput}
        onChangeText={setTokenInput}
      />
      <Button title="Set Token" onPress={() => setToken(tokenInput)} />
      <View style={styles.separator} />
      <Button title="Clear Token" onPress={clearToken} color="red" />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  token: {
    marginBottom: 20,
    fontFamily: 'monospace',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '80%',
  },
  separator: {
    marginVertical: 10,
  },
});
