import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { useState } from 'react'


const PostComments = () => {
const [comment, setComment] = useState("")

    return (
        <View>
            {/* <TextInput 
            placeholder='say well done...'
            onChangeText={(comment) => setComment(comment)}
            defaultValue={comment} /> */}
            
        </View>
    )
}