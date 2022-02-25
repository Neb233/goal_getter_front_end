
import { StyleSheet, Text, View, Button, TextInput, SafeAreaView, Platform } from 'react-native'
import DateTimePicker from "@react-native-community/datetimepicker"
import React, {  useState } from 'react'
import { useField, useFormikContext } from "formik";


const DatePicker = ({...props}) => {
    const { setFieldValue } = useFormikContext()
    const [field] = useField(props)
    const [date, setDate] = useState(new Date())
  const [startDate, setStartDate] = useState(new Date())
  const [show, setShow] = useState(false)

const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date

  
    setShow(Platform.OS === "ios")
    setStartDate(currentDate)
    setDate(currentDate)
setFieldValue(field.name, currentDate)
  }
  
  const showDatePicker = (event) => {
  
    setShow(true);
  
  }



  return (

<View>
      <View style={{margin:20}}>
        <Button title={`Set Date`} onPress={showDatePicker}/>
      </View>

      {show && (
        <DateTimePicker
        {...field}
        {...props}
        
        value={date}
        mode="date"
      
        display="default"
        onChange={(event, selectedDate) => {
            const currentDate = selectedDate || date
  
            setShow(Platform.OS === "ios")
            setStartDate(currentDate)
            setDate(currentDate)
        setFieldValue(field.name, currentDate)
       
        }}
        />
       )} 
      </View>

      
  )
      }

      export default DatePicker