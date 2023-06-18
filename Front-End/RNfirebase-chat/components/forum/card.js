import { Dimensions, Image, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const CardForum = ({ navigation, post }) => {
  const lebar = Dimensions.get("window").height;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Post", { id: post._id });
      }}
    >
      <Card
        style={{
          backgroundColor: "white",
          marginHorizontal: 12,
          marginVertical: 12,
        }}
      >
        <Card.Content>
          <Text variant="titleLarge">{post.title}</Text>
          {post.postImageUrl && (
            <Image
              source={{ uri: post.postImageUrl }}
              style={{ width: "100%", height: lebar * 0.3, marginVertical: 20 }}
            />
          )}
          <Text variant="bodyMedium" style={{color: "black"}}>{post.content.length >= 200 ? post.content.slice(0,200) + "..." : post.content}</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{fontSize: 12, color: "grey"}}>{post.createdAt.split("T")[0]}</Text>
            <Button>
              <FontAwesome name="comments-o" size={24} color="black" />
            </Button>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

export default CardForum;
