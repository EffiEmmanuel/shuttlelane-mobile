import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

const ScreenHeaderBtn = ({ icon, height, width, handlePress }) => {
  return (
    <TouchableOpacity style={{ padding: 10 }}>
      <Image source={icon} resizeMode="contain" style={{ height: height ?? 28, width: width ?? 28 }} />
    </TouchableOpacity>
  );
};

export default ScreenHeaderBtn;
