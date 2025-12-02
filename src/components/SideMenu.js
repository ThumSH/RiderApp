import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Dimensions,
  SafeAreaView,
  Pressable,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.80; // The menu will take up 80% of the screen width

const SideMenu = ({ isOpen, animatedValue, onClose }) => {
  const { theme, isDarkMode, toggleTheme, t, toggleLanguage } = useApp();

  const handleLogout = async () => {
    onClose();
    try{
      await  signOut(auth);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }

  };


  // Animate the menu sliding in from the left
  const translateX = animatedValue.interpolate({ // Corrected to slide from the right
    inputRange: [0, 1],
    outputRange: [width, width - MENU_WIDTH],
    extrapolate: 'clamp',
  });

  // Animate the opacity of the background overlay
  const overlayOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5], // from transparent to semi-transparent black
    extrapolate: 'clamp',
  });

  // Only render the menu if it's open or animating
  if (!isOpen && animatedValue._value === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Semi-transparent overlay */}
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      {/* The actual menu that slides in */}
      <Animated.View 
        style={[
          styles.menuContainer, 
          { 
            backgroundColor: theme.card,
            transform: [{ translateX }] 
          }
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.menuHeader}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="arrow-forward" size={30} color={theme.text} />
            </TouchableOpacity>
            <Text style={[styles.menuTitle, { color: theme.text }]}>{t.menu || 'Menu'}</Text>
          </View>
          
          {/* Menu Items */}
          <View style={styles.menuItems}>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="person-circle-outline" size={24} color={theme.text} />
              <Text style={[styles.menuItemText, { color: theme.text }]}>{t.profile || 'Profile'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="list-outline" size={24} color={theme.text} />
              <Text style={[styles.menuItemText, { color: theme.text }]}>{t.rideHistory || 'Ride History'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="card-outline" size={24} color={theme.text} />
              <Text style={[styles.menuItemText, { color: theme.text }]}>{t.payment || 'Payment'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, styles.menuItemToggle]} onPress={toggleTheme} activeOpacity={0.7}>
              <View style={styles.menuItemContent}>
                <Ionicons name="contrast-outline" size={24} color={theme.text} />
                <Text style={[styles.menuItemText, { color: theme.text }]}>{'Appearance'}</Text>
              </View>
              <Switch
                trackColor={{ false: "#767577", true: theme.primary }}
                thumbColor={isDarkMode ? theme.primary : "#f4f3f4"}
                onValueChange={toggleTheme}
                value={isDarkMode}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="help-circle-outline" size={24} color={theme.text} />
              <Text style={[styles.menuItemText, { color: theme.text }]}>{t.help || 'Help'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={44} color={COLORS.danger} />
              <Text style={[styles.menuItemText, { color: COLORS.danger }]}>{t.logout}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    bottom: 50,
    right: 0, // Position menu on the right
    width: MENU_WIDTH,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // for Android shadow
    marginTop: 50, // Lower the menu from the top
    borderTopLeftRadius: 20, // Optional: for a nicer look
    borderBottomLeftRadius: 20, // Optional: for a nicer look
  },
  safeArea: {
    flex: 1,
  },
  menuHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee', // Consider using theme.border color
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 15, // Add space between arrow and title
  },
  menuItems: {
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  menuItemToggle: {
    justifyContent: 'space-between',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 18,
  },
});

export default SideMenu;