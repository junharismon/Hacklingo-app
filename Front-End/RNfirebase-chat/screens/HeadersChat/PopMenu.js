import { MaterialIcons, FontAwesome, AntDesign, Feather } from '@expo/vector-icons';
import { useRef } from 'react';
import { useState } from "react";
import { Easing } from 'react-native';
import { StyleSheet, Text, SafeAreaView, Modal, TouchableOpacity, Animated } from "react-native";
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { logout } from '../../stores/authSlice';
import { logoutUser } from '../../stores/usersSlice';


export function PopMenu() {
    const navigation = useNavigation()
    const [visible, setVisible] = useState(false)
    const scale = useRef(new Animated.Value(0)).current
    const dispatch =  useDispatch()
    function resizeBox(to) {
        to === 1 && setVisible(true);
        Animated.timing(scale, {
            toValue: to,
            useNativeDriver: true,
            duration: 100,
            easing: Easing.linear
        }).start(() => to === 0 && setVisible(false))
    }
    const onSignOut = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
        } catch (error) {
            console.log('Error logging out: ', error);
        }
    };
    return (
        <>
            <TouchableOpacity onPress={() => resizeBox(1)}>
                <FontAwesome name="user-circle" size={40} color="white" />
            </TouchableOpacity>
            <Modal transparent visible={visible}>
                <SafeAreaView
                    style={{ flex: 1 }}
                    onTouchStart={() => resizeBox(0)}
                >
                    <Animated.View style={[styles.popup, { transform: [{ scale }] }]}>
                        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Profile')}>
                            <Text>Profile</Text>
                            <Feather name="user" size={26} color="black" style={{ marginLeft: 10 }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('CreateGroupChat')}>
                            <Text>Add Group</Text>
                            <AntDesign name="addusergroup" size={26} color="black" style={{ marginLeft: 10 }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.option} onPress={onSignOut}>
                            <Text>Logout</Text>
                            <MaterialIcons name="logout" size={26} color="black" style={{ marginLeft: 10 }} />
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
        top: 47,
        left: 47
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 7,
        borderBottomColor: '#ccc'
    }
})