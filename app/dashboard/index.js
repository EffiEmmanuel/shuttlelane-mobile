import { Link, Stack } from 'expo-router'
import React from 'react'
import { View } from 'react-native'
import { ScrollView } from 'react-native'
import { Image } from 'react-native'
import { SafeAreaView } from 'react-native'
import Welcome from '../../components/Welcome'
import RecentBookings from '../../components/RecentBookings'

const UserDashboard = () => {
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
            <Image
              source={logo}
              resizeMode="contain"
              style={{ width: 100, height: 100, marginTop: -28 }}
              height={28}
              width={28}
            />
          ),
          headerRight: () => (
            <>
              <Link href="https://www.shuttlelane.com" style={{ marginTop: 5 }}>
                <Image
                  source={globeIcon}
                  resizeMode="contain"
                  style={{ width: 46, height: 46 }}
                  height={28}
                  width={28}
                />
              </Link>
              <Link href="https://www.shuttlelane.com" style={{ marginTop: 5 }}>
                <Image
                  source={logoutIcon}
                  resizeMode="contain"
                  style={{ width: 46, height: 46 }}
                  height={28}
                  width={28}
                />
              </Link>
            </>
          ),
          headerTitle: "",
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, padding: 20 }}>
          <Welcome />
          <RecentBookings />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default UserDashboard