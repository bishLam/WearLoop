
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Pressable, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Colors } from "../../constants/Colors"
import { router } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign'
import { defaultImage } from '@/constants/defaultImage'
import { useUser } from '@/contexts/UserAuth'
import { cloth, generateProfilePictureLink, getTotalPostsByUserFromEmail, getUserDetailsFromEmail, listAllClothesByUser, userType } from '@/lib/appwriteFunctions'
import LoadingScreen from '../loadingScreen'
import CustomCard from '@/components/CustomCard'

type TabLayoutType = {
  selectedItem: string,
  userClothes: cloth[]
}




const initialUser: userType = {
  firstName: "",
  lastName: "",
  profilePictureID: defaultImage,
  email: "",
  userID: ''
}
const Profile = () => {
  const userContext = useUser();
  const [selectedTab, setSelectedTab] = useState("posts");
  const [user, setUser] = useState<userType>(initialUser);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoading, setisLoading] = useState(true);
  const [userClothes, setUserClothes] = useState<cloth[]>([
    {
      documentID: "",
      clothTitle: "",
      imageID: "",
      description: "",
      isActive: false,
      condition: "",
      category: "",
      postalCode: "",
      createdDate: "",
      gender: "",
      clothUri: "",
      uploaderID: ""
    }
  ])
  const [userFavClothes, setuserFavClothes] = useState<cloth[]>([
    {
      documentID: "",
      clothTitle: "",
      imageID: "",
      description: "",
      isActive: false,
      condition: "",
      category: "",
      postalCode: "",
      createdDate: "",
      gender: "",
      clothUri: "",
      uploaderID: ""
    }
  ])

  const handlePressablePress = (selectedItem: string) => {
    if (selectedItem === "posts") {
      setSelectedTab("posts")
      return
    }

    if (selectedItem === "favs") {
      setSelectedTab("favs")
      return
    }
  }

  const listHeaderItem = () => {
    return (<ScrollView contentContainerStyle={{ paddingHorizontal: "5%", paddingVertical: "2%" }}>
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          {/* button to go back to the previous page */}
          <TouchableOpacity
            onPress={() => router.push("/home")}
          >
            {/* <Text style={styles.backButtonText}> {`<`} </Text> */}
            <AntDesign name="arrowleft" size={34} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Profile</Text>
        </View>
        <Image style={styles.image} source={{ uri: generateProfilePictureLink(user?.profilePictureID ?? "") }} />
        <Text style={styles.usernameText}>{user?.firstName}</Text>
        <Text style={styles.emailText}>{user?.email}</Text>
        <View style={styles.totalPostsContainer}>
          <Text style={styles.postsCountText}>{totalPosts} posts .</Text>
          <Text style={styles.postsCountText}>0 saved</Text>
        </View>
        <TouchableOpacity style={[{ backgroundColor: Colors.light.gray }, styles.editProfileButton]}
          onPress={() => router.push("/editProfile")}
        >
          <Text style={{ color: "white", fontWeight: 600 }}>
            Edit Profile
          </Text>
        </TouchableOpacity>
        {/* This view will be the tab bar layout inside this page which will be in the middle */}
        <View style={styles.tabBarContainer}>
          <View style={styles.pressableContainer}>
            <Pressable onPress={() => handlePressablePress("posts")}>
              <Text style={selectedTab === "posts" && styles.postSelected}>
                Posts
              </Text>
            </Pressable>
            <Pressable onPress={() => handlePressablePress("favs")}>
              <Text style={selectedTab === "favs" && styles.favsSelected}>
                Favorites
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>)
  }


  // use effect to fetch profile details
  useEffect(() => {
    try {
      setisLoading(true)
      const userEmail = userContext?.current?.email!
      if (userEmail) {

        // console.log("Loading state:", isLoading);
        const getProfileDetails = async () => {
          let userDetails = await getUserDetailsFromEmail(userEmail)
          setUser({
            userID: userDetails?.userID!,
            email: userDetails?.email!,
            firstName: userDetails?.firstName,
            lastName: userDetails?.lastName,
            profilePictureID: userDetails?.profilePictureID
          })
        }

        const getTotalPosts = async () => {
          const totalPosts = await getTotalPostsByUserFromEmail(userEmail)
          setTotalPosts(totalPosts)

        }
        getProfileDetails()
        getTotalPosts()

      }
    }
    catch (error) {
      console.log(error)
    }
    finally {
        setisLoading(false)
    }
  }, [userContext?.current?.email!])


  useEffect(() => {
    setisLoading(true)
    const getUserClothes = async (userID: string) => {
      let clothes = await listAllClothesByUser(userID)
      setUserClothes(clothes!)
    }
    getUserClothes(user.email)
    setisLoading(false)
  }, [user.email])


  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* checks if the page is loading to show the loading screen */}
      {isLoading ?
      <View> 
        <LoadingScreen />
        </View>:
        <>
          {
            // checks if the selected tab is posts
            selectedTab === "posts" ?

            // checks if the user has any posts or not

              <FlatList
                data={userClothes}
                numColumns={2}
                columnWrapperStyle={styles.flatlistItemsContainer}
                ListHeaderComponent={listHeaderItem}
                renderItem={({ item }) =>
                  <CustomCard
                    cloth={item}
                  />
                }
                keyExtractor={item => item.documentID}
              />

              :
              <FlatList
                data={userFavClothes}
                numColumns={2}
                columnWrapperStyle={styles.flatlistItemsContainer}
                ListHeaderComponent={listHeaderItem}
                renderItem={({ item }) =>
                  <CustomCard
                    cloth={item}
                  />
                }
                keyExtractor={item => item.documentID}
              />
          }


        </>
      }

    </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
  },

  backButtonText: {
    fontSize: 30
  },

  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
    width: "100%"
  },
  headerText: {
    fontSize: 25,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    paddingRight: 34
  },
  image: {
    marginTop: 60,
    height: 90,
    width: 90,
    borderRadius: 50,
    resizeMode: "contain"
  },
  usernameText: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: "600",
  },
  emailText: {
    marginTop: 3,
    fontWeight: "400",
    color: "gray"
  },
  totalPostsContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 5
  },
  postsCountText: {
    color: "gray"
  },
  editProfileButton: {
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 9,
    marginTop: 25,
  },


  // From here on tab bar styles
  tabBarContainer: {
    marginTop: 40,
    alignSelf: "center"
  },

  pressableContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 10 //remove this later
  },

  postSelected: {
    borderBottomWidth: 2
  },
  favsSelected: {
    borderBottomWidth: 2
  },
  actualTabContainer: {
    flex: 1,
    alignContent: "center"
    // backgroundColor:"gray"
  },
  flatlistItemsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 30,
    flexWrap: "wrap",
  }
})