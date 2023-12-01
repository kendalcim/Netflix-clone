
import './App.css';
import HomeScreen from './screens/HomeScreen.js';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Routes
} from "react-router-dom";
import LoginScreen from './screens/LoginScreen';
import { useEffect } from 'react';
import { auth } from './firebase';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, selectUser } from './features/userSlice';
import ProfileScreen from './screens/ProfileScreen';


function App() {

  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(userAuth => {
      if (userAuth) {
        dispatch(
          login({
            uid: userAuth.uid,
            email: userAuth.email,
          })
        );

      }
      else {
        dispatch(logout());
      }
    });

    return unsubscribe;
  }, [dispatch])


  return (
    user === null ? <LoginScreen /> : (
      <div className="app">
        <Router>
          <Routes>
            <Route path='/profile' element={<ProfileScreen />} />
            <Route path="/" element={<HomeScreen />} />
            <Route path="/test" element={<h1>YOO Whatssupp</h1>} />

          </Routes>
        </Router>

      </div>
    )
  );
}

export default App;
