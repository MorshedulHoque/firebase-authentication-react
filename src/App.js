import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {

  const [user,setUser] = useState({
    isSinedIn: false,
    name: '',
    email: '',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () =>{
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, photoURL, email} = res.user;
      const sinedInUser = {
        isSinedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(sinedInUser);
      console.log(res);
    })
    .catch(err => {
      console.log(err);
      console.log(err.message);
    })
  }

  const handleSignOut = () => {
      firebase.auth().signOut()
      .then(res => {
          const signOutuser = {
            isSinedIn: false,
            name: '',
            photoURL: '',
            email: '',
            password: '',
            error: '',
            isValid: false,
            esistingUser: false
          }
          setUser(signOutuser);
      })
      .catch(err => {

      })
  }

  const isValidEmail = email =>
    /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  
  const hasNumber = input => 
    /\d/.test(input);

  const switchForm = e => {
    const createdUser = {...user};
    createdUser.existingUser = e.target.checked;
    setUser(createdUser);
  }
  


  const handleChange = e => {
    const newUserInfo = {
      ...user
    };

    // perform validation
    let isValid = true;
    if(e.target.name === "email") {
      isValid = (isValidEmail(e.target.value));
    }
    if(e.target.name === "password") {
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }

    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }

  const createAccount = (event) => {
    if(user.isValid){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user};
        createdUser.isSinedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(err => {
        console.log(err.message);
        const createdUser = {...user};
        createdUser.isSinedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
    }
    event.preventDefault();
    event.target.reset();
  }

  const signInUser = event => {
    if(user.isValid){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user};
        createdUser.isSinedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(err => {
        console.log(err.message);
        const createdUser = {...user};
        createdUser.isSinedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
    }
    event.preventDefault();
    event.target.reset();
  }

  return (
    <div className="App">
      {
        user.isSinedIn ? <button onClick={handleSignOut}>Sign Out</button> :
        <button onClick={handleSignIn}>Sign In</button>
      }
      {
        user.isSinedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
      <h1>Our Own Authentication</h1>
      <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm"/>
      <label htmlFor="switchForm"> Returning user</label>

      <form style={{display:user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
          <input type="text" onBlur={handleChange} name="email" placeholder="Your Email" required />
          <br/>
          <input type="password" onBlur={handleChange} name="password" placeholder="Your password" required />
          <br/>
          <input type="submit" value="Sign In"/>
      </form>

      <form style={{display:user.existingUser ? 'none' : 'block'}} onSubmit={createAccount}>
          <input type="text" onBlur={handleChange} name="name" placeholder="Your Name" required />
          <br/>
          <input type="text" onBlur={handleChange} name="email" placeholder="Your Email" required />
          <br/>
          <input type="password" onBlur={handleChange} name="password" placeholder="Your password" required />
          <br/>
          <input type="submit" value="Create account"/>
      </form>
      {
        user.error && <p style={{color:'red'}} >{user.error}</p>
      }
    </div>
  );
}

export default App;
