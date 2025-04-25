import {
  StyleSheet, Text, Image, TextInput,
  View, TouchableOpacity
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FlatList } from 'react-native';
import ProfileSlider from '@/components/ProfileSlider';

import { useUser } from '@/contexts/UserAuth'
import { useEffect } from 'react';
import { useState } from 'react';
import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { defaultImage } from '@/constants/defaultImage';
import { cloth } from '@/lib/appwriteFunctions'

//testing
import { config } from '@/lib/appwrite';
import { listAllActiveClothes, listenForChanges, getUserDetailsFromEmail, generateProfilePictureLink } from '@/lib/appwriteFunctions';
import { CustomCard } from "../../components/CustomCard"
import LoadingScreen from '../loadingScreen';




const Home = () => {

  const userAuth = useUser();
  const [allClothes, setAllClothes] = useState<cloth[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userImage, setUserImage] = useState(defaultImage);
  const listHeaderComponent = () => {

    return <SafeAreaView style={styles.container}>
        <View>
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
                  source={{ uri: userImage }}
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
          </View>
        </View>
    </SafeAreaView>

  }

  const [showProfileModal, setShowProfileModal] = useState(false);
  const handleLogout = async () => {
    await userAuth?.logout();
  }

  let user = userAuth?.current?.email!
  // fetches user profile
  useEffect(() => {
    const getUserImage = async () => {
      const userDetails = await getUserDetailsFromEmail(user)
      const userProfileLink = generateProfilePictureLink(userDetails?.profilePictureID)
      setUserImage(userProfileLink)
    }
    getUserImage()
  }, [user])

  // fetch all active clothes 
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

  //listen for changes in the appwrite document for realtime support
  // useEffect(() => {
  //   const unsubscribe = () => listenForChanges((newCloth) => {
  //     console.log("New cloth added: \n", newCloth);
  //     setAllClothes(prevCloths => [...prevCloths, newCloth])
  //   });

  //   return () => unsubscribe()
  // }, [`databases.${config.databaseID}.collections.${config.productCollectionID}.documents`])


  return (
    <>
      {
        !isLoading ?
          <>
            <FlatList
              data={allClothes}
              numColumns={2}
              columnWrapperStyle={styles.flatlistItemsContainer}
              style = {{backgroundColor: "#fff"}}
              ListHeaderComponent={listHeaderComponent}
              renderItem={({ item }) =>
                <CustomCard
                  cloth={item}
                />
              }
              keyExtractor={item => item.documentID}
            />
            <ProfileSlider
              visible={showProfileModal}
              onClose={() => setShowProfileModal(false)}
              onLogout={async () => {
                setShowProfileModal(false);
                await handleLogout();
              }}
            />
          </>
          :
          <LoadingScreen />
    }



    </>

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
    resizeMode: 'cover',
    borderRadius: 50
  },
  searchContainer: {
    backgroundColor: '#fff',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchInputContainer: {
    backgroundColor: '#eee',
  },
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

