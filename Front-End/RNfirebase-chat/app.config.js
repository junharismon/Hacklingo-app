import 'dotenv/config';

export default {
  expo: {
    owner: "hacklingo",
    name: 'Hacklingo',
    slug: 'Hacklingo',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/HACKLINGO.png',
    splash: {
      image: './assets/hacklingo-splash.png',
      resizeMode: 'contain',
      backgroundColor: '#0097B2'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true
    },
    android: {
      googleServicesFile: "./google-services.json",
      package : "com.hacklingo",
      adaptiveIcon: {
        foregroundImage: './assets/HACKLINGO.png',
        backgroundColor: '#0097B2'
      }
    },
    web: {
      favicon: './assets/favicon.png'
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      videoCallApiKey: process.env.VIDEO_CALL_API_KEY,
      grammarApiKey: process.env.GRAMMAR_API_KEY,
      firebaseServerKey: process.env.FIREBASE_SERVER_KEY,
      "eas": {
        "projectId": "72573024-e688-4354-8aa8-e0d00aafa619"
      }
    }
  }
};