import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. IMPORT WEB SDK FUNCTIONS
import { onAuthStateChanged } from 'firebase/auth'; 

// 2. IMPORT YOUR AUTH INSTANCE
import { auth, db } from '../config/firebaseConfig'; 
import { doc, getDoc } from 'firebase/firestore';

import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import SignUpScreen from '../screens/SignUpScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import OtpScreen from '../screens/OTPScreen';
import { useApp } from '../context/AppContext';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { theme, setUserData } = useApp(); // Get setUserData from context
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 3. LISTEN TO THE CORRECT AUTH INSTANCE
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user); // Set the raw auth user

      if (user) {
        // User is signed in, fetch their data from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          console.log("User data fetched and set in context:", userDoc.data());
          setUserData(userDoc.data()); // Set Firestore data in context
        }
      } else {
        // User is signed out, clear the data
        setUserData(null);
      }

      if (initializing) { setInitializing(false); }
    });

    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // IF LOGGED IN: Show Home
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="MapScreen" component={MapScreen} />
          </>
        ) : (
          // IF LOGGED OUT: Show Welcome
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="OtpScreen" component={OtpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;