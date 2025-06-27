import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { useErrorHandler } from 'hooks/useErrorHandler';

export const ErrorHandlingDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { reportError, handleAsyncError, safeExecute } = useErrorHandler();

  // Example 1: Manual error reporting
  const handleManualError = () => {
    try {
      // Simulate an error
      throw new Error('This is a manually reported error');
    } catch (error) {
      if (error instanceof Error) {
        reportError(error, 'Manual Error Demo', {
          userId: 'demo-user',
          action: 'button-click',
          timestamp: Date.now(),
        });
        Alert.alert('Error Reported', 'Check console for error details');
      }
    }
  };

  // Example 2: Async error handling
  const handleAsyncOperation = async () => {
    setIsLoading(true);

    const result = await handleAsyncError(async () => {
      // Simulate async operation that might fail
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (Math.random() > 0.5) {
        throw new Error('Random async error occurred');
      }

      return 'Success! Operation completed';
    }, 'Async Demo Operation');

    setIsLoading(false);

    if (result) {
      Alert.alert('Success', result);
    } else {
      Alert.alert('Operation Failed', 'An error occurred and was reported');
    }
  };

  // Example 3: Safe execution with fallback
  const handleSafeOperation = () => {
    const result = safeExecute(
      () => {
        // Simulate operation that might throw
        if (Math.random() > 0.5) {
          throw new Error('Safe execution error');
        }
        return 'Operation completed successfully';
      },
      'Operation failed, using fallback', // fallback value
      'Safe Execute Demo'
    );

    Alert.alert('Result', result);
  };

  // Example 4: Trigger error boundary
  const triggerErrorBoundary = () => {
    // This will crash the component and trigger the error boundary
    throw new Error('This error will trigger the error boundary fallback UI');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Error Handling Demo</Text>
      <Text style={styles.subtitle}>
        This component demonstrates various error handling patterns
      </Text>

      <View style={styles.buttonGroup}>
        <Button title="1. Report Error Manually" onPress={handleManualError} color="#2196F3" />

        <Button
          title={isLoading ? '2. Processing...' : '2. Async Error Handling'}
          onPress={handleAsyncOperation}
          disabled={isLoading}
          color="#4CAF50"
        />

        <Button
          title="3. Safe Execute with Fallback"
          onPress={handleSafeOperation}
          color="#FF9800"
        />

        <Button title="4. Trigger Error Boundary" onPress={triggerErrorBoundary} color="#F44336" />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          • Button 1: Reports errors manually with context{'\n'}• Button 2: Handles async errors
          gracefully{'\n'}• Button 3: Safe execution with fallback values{'\n'}• Button 4: Triggers
          error boundary fallback UI
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  buttonGroup: {
    gap: 12,
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
});
