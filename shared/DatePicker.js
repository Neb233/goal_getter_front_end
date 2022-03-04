import { StyleSheet, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { useField, useFormikContext } from "formik";
import { Button } from "react-native-paper";

const DatePicker = ({ ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const showDatePicker = (event) => {
    setShow(true);
  };

  return (
    <View
      style={{
        alignItems: "center",
        width: "100%",
      }}
    >
      <View style={{ margin: 20 }}>
        <Button
          mode="contained"
          title={`Set ${props.type} Date`}
          onPress={showDatePicker}
          style={styles.button}
        >
          Set {`${props.type}`} Date
        </Button>
      </View>

      {show && (
        <DateTimePicker
          {...field}
          {...props}
          value={date}
          mode="date"
          style={{
            color: "white",
            marginBottom: 20,
            width: 200,
            marginLeft: 86,
          }}
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate || date;
            setDate(currentDate);
            setFieldValue(field.name, currentDate);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: { width: 200, backgroundColor: "#3e4d6e" },
});

export default DatePicker;
