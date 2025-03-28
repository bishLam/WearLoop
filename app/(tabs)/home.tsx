import {
  StyleSheet, Text, Image, TextInput,
  View, ScrollView, TouchableOpacity
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useWindowDimensions } from 'react-native';
import ProfileSlider from '@/components/ProfileSlider';

import { useUser } from '@/contexts/UserAuth'
import { useEffect } from 'react';
import { useState } from 'react';

import { router } from 'expo-router';
import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { defaultImage } from '@/constants/defaultImage';

//testing
import { database, listAllClothes } from '@/lib/appwrite';


const Home = () => {

  const userAuth = useUser();
  const { width } = useWindowDimensions();

  const isMobile = width < 768;

  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = async () => {
    await userAuth?.logout();
  }



  useEffect(() => {
    if (!userAuth?.current) {
      setTimeout(() => {
        router.replace("/")
      }, 0);
    }
  },
    [userAuth?.current]);


  const cardsData = async() => {
    try{
     let data =  await listAllClothes();
     console.log(data)
  }
  catch(error){
    console.log(error)
  }
}

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.mainContainer}>
          <View style={styles.header}>
            <View style={styles.leftContainer}>

              <Image
                source={require('../../assets/icons/logo.png')}
                style={styles.logo}
              />
              <Text style={styles.welcomeText}>Welcome back</Text>
            </View>
            <TouchableOpacity onPress={() => setShowProfileModal(true)}>
              <Image
                source={{ uri: defaultImage }}
                style={styles.profile}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputcontainer}>
            <TextInput
              style={styles.inputtext}
              placeholder="Search"
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => {
                // Add search functionality here
              }}
            >
              <FontAwesome5 name="search" size={20} color="#007bff" />
            </TouchableOpacity>
          </View>
        </View>


        <View style={[
          styles.cardContainer,
          isMobile ? styles.cardContainerMobile : styles.cardContainerDesktop
        ]}>
          {/* {cardsData.map((item) => (
            <View
              key={item.id}
              style={[
                styles.card,
                isMobile ? styles.cardMobile : styles.cardDesktop
              ]}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.cardImage}
                resizeMode="contain"
              />
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardText}>{item.text}</Text>
                <TouchableOpacity style={styles.cardButton}>
                  <Text style={styles.cardButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))} */}
        </View>


      </ScrollView>

      <ProfileSlider
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onLogout={async () => {
          setShowProfileModal(false);
          await handleLogout();
        }}
      />





    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: "5%"
  },
  mainContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  welcomeText: {
    marginLeft: 12,
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  profile: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  searchContainer: {
    backgroundColor: '#fff',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchInputContainer: {
    backgroundColor: '#eee',
  },
  contentPlaceholder: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
  },
  inputcontainer: {
    height: 48,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    marginTop: 15,
    marginHorizontal: 20,
  },
  inputtext: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  searchButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginRight: 5,
  },

  cardContainer: {
    width: '100%',
  },
  cardContainerDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainerMobile: {
    flexDirection: 'column',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardDesktop: {
    width: '48%',
    maxWidth: 400,

  },
  cardMobile: {
    width: '100%',
  },
  cardImage: {
    width: '100%',
    height: 180,
  },
  cardBody: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  cardButton: {
    backgroundColor: '#3d7cf7',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  cardButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },




});