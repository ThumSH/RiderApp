import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useApp } from '../context/AppContext';

const WelcomeScreen = ({ navigation }) => {
  const { theme } = useApp();

  const styles = StyleSheet.create({
      container: {
          flex: 1,
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: 20,
          backgroundColor: theme.background,
      },
      content: {
          alignItems: 'center',
      },
      logo: {
          width: 250,
          height: 250,
          resizeMode: 'contain',
          marginBottom: 20,
      },
      subtitle: {
          fontSize: 18,
          marginTop: 10,
          textAlign: 'center',
          color: theme.subText,
      },
      button: {
          paddingVertical: 15,
          paddingHorizontal: 100,
          borderRadius: 30,
          width: '100%',
          alignItems: 'center',
          backgroundColor: theme.primary,
      },
      buttonText: {
          color: '#fff',
          fontSize: 18,
          fontWeight: 'bold',
      },
      separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        width: '80%',
      },
      line: {
        flex: 1,
        height: 1,
        backgroundColor: theme.subText,
      },
      separatorText: {
        marginHorizontal: 10,
        color: theme.subText,
      },
      linkButton: {
        marginTop: 20,
      },
      linkText: {
        color: theme.primary,
        fontSize: 16,
      },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.subtitle}>Your journey begins now.</Text>
      </View>
      <View style={{alignItems: 'center', width: '100%'}}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <View style={styles.separatorContainer}>
            <View style={styles.line} />
            <Text style={styles.separatorText}>or</Text>
            <View style={styles.line} />
        </View>
        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.linkText}>create a new account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;