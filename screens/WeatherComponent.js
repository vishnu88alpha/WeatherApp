// WeatherComponent.js

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const WeatherComponent = ({ weatherData }) => {
  if (!weatherData) {
    return null; // Don't render anything if there's no weather data
  }

  return (
    <View style={styles.weatherContainer}>
      <Text style={styles.location}>
        {weatherData.name}, {weatherData.sys.country}
      </Text>
      <Text style={styles.temperature}>{weatherData.main.temp}°C</Text>
      <Text style={styles.description}>
        {weatherData.weather[0].description}
      </Text>

      <Image
        style={styles.icon}
        source={{
          uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  weatherContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  location: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "white",
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 10,
    color: "white",
  },
  description: {
    fontSize: 18,
    textTransform: 'capitalize',
    color: "white",
  },
  icon: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});

export default WeatherComponent;
