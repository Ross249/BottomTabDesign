import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const CreateFlowScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Create Flow</Text>
    </View>
  );
};

export default CreateFlowScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 36,
  },
});
