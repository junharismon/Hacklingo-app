import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

async function pickImage () {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    // We check the fileUri, fileName, and fileType ( These three are a must for uploading data )
    const fileUri = result.assets[0].uri;
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    const fileName = fileInfo.uri.split('/').pop();
    const fileType = result.assets[0].type + "/" +  fileName.split('.').pop();
    const imageData = {
      uri: fileUri,
      name: fileName,
      type: fileType
    };
    // console.log(imageData, "<<< ini imageData");
    return imageData;
  }
};

export default pickImage;