import { Stack, useRouter, useSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../../../../../constants/themes";
import arrowBackIcon from "../../../../../assets/icons/arrowBackIcon.png";
import currentLocationIcon from "../../../../../assets/icons/currentLocationIcon.png";
import destinationIcon from "../../../../../assets/icons/destinationIcon.png";
import passengerIcon from "../../../../../assets/icons/passengerIcon.png";
import luggageIcon from "../../../../../assets/icons/luggageIcon.png";

// CARS
import economy from "../../../../../assets/images/cars/economy.png";

const AirportDropoffStepTwo = () => {
  const params = useSearchParams();
  const { dropoffAirport, pickupAddress, date, passengers } = params;

  const router = useRouter();

  // CAR STATE
  const [carPicked, setCarPicked] = useState("");

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.white, display: "relative" }}
    >
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: COLORS.white,
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity style={{}} onPress={() => router.back()}>
              <Image
                source={arrowBackIcon}
                resizeMode="cover"
                style={{ width: 45, height: 45 }}
              />
            </TouchableOpacity>
          ),
          headerTitle: "",
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: COLORS.white, padding: 20 }}
      >
        <View
          style={{
            backgroundColor: COLORS.shuttlelaneYellowFaded,
            padding: 10,
            borderRadius: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={currentLocationIcon}
              resizeMode="cover"
              style={{ width: 28, height: 28 }}
            />
            <Text style={{ fontFamily: "PoppinsRegular" }}>
              {dropoffAirport}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={destinationIcon}
              resizeMode="cover"
              style={{ width: 28, height: 28 }}
            />
            <Text style={{ fontFamily: "PoppinsRegular" }}>
              {pickupAddress}
            </Text>
          </View>
        </View>

        {/* CARS */}
        <View style={{ marginTop: 20, paddingBottom: 80 }}>
          {/* CAR */}
          <TouchableOpacity
            onPress={() => {
              setCarPicked("economy");
              router.push({
                pathname: "/bookings/summary",
                params: {
                  bookingType: "Airport Dropoff",
                  dropoffAirport,
                  pickupAddress,
                  passengers,
                  date,
                  carPicked: "economy",
                },
              });
            }}
            style={{
              borderRadius: 10,
              borderWidth: 0.5,
              borderColor: "#C9C9C9",
              height: 160,
              padding: 20,
              marginVertical: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 22 }}>
                Salon
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* PASSENGERS */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={passengerIcon}
                    resizeMode="cover"
                    style={{ width: 38, height: 38 }}
                  />
                  <Text style={{ fontFamily: "PoppinsRegular" }}>4</Text>
                </View>
                {/* LUGGAGE */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={luggageIcon}
                    resizeMode="cover"
                    style={{ width: 38, height: 38 }}
                  />
                  <Text style={{ fontFamily: "PoppinsRegular" }}>3</Text>
                </View>
                {/* BOXES */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={luggageIcon}
                    resizeMode="cover"
                    style={{ width: 38, height: 38 }}
                  />
                  <Text style={{ fontFamily: "PoppinsRegular" }}>0</Text>
                </View>
              </View>
            </View>
            {/* CAR AND PRICE */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: -10,
              }}
            >
              <Image
                source={economy}
                resizeMode="contain"
                style={{ height: 130, width: 130 }}
              />
              <Text
                style={{
                  fontFamily: "PoppinsBold",
                  fontSize: 32,
                  color: COLORS.green,
                }}
              >
                $24
              </Text>
            </View>
          </TouchableOpacity>
          {/* CAR */}
          <TouchableOpacity
            onPress={() => {
              setCarPicked("economy");
              router.push({
                pathname: "/bookings/summary",
                params: {
                  bookingType: "Airport Dropoff",
                  dropoffAirport,
                  pickupAddress,
                  passengers,
                  date,
                  carPicked,
                },
              });
            }}
            style={{
              borderRadius: 10,
              borderWidth: 0.5,
              borderColor: "#C9C9C9",
              height: 160,
              padding: 20,
              marginVertical: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 22 }}>
                Salon
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* PASSENGERS */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={passengerIcon}
                    resizeMode="cover"
                    style={{ width: 38, height: 38 }}
                  />
                  <Text style={{ fontFamily: "PoppinsRegular" }}>4</Text>
                </View>
                {/* LUGGAGE */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={luggageIcon}
                    resizeMode="cover"
                    style={{ width: 38, height: 38 }}
                  />
                  <Text style={{ fontFamily: "PoppinsRegular" }}>3</Text>
                </View>
                {/* BOXES */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={luggageIcon}
                    resizeMode="cover"
                    style={{ width: 38, height: 38 }}
                  />
                  <Text style={{ fontFamily: "PoppinsRegular" }}>0</Text>
                </View>
              </View>
            </View>
            {/* CAR AND PRICE */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: -10,
              }}
            >
              <Image
                source={economy}
                resizeMode="contain"
                style={{ height: 130, width: 130 }}
              />
              <Text
                style={{
                  fontFamily: "PoppinsBold",
                  fontSize: 32,
                  color: COLORS.green,
                }}
              >
                $24
              </Text>
            </View>
          </TouchableOpacity>
          {/* CAR */}
          <TouchableOpacity
            onPress={() => {
              setCarPicked("economy");
              router.push({
                pathname: "/bookings/summary",
                params: {
                  bookingType: "Airport Dropoff",
                  dropoffAirport,
                  pickupAddress,
                  passengers,
                  date,
                  carPicked,
                },
              });
            }}
            style={{
              borderRadius: 10,
              borderWidth: 0.5,
              borderColor: "#C9C9C9",
              height: 160,
              padding: 20,
              marginVertical: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 22 }}>
                Salon
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* PASSENGERS */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={passengerIcon}
                    resizeMode="cover"
                    style={{ width: 38, height: 38 }}
                  />
                  <Text style={{ fontFamily: "PoppinsRegular" }}>4</Text>
                </View>
                {/* LUGGAGE */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={luggageIcon}
                    resizeMode="cover"
                    style={{ width: 38, height: 38 }}
                  />
                  <Text style={{ fontFamily: "PoppinsRegular" }}>3</Text>
                </View>
                {/* BOXES */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={luggageIcon}
                    resizeMode="cover"
                    style={{ width: 38, height: 38 }}
                  />
                  <Text style={{ fontFamily: "PoppinsRegular" }}>0</Text>
                </View>
              </View>
            </View>
            {/* CAR AND PRICE */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: -10,
              }}
            >
              <Image
                source={economy}
                resizeMode="contain"
                style={{ height: 130, width: 130 }}
              />
              <Text
                style={{
                  fontFamily: "PoppinsBold",
                  fontSize: 32,
                  color: COLORS.green,
                }}
              >
                $24
              </Text>
            </View>
          </TouchableOpacity>
          {/* CAR */}
          <TouchableOpacity
            onPress={() => {
              setCarPicked("economy");
              router.push({
                pathname: "/bookings/summary",
                params: {
                  bookingType: "Airport Dropoff",
                  dropoffAirport,
                  pickupAddress,
                  passengers,
                  date,
                  carPicked,
                },
              });
            }}
            style={{
              borderRadius: 10,
              borderWidth: 0.5,
              borderColor: "#C9C9C9",
              height: 160,
              padding: 20,
              marginVertical: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 22 }}>
                Salon
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* PASSENGERS */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={passengerIcon}
                    resizeMode="cover"
                    style={{ width: 38, height: 38 }}
                  />
                  <Text style={{ fontFamily: "PoppinsRegular" }}>4</Text>
                </View>
                {/* LUGGAGE */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={luggageIcon}
                    resizeMode="cover"
                    style={{ width: 38, height: 38 }}
                  />
                  <Text style={{ fontFamily: "PoppinsRegular" }}>3</Text>
                </View>
                {/* BOXES */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={luggageIcon}
                    resizeMode="cover"
                    style={{ width: 38, height: 38 }}
                  />
                  <Text style={{ fontFamily: "PoppinsRegular" }}>0</Text>
                </View>
              </View>
            </View>
            {/* CAR AND PRICE */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: -10,
              }}
            >
              <Image
                source={economy}
                resizeMode="contain"
                style={{ height: 130, width: 130 }}
              />
              <Text
                style={{
                  fontFamily: "PoppinsBold",
                  fontSize: 32,
                  color: COLORS.green,
                }}
              >
                $24
              </Text>
            </View>
          </TouchableOpacity>
          {/* CAR */}
          <TouchableOpacity
            onPress={() => {
              setCarPicked("economy");
              router.push({
                pathname: "/bookings/summary",
                params: {
                  bookingType: "Airport Dropoff",
                  dropoffAirport,
                  pickupAddress,
                  passengers,
                  date,
                  carPicked,
                },
              });
            }}
            style={{
              borderRadius: 10,
              borderWidth: 0.5,
              borderColor: "#C9C9C9",
              height: 160,
              padding: 20,
              marginVertical: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 22 }}>
                Salon
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* PASSENGERS */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={passengerIcon}
                    resizeMode="cover"
                    style={{ width: 38, height: 38 }}
                  />
                  <Text style={{ fontFamily: "PoppinsRegular" }}>4</Text>
                </View>
                {/* LUGGAGE */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={luggageIcon}
                    resizeMode="cover"
                    style={{ width: 38, height: 38 }}
                  />
                  <Text style={{ fontFamily: "PoppinsRegular" }}>3</Text>
                </View>
                {/* BOXES */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={luggageIcon}
                    resizeMode="cover"
                    style={{ width: 38, height: 38 }}
                  />
                  <Text style={{ fontFamily: "PoppinsRegular" }}>0</Text>
                </View>
              </View>
            </View>
            {/* CAR AND PRICE */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: -10,
              }}
            >
              <Image
                source={economy}
                resizeMode="contain"
                style={{ height: 130, width: 130 }}
              />
              <Text
                style={{
                  fontFamily: "PoppinsBold",
                  fontSize: 32,
                  color: COLORS.green,
                }}
              >
                $24
              </Text>
            </View>
          </TouchableOpacity>
          {/* CAR */}
          <TouchableOpacity
            onPress={() => {
              setCarPicked("economy");
              router.push({
                pathname: "/bookings/summary",
                params: {
                  bookingType: "Airport Dropoff",
                  dropoffAirport,
                  pickupAddress,
                  passengers,
                  date,
                  carPicked,
                },
              });
            }}
            style={{
              borderRadius: 10,
              borderWidth: 0.5,
              borderColor: "#C9C9C9",
              height: 160,
              padding: 20,
              marginVertical: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 22 }}>
                Salon
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* PASSENGERS */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={passengerIcon}
                    resizeMode="cover"
                    style={{ width: 38, height: 38 }}
                  />
                  <Text style={{ fontFamily: "PoppinsRegular" }}>4</Text>
                </View>
                {/* LUGGAGE */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={luggageIcon}
                    resizeMode="cover"
                    style={{ width: 38, height: 38 }}
                  />
                  <Text style={{ fontFamily: "PoppinsRegular" }}>3</Text>
                </View>
                {/* BOXES */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={luggageIcon}
                    resizeMode="cover"
                    style={{ width: 38, height: 38 }}
                  />
                  <Text style={{ fontFamily: "PoppinsRegular" }}>0</Text>
                </View>
              </View>
            </View>
            {/* CAR AND PRICE */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: -10,
              }}
            >
              <Image
                source={economy}
                resizeMode="contain"
                style={{ height: 130, width: 130 }}
              />
              <Text
                style={{
                  fontFamily: "PoppinsBold",
                  fontSize: 32,
                  color: COLORS.green,
                }}
              >
                $24
              </Text>
            </View>
          </TouchableOpacity>
          {/* CAR */}
          <TouchableOpacity
            onPress={() => {
              setCarPicked("economy");
              router.push({
                pathname: "/bookings/summary",
                params: {
                  bookingType: "Airport Dropoff",
                  dropoffAirport,
                  pickupAddress,
                  passengers,
                  date,
                  carPicked,
                },
              });
            }}
            style={{
              borderRadius: 10,
              borderWidth: 0.5,
              borderColor: "#C9C9C9",
              height: 160,
              padding: 20,
              marginVertical: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontFamily: "PoppinsBold", fontSize: 22 }}>
                Salon
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* PASSENGERS */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={passengerIcon}
                    resizeMode="cover"
                    style={{ width: 38, height: 38 }}
                  />
                  <Text style={{ fontFamily: "PoppinsRegular" }}>4</Text>
                </View>
                {/* LUGGAGE */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={luggageIcon}
                    resizeMode="cover"
                    style={{ width: 38, height: 38 }}
                  />
                  <Text style={{ fontFamily: "PoppinsRegular" }}>3</Text>
                </View>
                {/* BOXES */}
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={luggageIcon}
                    resizeMode="cover"
                    style={{ width: 38, height: 38 }}
                  />
                  <Text style={{ fontFamily: "PoppinsRegular" }}>0</Text>
                </View>
              </View>
            </View>
            {/* CAR AND PRICE */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: -10,
              }}
            >
              <Image
                source={economy}
                resizeMode="contain"
                style={{ height: 130, width: 130 }}
              />
              <Text
                style={{
                  fontFamily: "PoppinsBold",
                  fontSize: 32,
                  color: COLORS.green,
                }}
              >
                $24
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AirportDropoffStepTwo;
