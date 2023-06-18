import { Dimensions, Image, ScrollView, Text, View } from "react-native";
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DetailProfile({route}) {
  const { name, email } = route.params;
  const lebar = Dimensions.get("window").width
  return (
    <>
      <View style={{flex: 1}}>
        <ScrollView>
          <View style={{justifyContent: "center", alignItems: "center", flexDirection: "column", marginTop: 30}}>
            <Image source={{ uri: "https://i.pravatar.cc/300"}} style={{width: 120, height: 120, borderRadius: 100}}/>
            <Text style={{fontSize: 30, fontWeight: "600", marginTop: 10}}>{name}</Text>
            <Text style={{ fontSize: 20, fontWeight: "300", marginTop: 10, color: "grey" }}>{email}</Text>
          </View>
          <View style={{flexDirection: "row", justifyContent: "space-evenly", marginTop: 20, paddingTop: 5}}>
            <View style={{ backgroundColor: "white", width: "25%", alignItems: "center", borderRadius: 10, paddingTop: 10 }}>
              <FontAwesome name="phone" size={24} color="#077eff" />
              <Text style={{fontSize: 15, color: "#077eff", marginTop: 5, marginBottom: 10}}>audio</Text>
            </View>
            <View style={{ backgroundColor: "white", width: "25%", alignItems: "center", borderRadius: 10, paddingTop: 10 }}>
              <FontAwesome5 name="video" size={24} color="#077eff" />
              <Text style={{ fontSize: 15, color: "#077eff", marginTop: 5, marginBottom: 10 }}>video</Text>
            </View>
            <View style={{ backgroundColor: "white", width: "25%", alignItems: "center", borderRadius: 10, paddingTop: 10 }}>
              <Ionicons name="search-sharp" size={24} color="#077eff" />
              <Text style={{ fontSize: 15, color: "#077eff", marginTop: 5, marginBottom: 10 }}>search</Text>
            </View>
          </View>
          <View style={{marginLeft: "2%", marginTop: 30, alignItems: "center", justifyContent: "center"}}>
            <View style={{ backgroundColor: "white", width: "95%", borderRadius: 10, padding: 10, marginBottom: 20 }}>
              <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: "500"}}>Hello, my name is {name}</Text>
              <Text style={{ marginLeft: 10, fontSize: 14, color: "grey" }}>17/04/23 at 20.02</Text>
            </View>
            <View style={{ backgroundColor: "white", width: "95%", borderRadius: 10, marginBottom: 20 }}>
              <View style={{ padding: 10, flexDirection: "row"}}>
                <View style={{ marginLeft: 10, backgroundColor: "#077eff", padding: 4, borderRadius: 4}}>
                <FontAwesome name="image" size={16} color="white" />
                </View>
                <Text style={{ marginLeft: 10, fontSize: 14 }}>Media, Links, and Docs</Text>
                <Text style={{ marginLeft: lebar * 0.33, fontSize: 14, color: "grey" }}>0 <AntDesign name="right" size={16} color="grey" /></Text>
              </View>
              <View style={{ padding: 10, flexDirection: "row", borderTopWidth: 1, borderTopColor: "#F6F1F1" }}>
                <View style={{ marginLeft: 10, backgroundColor: "#ffc700", padding: 4, borderRadius: 4 }}>
                  <FontAwesome name="star" size={16} color="white" />
                </View>
                <Text style={{ marginLeft: 10, fontSize: 14 }}>Starred Messages</Text>
                <Text style={{ marginLeft: lebar * 0.348, fontSize: 14, color: "grey" }}>None <AntDesign name="right" size={16} color="grey" /></Text>
              </View>
            </View>

            <View style={{ backgroundColor: "white", width: "95%", borderRadius: 10, marginBottom: 20 }}>
              <View style={{ padding: 10, flexDirection: "row" }}>
                <View style={{ marginLeft: 10, backgroundColor: "#35c759", padding: 4, borderRadius: 4 }}>
                  <FontAwesome name="volume-up" size={16} color="white" />
                </View>
                <Text style={{ marginLeft: 10, fontSize: 14 }}>Mute</Text>
                <Text style={{ marginLeft: lebar * 0.592, fontSize: 14, color: "grey" }}>No <AntDesign name="right" size={16} color="grey" /></Text>
              </View>
              <View style={{ padding: 10, flexDirection: "row", borderTopWidth: 1, borderTopColor: "#F6F1F1" }}>
                <View style={{ marginLeft: 10, backgroundColor: "#eb72d8", padding: 4, borderRadius: 4 }}>
                  <Ionicons name="ios-flower-outline" size={16} color="white" />
                </View>
                <Text style={{ marginLeft: 10, fontSize: 14 }}>Wallpaper & Sound</Text>
                <Text style={{ marginLeft: lebar * 0.424, fontSize: 14, color: "grey" }}><AntDesign name="right" size={16} color="grey" /></Text>
              </View>
              <View style={{ padding: 10, flexDirection: "row", borderTopWidth: 1, borderTopColor: "#F6F1F1" }}>
                <View style={{ marginLeft: 10, backgroundColor: "#ffc700", padding: 4, borderRadius: 4 }}>
                  <Ionicons name="ios-download-outline" size={16} color="white" />
                </View>
                <Text style={{ marginLeft: 10, fontSize: 14 }}>Save to Camera Roll</Text>
                <Text style={{ marginLeft: lebar * 0.32, fontSize: 14, color: "grey" }}>Default</Text>
              </View>
            </View>

            <View style={{ backgroundColor: "white", width: "95%", borderRadius: 10, marginBottom: 20 }}>
              <View style={{ padding: 10, flexDirection: "row" }}>
                <View style={{ marginLeft: 10, backgroundColor: "#077eff", padding: 4, borderRadius: 4 }}>
                  <FontAwesome5 name="lock" size={16} color="white" />
                </View>
                <Text style={{ marginLeft: 10, fontSize: 14 }}>Encryption</Text>
                <Text style={{ marginLeft: lebar * 0.562, fontSize: 14, color: "grey" }}><AntDesign name="right" size={16} color="grey" /></Text>
              </View>
              <View style={{ padding: 10, flexDirection: "row", borderTopWidth: 1, borderTopColor: "#F6F1F1" }}>
                <View style={{ marginLeft: 10, backgroundColor: "#077eff", padding: 4, borderRadius: 4 }}>
                  <MaterialCommunityIcons name="progress-clock" size={16} color="white" />
                </View>
                <Text style={{ marginLeft: 10, fontSize: 14 }}>Disappearing Messages</Text>
                <Text style={{ marginLeft: lebar * 0.283, fontSize: 14, color: "grey" }}>Off <AntDesign name="right" size={16} color="grey" /></Text>
              </View>
            </View>

            <View style={{ backgroundColor: "white", width: "95%", borderRadius: 10, marginBottom: 20 }}>
              <View style={{ padding: 10, flexDirection: "row" }}>
                <Text style={{ marginLeft: 10, fontSize: 14, color: "#077eff" }}>Share Contact</Text>
              </View>
              <View style={{ padding: 10, flexDirection: "row", borderTopWidth: 1, borderTopColor: "#F6F1F1" }}>
                <Text style={{ marginLeft: 10, fontSize: 14, color: "#077eff" }}>Export Chat</Text>
              </View>
              <View style={{ padding: 10, flexDirection: "row", borderTopWidth: 1, borderTopColor: "#F6F1F1" }}>
                <Text style={{ marginLeft: 10, fontSize: 14, color: "#fe3c30" }}>Clear Chat</Text>
              </View>
            </View>

            <View style={{ backgroundColor: "white", width: "95%", borderRadius: 10, marginBottom: 30 }}>
              <View style={{ padding: 10, flexDirection: "row", borderTopWidth: 1, borderTopColor: "#F6F1F1" }}>
                <Text style={{ marginLeft: 10, fontSize: 14, color: "#fe3c30" }}>Block {name}</Text>
              </View>
              <View style={{ padding: 10, flexDirection: "row", borderTopWidth: 1, borderTopColor: "#F6F1F1" }}>
                <Text style={{ marginLeft: 10, fontSize: 14, color: "#fe3c30" }}>Report {name}</Text>
              </View>
            </View>
          </View>
          
        </ScrollView>
      </View>
    </>
  )
}