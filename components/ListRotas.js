import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Parse from 'parse/react-native.js';

Parse.initialize('tlm51YBrghbq3XKr2rUXGpJCrIlkJzcmyKr1s314', 'xtTYxvTeJbrQwJysCuc3JSAX6CT0fCVLLgzzxINc');
Parse.serverURL = 'https://parseapi.back4app.com/';

const RouteList = ({ navigation }) => {
  const [routeData, setRouteData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRoutes = useCallback(async () => {
    setIsLoading(true);
    try {
      const RouteObject = Parse.Object.extend('Rota');
      const query = new Parse.Query(RouteObject);
      const routes = await query.find();
      setRouteData(routes);
    } catch (error) {
      alert(`Error fetching routes: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const refreshRoutes = useCallback(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const deleteRoute = async (routeId) => {
    const RouteObject = new Parse.Object('Rota');
    RouteObject.set('objectId', routeId);

    try {
      await RouteObject.destroy();
      alert('Route successfully deleted!');
      fetchRoutes();
    } catch (error) {
      alert(`Failed to delete route: ${error.message}`);
    }
  };

  const confirmDeleteRoute = (routeId) => {
    Alert.alert(
      'Delete Route',
      'Are you sure you want to delete this route?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteRoute(routeId) },
      ],
      { cancelable: true }
    );
  };

  const viewRoute = (routeId) => {
    navigation.navigate('ExibirCaminho', { routeId });
  };

  const renderRouteItem = ({ item }) => {
    const routeName = item.get('nome') || 'Unnamed Route';
    const coordinates = item.get('latitude','longitude') || [];
    const dateCreated = item.get('data') ? new Date(item.get('data')) : new Date();

    return (
      <View style={styles.routeItem}>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemText}>Route ID: {item.id}</Text>
          <Text style={styles.itemText}>Name: {routeName}</Text>
          <Text style={styles.itemText}>Points: {coordinates.length}</Text>
          <Text style={styles.itemText}>Date & Time: {dateCreated.toLocaleString()}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.viewButton} onPress={() => viewRoute(item.id)}>
            <Text style={styles.buttonText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDeleteRoute(item.id)}>
            <Icon name="delete" size={20} color="#fff" style={styles.deleteIcon} />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.header}>Saved Routes</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#2980b9" />
      ) : (
        <FlatList
          data={routeData}
          renderItem={renderRouteItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refreshRoutes} />
          }
          ListEmptyComponent={<Text style={styles.emptyText}>No routes available.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#ecf0f1',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  routeItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#bdc3c7',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 5,
  },
  viewButton: {
    backgroundColor: '#2980b9',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
  },
  deleteIcon: {
    marginRight: 5,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RouteList;
