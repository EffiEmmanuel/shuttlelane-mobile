import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Text } from "react-native";
import { COLORS } from "../../../constants/themes";
import { SafeAreaView } from "react-native";

const BookingSummaryPage = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView style={{ flex: 1 }}>
        <Text>Hi</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingSummaryPage;
