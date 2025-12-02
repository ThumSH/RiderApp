import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Switch, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const NavigationalPanel = ({ isVisible, onClose }) => {
  const { theme, toggleTheme, toggleLanguage, isDarkMode, t, language } = useApp();

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Invisible overlay to close menu when tapping outside */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      {/* The actual menu panel */}
      <View style={[styles.panel, { backgroundColor: theme.card }]}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Option 1: Account */}
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person-outline" size={22} color={theme.text} />
          <Text style={[styles.menuText, { color: theme.text }]}>{t.account}</Text>
        </TouchableOpacity>

        {/* Option 2: Dark Mode */}
        <View style={styles.menuItem}>
          <View style={styles.row}>
            <Ionicons name="moon-outline" size={22} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>{t.darkMode}</Text>
          </View>
          <Switch 
            value={isDarkMode} 
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: theme.primary }}
            thumbColor={"#f4f3f4"}
          />
        </View>

        {/* Option 3: Language */}
        <TouchableOpacity style={styles.menuItem} onPress={toggleLanguage}>
          <View style={styles.row}>
            <Ionicons name="language-outline" size={22} color={theme.text} />
            <Text style={[styles.menuText, { color: theme.text }]}>{t.language}</Text>
          </View>
          <View style={styles.langBadge}>
            <Text style={styles.langText}>{t.switchLang}</Text>
          </View>
        </TouchableOpacity>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: theme.subText }]} />

        {/* Option 4: Log Out */}
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
          <Text style={[styles.menuText, { color: "#FF3B30" }]}>{t.logout}</Text>
        </TouchableOpacity>

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  panel: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 250,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
  },
  divider: {
    height: 0.5,
    opacity: 0.2,
    marginVertical: 10,
  },
  langBadge: {
    backgroundColor: '#eee',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  langText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  }
});

export default NavigationalPanel;