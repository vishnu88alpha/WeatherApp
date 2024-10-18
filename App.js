import React, { useEffect, useState } from 'react';
import { View, TextInput, Alert, StyleSheet, ScrollView, TouchableOpacity, Text, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LoadingScreen from './screens/LoadingScreen';
import WeatherComponent from './screens/WeatherComponent';

const API_KEY = 'e74df13a802a89c55fb6f43789ea78a4';

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location access is required to fetch weather.');
      setLoading(false);
      return;
    }
    getCurrentLocation();
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const { coords } = await Location.getCurrentPositionAsync();
      setLocation(coords);
      fetchWeatherByCoords(coords.latitude, coords.longitude);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Unable to fetch location.');
      console.error('Location Error:', error);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch weather data.');
      console.error('Weather API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Input Required', 'Please enter a city name.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(response.data);
      setSearchQuery('');
    } catch (error) {
      if (error.message.includes('Network Error')) {
        console.log('Handled Error: Network connection issue.');
        Alert.alert('Network Error', 'Please check your internet connection.');
        return;
      }

      if (error.response) {
        const { status } = error.response;

        switch (status) {
          case 401:
            console.log('Handled Error: Invalid API Key.');
            Alert.alert('Unauthorized', 'Invalid API key. Please verify your key.');
            break;
          case 404:
            console.log('Handled Error: City not found.');
            Alert.alert('City Not Found', 'City not found. Please check the spelling.');
            break;
          default:
            console.log(`Handled Error: Unexpected error with status ${status}.`);
            Alert.alert('Error', `Something unexpected happened. Status code: ${status}`);
        }
      } else {
        console.log('Handled Error: Unexpected error occurred.', error.toString());
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#003f5c" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <WeatherComponent weatherData={weatherData} />

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search city..."
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.button} onPress={fetchWeatherByCity}>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.refreshButton} onPress={getCurrentLocation}>
          <Ionicons name="location" size={24} color="#fff" />
          <Text style={styles.refreshButtonText}>Refresh Location</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003f5c',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#465881',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#fb5b5a',
    padding: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#38a169',
    padding: 15,
    borderRadius: 25,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  refreshButtonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '600',
  },
});
