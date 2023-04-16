import React, { useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { COLORS } from "../../constants/themes";
import {
  PaperAirplaneIcon,
  TruckIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import airplaneIcon from "../../assets/icons/airportPass.png";
import carHireIcon from "../../assets/icons/carHire.png";
import priorityPassIcon from "../../assets/icons/proprityPassIcon.png";
import searchIcon from "../../assets/icons/searchIcon.png";

const Welcome = () => {
  const router = useRouter();

  // Search State
  const [search, setSearch] = useState("");
  return (
    <View style={{ marginTop: 30 }}>
      <View style={{}}>
        <Text style={{ fontSize: 18, fontFamily: "PoppinsRegular" }}>
          Hello, Emmanuel.
        </Text>
        <Text
          style={{
            fontSize: 24,
            marginTop: 5,
            fontWeight: "500",
            color: COLORS.shuttlelanePurple,
            fontFamily: "PoppinsBold",
          }}
        >
          Schedule your next booking
        </Text>
      </View>

      <View
        style={{
          paddingHorizontal: 35,
          marginTop: 40,
          backgroundColor: "#FBFBFB",
          paddingVertical: 14,
          borderRadius: 20,
        }}
      >
        <View
          style={{
            marginTop: -10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => router.push('/bookings/airport-transfer')}
            >
              {/* <PaperAirplaneIcon style={{ width: 24, rotate: "-90deg" }} /> */}
              <Image source={airplaneIcon} style={{ width: 55, height: 55 }} />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 12,
                marginTop: -5,
                color: "#A1A1A1",
                fontFamily: "PoppinsRegular",
              }}
            >
              Airport Transfer
            </Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => router.push('/bookings/car-hire')}
            >
              <Image source={carHireIcon} style={{ width: 60, height: 60 }} />
              <Text
                style={{
                  fontSize: 13,
                  marginTop: -10,
                  color: "#A1A1A1",
                  fontFamily: "PoppinsRegular",
                }}
              >
                Car Hire
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => router.push('/bookings/priority-pass')}
            >
              <Image
                source={priorityPassIcon}
                style={{ width: 53, height: 53 }}
              />
              <Text
                style={{
                  fontSize: 13,
                  marginTop: -5,
                  color: "#A1A1A1",
                  fontFamily: "PoppinsRegular",
                }}
              >
                Priority Pass
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search bookings */}
      <View style={{ marginTop: 40, flexDirection: "row", width: "100%" }}>
        <TextInput
          style={{
            padding: 10,
            paddingHorizontal: 20,
            borderColor: "#C9C9C9",
            borderWidth: 0.5,
            height: 55,
            borderRadius: 10,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            fontFamily: "PoppinsRegular",
            width: "85%",
          }}
          placeholder="Search for a booking"
          placeholderTextColor="#C9C9C9"
          value={search}
          onChangeText={(text) => {
            setSearch(text);
          }}
        />

        <TouchableOpacity
          style={{
            backgroundColor: COLORS.shuttlelaneYellow,
            width: "15%",
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={searchIcon}
            style={{ width: 45, height: 45 }}
            resizeMode="cover"
            width={30}
            height={30}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Welcome;
