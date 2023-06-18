import Toast from 'react-native-toast-message';

function showToast(type, title, message) {
  Toast.show({
    type: type,
    text1: title,
    text2: message,
  });
}

export default showToast;