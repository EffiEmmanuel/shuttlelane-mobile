import { Link, Stack, useRouter } from "expo-router";
import logo from "../../assets/images/logo.png";
import { Image, StyleSheet } from "react-native";
import { COLORS } from "../../constants/themes";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.white,
        },
        headerShadowVisible: false,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="signInOptions"
        options={{
          headerStyle: {
            backgroundColor: COLORS.white,
          },
          headerShadowVisible: false,
          headerTitle: "",
          headerLeft: null,
          headerShown: false,
        }}
      />
    </Stack>
  );
};

const style = StyleSheet.create({
  headerImage: { width: 100, height: 100, marginTop: -28 },
});

export default Layout;
