import React, { useState } from 'react';
import AgoraUIKit from 'agora-rn-uikit';
import { Button, View, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

const VideoChat = ({ route }) => {
    const [videoCall, setVideoCall] = useState(false);
    const { roomId, username } = route.params
    const navigation = useNavigation()
    console.log(roomId, "<< room id")
    /**
     * @type {import('agora-rn-uikit').ConnectionData}
     */
    const connectionData = {
        appId: Constants.manifest.extra.videoCallApiKey,
        channel: roomId,
        username: username
    }

    /**
     * @type {import('agora-rn-uikit').rtmCallbacks}
     */
    const rtcCallbacks = (navigation) => ({
        EndCall: () => {
            setTimeout(() => {
                setVideoCall(false);
                navigation.goBack()
            }, 200);
        },
    })

    /**
     * @type {import('agora-rn-uikit').Settings}
     */
    const settings = {
        displayUsername: true,
    }
    return (
        <View style={styles.container}>
            <AgoraUIKit settings={settings} connectionData={connectionData} rtcCallbacks={rtcCallbacks(navigation)} />
        </View>
    )
};

export default VideoChat;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    input: {
        borderWidth: 1,
        width: 200,
        height: 36,
        marginRight: 8,
        paddingHorizontal: 8
    }
})