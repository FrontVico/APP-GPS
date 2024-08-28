import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Home = () => {
  return (
    <View style={styles.container}>
      {/* Imagem de fundo */}
      <Image 
        source={require('../img/Default_faa_um_wallpaper_de_um_aplicativo_de_carros_2.jpg')} 
        style={styles.backgroundImage} 
        resizeMode="cover" 
      />
      
      {/* Camada de sobreposição com gradiente */}
      <View style={styles.overlay} />

      {/* Imagem de logotipo */}
      <Image 
        source={require('../img/Logo.png')} 
        style={styles.logo} 
      />
      
      {/* Texto de boas-vindas */}
      <Text style={styles.text}>Bem-vindo ao Registrador de Rotas!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Sombra escura para contraste
  },
  logo: {
    width: 500,
    height: 500,
    marginBottom: 20,
  },
  text: {
    flex: 0.5,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default Home;
