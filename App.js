// App.js
import { AuthProvider, AuthContext } from './AuthProvider'; // ✅ NEW
import { useContext } from 'react'; // ✅ NEW
import RegisterScreen from './RegisterScreen';
import LoginScreen from './LoginScreen'; // at top
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, Image, ActivityIndicator, FlatList
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Animated as RNAnimated } from 'react-native'; // for popup
import { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Animatable from 'react-native-animatable';



const Stack = createNativeStackNavigator();
const screenWidth = Dimensions.get('window').width;

const translations = {
  en: {
    title: '🚨 Raksha+',
    tagline: 'Every Second Matters. Help is One Tap Away.',
    services: {
      ambulance: 'Ambulance',
      fire: 'Fire Brigade',
      police: 'Police',
    },
    confirmation: 'Help is on the way. Stay calm and safe!',
    status: {
      searching: 'Searching nearby...',
      assigned: {
        ambulance: 'Ambulance Assigned!',
        fire: 'Fire Service Assigned!',
        police: 'Police Help Assigned!',
      },
      arriving: 'Arriving in',
    },
    tips: {
      ambulance: [
        '🩹 Apply pressure to stop bleeding.',
        '💨 Ensure the patient is breathing.',
        '🧍‍♀️ Lay patient flat and elevate legs.',
        '📞 Keep calm and talk to the patient.',
      ],
      fire: [
        '🚪 Stay low and close doors behind you.',
        '🚿 Cover nose with wet cloth.',
        '🚷 Avoid using lifts.',
        '📞 Call fire emergency and move to open space.',
      ],
      police: [
        '🔒 Lock yourself in a safe room.',
        '📞 Call nearest police station.',
        '🗣️ Stay calm and speak clearly.',
        '🧍 Don’t argue or panic. Help is coming.',
      ],
    },
    speak: {
      ambulance: 'Ambulance assigned. Please stay calm.',
      fire: 'Fire Brigade is coming. Stay alert.',
      police: 'Police help is on the way. Stay strong.',
    },
  },

  hi: {
    title: '🚨 रक्षा+',
    tagline: 'हर सेकंड कीमती है। मदद एक टैप दूर है।',
    services: {
      ambulance: 'एम्बुलेंस',
      fire: 'फायर ब्रिगेड',
      police: 'पुलिस',
    },
    confirmation: 'सहायता रास्ते में है। शांत रहें और सुरक्षित रहें!',
    status: {
      searching: 'नज़दीकी सेवाएँ खोजी जा रही हैं...',
      assigned: {
        ambulance: 'एम्बुलेंस आ रही है!',
        fire: 'फायर ब्रिगेड आ रही है!',
        police: 'पुलिस मदद आ रही है!',
      },
      arriving: 'पहुंचने में शेष समय',
    },
    tips: {
      ambulance: [
        '🩹 रक्तस्राव रोकने के लिए दबाव डालें।',
        '💨 सुनिश्चित करें कि रोगी साँस ले रहा है।',
        '🧍‍♀️ रोगी को लेटाएं और पैर ऊपर उठाएं।',
        '📞 शांत रहें और रोगी से बात करें।',
      ],
      fire: [
        '🚪 झुककर चलें और दरवाजे बंद करें।',
        '🚿 गीले कपड़े से नाक ढकें।',
        '🚷 लिफ्ट का उपयोग न करें।',
        '📞 फायर ब्रिगेड को कॉल करें और बाहर निकलें।',
      ],
      police: [
        '🔒 खुद को सुरक्षित कमरे में बंद करें।',
        '📞 नज़दीकी पुलिस स्टेशन को कॉल करें।',
        '🗣️ शांत रहें और स्पष्ट बोलें।',
        '🧍 घबराएँ नहीं, मदद आ रही है।',
      ],
    },
    speak: {
      ambulance: 'एम्बुलेंस आ रही है। कृपया शांत रहें।',
      fire: 'फायर ब्रिगेड आ रही है। सतर्क रहें।',
      police: 'पुलिस मदद रास्ते में है। मजबूत बनें।',
    },
  },

  te: {
    title: '🚨 రక్ష+',
    tagline: 'ప్రతి క్షణం ముఖ్యం. సహాయం ఒక్క ట్యాప్‌ దూరంలో.',
    services: {
      ambulance: 'ఆంబులెన్స్',
      fire: 'ఫైర్ బ్రిగేడ్',
      police: 'పోలీసు',
    },
    confirmation: 'సహాయం రోడ్డులో ఉంది. శాంతిగా ఉండండి!',
    status: {
      searching: 'సమీప సేవలను వెతుకుతోంది...',
      assigned: {
        ambulance: 'ఆంబులెన్స్ వచ్చేస్తోంది!',
        fire: 'ఫైర్ బ్రిగేడ్ వచ్చేస్తోంది!',
        police: 'పోలీసు సహాయం వస్తోంది!',
      },
      arriving: 'వచ్చేలోపు మిగిలిన సమయం',
    },
    tips: {
      ambulance: [
        '🩹 రక్తం ఆగిపోయేలా ఒత్తిడి ఇవ్వండి.',
        '💨 బాధితుడు శ్వాస తీసుకుంటున్నాడో లేదో చూడండి.',
        '🧍‍♀️ బాధితుడిని ఫ్లాట్‌గా పెట్టి కాళ్లు ఎత్తండి.',
        '📞 శాంతంగా ఉండి మాట్లాడండి.',
      ],
      fire: [
        '🚪 తక్కువగా వంగి నడవండి, తలుపులు మూసేయండి.',
        '🚿 తడి గుడ్డతో ముక్కును కప్పండి.',
        '🚷 లిఫ్ట్ వాడకండి.',
        '📞 ఫైర్ సర్వీసుకు కాల్ చేసి బయటికి రండి.',
      ],
      police: [
        '🔒 మీరు సురక్షితమైన గదిలోకి వెళ్లండి.',
        '📞 పోలీసులను కాల్ చేయండి.',
        '🗣️ శాంతంగా స్పష్టంగా మాట్లాడండి.',
        '🧍 భయపడకండి. సహాయం వస్తోంది.',
      ],
    },
    speak: {
      ambulance: 'ఆంబులెన్స్ వస్తోంది. దయచేసి శాంతంగా ఉండండి.',
      fire: 'ఫైర్ బ్రిగేడ్ వస్తోంది. జాగ్రత్తగా ఉండండి.',
      police: 'పోలీసు సహాయం వస్తోంది. ధైర్యంగా ఉండండి.',
    },
  },
};


function HomeScreen({ navigation }) {
  const [address, setAddress] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [language, setLanguage] = useState('en');
  const t = translations[language];
  const { logout } = useContext(AuthContext); // <-- Add this line

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let loc = await Location.getCurrentPositionAsync({});
      setUserLocation(loc.coords);

      const addr = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (addr.length > 0) {
        const place = addr[0];
        const full = [
          place.district || place.subregion || place.name || '',
          place.street || '', place.city || '',
          place.region || '', place.country || ''
        ].filter(Boolean).join(', ');
        setAddress(full);
      }
    })();
  }, []);

  const startService = (service) => {
    navigation.navigate('Tracking', { userLocation, language, service });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🚨</Text>
      <Text style={styles.title}>Raksha+</Text>
      <Text style={styles.tagline}>{t.tagline}</Text>

      {['ambulance', 'fire', 'police'].map((service, i) => (
        <Animated.View entering={FadeInDown.delay(i * 200).duration(600)} key={service}>
          <TouchableOpacity style={styles.card} onPress={() => startService(service)}>
            <Image source={{
              uri: service === 'ambulance'
                ? 'https://img.icons8.com/emoji/96/ambulance-emoji.png'
                : service === 'fire'
                  ? 'https://img.icons8.com/color/96/fire-truck.png'
                  : 'https://img.icons8.com/fluency/96/police-badge.png'
            }} style={styles.icon} />
            <Text style={styles.cardText}>
              {service === 'ambulance' ? '🚑' : service === 'fire' ? '🔥' : '👮'} {t.services[service]}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      ))}

      <View style={styles.langRow}>
        {['en', 'hi', 'te'].map((lang) => (
          <TouchableOpacity key={lang} onPress={() => setLanguage(lang)}>
            <Text style={[styles.language, language === lang && { fontWeight: 'bold', color: '#000' }]}>
              {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'తెలుగు'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.locationText}>
        📍 {address ? address : 'Fetching location...'}
      </Text>

      {/* --- Add Logout Button Here --- */}
      <TouchableOpacity
        style={{
          marginTop: 30,
          backgroundColor: '#e74c3c',
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 8,
        }}
        onPress={logout}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

function TrackingScreen({ route, navigation }) {
  const mapRef = useRef(null); // Add this line at the top of your TrackingScreen
  const { userLocation, language, service } = route.params;
  const t = translations[language];
  const [isSearching, setIsSearching] = useState(true);
  const [assigned, setAssigned] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [seconds, setSeconds] = useState(45);
  const [address, setAddress] = useState('');
  const [popupText, setPopupText] = useState('');
  const popupOpacity = useState(new RNAnimated.Value(0))[0];

  useEffect(() => {
    (async () => {
      if (!userLocation) return;
      const reverse = await Location.reverseGeocodeAsync(userLocation);
      if (reverse.length > 0) {
        const place = reverse[0];
        setAddress(`${place.name || ''}, ${place.street || ''}, ${place.city || ''}`);
      }
    })();
  }, [userLocation]);

  useEffect(() => {
  if (!userLocation) return;

  const services = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    type: service,
    latitude: userLocation.latitude + (Math.random() - 0.5) * 0.02,
    longitude: userLocation.longitude + (Math.random() - 0.5) * 0.02,
  }));

  setMarkers(services);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const toRad = x => x * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const nearest = services.reduce((nearest, current) => {
    const currentDist = getDistance(
      userLocation.latitude,
      userLocation.longitude,
      current.latitude,
      current.longitude
    );
    const nearestDist = getDistance(
      userLocation.latitude,
      userLocation.longitude,
      nearest.latitude,
      nearest.longitude
    );
    return currentDist < nearestDist ? current : nearest;
  });

  setTimeout(() => {
    setAssigned(nearest);
    setIsSearching(false);

    Speech.speak(t.speak[service]);
    showPopup('✅ ' + t.speak[service]);

    t.tips[service].forEach((msg, idx) => {
      setTimeout(() => {
        Speech.speak(msg);
        showPopup(msg);
      }, 3000 * (idx + 1));
    });
  }, 3000);
}, []);


  useEffect(() => {
  if (!assigned || !userLocation || seconds <= 0) return;

  const totalSteps = seconds;
  const deltaLat = (userLocation.latitude - assigned.latitude) / totalSteps;
  const deltaLng = (userLocation.longitude - assigned.longitude) / totalSteps;

  const interval = setInterval(() => {
    setAssigned(prev => ({
      latitude: prev.latitude + deltaLat,
      longitude: prev.longitude + deltaLng,
    }));
  }, 1000);

  return () => clearInterval(interval);
}, [assigned, userLocation, seconds]);


  useEffect(() => {
    if (isSearching || seconds <= 0) return;
    const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
    if (seconds === 1) navigation.navigate('Confirmation', { language });
    return () => clearTimeout(timer);
  }, [seconds, isSearching]);

  // Voice alert when close
useEffect(() => {
  if (seconds === 10 || seconds === 5) {
    Speech.speak("Responder is very close. Please get ready.");
  }
}, [seconds]);

useEffect(() => {
  if (seconds === 0) {
    setTimeout(() => {
      Speech.speak("The responder has reached your location. Please proceed carefully.");
    }, 1000); // Slight delay after 0s
  }
}, [seconds]);

  const iconURL = service === 'ambulance'
    ? 'https://img.icons8.com/emoji/48/ambulance-emoji.png'
    : service === 'fire'
      ? 'https://img.icons8.com/color/48/fire-truck.png'
      : 'https://img.icons8.com/fluency/48/police-badge.png';

  const showPopup = (msg) => {
    setPopupText(msg);
    RNAnimated.sequence([
      RNAnimated.timing(popupOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      RNAnimated.timing(popupOpacity, { toValue: 0, duration: 500, delay: 2000, useNativeDriver: true }),
    ]).start();
  };

  const getETAStatus = () => {
  if (seconds > 30) return "🚨 Responder is on the way";
  if (seconds > 15) return "🔍 Getting closer";
  if (seconds > 5) return "⏳ Almost there";
  if (seconds > 1) return "🛬 Arriving now!";
  return "✅ Responder has reached";
};

const renderDash = () => {
  const total = 5;
  const filled = Math.round(((45 - seconds) / 45) * total);
  return [...Array(total)].map((_, i) => (
    <View
      key={i}
      style={{
        width: 12,
        height: 12,
        marginHorizontal: 4,
        borderRadius: 6,
        backgroundColor: i < filled ? '#e74c3c' : '#ccc',
      }}
    />
  ));
};


  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>{isSearching ? '🔍 Searching nearby...' : `${t.services[service]} Assigned!`}</Text>
      {!isSearching && (
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
        <Text style={styles.etaText}>{getETAStatus()}</Text>
        <View style={{ flexDirection: 'row', marginTop: 6 }}>{renderDash()}</View>
        <Text style={{ fontSize: 14, color: '#888', marginTop: 4 }}>{seconds}s left</Text>
      </View>
    )}
      {address && <Text style={styles.address}>📍 {address}</Text>}

      {userLocation && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={userLocation} title="You" pinColor="blue" />
         {assigned && (
          <Marker coordinate={assigned}>
            <Animatable.Image
              animation="pulse"
              iterationCount="infinite"
              easing="ease-in-out"
              source={{ uri: iconURL }}
              style={{ width: 40, height: 40 }}
            />

          </Marker>
        )}

          {markers.map((coord, index) => (
            <Marker key={index} coordinate={coord}>
    <Image
      source={{
        uri:
          service === 'ambulance'
            ? 'https://img.icons8.com/emoji/48/ambulance-emoji.png'
            : service === 'fire'
            ? 'https://img.icons8.com/color/48/fire-truck.png'
            : 'https://img.icons8.com/fluency/48/police-car.png',
      }}
      style={{
        width: 36,
        height: 36,
        opacity: assigned && coord.latitude === assigned.latitude && coord.longitude === assigned.longitude ? 1 : 0.6,
        transform: assigned && coord.latitude === assigned.latitude && coord.longitude === assigned.longitude
          ? [{ scale: 1.2 }]
          : [{ scale: 1 }],
      }}
    />
  </Marker>
))}

          {assigned && <Polyline coordinates={[assigned, userLocation]} strokeColor="red" strokeWidth={3} />}
        </MapView>
      )}

      {!isSearching && (
        <View style={styles.driverPanel}>
          <Image source={{ uri: 'https://randomuser.me/api/portraits/men/42.jpg' }} style={styles.driverAvatar} />
          <View>
            <Text style={styles.driverName}>Ravi Kumar ({t.services[service]})</Text>
            <Text style={styles.driverSub}>Verified Responder | 4.8⭐</Text>
          </View>
        </View>
      )}

      <RNAnimated.View style={[styles.popup, { opacity: popupOpacity }]}>
        <Text style={styles.popupText}>{popupText}</Text>
      </RNAnimated.View>
    </View>
  );
}

function ConfirmationScreen({ route }) {
  const { language } = route.params;
  const t = translations[language];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ Request Sent</Text>
      <Text style={styles.tagline}>{t.confirmation}</Text>
    </View>
  );
}

function AppContent() {
  const { user, authLoading } = useContext(AuthContext);

  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? 'Home' : 'Login'}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Tracking" component={TrackingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Confirmation" component={ConfirmationScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafc',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 60,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#ffffff',
    width: screenWidth * 0.8,
    borderRadius: 16,
    alignItems: 'center',
    padding: 16,
    marginVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
  },
  icon: {
    width: 64,
    height: 64,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  langRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  language: {
    fontSize: 16,
    marginHorizontal: 8,
    color: '#555',
  },
  locationText: {
    fontSize: 14,
    color: '#777',
    marginTop: 12,
    textAlign: 'center',
  },
    map: {
    width: screenWidth * 0.95,
    height: 350,
    borderRadius: 12,
    marginTop: 10,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
  },
  etaText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
  },
  driverPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 4,
    marginTop: 16,
    width: screenWidth * 0.9,
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  driverSub: {
    fontSize: 13,
    color: '#777',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 6,
  },
  tip: {
    fontSize: 14,
    color: '#333',
    paddingVertical: 4,
  },
    popup: {
  position: 'absolute',
  bottom: 40,
  backgroundColor: '#fffbea',
  paddingHorizontal: 20,
  paddingVertical: 14,
  borderRadius: 18,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.15,
  shadowRadius: 6,
  elevation: 6,
  borderLeftWidth: 5,
  borderLeftColor: '#f39c12',
},
popupText: {
  fontSize: 15,
  color: '#2c3e50',
  fontWeight: '600',
  textAlign: 'center',
},

address: {
  fontSize: 14,
  color: '#666',
  marginTop: 4,
    textAlign: 'center',
  },
});
