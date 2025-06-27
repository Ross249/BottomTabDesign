import { useState } from 'react';
import { Text, View, Button, TextInput, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ErrorBoundary from 'react-native-error-boundary';

import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { ErrorFallback } from 'components/ErrorFallback';
import { errorHandler } from 'utils/errorHandler';
import TabStack from 'navigation/TabStack';

export default function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, stackTrace) => {
        // Enhanced error handling with detailed reporting
        errorHandler.handleBoundaryError(error, { stackTrace });
      }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <TabStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({});
