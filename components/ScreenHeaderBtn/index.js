import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

const ScreenHeaderBtn = ({ icon, dimensions, handlePress }) => {
  return (
    <TouchableOpacity style={{ padding: 10 }}>
      <Image source={icon} resizeMode="cover" style={{ height: 28, width: 28 }} />
    </TouchableOpacity>
  );
};

export default ScreenHeaderBtn;
