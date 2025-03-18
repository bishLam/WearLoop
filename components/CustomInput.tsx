import { StyleSheet, Text, View, TextInput, KeyboardTypeOptions } from 'react-native'
import React from 'react'

type inputProps = {
  title: string
  error: boolean,
  value: string,
  handleChangeText: (val:string) => void
  secureText: boolean
  keyboardType: KeyboardTypeOptions,
}

const CustomInput: React.FC<inputProps> = ({title, error, value, handleChangeText, secureText, keyboardType}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.inputHeading]}> {title} </Text>
      <TextInput
        style={[styles.inputText, error && { borderColor: "red" }]}
        placeholder={`Enter your ${title}`}
        keyboardType={keyboardType}
        value={value}
        onChangeText={handleChangeText}
        secureTextEntry = {secureText}
        
      />
    </View>
  )
}

export default CustomInput

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 16,
    display: "flex",
    flexDirection: "column",
    flex:1,
  },

  inputText: {
    borderWidth: 1,
    borderColor: "#D4D7E3",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 16,
    height: 42,
    flex:1
  },

  inputHeading: {
    fontSize: 16
  },

})