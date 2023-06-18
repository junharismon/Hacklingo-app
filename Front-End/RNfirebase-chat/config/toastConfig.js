// App.jsx
import Toast, { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message';

/*
  1. Create the config
*/
const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <BaseToast
      {...props}
      style={{borderLeftColor: "#63f542"}}
      text1Style={{
        fontSize: 15,
      }}
      text2Style={{
        fontSize: 12,
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 15
      }}
      text2Style={{
        fontSize: 12,
      }}
    />
  ),

  info: (props) => (
    <InfoToast
      {...props}
      text1Style={{
        fontSize: 15,
      }}
      text2Style={{
        fontSize: 12,
      }}
    />
  ),
};

export default toastConfig;
