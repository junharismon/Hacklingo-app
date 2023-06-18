import React from 'react'
import { View, StyleSheet, Text, Image, Dimensions, TouchableOpacity } from 'react-native'

const { width, height } = Dimensions.get('window');


const CarouselItem = ({ item, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.cardView}>
            <Image style={styles.image} source={{ uri: item.url }} />
            <View style={styles.textView}>
                <Text style={styles.itemTitle}> {item.title}</Text>
                <Text style={styles.itemDescription}>{item.description.slice(0,100) + "..."}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardView: {
        flex: 1,
        width: width - 20,
        height: height / 3 + 10,
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 0.5 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 5,
    },

    textView: {
        marginVertical: 5,
        marginHorizontal: 10,
    },
    image: {
        width: width - 20,
        height: height / 4.5,
        borderRadius: 10
    },
    itemTitle: {
        color: 'black',
        fontSize: 18,
        // backgroundColor: "red",
        // shadowOffset: { width: 0.8, height: 0.8 },
        // shadowRadius: 3,
        marginBottom: 5,
        fontWeight: 600,
        // elevation: 5
    },
    itemDescription: {
        color: 'black',
        fontSize: 12,
        paddingLeft: 3,
        // backgroundColor: "red",
        shadowOffset: { width: 0.8, height: 0.8 },
        shadowRadius: 3,
        // elevation: 5
    }
})

export default CarouselItem