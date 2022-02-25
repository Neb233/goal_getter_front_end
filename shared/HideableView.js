import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";

const HideableView = (props) => {
  const { children, hidden, style } = props;
  if (hidden) {
    return null;
  }
  return <View style={style}>{children}</View>;
};

export { HideableView };
