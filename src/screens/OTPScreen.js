import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  SafeAreaView, 
  ActivityIndicator, 
  Keyboard
} from 'react-native';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

const OtpScreen = ({ route, navigation }) => {
  // Extract data passed from SignUpScreen
  const { verificationId: initialVerificationId, username, phoneNumber } = route.params;

  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState(initialVerificationId);
  const [loading, setLoading] = useState(false);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds
  const [canResend, setCanResend] = useState(false);

  // Recaptcha for Resending
  const recaptchaVerifier = useRef(null);

  // 1. COUNTDOWN TIMER LOGIC
  useEffect(() => {
    let interval = null;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      setCanResend(true);
      if(interval) clearInterval(interval);
    }
    return () => {
      if(interval) clearInterval(interval);
    };
  }, [timeLeft]);

  // 2. VERIFY CODE & CREATE USER
  const handleVerify = async () => {
    if (verificationCode.length < 6) {
      Alert.alert('Error', 'Please enter a 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      const credential = PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      
      // This signs the user in
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      console.log("Phone verified! Saving to Firestore...");

      // NOW we save the user to Firestore using the confirmed Auth UID
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        username: username,
        phoneNumber: phoneNumber,
        role: 'rider',
        createdAt: serverTimestamp(),
      });

      // Navigation is handled automatically by AppNavigator listening to onAuthStateChanged
    } catch (error) {
      console.error("Verification Error:", error);
      Alert.alert('Verification Failed', 'Invalid code or error occurred.');
      setLoading(false);
    }
  };

  // 3. RESEND CODE
  const handleResend = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const newVerificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      );
      
      setVerificationId(newVerificationId);
      Alert.alert('Sent', 'A new code has been sent.');
      
      // Reset Timer
      setTimeLeft(60);
      setCanResend(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={auth.app.options}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>Verify Phone</Text>
        <Text style={styles.subtitle}>
          Code sent to {phoneNumber}
        </Text>

        <TextInput
          style={styles.otpInput}
          placeholder="123456"
          placeholderTextColor="#ccc"
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Verify & Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Timer / Resend Section */}
        <View style={styles.resendContainer}>
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendLink}>Resend Code</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>
              Resend code in {timeLeft}s
            </Text>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  otpInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 12,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
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
  resendContainer: {
    marginTop: 20,
  },
  timerText: {
    color: '#999',
    fontSize: 14,
  },
  resendLink: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default OtpScreen;