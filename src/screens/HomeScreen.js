import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  SafeAreaView, 
  TouchableOpacity, 
  Platform, 
  ScrollView, 
  Animated 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { COLORS } from '../constants/colors';
import QuickActionCard from '../components/QuickActionCard';
import SideMenu from '../components/SideMenu';
import { useApp } from '../context/AppContext';

const HomeScreen = ({navigation}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current; 
  const { theme, t, isDarkMode, userData } = useApp(); // <-- Get userData from context


  useEffect(() => {
    console.log('Menu state:',isMenuOpen);
    console.log('Animation value:', slideAnim);
    Animated.timing(slideAnim, {
      toValue: isMenuOpen ? 1 : 0,
      duration: 300, 
      useNativeDriver: true,
    }).start();
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return(
    <View style={styles.rootContainer}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

      {/* Main Content Wrapper */}
      <View style={{ flex: 1 }}>
        {/* Header Section */}
        <View style={[styles.headerSection, { backgroundColor: theme.header }]}>
          <View style={styles.headerLeft}>
            <View style={[styles.logoContainer, { backgroundColor: theme.card }]}>
              <Image
                source={isDarkMode
                ? require('../../assets/logoW1.png')
                : require('../../assets/logo.png')
                }
                style={styles.logo}
                resizeMode="cover"
              />
            </View>
            <View style={styles.greetingContainer}>
              <Text style={[styles.greetingText, { color: theme.subText }]}>{t.welcome}</Text>
              <Text style={[styles.userName, { color: theme.text }]}>{userData?.username || t.rider}</Text>
            </View>
          </View>

          {/* MENU BUTTON (Hamburger) */}
          <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
            <Ionicons name="menu" size={32} color={theme.text} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Action Section */}
          <View style={styles.mainActionSection}>
            <TouchableOpacity
              style={[styles.mainActionButton, { backgroundColor: theme.card }]}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('MapScreen')}
            >
              <View style={styles.mainActionContent}>
                <Ionicons name="navigate-circle" size={32} color={theme.primary} />
                <View style={styles.mainActionTextContainer}>
                  <Text style={[styles.mainActionTitle, { color: theme.text }]}>{t.book}</Text>
                  <Text style={[styles.mainActionSubtitle, { color: theme.subText }]}>{t.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={theme.subText} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.todaySummary}</Text>
            <View style={styles.statsContainer}>
              {/* Rides */}
              <View style={[styles.sideStatCard, { backgroundColor: theme.card }]}>
                <Ionicons name="car-sport-outline" size={28} color={theme.primary} />
                <Text style={[styles.sideStatNumber, { color: theme.text }]}>12</Text>
                <Text style={[styles.sideStatLabel, { color: theme.subText }]}>{t.rides}</Text>
              </View>
              {/* Earnings */}
              <View style={styles.mainStatCard}>
                <Text style={styles.mainStatLabel}>{t.earnings}</Text>
                <Text style={styles.mainStatNumber}>2,450</Text>
              </View>
              {/* Rating */}
              <View style={[styles.sideStatCard, { backgroundColor: theme.card }]}>
                <Ionicons name="star-outline" size={28} color={COLORS.warning} />
                <Text style={[styles.sideStatNumber, { color: theme.text }]}>4.8</Text>
                <Text style={[styles.sideStatLabel, { color: theme.subText }]}>{t.rating}</Text>
              </View>
            </View>
          </View>

          {/* Promo Banner */}
          <View style={styles.promoSection}>
            <View style={styles.promoCard}>
              <View style={styles.promoContent}>
                <Text style={styles.promoTitle}>{t.promoTitle}</Text>
                <Text style={styles.promoDescription}>{t.promoDesc}</Text>
              </View>
              <View style={styles.promoIcon}>
                <Ionicons name="gift" size={32} color={COLORS.white} />
              </View>
            </View>
          </View>

          {/* Quick Actions Grid */}
          <View style={styles.quickActionsSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.quickActions}</Text>
            <View style={styles.gridContainer}>
              <QuickActionCard 
                 title={t.quickActions === "කෙටි සේවා" ? "කුරියර්" : "Courier"} 
                 description={t.quickActions === "කෙටි සේවා" ? "බෙදාහැරීම්" : "Delivery"} 
                 color={theme.primary} 
                 icon={<MaterialCommunityIcons name="package-variant-closed" size={36} color={theme.primary} />} 
                 onPress={() => {}}
              />
               <QuickActionCard 
                 title={t.quickActions === "කෙටි සේවා" ? "පසුම්බිය" : "Wallet"} 
                 description={t.earnings} 
                 color={COLORS.success} 
                 icon={<Ionicons name="wallet-outline" size={36} color={COLORS.success} />} 
                 onPress={() => {}}
              />
               <QuickActionCard 
                 title={t.quickActions === "කෙටි සේවා" ? "ඉතිහාසය" : "History"} 
                 description={t.rides} 
                 color={COLORS.warning} 
                 icon={<Ionicons name="time-outline" size={36} color={COLORS.warning} />} 
                 onPress={() => {}}
              />
               <QuickActionCard 
                 title={t.quickActions === "කෙටි සේවා" ? "හදිසි" : "Emergency"} 
                 description="Help" 
                 color={COLORS.danger} 
                 icon={<Ionicons name="alert-circle-outline" size={36} color={COLORS.danger} />} 
                 onPress={() => {}}
              />
            </View>
          </View>
          
        </ScrollView>
      </View>
      </SafeAreaView>
      
      {/* Sliding Side Menu (Rendered on top with absolute positioning) */}
      <View 
        style={styles.sideMenuContainer}
        // This allows touch events to pass through when the menu is closed
        pointerEvents={isMenuOpen ? 'auto' : 'none'}
      >
        <SideMenu 
          isOpen={isMenuOpen} 
          animatedValue={slideAnim} 
          onClose={() => setIsMenuOpen(false)} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 20,
  },
  
  // Header Section
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: Platform.OS === 'android' ? 50 : 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 80, 
    height: 60,
    borderRadius: 30,
    alignItems: 'center', 
    justifyContent: 'center', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    width: 100, 
    height: 50, 
  },
  greetingContainer: {
    marginLeft: 30,
    alignItems: 'flex-start', 
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 14,
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 8,
  },

  // Main Action Section
  mainActionSection: {
    paddingHorizontal: 20,
    marginBottom:30
  },
  mainActionButton: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderLeftWidth: 6,
    borderLeftColor: COLORS.primary,
  },
  mainActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainActionTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  mainActionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mainActionSubtitle: {
    fontSize: 16,
  },

  // Quick Actions Section
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // Stats Section
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sideStatCard: {
    width: '28%',
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sideStatNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 6,
  },
  sideStatLabel: {
    fontSize: 13,
  },
  mainStatCard: {
    width: '40%',
    aspectRatio: 0.9,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  mainStatLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  mainStatNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 4,
  },

  // Promo Section
  promoSection: {
    paddingHorizontal: 16,
    marginBottom: 34,
  },
  promoCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  promoDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  promoIcon: {
    marginLeft: 16,
  },

  // Side Menu Container
  sideMenuContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10, // Ensure it's on top
  },
});

export default HomeScreen;