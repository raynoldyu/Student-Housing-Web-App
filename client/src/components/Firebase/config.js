import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';

//firebase project configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAfI95DrMsNe16kvh65hyF8aKWAxwBPn0U',
  authDomain: 'msci-342-project-e0b6f.firebaseapp.com',
  projectId: 'msci-342-project-e0b6f',
  storageBucket: 'msci-342-project-e0b6f.appspot.com',
  messagingSenderId: '837063586861',
  appId: '1:837063586861:web:c084313605eab2918bb4a4',
  measurementId: 'G-5V6RTTVZYX',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
