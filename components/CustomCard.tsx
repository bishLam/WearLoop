import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Platform, Image } from 'react-native'
import { Colors } from '@/constants/Colors'
import { config, storage } from '@/lib/appwrite'
import { defaultClothImage } from '@/constants/defaultImage'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'



type cardPropsType = {
  imageUri: string,
  title:string,
  location:string,
  condition:string
}

export const CustomCard = ({ imageUri, title, location, condition }: cardPropsType) => {
  return (
    <View style={
      [Platform.OS === "android" || Platform.OS === "ios" ? styles.phoneCardContainer : styles.webCardContainer,
      ]}>
      <View style={styles.cardImageContainer}>
        <Image source={{ uri: defaultClothImage }} //imageUri is not supported on free plan. So using a default image for all the cloths
          style={styles.image}
          onError={(e) => console.log("Image error:", e.nativeEvent.error)}
        />
      </View>

      <View style={styles.cardBottomContainer}>
        <Text style={styles.titleText}>{title}</Text>
        <View style={styles.footerContainer}>
          <View style={styles.locationContainer}>
            <Text>{location}</Text>
            <Text>{condition}</Text>
          </View>
          <View>
            <MaterialCommunityIcons size={28} color={Colors.light.lime} name="facebook-messenger" />
          </View>
        </View>
      </View>
    </View>
  )
}

export default CustomCard

const styles = StyleSheet.create({
  phoneCardContainer: {
    width: 200,
    borderRadius: 10,
    marginBottom: 20,
    minHeight: 300,
    maxHeight:500,
    borderColor: "gray",
    borderWidth: 1,
  },

  webCardContainer: {
    width: 360,
    borderRadius: 10,
    marginBottom: 20,
    height: 300,
    borderColor: "gray",
    borderWidth: 1,
  },

  cardImageContainer: {
    maxWidth: "100%",
    height: "50%"
  },

  image: {
    flex: 1,
    resizeMode: "contain",
    borderBottomColor: "red",
    paddingVertical: 10,
    borderBottomWidth: 2,
    // borderRadius:20
  },

  cardBottomContainer: {
    flex: 1,
    flexDirection: "column",
    // justifyContent:"space-between",
    gap:20,
    paddingVertical:5,
    paddingHorizontal:10,
    // borderColor:"red",
    // borderWidth:2
  },

  titleText: {
    fontSize: 24,
    color: "black"
  },

  footerContainer: {
    flex:1,
    flexDirection:"row",
    justifyContent:"space-between",
    bottom:0
  },
  locationContainer: {
    gap:10
  }
})