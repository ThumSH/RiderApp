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
// 1. Import Phone Auth functions
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import CountryPicker from 'react-native-country-picker-modal';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'; // 2. Import Recaptcha
import { auth, db } from '../config/firebaseConfig'; 

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState({ cca2: 'LK', callingCode: ['94'] });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  
  // Ref for Recaptcha
  const recaptchaVerifier = useRef(null);

  const handleSendOtp = async () => {
    const cleanUsername = username.trim();
    const userEnteredPhone = phoneNumber.trim();
    // Clean the phone number by removing any leading zeros, then combine with country code.
    const cleanPhone = userEnteredPhone.replace(/^0+/, '');
    const fullPhoneNumber = `+${country.callingCode[0]}${cleanPhone}`;

    if (cleanUsername.length < 3) {
      Alert.alert('Invalid Username', 'Username must be at least 3 characters long.');
      return;
    }
    if (cleanPhone.length < 9) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number with country code (e.g. +94...)');
      return;
    }

    setLoading(true);
    Keyboard.dismiss();

    try {
      // 1. CHECK UNIQUENESS
      // Check if username is taken
      const usersRef = collection(db, 'users');
      const usernameQuery = query(usersRef, where("username", "==", cleanUsername));
      const usernameSnapshot = await getDocs(usernameQuery);

      if (!usernameSnapshot.empty) {
        Alert.alert('Username Taken', `"${cleanUsername}" is already taken.`);
        setLoading(false);
        return;
      }

      // Check if phone number is already registered
      const phoneQuery = query(usersRef, where("phoneNumber", "==", fullPhoneNumber));
      const phoneSnapshot = await getDocs(phoneQuery);
      if (!phoneSnapshot.empty) {
        Alert.alert('Phone Number Exists', 'This phone number is already registered with another account.');
        setLoading(false);
        return;
      }

      // 2. SEND OTP
      // The phone provider requires the recaptcha ref
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        fullPhoneNumber,
        recaptchaVerifier.current
      );

      setVerificationId(verificationId);
      setLoading(false);

      // 3. NAVIGATE TO OTP SCREEN
      // We pass the verificationId and the user data to the next screen
      // We do NOT save to Firestore yet. We wait until they verify the code.
      navigation.navigate('OtpScreen', {
        verificationId: verificationId,
        username: cleanUsername,
        phoneNumber: fullPhoneNumber
      });

    } catch (error) {
      console.error("SignUp Error:", error);
      Alert.alert('Error', error.message);
      setLoading(false);
    }
  };

  const onSelectCountry = (selectedCountry) => {
    setCountry(selectedCountry);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {/* Recaptcha Modal - Required for Phone Auth */}
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={auth.app.options}
          attemptInvisibleVerification={true} 
        />

        <View style={styles.content}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Enter details to verify your number.</Text>
          
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. SpeedRider99"
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

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

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleSendOtp} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

// ... copy your existing styles ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  countryPickerButton: {
    paddingVertical: 15,
  },
  callingCodeText: {
    fontSize: 16,
    color: '#333',
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
});

export default SignUpScreen;