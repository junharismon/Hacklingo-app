import * as React from 'react';
import { Dimensions, Image, View } from 'react-native';
import logo from "./assets/LOGO.png"

export default function HeaderPost() {
  const width = Dimensions.get("window").width
  return (
    <View style={{ flexDirection: "row", backgroundColor: "#0097b2", alignItems: "center" }}>
      <Image source={logo} style={{ width: 50, height: 50, marginRight: width * 0.01 }} />
    </View>
  )
}