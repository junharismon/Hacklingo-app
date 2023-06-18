import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { database } from '../config/firebase';
import { fetchOtherUserByEmail } from '../stores/usersSlice';
import sendPushNotification from '../helper/sendPushNotification';
import { useDispatch } from 'react-redux';

const UserCard = ({ user, groupId }) => {

    const dispatch = useDispatch();

    const acceptRequest = async () => {
        const groupDocRef = doc(database, 'groupChats', groupId);
        await updateDoc(groupDocRef, {
            requestJoin: arrayRemove(user),
            users: arrayUnion(user.email),
        });
        const joineeData = await dispatch(
            fetchOtherUserByEmail(user.email)
        ).unwrap();
        if (joineeData.deviceToken) {
            sendPushNotification(
              joineeData.deviceToken,
              `The admin has accepted you!`, 
              `You can now participate in the group!`
            );
          }
    };

    const denyRequest = async () => {
        const groupDocRef = doc(database, 'groupChats', groupId);
        await updateDoc(groupDocRef, {
            requestJoin: arrayRemove(user),
        });
    };

    return (
        <View style={styles.card}>
            <Text style={styles.userInfo}>{user.username}</Text>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={acceptRequest} style={styles.acceptButton}>
                    <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={denyRequest} style={styles.denyButton}>
                    <Text style={styles.buttonText}>Deny</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const RequestJoin = ({ route }) => {
    const { groupId } = route.params;
    const [requestedUsers, setRequestedUsers] = useState([]);

    useEffect(() => {
        const fetchGroupData = async () => {
            const groupDocRef = doc(database, 'groupChats', groupId);
            const groupDoc = await getDoc(groupDocRef);
            if (groupDoc.exists()) {
                const groupData = groupDoc.data();
                const requestJoin = groupData.requestJoin || [];
                setRequestedUsers(requestJoin);
            }
        };

        fetchGroupData();
    }, [groupId, requestedUsers]);

    return (
        <View style={styles.container}>
            {requestedUsers.length === 0 ? (
                <>
                    <Image
                        source={{
                            uri: 'https://cdn2.iconfinder.com/data/icons/delivery-and-logistic/64/Not_found_the_recipient-no_found-person-user-search-searching-4-512.png',
                        }}
                        style={styles.noUserImage}
                    />
                    <Text style={styles.noUserText}>No user applied to your group.</Text>
                </>
            ) : (
                requestedUsers.map((user, index) => (
                    <UserCard key={index} user={user} groupId={groupId} />
                ))
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: "95%",
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginTop: 10,
    },
    userInfo: {
        fontSize: 16,
        marginRight : 10
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    acceptButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 10,
    },
    denyButton: {
        backgroundColor: '#f44336',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    buttonText: {
        color: '#fff',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noUserImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    noUserText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default RequestJoin;
