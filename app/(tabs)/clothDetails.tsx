import { defaultClothImage, defaultImage } from '@/constants/defaultImage'
import { cloth, generateClothImageLink, generateProfilePictureLink, getUserDetailsFromEmail, userType } from '@/lib/appwriteFunctions'
import AntDesign from '@expo/vector-icons/AntDesign'
import { router, useLocalSearchParams } from 'expo-router'
import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LoadingScreen from '../loadingScreen'

const ClothDetail = () => {
  const [isLoading, setIsLoading] = useState(true)

  const { cloth } = useLocalSearchParams();
  const clothObject: cloth = cloth ? JSON.parse(cloth as string) : null;
  console.log(clothObject)

  const handleChatButtonPress= (clothID:string) => {
    router.push("/(tabs)/messenger")
  }

  const [uploaderUser, setUploaderUser] = useState<userType>({
    email: '',
    firstName: '',
    lastName: '',
    profilePictureID: '',
    userID: ''
  })

  useEffect(() => {
    const getUserDetails = async() => {
      try{
        setIsLoading(true)
      let user = await getUserDetailsFromEmail(clothObject.uploaderID)
      console.log(clothObject.uploaderID)
      if (user){
        console.log(user)
        setUploaderUser(user!)
      }
      else{

      }
    }
    catch(error){
      console.log(error)
    }
    finally{
      setIsLoading(false)
    }
      
  } 
  getUserDetails()
}, [clothObject.uploaderID])
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {
        isLoading ?
        <LoadingScreen />
        :
              <ScrollView contentContainerStyle={{ paddingHorizontal: "5%", paddingVertical: "2%", flex: 1 }}>
        <View style={styles.mainContainer}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton}
              onPress={() => router.back()}
            >
              {/* <Text style={styles.backButtonText}> {`<`} </Text> */}
              <AntDesign name="arrowleft" size={34} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>{clothObject.clothTitle}</Text>
          </View>

          <View style={styles.contentView}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri:  generateClothImageLink(clothObject.documentID) }}
                height={150}
                width={150}
                resizeMode='cover'
                style={styles.image}
              />
            </View>
            <View style={styles.detailsContainer}>
              <Text style={{ textDecorationLine: "underline", fontWeight: "600", fontSize: 18 }}>Details</Text>
              <View style={styles.userProfileContainer}>
                <Image
                  source={{ uri: generateProfilePictureLink(uploaderUser.profilePictureID) }}
                  height={40}
                  width={40}
                  style={styles.profileImage}
                />
                <Text>{uploaderUser.firstName + " " + uploaderUser.lastName}</Text>
                <Text style={{ flexGrow: 2, textAlign: "right" }}>{clothObject.createdDate}</Text>

              </View>
              <View style={styles.otherDetailsSection}>
                <View style={styles.individualDetailView}>
                  <Text style={styles.detailTileText}>Description:</Text>
                  <Text style={styles.detailText}>{clothObject.description}</Text>
                </View>
                <View style={styles.individualDetailView}>
                  <Text style={styles.detailTileText}>Condition:</Text>
                  <Text style={styles.detailText}>{clothObject.condition}</Text>
                </View>
                <View style={styles.individualDetailView}>
                  <Text style={styles.detailTileText}>Category:</Text>
                  <Text style={styles.detailText}>{clothObject.category}</Text>
                </View>
                <View style={styles.individualDetailView}>
                  <Text style={styles.detailTileText}>Gender:</Text>
                  <Text style={styles.detailText}>{clothObject.gender}</Text>
                </View>
                <View style={styles.individualDetailView}>
                  <Text style={styles.detailTileText}>Postal Code:</Text>
                  <Text style={styles.detailText}>{clothObject.postalCode}</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => handleChatButtonPress(clothObject.documentID)}
            >
              <Text style={styles.buttonText}>Chat with uploader</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      }

    </SafeAreaView>
  )
}

export default ClothDetail

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },

  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  headerText: {
    fontSize: 25,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    paddingRight: 34
  },
  backButton: {
    // backgroundColor:"red"

  },
  backButtonText: {
    fontSize: 40
  },
  contentView: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10
  },

  imageContainer: {
    minWidth: "0%",
    alignItems: "center",
    marginTop: 40,
    borderRadius: 2,
    shadowColor: "lime",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 24,
  },

  image: {
    borderRadius: 20,
    marginVertical: 10

  },

  detailsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    marginTop: 40
  },
  userProfileContainer: {
    marginTop: 15,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"

  },

  profileImage: {
    marginEnd: 10,
    borderRadius: 50
  },

  otherDetailsSection: {
    width: "100%",
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    gap: 20
  },
  individualDetailView: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  detailTileText: {
    fontWeight: "300",
    fontStyle: "italic",
  },

  detailText: {
    marginStart: 40,
    fontWeight: "500",
  },

  chatButton: {
    backgroundColor: "lime",
    width: "100%",
    borderRadius: 10,
    paddingVertical: 10,
    marginTop:10,
    shadowColor:"lime",
    shadowOffset: {
      height: 10,
      width: 20
    },
    shadowOpacity:0.58,
    shadowRadius:16,
    elevation:80
  },

  buttonText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "500"
  }

})