import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useUser } from '@/contexts/UserAuth'

const Home = () => {

  const userAuth = useUser();
  const handleLogout = async () => {
    await userAuth?.logout();
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.mainContainer}>
          <TouchableOpacity onPress={handleLogout}>
            <Text>
              Log out from the {userAuth?.current?.email}
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