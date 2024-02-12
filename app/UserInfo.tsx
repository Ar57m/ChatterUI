import { UserCard } from '@constants/Users'
import { FontAwesome } from '@expo/vector-icons'
import { Global, Color, Users } from '@globals'
import * as DocumentPicker from 'expo-document-picker'
import { Stack, useRouter } from 'expo-router'
import React from 'react'
import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    TextInput,
} from 'react-native'
import { useMMKVObject, useMMKVString } from 'react-native-mmkv'

const UserInfo = () => {
    const router = useRouter()
    const [userName, setUserName] = useMMKVString(Global.CurrentUser)
    const [userCard, setUserCard] = useMMKVObject<UserCard>(Global.CurrentUserCard)

    const saveCard = () => {
        if (userName && userCard) Users.saveFile(userName, userCard)
    }

    return (
        <SafeAreaView style={styles.mainContainer}>
            <Stack.Screen
                options={{
                    title: 'Edit User',
                    animation: 'none',
                }}
            />

            <View style={styles.userContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.userImage}
                        source={{ uri: Users.getImageDir(userName ?? '') }}
                    />
                </View>
                <View>
                    <Text style={styles.userName}>{userName}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                saveCard()
                                router.back()
                            }}>
                            <FontAwesome size={20} name="check" color={Color.Button} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                DocumentPicker.getDocumentAsync({
                                    copyToCacheDirectory: true,
                                    type: 'image/*',
                                }).then((result) => {
                                    if (result.canceled) return
                                    if (userName) Users.copyImage(result.assets[0].uri, userName)
                                })
                            }}>
                            <FontAwesome size={20} name="upload" color={Color.Button} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.inputarea}>
                <Text style={{ color: Color.Text }}>Description</Text>
                <TextInput
                    style={styles.input}
                    multiline
                    numberOfLines={6}
                    value={userCard?.description ?? ''}
                    onChangeText={(text) => {
                        if (userCard) setUserCard({ ...userCard, description: text })
                    }}
                    placeholder="----"
                    placeholderTextColor={Color.Offwhite}
                />
            </View>
        </SafeAreaView>
    )
}

export default UserInfo

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: Color.Background,
        flex: 1,
    },

    userContainer: {
        flexDirection: 'row',
        marginBottom: 40,
        margin: 16,
    },

    buttonContainer: {
        flexDirection: 'row',
        marginLeft: 12,
    },

    button: {
        backgroundColor: Color.DarkContainer,
        marginRight: 10,
        padding: 8,
    },

    userName: {
        color: Color.Text,
        fontSize: 20,
        marginTop: 16,
        marginBottom: 8,
        marginLeft: 12,
    },

    imageContainer: {
        width: 108,
        height: 108,
        borderRadius: 54,
        margin: 4,
        borderWidth: 2,
        borderColor: Color.White,
        backgroundColor: Color.DarkContainer,
    },

    userImage: {
        width: 108,
        height: 108,
        borderRadius: 54,
    },

    inputarea: {
        paddingHorizontal: 16,
        paddingBottom: 4,
    },

    input: {
        marginTop: 12,
        color: Color.Text,
        backgroundColor: Color.DarkContainer,
        textAlignVertical: 'top',
        paddingVertical: 8,
        borderRadius: 8,
    },
})
