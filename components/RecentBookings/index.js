import React from "react";
import { Image, Text, View } from "react-native";
import { COLORS } from "../../constants/themes";
import priorityPassWhite from "../../assets/icons/priorityPassWhite.png";

const RecentBookings = () => {
  return (
    <View style={{ marginTop: 40 }}>
      <View style={{}}>
        <Text
          style={{
            fontSize: 24,
            marginTop: 5,
            fontWeight: "500",
            color: COLORS.shuttlelanePurple,
            fontFamily: 'PoppinsBold'
          }}
        >
          Recent Bookings
        </Text>
      </View>

      <View style={{ marginTop: 20 }}>
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 16, fontFamily: 'PoppinsSemiBold' }}>Today</Text>
        </View>

        <View style={{ marginTop: 10 }}>
          <View
            style={{
              backgroundColor: "#FBFBFB",
              flexDirection: "row",
              padding: 20,
              marginTop: 10,
              borderRadius: 20,
            }}
          >
            {/* Booking Type */}
            <View style={{ justifyContent: "center" }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: COLORS.shuttlelaneYellow,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={priorityPassWhite}
                  style={{ width: 40, height: 40 }}
                />
              </View>
            </View>

            {/* Booking Dropoff and Pickup addresses */}
            <View style={{ justifyContent: "center" }}>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderColor: "#C9C9C9",
                    borderWidth: "1px",
                    borderRadius: "50%",
                    marginHorizontal: 10,
                  }}
                ></View>
                <Text numberOfLines={1} style={{ maxWidth: "70%", fontFamily: 'PoppinsRegular' }}>
                  Pick up: 4 Ganiu Lawal, Lekki Phase 1
                </Text>
              </View>
              <View
                style={{
                  width: 2,
                  height: 30,
                  marginLeft: 16.5,
                  backgroundColor: "#D9D9D9",
                }}
              ></View>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderColor: "#C9C9C9",
                    borderWidth: "1px",
                    borderRadius: "50%",
                    marginHorizontal: 10,
                  }}
                ></View>
                <Text numberOfLines={1} style={{ maxWidth: "70%", fontFamily: 'PoppinsRegular' }}>
                  Dropoff: Murtala Mohammed Airport
                </Text>
              </View>
            </View>

            {/* Booking Price */}
            <View
              style={{
                // height: "100%",
                justifyContent: "center",
                marginLeft: -12,
              }}
            >
              <Text
                style={{ fontSize: 20, color: COLORS.green, fontFamily: 'PoppinsBold' }}
              >
                $25
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "#FBFBFB",
              flexDirection: "row",
              padding: 20,
              marginTop: 10,
              borderRadius: 20,
            }}
          >
            {/* Booking Type */}
            <View style={{ justifyContent: "center" }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: COLORS.shuttlelaneYellow,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={priorityPassWhite}
                  style={{ width: 40, height: 40 }}
                />
              </View>
            </View>

            {/* Booking Dropoff and Pickup addresses */}
            <View style={{ justifyContent: "center" }}>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderColor: "#C9C9C9",
                    borderWidth: "1px",
                    borderRadius: "50%",
                    marginHorizontal: 10,
                  }}
                ></View>
                <Text numberOfLines={1} style={{ maxWidth: "70%", fontFamily: 'PoppinsRegular' }}>
                  Pick up: 4 Ganiu Lawal, Lekki Phase 1
                </Text>
              </View>
              <View
                style={{
                  width: 2,
                  height: 30,
                  marginLeft: 16.5,
                  backgroundColor: "#D9D9D9",
                }}
              ></View>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderColor: "#C9C9C9",
                    borderWidth: "1px",
                    borderRadius: "50%",
                    marginHorizontal: 10,
                  }}
                ></View>
                <Text numberOfLines={1} style={{ maxWidth: "70%" }}>
                  Dropoff: Murtala Mohammed Airport
                </Text>
              </View>
            </View>

            {/* Booking Price */}
            <View
              style={{
                justifyContent: "center",
                marginLeft: -12,
              }}
            >
              <Text
                style={{ fontSize: 20, color: COLORS.green, fontFamily: 'PoppinsBold' }}
              >
                $15
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 16 }}>Yesterday</Text>
        </View>

        <View style={{ marginTop: 10 }}>
          <View
            style={{
              backgroundColor: "#FBFBFB",
              flexDirection: "row",
              padding: 20,
              marginTop: 10,
              borderRadius: 20,
            }}
          >
            {/* Booking Type */}
            <View style={{ justifyContent: "center" }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: COLORS.shuttlelaneYellow,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={priorityPassWhite}
                  style={{ width: 40, height: 40 }}
                />
              </View>
            </View>

            {/* Booking Dropoff and Pickup addresses */}
            <View style={{ justifyContent: "center" }}>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderColor: "#C9C9C9",
                    borderWidth: "1px",
                    borderRadius: "50%",
                    marginHorizontal: 10,
                  }}
                ></View>
                <Text numberOfLines={1} style={{ maxWidth: "70%" }}>
                  Pick up: 4 Ganiu Lawal, Lekki Phase 1
                </Text>
              </View>
              <View
                style={{
                  width: 2,
                  height: 30,
                  marginLeft: 16.5,
                  backgroundColor: "#D9D9D9",
                }}
              ></View>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderColor: "#C9C9C9",
                    borderWidth: "1px",
                    borderRadius: "50%",
                    marginHorizontal: 10,
                  }}
                ></View>
                <Text numberOfLines={1} style={{ maxWidth: "70%" }}>
                  Dropoff: Murtala Mohammed Airport
                </Text>
              </View>
            </View>

            {/* Booking Price */}
            <View
              style={{
                // height: "100%",
                justifyContent: "center",
                marginLeft: -12,
              }}
            >
              <Text
                style={{ fontSize: 20, color: COLORS.green, fontWeight: "600" }}
              >
                $25
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: "#FBFBFB",
              flexDirection: "row",
              padding: 20,
              marginTop: 10,
              borderRadius: 20,
            }}
          >
            {/* Booking Type */}
            <View style={{ justifyContent: "center" }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: COLORS.shuttlelaneYellow,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={priorityPassWhite}
                  style={{ width: 40, height: 40 }}
                />
              </View>
            </View>

            {/* Booking Dropoff and Pickup addresses */}
            <View style={{ justifyContent: "center" }}>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderColor: "#C9C9C9",
                    borderWidth: "1px",
                    borderRadius: "50%",
                    marginHorizontal: 10,
                  }}
                ></View>
                <Text numberOfLines={1} style={{ maxWidth: "70%" }}>
                  Pick up: 4 Ganiu Lawal, Lekki Phase 1
                </Text>
              </View>
              <View
                style={{
                  width: 2,
                  height: 30,
                  marginLeft: 16.5,
                  backgroundColor: "#D9D9D9",
                }}
              ></View>
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    width: 16,
                    height: 16,
                    borderColor: "#C9C9C9",
                    borderWidth: "1px",
                    borderRadius: "50%",
                    marginHorizontal: 10,
                  }}
                ></View>
                <Text numberOfLines={1} style={{ maxWidth: "70%" }}>
                  Dropoff: Murtala Mohammed Airport
                </Text>
              </View>
            </View>

            {/* Booking Price */}
            <View
              style={{
                justifyContent: "center",
                marginLeft: -12,
              }}
            >
              <Text
                style={{ fontSize: 20, color: COLORS.green, fontWeight: "600" }}
              >
                $15
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RecentBookings;
