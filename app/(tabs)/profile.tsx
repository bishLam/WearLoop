import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Profile = () => {
  return (
    <SafeAreaView>
          <ScrollView>
            <View style = {styles.mainContainer}>
              <Text>Log in Page</Text>
            </View>
          </ScrollView>
   </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({
  mainContainer : {

  }
})