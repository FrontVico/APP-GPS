import 'react-native-get-random-values';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Parse from 'parse/react-native.js';

Parse.initialize('tlm51YBrghbq3XKr2rUXGpJCrIlkJzcmyKr1s314', 'xtTYxvTeJbrQwJysCuc3JSAX6CT0fCVLLgzzxINc');
Parse.serverURL = 'https://parseapi.back4app.com/';

const CaminhoTracker = () => {
  const [trackingActive, setTrackingActive] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeTitle, setRouteTitle] = useState('');
  const [mapSettings, setMapSettings] = useState({
    latitude: 47.55052,
    longitude: -65.633308,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const locationWatcher = useRef(null);

  useEffect(() => {
    return () => locationWatcher.current?.remove();
  }, []);

  const initiateTracking = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Location permission denied');
      return;
    }

    setTrackingActive(true);
    locationWatcher.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      ({ coords: { latitude, longitude } }) => {
        const newLocation = { latitude, longitude };
        setRouteCoordinates((prevCoords) => [...prevCoords, newLocation]);
        setMapSettings((prevSettings) => ({ ...prevSettings, latitude, longitude }));
        console.log('Captured location:', newLocation);
      }
    );
  };

  const haltTracking = async () => {
    locationWatcher.current?.remove();
    setTrackingActive(false);

    const routeData = new Parse.Object('Rota');
    routeData.set('latitude', routeCoordinates.map(({ latitude }) => latitude));
    routeData.set('longitude', routeCoordinates.map(({ longitude }) => longitude));
    routeData.set('nome', routeTitle);
    routeData.set('data', new Date());

    try {
      await routeData.save();
      alert('Rota salva com sucesso, bb!');
      resetTracking();
    } catch (error) {
      alert(`Eita, não salvou, irmão! ${error.message}`);
      console.error('Error saving route:', error);
    }
  };

  const resetTracking = () => {
    setRouteCoordinates([]);
    setRouteTitle('');
  };

  // Marcadores apenas para o início e fim da rota
  const startCoordinate = routeCoordinates[0];
  const endCoordinate = routeCoordinates[routeCoordinates.length - 1];

  return (
    <View style={styles.wrapper}>
      <Text style={styles.header}>Rotas!</Text>
      
      <TextInput
        style={styles.textInput}
        placeholder="fale sua rota, parceiro!"
        value={routeTitle}
        onChangeText={setRouteTitle}
        placeholderTextColor="#00008B"
      />

      <MapView style={styles.map} region={mapSettings}>
        <Polyline coordinates={routeCoordinates} strokeColor="#2980b9" strokeWidth={6} />
        {routeCoordinates.length > 0 && (
          <>
            <Marker coordinate={startCoordinate} pinColor="red" />
            <Marker coordinate={endCoordinate} pinColor="red" />
          </>
        )}
      </MapView>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: trackingActive ? '#e74c3c' : '#27ae60' }]}
        onPress={trackingActive ? haltTracking : initiateTracking}
      >
        <Text style={styles.buttonText}>{trackingActive ? 'Pare a rota' : 'Comece seu trajeto!'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 15,
    backgroundColor: '#4682B4',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 15,
    textAlign: 'center',
  },
  textInput: {
    height: 45,
    borderColor: '#95a5a6',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
  },
  map: {
    flex: 1,
    borderRadius: 5,
    marginBottom: 15,
    width: "100%",
    height: 200, // Ajustado para garantir visibilidade
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default CaminhoTracker;
