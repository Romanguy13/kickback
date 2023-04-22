
//import {StyleSheet, Text, View } from "react-native"
import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Pressable,
    TouchableOpacity,
    Alert,
  } from 'react-native';

export default function NavBar({navigation }: any)
{
    return (
    <View style={styles.container}>
        <View style={styles.bottonContainer}> 
            <Pressable style={styles.Button} onPress={() => navigation.navigate('Welcome')}> 
                <Text style={styles.format} > Group </Text>
            </Pressable>
            <Pressable style={styles.Button} onPress={() => navigation.navigate('Welcome')} > 
                <Text style={styles.format}> Create </Text>
            </Pressable>
            <Pressable style={styles.Button} onPress={() => navigation.navigate('Welcome')}> 
                <Text style={styles.format}> History </Text>
            </Pressable>

        </View>
    </View>
    );
}

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        backgroundColor: '#FF7000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottonContainer:
    {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width:1000,
        height:100,
        top: 300
    },
    format:
    {
        fontSize:20,
        fontWeight: 'bold',
        alignItems: 'center'
    },
    Button:
    {
        width:300,
        height: 75,
        borderRadius: 50,
        borderColor: 'blue',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    Icons:
    {
        width:150,
        height: 50
    }
})

