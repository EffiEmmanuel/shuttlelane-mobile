import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { COLORS } from "../../../constants/themes";
import { Link, Stack, useRouter, useSearchParams } from "expo-router";
import logo from "../../../assets/images/logo.png";
import { TextInput } from "react-native";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import arrowBackIcon from "../../../assets/icons/arrowBackIcon.png";
//   import SignupForm from "../forms/SignupForm";
import { StyleSheet } from "react-native";
import UserDetailsForm from "../../../forms/UserDetailsForm";

const UserDetails = () => {
  //   ROUTER
  const router = useRouter();

  const {
    bookingType,
    pickupAirport,
    dropoffAddress,
    passengers,
    date,
    time,
    carPicked,
    total,
    flightNumber,
    pickupAddress,
    days,
    service,
    airport,
    pass,
    airline,
  } = useSearchParams();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white, position: "relative" }}
    >
      <Stack.Screen
        options={{
          headerTitle: "",
          headerStyle: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            width: Dimensions.get("window").width,
          },
          headerLeft: null,
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, padding: 20 }}>
          <UserDetailsForm
            bookingType={bookingType}
            pickupAirport={pickupAirport}
            dropoffAddress={dropoffAddress}
            passengers={passengers}
            date={date}
            time={time}
            carPicked={carPicked}
            total={total}
            flightNumber={flightNumber}
            pickupAddress={pickupAddress}
            days={days}
            service={service}
            airport={airport}
            pass={pass}
            airline={airline}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  headerImage: { width: 100, height: 100, marginTop: -28 },
});

export default UserDetails;
