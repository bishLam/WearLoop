import {
  StyleSheet, Text, Image, TextInput,
  View, ScrollView, TouchableOpacity
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useWindowDimensions, FlatList } from 'react-native';
import ProfileSlider from '@/components/ProfileSlider';

import { useUser } from '@/contexts/UserAuth'
import { useEffect } from 'react';
import { useState } from 'react';

import { router } from 'expo-router';
import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { defaultImage } from '@/constants/defaultImage';
import { cloth } from '@/lib/appwriteFunctions'

//testing
import { database, storage, client, config } from '@/lib/appwrite';
import { listAllActiveClothes, listenForChanges } from '@/lib/appwriteFunctions';
import { CustomCard } from "../../components/CustomCard"
import LoadingScreen from '../loadingScreen';


const Home = () => {

  const userAuth = useUser();
  const [allClothes, setAllClothes] = useState<cloth[]>([])
  const [isLoading, setIsLoading] = useState(false)

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
    [userAuth?.current])

  useEffect(() => {
    setIsLoading(true)
    const fetchAllActiveClothes = async () => {
      try {
        let allActiveclothes = await listAllActiveClothes();
        setAllClothes(allActiveclothes!);
      } catch (error) {
        console.log(error)
      }
      finally {
        setIsLoading(false)
      }
    }
    fetchAllActiveClothes()
  }, [])

  useEffect(() => {
    //listen for changes in the appwrite document for realtime support
    const unsubscribe = () => listenForChanges((newCloth) => {
      console.log("New cloth added: \n", newCloth);
      setAllClothes(prevCloths => [...prevCloths, newCloth])
    });

    return () => unsubscribe()
  }, [])


  return (
    <SafeAreaView style={styles.container}>
      {isLoading ?
        <LoadingScreen />
        :
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

          <View style={styles.clothesContainer}>
            <Text style={styles.headerText}>We thought you might like these</Text>
            <FlatList
              data={allClothes}
              numColumns={2}
              columnWrapperStyle={styles.flatlistItemsContainer}
              renderItem={({ item }) =>
                <CustomCard
                  imageUri={item.clothUri}
                  title={item.description}
                  location={item.postalCode}
                  condition={item.condition}
                />
              }


              keyExtractor={item => item.documentID}
            />
          </View>


          <ProfileSlider
            visible={showProfileModal}
            onClose={() => setShowProfileModal(false)}
            onLogout={async () => {
              setShowProfileModal(false);
              await handleLogout();
            }}
          />



        </ScrollView>
      }
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
    // paddingHorizontal: 20,
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
  // contentPlaceholder: {
  //   marginTop: 20,
  //   fontSize: 18,
  //   textAlign: 'center',
  //   color: '#666',
  // },
  inputcontainer: {
    height: 48,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    marginTop: 15,
  },
  inputtext: {
    flex: 1,
    fontSize: 16,
    // color: '#333',
    paddingVertical: 8,
  },
  searchButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginRight: 5,
  },

  headerText: {
    fontSize: 20,
    marginVertical: 10
  },

  clothesContainer: {
    // display:"flex",
    // flexDirection:"column",
    // gap:20,
    // marginBottom:200
  },

  flatlistItemsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 30,
    flexWrap: "wrap",
    columnGap: 0
  }
});