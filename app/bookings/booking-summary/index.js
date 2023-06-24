import React, { useEffect, useState } from "react";
import { Image, ScrollView, TouchableOpacity, View, Text, SafeAreaView } from "react-native";
import { COLORS } from "../../../constants/themes";
import { useRouter, useSearchParams } from "expo-router";
import ToastMessage from "../../../components/ToastMessage";
// import PayWithFlutterwave from "flutterwave-react-native";
// import { StripeProvider } from "@stripe/stripe-react-native";

// Icons
import currentLocationIcon from "../.././../assets/icons/currentLocationIcon.png";
import destinationIcon from "../.././../assets/icons/destinationIcon.png";
import carIcon from "../.././../assets/icons/carIcon.png";
import passengerIcon from "../.././../assets/icons/passengerIcon.png";
import timeIcon from "../.././../assets/icons/timeIcon.png";
import priorityPassIcon from "../.././../assets/icons/priorityPassIcon.png";
import calendarIcon from "../.././../assets/icons/calendarIcon.png";

const BookingSummaryPage = () => {
  const router = useRouter();

  const params = useSearchParams();
  const {
    pickupAirport,
    dropoffAddress,
    date,
    passengers,
    carPicked,
    dropoffAirport,
    pickupAddress,
    bookingType,
    pass,
    time,
    airport,
    service,
    total,
    days,
    flightNumber,
    airline,
    countryCode,
    email,
  } = params;

  // STATES
  // TOAST CONFIGS
  const [isToasting, setIsToasting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");
  // PRIORITY PASS SETUP
  const [priorityPasses, setPriorityPasses] = useState();
  const [priorityPassAdded, setPriorityPassAdded] = useState(false);
  const [selectedPass, setSelectedPass] = useState();
  const [numberOfPass, setNumberOfPass] = useState(1);
  // CAR HIRE HANDLER
  const [isCarHireLoading, setIsCarHireLoading] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView style={{ flex: 1 }}>
        {/* TOAST MESSAGE */}
        {isToasting && (
          <ToastMessage
            type={toastType}
            message={toastMessage}
            style={{
              position: "absolute",
              zIndex: 100,
              top: 0,
              width: Dimensions.get("window").width,
              flexDirection: "row",
              justifyContent: "center",
            }}
          />
        )}
        {/* STRIPE WRAPPER */}
        {/* <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}> */}
        <Text
          style={{
            fontSize: Platform.OS === "ios" ? 24 : 20,
            fontFamily: "PoppinsBold",
            color: COLORS.shuttlelanePurple,
          }}
        >
          Booking Summary
        </Text>

        {/* BOOKING TYPE */}
        <Text
          style={{
            fontSize: Platform.OS === "ios" ? 16 : 12,
            fontFamily: "PoppinsSemiBold",
          }}
        >
          {bookingType}
        </Text>

        <View style={{ marginTop: 20 }}>
          <View
            style={{
              //   backgroundColor: COLORS.shuttlelaneYellowFaded,
              // padding: ,
              marginVertical: 10,
              borderRadius: 10,
            }}
          >
            {pickupAirport && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={currentLocationIcon}
                  resizeMode="cover"
                  style={{ width: 28, height: 28 }}
                />
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                  }}
                >
                  {airportPicked?.airportName}
                </Text>
              </View>
            )}

            {service && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={passengerIcon}
                  resizeMode="cover"
                  style={{ width: 28, height: 28 }}
                />
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                  }}
                >
                  {service}
                </Text>
              </View>
            )}

            {dropoffAddress && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={destinationIcon}
                  resizeMode="cover"
                  style={{ width: 28, height: 28 }}
                />
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                  }}
                >
                  {dropoffAddress}
                </Text>
              </View>
            )}

            {pickupAddress && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={currentLocationIcon}
                  resizeMode="cover"
                  style={{ width: 28, height: 28 }}
                />
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                  }}
                >
                  {pickupAddress}
                </Text>
              </View>
            )}

            {dropoffAirport && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={destinationIcon}
                  resizeMode="cover"
                  style={{ width: 28, height: 28 }}
                />
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                  }}
                >
                  {airportPicked?.airportName}
                </Text>
              </View>
            )}

            {airline && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}
              >
                {/* <Image
                    source={destinationIcon}
                    resizeMode="cover"
                    style={{ width: 28, height: 28 }}
                  /> */}
                <Icon
                  name="flight"
                  size={14}
                  style={{ marginRight: 5, marginTop: -5 }}
                />
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                  }}
                >
                  {airline}
                </Text>
              </View>
            )}

            {flightNumber && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}
              >
                {/* <Image
                    source={destinationIcon}
                    resizeMode="cover"
                    style={{ width: 28, height: 28 }}
                  /> */}
                <Icon
                  name="flight-takeoff"
                  size={14}
                  style={{ marginRight: 5, marginTop: -5 }}
                />
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                  }}
                >
                  {flightNumber}
                </Text>
              </View>
            )}

            {airport && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={destinationIcon}
                  resizeMode="cover"
                  style={{ width: 28, height: 28 }}
                />
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                  }}
                >
                  {airportPicked?.airportName}
                </Text>
              </View>
            )}

            {passengers && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={passengerIcon}
                  resizeMode="cover"
                  style={{ width: 28, height: 28 }}
                />
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                  }}
                >
                  {passengers}
                </Text>
              </View>
            )}

            {pass && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={priorityPassIcon}
                  resizeMode="cover"
                  style={{ width: 28, height: 28 }}
                />
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                  }}
                >
                  {pass}
                </Text>
              </View>
            )}

            {carPicked && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={carIcon}
                  resizeMode="cover"
                  style={{ width: 30, height: 30 }}
                />
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                    textTransform: "capitalize",
                  }}
                >
                  {carPicked}
                </Text>
              </View>
            )}

            {date && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={calendarIcon}
                  resizeMode="cover"
                  style={{ width: 30, height: 30 }}
                />
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                    textTransform: "capitalize",
                  }}
                >
                  {date}
                </Text>
              </View>
            )}

            {time && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={timeIcon}
                  resizeMode="cover"
                  style={{ width: 30, height: 30 }}
                />
                <Text
                  style={{
                    fontFamily: "PoppinsRegular",
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                    textTransform: "capitalize",
                  }}
                >
                  {time}
                </Text>
              </View>
            )}
          </View>

          {/* PASS OPTION */}
          <View style={{ marginTop: 10 }}>
            {priorityPassAdded && (
              <>
                <SelectList
                  setSelected={(value) => {
                    setSelectedPass(value);
                  }}
                  data={priorityPasses}
                  arrowicon={
                    <Image
                      source={arrowDownIcon}
                      style={{ width: 40, height: 40, marginTop: -8 }}
                      resizeMode="cover"
                    />
                  }
                  closeicon={
                    <Image
                      source={closeIcon}
                      style={{ width: 50, height: 50, marginTop: -1 }}
                      resizeMode="cover"
                    />
                  }
                  boxStyles={{
                    borderRadius: 10,
                    borderWidth: 0.5,
                    borderColor: "#C9C9C9",
                    height: 50,
                    padding: 10,
                  }}
                  dropdownItemStyles={{
                    marginVertical: 5,
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                  }}
                  dropdownStyles={{
                    borderRadius: 10,
                    borderWidth: 0.5,
                    borderColor: "#C9C9C9",
                    padding: 10,
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                  }}
                  inputStyles={{
                    fontFamily: "PoppinsRegular",
                    color: "#C9C9C9",
                    marginTop: 4,
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                  }}
                  dropdownTextStyles={{
                    fontFamily: "PoppinsRegular",
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                  }}
                  placeholder="Select Pass"
                  searchPlaceholder="Search passes"
                />
              </>
            )}
          </View>
          {/* PASS OPTION */}
          <View style={{ marginTop: 10 }}>
            {priorityPassAdded && (
              <>
                <SelectList
                  setSelected={(value) => {
                    setNumberOfPass(value);
                  }}
                  data={[
                    {
                      key: "1",
                      value: "1",
                    },
                    {
                      key: "2",
                      value: "2",
                    },
                    {
                      key: "3",
                      value: "3",
                    },
                    {
                      key: "4",
                      value: "4",
                    },
                    {
                      key: "5",
                      value: "5",
                    },
                    {
                      key: "6",
                      value: "6",
                    },
                  ]}
                  arrowicon={
                    <Image
                      source={arrowDownIcon}
                      style={{ width: 40, height: 40, marginTop: -8 }}
                      resizeMode="cover"
                    />
                  }
                  closeicon={
                    <Image
                      source={closeIcon}
                      style={{ width: 50, height: 50, marginTop: -1 }}
                      resizeMode="cover"
                    />
                  }
                  boxStyles={{
                    borderRadius: 10,
                    borderWidth: 0.5,
                    borderColor: "#C9C9C9",
                    height: 50,
                    padding: 10,
                  }}
                  dropdownItemStyles={{
                    marginVertical: 5,
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                  }}
                  dropdownStyles={{
                    borderRadius: 10,
                    borderWidth: 0.5,
                    borderColor: "#C9C9C9",
                    padding: 10,
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                  }}
                  inputStyles={{
                    fontFamily: "PoppinsRegular",
                    color: "#C9C9C9",
                    marginTop: 4,
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                  }}
                  dropdownTextStyles={{
                    fontFamily: "PoppinsRegular",
                    fontSize: Platform.OS === "ios" ? 16 : 12,
                  }}
                  placeholder="Number of pass"
                  // search={false}
                  searchPlaceholder="Input Number (Max 6)"
                />
              </>
            )}
          </View>

          {/* TOTAL */}
          {/* <View
              style={{
                backgroundColor: COLORS.shuttlelaneYellowFaded,
                padding: 10,
                borderRadius: 10,
                marginTop: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "PoppinsBold",
                    textAlign: "center",
                    fontSize: Platform.OS === "ios" ? 24 : 20,
                    textTransform: "uppercase",
                  }}
                >
                  TOTAL:
                </Text>
                <Text
                  style={{
                    fontFamily: "PoppinsBold",
                    textAlign: "center",
                    fontSize: Platform.OS === "ios" ? 24 : 20,
                    marginHorizontal: 10,
                    textTransform: "uppercase",
                  }}
                >
                  {user?.currency === "dollars"
                    ? "$"
                    : user?.currency === "neira"
                    ? "₦"
                    : user?.currency === "pounds"
                    ? "£"
                    : user?.currency === "euros"
                    ? "€"
                    : "!"}
                  {(!orderTotal || !priorityPassAdded) && (
                    <>
                      {total?.includes(",")
                        ? total
                        : Intl.NumberFormat("en-US", {}).format(total)}
                    </>
                  )}

                  {!isNaN(orderTotal) && priorityPassAdded && (
                    <>{Number(orderTotal)?.toFixed(2)}</>
                  )}
                </Text>
              </View>
            </View> */}
        </View>

        {(bookingType == "Airport Pickup" ||
          bookingType == "Airport Dropoff") && (
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
              borderColor: "#D9D9D9",
              borderWidth: 0.4,
              height: 30,
              flexDirection: "row",
            }}
            onPress={() => {
              setPriorityPassAdded(!priorityPassAdded);
            }}
          >
            {priorityPassAdded && (
              <Icon name="check" size={18} color="#4BB543" />
            )}
            <Text
              style={{
                fontFamily: "PoppinsRegular",
                fontSize: Platform.OS === "ios" ? 16 : 12,
              }}
            >
              Add Priority Pass
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ marginTop: 20 }}>
          {bookingType !== "Car Hire" && (
            <View
              style={{
                padding: 10,
                borderRadius: 10,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "column",
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: Platform.OS === "ios" ? 18 : 14,
                    fontFamily: "PoppinsSemiBold",
                  }}
                >
                  Pay with:
                </Text>

                {/* PAYMENT OPTIONS */}
                <View style={{ width: "100%", alignItems: "center" }}>
                  {/* PAYPAL PAYMENT */}
                  {/* {user?.currency !== "neira" && (
                      <TouchableOpacity
                        style={{
                          borderWidth: 1,
                          marginTop: 20,
                          borderColor: "#C9C9C9",
                          width: "100%",
                          alignItems: "center",
                          justifyContent: "center",
                          height: 60,
                          borderRadius: 10,
                        }}
                        onPress={payWithPayPal}
                      >
                        <Image
                          source={paypal}
                          style={{ width: 100, height: 100 }}
                          resizeMode="cover"
                        />
                      </TouchableOpacity>
                    )} */}

                  {/* FLUTTERWAVE PAYMENT */}
                  {/* <PayWithFlutterwave
                      onRedirect={handleOnRedirect}
                      options={{
                        tx_ref: generateTransactionRef(10),
                        authorization: FLUTTERWAVE_KEY,
                        customer: {
                          email: `${email}` ?? `${user?.email}`,
                        },
                        amount:
                          !priorityPassAdded && total?.includes(",")
                            ? Number(
                                `${total.split(",")[0]}${total.split(",")[1]}`
                              )
                            : priorityPassAdded
                            ? Number(orderTotal)
                            : Number(total),
                        currency:
                          user?.currency === "neira"
                            ? "NGN"
                            : user?.currency === "dollars"
                            ? "USD"
                            : user?.currency === "pounds"
                            ? "GBP"
                            : user?.currency === "euros"
                            ? "EUR"
                            : "NGN",
                        payment_options: "card",
                      }}
                      customButton={(props) => (
                        <TouchableOpacity
                          style={{
                            borderWidth: 1,
                            marginTop: 20,
                            borderColor: "#C9C9C9",
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            height: 60,
                            borderRadius: 10,
                          }}
                          onPress={props.onPress}
                          isBusy={props.isInitializing}
                          disabled={props.disabled}
                        >
                          <Image
                            source={flutterwave}
                            style={{ width: 110, height: 110 }}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      )}
                    /> */}

                  {/* STRIPE PAYMENT */}
                  {/* <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        marginTop: 20,
                        borderColor: "#C9C9C9",
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 60,
                        borderRadius: 10,
                      }}
                      onPress={payWithStripe}
                    >
                      {!isStripeLoading && (
                        <Image
                          source={stripeLogo}
                          style={{ width: 100, height: 100 }}
                          resizeMode="contain"
                        />
                      )}

                      {isStripeLoading && <ActivityIndicator size={32} />}
                    </TouchableOpacity> */}
                </View>
              </View>
            </View>
          )}

          {bookingType == "Car Hire" && (
            <TouchableOpacity
              style={{
                height: 50,
                padding: 10,
                paddingHorizontal: 20,
                fontSize: 16,
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
                borderColor: "#000",
                borderWidth: 1,
                borderRadius: 10,
                backgroundColor: COLORS.shuttlelanePurple,
              }}
              onPress={() => carHireHandler()}
            >
              <Text
                style={{
                  fontFamily: "PoppinsRegular",
                  color: "#FFF",
                }}
              >
                {isCarHireLoading ? (
                  <ActivityIndicator size={32} color="#FFF" />
                ) : (
                  "Make Booking"
                )}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {/* </StripeProvider> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingSummaryPage;
