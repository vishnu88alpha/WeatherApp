// LoadingScreen.js

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';

// Update the icon path as per your file structure
const iconPath = require('../assets/cloudy.png'); // Ensure this path is correct

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={iconPath} style={styles.icon} resizeMode="contain" />
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f7fa', // Optional: change background color
  },
  icon: {
    width: 100,  // Adjust width as necessary
    height: 100, // Adjust height as necessary
    marginBottom: 20, // Space between icon and activity indicator
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#000',
  },
});

export default LoadingScreen;
