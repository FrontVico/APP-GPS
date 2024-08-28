import 'react-native-get-random-values';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons';
import Parse from 'parse/react-native.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Home from './components/Home';
import CriarCaminho from './components/CriarCaminho';
import ListRotas from './components/ListRotas';
import ExibirCaminho from './components/ExibirCaminho'; // Importando ExibirCaminho

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize('tlm51YBrghbq3XKr2rUXGpJCrIlkJzcmyKr1s314', 'xtTYxvTeJbrQwJysCuc3JSAX6CT0fCVLLgzzxINc');
Parse.serverURL = 'https://parseapi.back4app.com/';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 60,
          borderTopWidth: 0,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
        },
        tabBarIconStyle: {
          marginBottom: 5,
        },
        tabBarActiveTintColor: '#00008B',
        tabBarInactiveTintColor: '#B0B0B0',
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'CriarCaminho') {
            iconName = 'car';
          } else if (route.name === 'ListRotas') {
            iconName = 'bars';
          }

          return <AntDesign name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Home} 
        options={{ 
          tabBarLabel: 'Início',
        }} 
      />
      <Tab.Screen 
        name="CriarCaminho" 
        component={CriarCaminho} 
        options={{ 
          tabBarLabel: 'Caminho',
        }} 
      />
      <Tab.Screen 
        name="ListRotas" 
        component={ListRotas} 
        options={{ 
          tabBarLabel: 'Rotas',
        }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Tabs"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Tabs" component={MyTabs} />
        <Stack.Screen name="ExibirCaminho" component={ExibirCaminho} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
