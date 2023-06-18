import { MaterialIcons, FontAwesome, AntDesign, Feather, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRef } from 'react';
import { useState } from "react";
import { Easing } from 'react-native';
import { View, StyleSheet, Text, SafeAreaView, Modal, TouchableOpacity, Animated } from "react-native";

export function PopChatMenu({email, name}) {
    const navigation = useNavigation()
    const [visible, setVisible] = useState(false)
    const scale = useRef(new Animated.Value(0)).current

    function resizeBox(to) {
        to === 1 && setVisible(true);
        Animated.timing(scale, {
            toValue: to,
            useNativeDriver: true,
            duration: 100,
            easing: Easing.linear
        }).start(() => to === 0 && setVisible(false))
    }
    return (
        <>
            <TouchableOpacity onPress={() => resizeBox(1)}>
                <Entypo name="dots-three-vertical" size={24} color="black" />
            </TouchableOpacity>
            <Modal transparent visible={visible}>
                <SafeAreaView
                    style={{ flex: 1 }}
                    onTouchStart={() => resizeBox(0)}
                >
                    <Animated.View style={[styles.popup, { transform: [{ scale }] }]}>
                        <TouchableOpacity style={styles.option} onPress={() => {
                            return navigation.navigate("DetailProf", {email, name})
                            }}>
                            <Text>Cek Profile</Text>
                            <Feather name="user" size={26} color="black" style={{ marginLeft: 10 }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.option}>
                            <Text>Report</Text>
                            <MaterialIcons name="report" size={26} color="black" style={{ marginLeft: 8 }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.option}>
                            <Text>Block</Text>
                            <Entypo name="block" size={26} color="black" style={{ marginLeft: 10 }} />
                        </TouchableOpacity>
                    </Animated.View>
                </SafeAreaView>
            </Modal>
        </>
    )
}


const styles = StyleSheet.create({
    popup: {
        borderRadius: 8,
        borderColor: '#333',
        borderWidth: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        position: 'absolute',
        top: 50,
        right: 20
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 7,
        borderBottomColor: '#ccc'
    }
})