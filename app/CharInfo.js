import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity, Alert, ToastAndroid } from 'react-native'
import { useState } from 'react'

import { Global, Color, copyCharImage, deleteCharacter, getCharacterCard, getCharacterImageDirectory, saveCharacterCard } from '@globals'
import { useMMKVString } from 'react-native-mmkv'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { useEffect } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import llamaTokenizer from '@constants/tokenizer'
import { Stack, useRouter } from 'expo-router'
import * as DocumentPicker from 'expo-document-picker'

const CharInfo = () => {
  const router = useRouter()
  const [charName, setCharName] = useMMKVString(Global.CurrentCharacter)
  const [characterCard, setCharacterCard] = useState({})
  
  // redo charactercard as CONTEXT

  const loadcard = () => {
    getCharacterCard().then(data =>{
      setCharacterCard(JSON.parse(data))
    })
  }
  
  const savecard = () => {
    return saveCharacterCard(charName, JSON.stringify(characterCard))
  }

  useEffect(() => {
    loadcard()
  }, [])


  return (
    <SafeAreaView style={styles.mainContainer}>
    <Stack.Screen options={{
      headerRight: () => (<View style={styles.buttonContainer}>
        <TouchableOpacity  style={styles.button} onPress={() => {
                savecard().then(() => loadcard())
                ToastAndroid.show(`Character saved!`,ToastAndroid.SHORT)
              }}>
                <FontAwesome name='save' size={28} color={Color.Button} />
            </TouchableOpacity>

            <TouchableOpacity  style={styles.button} onPress={() => {
              Alert.alert(
                `Delete Character`,
                `Are you sure you want to delete this character? This cannot be undone.`,
                [
                  {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                  }, 
                  {
                    text: 'Confirm',
                    onPress: () => {
                      
                      deleteCharacter(charName)
                      setCharName('Welcome')
                      router.back()
                    },
                    style: 'destructive',
                  },
                  
                ],
                {
                  cancelable: true
                }
              )}
              }>
              <FontAwesome name='trash' size={28} color={Color.Button} />
            </TouchableOpacity></View>)
    }} />

    <ScrollView>
      
      <View style={styles.characterHeader}>
        <Image source={{uri:getCharacterImageDirectory(charName)}} style={styles.avatar}/>

        <View style={styles.characterHeaderInfo}>
          
        <Text style={{fontSize:20, marginBottom: 12, color:Color.Text}}>{charName}</Text>
          <View style={styles.buttonContainer}> 
            <TouchableOpacity 
              style={styles.foregroundButton}
              onPress={() => {
                DocumentPicker.getDocumentAsync({copyToCacheDirectory: true, type:'image/*'}).then((result) => {
                  if(result.canceled) return
                  copyCharImage(result.assets[0].uri, charName)
                })
              }}
              >
              <FontAwesome name='upload' size={20} color={Color.Button}/>
            </TouchableOpacity>
          </View>

        </View>
      </View>
      
     

      <Text
        style={styles.boxText}
      >Description    Tokens: {(characterCard?.description ?? characterCard?.data?.description) !== undefined && llamaTokenizer.encode(characterCard?.description ?? characterCard.data.description).length}</Text>
     
      <ScrollView style={styles.inputContainer}>
      <TextInput 
        style={styles.input}
        multiline
        onChangeText={(mes) => {
          if(characterCard.spec !== undefined && characterCard.spec === 'chara_card_v2')
          setCharacterCard({...characterCard, description: mes, data: {...characterCard.data, description: mes} })
          else 
          setCharacterCard({...characterCard, description: mes })
        }}
        value={characterCard?.data?.description ?? characterCard?.description}
        numberOfLines={8}
      />
      </ScrollView>

      <Text style={styles.boxText}>First Message</Text>
      <ScrollView style={styles.inputContainer}>
      <TextInput 
        style={styles.input}
        multiline
        onChangeText={(mes) => {
          if(characterCard.spec !== undefined && characterCard.spec === 'chara_card_v2')
          setCharacterCard({...characterCard, first_mes: mes, data: {...characterCard.data, first_mes: mes} })
          else 
          setCharacterCard({...characterCard, first_mes: mes })
        }}
        value={characterCard?.data?.first_mes ?? characterCard?.first_mes}
        numberOfLines={8}
      />
      </ScrollView>

      <Text style={styles.boxText}>Adventure Options</Text>
      <Text style={styles.boxTextGray}>eg. option1 || option2 || option3</Text>
      <ScrollView style={styles.inputContainer}>
      <TextInput 
        style={styles.input}
        multiline
        onChangeText={(mes) => {
          if(characterCard.spec !== undefined && characterCard.spec === 'chara_card_v2')
          setCharacterCard({...characterCard, adventure_options: mes, data: {...characterCard.data, adventure_options: mes} })
          else 
          setCharacterCard({...characterCard, adventure_options: mes })
        }}
        value={characterCard?.data?.adventure_options ?? characterCard?.adventure_options}
        numberOfLines={8}
      />
      </ScrollView>
    </ScrollView>   
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  mainContainer:{
    flex:1,
    paddingHorizontal:12,
    paddingVertical: 20,
    backgroundColor: Color.Background
  },

  button : {
    marginRight:20,
  },

  characterHeader: {
    alignContent: 'flex-start',
    flexDirection: 'row',
    marginLeft:8,
  },

  characterHeaderInfo : {
    marginLeft: 12,
    marginBottom: 12,
  },


  buttonContainer:{
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginTop:4,
  },

  foregroundButton: {
    backgroundColor: Color.DarkContainer,
    padding:8, 
    borderRadius: 4,
  },

  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom:4,
    marginLeft: 4, 
    marginRight: 8, 
  },

  inputContainer: {
    backgroundColor: Color.DarkContainer,
		borderRadius: 8, 
		paddingHorizontal: 8,
    maxHeight: 160,
	},

  boxText:{
    color:Color.Text, 
    paddingTop:16,
    paddingBottom: 8,
  },

  boxTextGray:{
    color:Color.Offwhite, 
    paddingBottom: 8,
  },

  input: {
    color: Color.Text,
    textAlignVertical: 'top',
    paddingVertical:8,
  },
})

export default CharInfo



let string = ""
const TavernCardV1 = {
  name: string,
  description: string,
  personality: string,
  scenario: string,
  first_mes: string,
  mes_example: string,
}

const TavernCardV2 = () => { 
  return {
    spec: 'chara_card_v2',
    spec_version: '2.0',
    data: {
      name: '',
      description: '',
      personality: '',
      scenario: '',
      first_mes: '',
      mes_example: '',

      // New fields start here
      creator_notes: '',
      system_prompt: '',
      post_history_instructions: '',
      alternate_greetings: [],
      character_book: '',

      // May 8th additions
      tags: [],
      creator: '',
      character_version: '',
      extensions: {},
    }
  }
}