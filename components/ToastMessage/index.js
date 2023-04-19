import React from "react";
import { Dimensions, Text } from "react-native";
import { View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutUp,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/MaterialIcons";
import { COLORS } from "../../constants/themes";

const ToastMessage = (props) => {
  return (
    <View
      style={{
        height: Dimensions.get("window").height,
        position: "absolute",
        zIndex: 90,
        top: 0,
      }}
    >
      <Animated.View
        entering={FadeInUp}
        exiting={FadeOutUp}
        style={props?.style}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            width: "90%",
            padding: 20,
            shadowColor: "#003049",
            shadowOpacity: 0.4,
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 1 },
            elevation: 2,
            backgroundColor:
              props?.type === "info"
                ? "#20639F"
                : props?.type === "error"
                ? "#CD5C5C"
                : props?.type === "success"
                ? "#4BB543"
                : "#FFF",
            borderRadius: 5,
          }}
        >
          <Icon
            name={
              props?.type === "info"
                ? "info"
                : props?.type === "error"
                ? "error-outline"
                : props?.type === "success"
                ? "check-circle-outline"
                : ""
            }
            size={24}
            color="#F6F4F4"
          />
          <View>
            <Text
              style={{
                color: COLORS.white,
                fontFamily: "PoppinsBold",
                marginLeft: 10,
                fontSize: 16,
              }}
            >
              {props?.type === "info"
                ? "Info"
                : props?.type === "error"
                ? "Error"
                : props?.type === "success"
                ? "Success"
                : ""}
            </Text>
            <Text
              style={{
                color: COLORS.white,
                fontFamily: "PoppinsRegular",
                marginLeft: 10,
                fontSize: 14,
              }}
            >
              {props?.message}
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default ToastMessage;
