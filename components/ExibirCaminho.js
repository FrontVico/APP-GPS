import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import Parse from 'parse/react-native.js';

const ExibirCaminho = ({ route }) => {
  const [routeData, setRouteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Recebe o ID da rota da tela ListRotas
  const { routeId } = route.params;

  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        const RouteObject = Parse.Object.extend('Rota');
        const query = new Parse.Query(RouteObject);
        const routeObject = await query.get(routeId);

        // Obtém latitude e longitude do banco de dados e converte para um array de objetos
        const latitudes = routeObject.get('latitude') || [];
        const longitudes = routeObject.get('longitude') || [];
        const coordinates = latitudes.map((lat, index) => ({
          latitude: lat,
          longitude: longitudes[index],
        }));

        setRouteData({
          coordinates,
          title: routeObject.get('nome') || 'Unnamed Route',
        });
      } catch (error) {
        alert(`Error fetching route: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRouteData();
  }, [routeId]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2980b9" />
      </View>
    );
  }

  if (!routeData || routeData.coordinates.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No route data available</Text>
      </View>
    );
  }

  const initialRegion = {
    latitude: routeData.coordinates[0].latitude,
    longitude: routeData.coordinates[0].longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // Marcadores apenas para o início e fim da rota
  const startCoordinate = routeData.coordinates[0];
  const endCoordinate = routeData.coordinates[routeData.coordinates.length - 1];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{routeData.title}</Text>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Polyline
          coordinates={routeData.coordinates}
          strokeColor="#2980b9"
          strokeWidth={6}
        />
        <Marker coordinate={startCoordinate} pinColor="red" />
        <Marker coordinate={endCoordinate} pinColor="red" />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#ecf0f1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  map: {
    flex: 1,
    borderRadius: 5,
  },
});

export default ExibirCaminho;
