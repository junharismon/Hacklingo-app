import * as DocumentPicker from "expo-document-picker";

async function pickAudio() {
  const result = await DocumentPicker.getDocumentAsync({
    type: "audio/*"
  })

  if (result.type === "success") {
    console.log(result, "<<<< ini result pick audio");
    // We check the fileUri, fileName, and fileType ( These three are a must for uploading data )
    const fileUri = result.uri;
    const fileName = result.name;
    const fileType = result.mimeType;
    return {
      uri: fileUri,
      name: fileName,
      type: fileType
    };
  }
}

export default pickAudio;