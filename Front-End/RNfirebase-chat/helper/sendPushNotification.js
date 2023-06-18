import Constants from "expo-constants";
import axios from "axios";

function sendPushNotification(deviceToken, title, body) {
  
  const notification = {
    to: deviceToken,
    notification: {
      title,
      body,
    },
    priority: "high",
    soundName: "default",
  };

  axios({
    method: "POST",
    url: "https://fcm.googleapis.com/fcm/send",
    headers: {
      Authorization: `key=${Constants.manifest.extra.firebaseServerKey}`, // Server key dari firebase
      "Content-Type": "application/json",
    },
    data: notification,
  })
    .catch((err) => console.log(err, "<<<< ini error kirim notif axios"));
}

export default sendPushNotification;
