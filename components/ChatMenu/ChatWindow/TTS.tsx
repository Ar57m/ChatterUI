import { FontAwesome } from '@expo/vector-icons'
import { Global, Color, Logger } from '@globals'
import * as Speech from 'expo-speech'
import { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useMMKVObject } from 'react-native-mmkv'

type TTSProps = {
    message: string
}

const TTS: React.FC<TTSProps> = ({ message }) => {
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false)
    const [currentSpeaker, setCurrentSpeaker] = useMMKVObject<Speech.Voice>(Global.TTSSpeaker)
    return (
        <View style={{ marginTop: 8 }}>
            {isSpeaking ? (
                <TouchableOpacity
                    onPress={() => {
                        setIsSpeaking(false)
                        Speech.stop()
                    }}>
                    <FontAwesome name="stop" size={20} color={Color.Button} />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    onPress={async () => {
                        if (currentSpeaker === undefined) {
                            Logger.log(`No Speaker Chosen`, true)
                            return
                        }
                        setIsSpeaking(true)
                        if (await Speech.isSpeakingAsync()) Speech.stop()
                        Speech.speak(message, {
                            language: currentSpeaker?.language,
                            voice: currentSpeaker?.identifier,
                            onDone: () => setIsSpeaking(false),
                            onStopped: () => setIsSpeaking(false),
                        })
                    }}>
                    <FontAwesome name="volume-down" size={28} color={Color.Button} />
                </TouchableOpacity>
            )}
        </View>
    )
}

export default TTS
