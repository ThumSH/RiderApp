import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import CountryPicker from 'react-native-country-picker-modal';
import { collection, query , where , getDocs, doc, getDoc } from 'firebase/firestore';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { auth, db } from '../config/firebaseConfig'; 

const LoginScreen = ({ navigation }) => {
  const [country, setCountry] = useState({ cca2: 'LK', callingCode: ['94'] });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const recaptchaVerifier = useRef(null);

  const handleSendOtp = async () => {
    const userEnteredPhone = phoneNumber.trim();
    
    // --- FIX: Remove the leading '0' so it matches the format in the database ---
    const cleanPhone = userEnteredPhone.replace(/^0+/, ''); 
    const fullPhoneNumber = `+${country.callingCode[0]}${cleanPhone}`;
    // --------------------------------------------------------------------------

    if (cleanPhone.length < 9) { // Check length of clean number
      Alert.alert('Invalid Phone', 'Please enter a valid phone number with country code (e.g. +94...).');
      return;
    }

    setLoading(true);
    Keyboard.dismiss();

    try {
      // 1. Check if user with this phone number exists
      const usersRef = collection(db, 'users');
      // Now this searches for +9477... instead of +94077...
      const q = query(usersRef, where("phoneNumber", "==", fullPhoneNumber));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert('User Not Found', 'This phone number is not registered. Please sign up first.');
        setLoading(false);
        return;
      }

      // 2. If user exists, send OTP
      const phoneProvider = new PhoneAuthProvider(auth);
      const verId = await phoneProvider.verifyPhoneNumber(
        fullPhoneNumber,
        recaptchaVerifier.current
      );
      setVerificationId(verId);
      Alert.alert('OTP Sent', 'A verification code has been sent to your phone.');
    } catch (error) {
      console.error("Login OTP Error:", error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (verificationCode.length < 6) {
      Alert.alert('Invalid Code', 'Please enter the 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      // This signs the user in, and the AppNavigator will handle the rest
      await signInWithCredential(auth, credential);
    } catch (error) {
      console.error("Login Verification Error:", error);
      Alert.alert('Verification Failed', 'The code you entered is invalid.');
      setLoading(false);
    }
    // No need to set loading to false on success, as the screen will unmount
  };

  const onSelectCountry = (selectedCountry) => {
    setCountry(selectedCountry);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={auth.app.options}
          attemptInvisibleVerification={true}
        />

        <View style={styles.content}>
          <Text style={styles.title}>Welcome Back</Text>
          
          {!verificationId ? (
            <>
              <Text style={styles.subtitle}>Enter your phone number to log in.</Text>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.phoneInputContainer}>
                <CountryPicker
                  countryCode={country.cca2}
                  withFilter
                  withFlag
                  withCallingCode
                  withAlphaFilter
                  onSelect={onSelectCountry}
                  containerButtonStyle={styles.countryPickerButton}
                />
                <Text style={styles.callingCodeText}>+{country.callingCode[0]}</Text>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="77 123 4567"
                  placeholderTextColor="#aaa"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                />
              </View>
              <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Send OTP</Text>}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.subtitle}>Enter the code sent to +{country.callingCode[0]}{phoneNumber}</Text>
              <Text style={styles.label}>Verification Code</Text>
              <TextInput
                style={styles.input}
                placeholder="123456"
                placeholderTextColor="#aaa"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
              />
              <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Verify & Log In</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.linkButton} onPress={() => setVerificationId(null)}>
                <Text style={styles.linkText}>Use a different number</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.linkButton} onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF', // A nice light blue theme
    padding: 20,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    color: '#1A2C50', // Dark blue text
  },
  subtitle: {
    fontSize: 16,
    color: '#5A678A', // Softer blue-gray text
    textAlign: 'left',
    marginBottom: 40,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#C9D6F0',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#FFF',
    color: '#1A2C50',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C9D6F0',
    borderRadius: 12,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  countryPickerButton: {
    paddingVertical: 15,
  },
  callingCodeText: {
    fontSize: 16,
    color: '#1A2C50',
    marginLeft: 5,
    marginRight: 5,
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#0062CC', // Slightly darker blue for links
    fontSize: 16,
  }
});

export default LoginScreen;
