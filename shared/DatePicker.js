
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView, Platform } from 'react-native'
import DateTimePicker from "@react-native-community/datetimepicker"
import React, {  useState } from 'react'
import { useField, useFormikContext } from "formik";


const DatePicker = ({...props}) => {
    const { setFieldValue } = useFormikContext()
    const [field] = useField(props)
    const [date, setDate] = useState(new Date())
  const [startDate, setStartDate] = useState(new Date())
  const [showStartDate, setShowStartDate] = useState(false)

const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date
  
    setShowStartDate(Platform.OS === "ios")
    setStartDate(currentDate)
    setDate(currentDate)
setFieldValue(field.name, currentDate)
  }
  
//   const showStartDatePicker = (event) => {
  
//     setShowStartDate(true);
  
//   }



  return (

<View>
      {/* <View style={{margin:20}}>
        <Button title={`Set ${mode} Date`} onPress={showStartDatePicker}/>
      </View> */}
      {/* {showStartDate && ( */}
        <DateTimePicker
        {...field}
        {...props}
        
        value={date}
        mode="date"
      
        display="default"
        onChange={(event, selectedDate) => {
            const currentDate = selectedDate || date
  
            setShowStartDate(Platform.OS === "ios")
            setStartDate(currentDate)
            setDate(currentDate)
        setFieldValue(field.name, currentDate)
       
        }}
        />
      {/* )} */}
      </View>

      
  )
      }

      export default DatePicker