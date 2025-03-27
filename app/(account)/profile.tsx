
import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Colors } from "../../constants/Colors"
import { router } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign'
import { defaultImage } from '@/constants/defaultImage'

type TabLayoutType = {
  selectedItem: string
}

const TabLayout = ({ selectedItem }: TabLayoutType) => {
  if (selectedItem === "posts") {
    return (
      <Text>
        Create a post now
      </Text>
    )
  }

  else if (selectedItem === "favs") {
    return (
      <Text>
        You do not have any favourites
      </Text>
    )
  }
}

const Profile = () => {
  const [selectedTab, setSelectedTab] = useState("posts");

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

  return (
    <SafeAreaView style = {{flex:1}}>
      <ScrollView contentContainerStyle = {{paddingHorizontal: "5%", paddingVertical:"2%"}}>
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
          <Image style={styles.image} source={{uri: defaultImage}} />
          <Text style={styles.usernameText}>bishwo</Text>
          <Text style={styles.emailText}>biswanathlamichhane@gmail.com</Text>
          <View style={styles.totalPostsContainer}>
            <Text style={styles.postsCountText}>0 posts .</Text>
            <Text style={styles.postsCountText}>0 saved</Text>
          </View>
          <TouchableOpacity style={[{ backgroundColor: Colors.light.gray }, styles.editProfileButton]}
            onPress={() => router.replace("/editProfile")}
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

            <View style={styles.actualTabContainer}>
              <TabLayout
                selectedItem={selectedTab}
              />
            </View>
          </View>
        </View>
      </ScrollView>
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
    alignItems:"center",
    flex:1,
    width:"100%"
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
  }
})