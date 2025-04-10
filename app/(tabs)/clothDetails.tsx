import { cloth } from '@/lib/appwriteFunctions'
import AntDesign from '@expo/vector-icons/AntDesign'
import { router, useLocalSearchParams } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ClothDetail = () => {
  const { cloth } = useLocalSearchParams();
  const clothObject: cloth = cloth ? JSON.parse(cloth as string) : null;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: "5%", paddingVertical: "2%" }}>
        <View style={styles.mainContainer}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton}
              onPress={() => router.replace("/home")}
            >
              {/* <Text style={styles.backButtonText}> {`<`} </Text> */}
              <AntDesign name="arrowleft" size={34} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Cloth Details</Text>
          </View>

          <View style = {styles.contentView}>
            <Text>{clothObject.description}</Text>
            <Text>{clothObject.category}</Text>
            <Text>{clothObject.condition}</Text>
            <Text>{clothObject.gender}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ClothDetail

const styles = StyleSheet.create({
  mainContainer: {

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

})