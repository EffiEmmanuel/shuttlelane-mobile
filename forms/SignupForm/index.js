import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { COLORS } from "../../constants/themes";
import { SelectList } from "react-native-dropdown-select-list";
import { Image } from "react-native";
import arrowDownIcon from "../../assets/icons/arrowDownIcon.png";
import closeIcon from "../../assets/icons/closeIcon.png";

const SignupForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [currency, setCurrency] = useState("");

  const currencies = [
    {
      key: "neira",
      value: "₦ - Naira",
    },
    {
      key: "pounds",
      value: "£ - Pounds",
    },
    {
      key: "dollars",
      value: "$ - Dollars",
    },
    {
      key: "euros",
      value: "€ - Euro",
    },
  ];

  async function signupUser() {
    const response = await fetch(
        "https://www.shuttlelane.com/api/users",
    //   "http://localhost:3001api/users",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email: email,
          mobile: mobile,
          password: password,
          currency: currency,
        }),
      }
    );
    const user = await response.json();
    console.log("RESPONSE:", response);
  }

  return (
    <View style={{ marginTop: 40, padding: 20 }}>
      <Text
        style={{
          fontSize: 24,
          fontFamily: "PoppinsBold",
          color: COLORS.shuttlelanePurple,
        }}
      >
        Sign up
      </Text>
      <Text
        style={{
          fontSize: 16,
          fontFamily: "PoppinsRegular",
          marginTop: 5,
        }}
      >
        Create an account today
      </Text>

      <View style={{ marginTop: 20 }}>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontFamily: "PoppinsRegular" }}>First name</Text>
          <TextInput
            value={firstName}
            style={{
              height: 50,
              padding: 10,
              paddingHorizontal: 20,
              fontSize: 16,
              marginTop: 10,
              fontFamily: "PoppinsRegular",
              borderColor: "#C9C9C9",
              borderWidth: 0.5,
              borderRadius: 10,
            }}
            placeholder="John"
            placeholderTextColor="#C9C9C9"
            onChangeText={(value) => setFirstName(value)}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontFamily: "PoppinsRegular" }}>Last name</Text>
          <TextInput
            value={lastName}
            style={{
              height: 50,
              padding: 10,
              paddingHorizontal: 20,
              fontSize: 16,
              marginTop: 10,
              fontFamily: "PoppinsRegular",
              borderColor: "#C9C9C9",
              borderWidth: 0.5,
              borderRadius: 10,
            }}
            placeholder="Doe"
            placeholderTextColor="#C9C9C9"
            onChangeText={(value) => setLastName(value)}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontFamily: "PoppinsRegular" }}>Email</Text>
          <TextInput
            value={email}
            style={{
              height: 50,
              padding: 10,
              paddingHorizontal: 20,
              fontSize: 16,
              marginTop: 10,
              fontFamily: "PoppinsRegular",
              borderColor: "#C9C9C9",
              borderWidth: 0.5,
              borderRadius: 10,
            }}
            keyboardType="email-address"
            returnKeyType="done"
            placeholder="abc@example.com"
            placeholderTextColor="#C9C9C9"
            onChangeText={(value) => setEmail(value)}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontFamily: "PoppinsRegular" }}>Phone Number</Text>
          <TextInput
            value={mobile}
            style={{
              height: 50,
              padding: 10,
              paddingHorizontal: 20,
              fontSize: 16,
              marginTop: 10,
              fontFamily: "PoppinsRegular",
              borderColor: "#C9C9C9",
              borderWidth: 0.5,
              borderRadius: 10,
            }}
            keyboardType="phone-pad"
            returnKeyType="done"
            placeholder="+23481234567890"
            placeholderTextColor="#C9C9C9"
            onChangeText={(value) => setMobile(value)}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontFamily: "PoppinsRegular" }}>Password</Text>
          <TextInput
            value={password}
            style={{
              height: 50,
              padding: 10,
              paddingHorizontal: 20,
              fontSize: 16,
              marginTop: 10,
              fontFamily: "PoppinsRegular",
              borderColor: "#C9C9C9",
              borderWidth: 0.5,
              borderRadius: 10,
            }}
            secureTextEntry={true}
            returnKeyType="done"
            placeholder="********"
            placeholderTextColor="#C9C9C9"
            onChangeText={(value) => setPassword(value)}
          />
        </View>

        {/* SERVICE SELECT DROPDOWN */}
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontFamily: "PoppinsRegular", marginTop: 10 }}>Currency</Text>
          <SelectList
            setSelected={(value) => setCurrency(value)}
            data={currencies}
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
              marginTop: 10
            }}
            dropdownItemStyles={{
              marginVertical: 5,
            }}
            dropdownStyles={{
              borderRadius: 10,
              borderWidth: 0.5,
              maxHeight: 150,
              borderColor: "#C9C9C9",
              padding: 10,
            }}
            inputStyles={{
              fontFamily: "PoppinsRegular",
              color: "#C9C9C9",
              marginTop: 4,
              fontSize: 16,
            }}
            dropdownTextStyles={{
              fontFamily: "PoppinsRegular",
            }}
            placeholder="Select Currency"
            searchPlaceholder="Search Currencies"
          />
        </View>

        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            style={{
              height: 50,
              padding: 10,
              paddingHorizontal: 20,
              fontSize: 16,
              marginTop: 10,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: COLORS.shuttlelaneYellow,
              borderRadius: 10,
            }}
            onPress={signupUser}
          >
            <Text
              style={{
                fontFamily: "PoppinsSemiBold",
                color: COLORS.white,
              }}
            >
              Create account
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: 20,
            // flexDirection: "row",
            // justifyContent: "center",
          }}
        >
          <Text>
            Already have an account?{" "}
            <Link style={{ color: COLORS.shuttlelanePurple }} href="/">
              Log in
            </Link>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SignupForm;