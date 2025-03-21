import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useUser } from '@/contexts/UserAuth'
import { useEffect } from 'react';
import { router } from 'expo-router';

const Home = () => {

  const userAuth = useUser();
  const handleLogout = async () => {
    await userAuth?.logout();
  }

  useEffect(()=>{
    console.log(
      "Home page is reloaded on current change on value user"
    )
  } ,
  [userAuth?.current]
)

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.mainContainer}>
          <TouchableOpacity onPress={handleLogout}>
            <Text>
              Log out from the app ? {userAuth?.current?.email}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
  mainContainer: {

  }
})