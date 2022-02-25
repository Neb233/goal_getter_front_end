import { StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useState} from 'react'
import { getCurrentStatus } from '../../utils/api'


const GoalStatus = () => {
    const [status, SetStatus] = useState({})

    const ownerP = 'jeff'

    useEffect(() => {
        getCurrentStatus(ownerP).then((res) => {
            SetStatus(res[2])
        })
    }, [])

  return (
    <View>
      <Text style={styles.text}>{status.message}</Text>
    </View>
  )
}

export default GoalStatus

const styles = StyleSheet.create({

    text: {
        fontSize: 16,
        fontWeight: 400,
        color: "white"
    }
})