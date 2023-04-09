import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import ImageUpload from './ImageUpload';
import { db , auth } from './firebase';
import { Button, Input, makeStyles, Modal } from '@material-ui/core';

// const vs. function 
const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`, // centered in screen
  };
}
  
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  // creates variable of certain datatype (empty array, false, etc.). setXXXX is how to modify it
  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  // onClick --> passes click event
  const signUp = (event) => { 
    event.preventDefault();
  
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        console.log(authUser);
        return authUser.user.updateProfile({
            displayName: username,
        })
      })
      .catch((error) => alert(error.message.replace("Firebase: ","")));

    setOpenSignUp(false);
  }

  const signIn = (event) => { 
    event.preventDefault();
  
    auth.signInWithEmailAndPassword(email,password)
      .catch((error) => alert(error.message.replace("Firebase: ","")));

    setOpenSignIn(false);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) { // logged in 
        console.log(authUser);
        setUser(authUser);

        if(authUser.displayName) {
          // user already has display name, don't update
        } else {
          // update profile with display name
          return authUser.updateProfile({
            displayName: username,
          })
        }
      } else { // logged out
        setUser(null);
      }
    })

    return () => {
      unsubscribe(); // deletes listener so dont have many running at once
    }
  }, [user, username]); // LOG-IN CHECKING listener only triggers if these variables change

  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => { 
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []); // empty array --> POST-UPDATING listener triggers after initial rendering

  return (
    <div className="app">

      {/* Sign-up modal */}
      <Modal open={openSignUp} onClose={() => setOpenSignUp(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img className="app__headerImage" src="https://www.w3schools.com/images/w3schools_green.jpg" alt="logo"/>
            </center>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      {/* Sign-in Modal */}
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img className="app__headerImage" src="https://www.w3schools.com/images/w3schools_green.jpg" alt="logo"/>
            </center>
            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img className="app__headerImage" src="https://www.w3schools.com/images/w3schools_green.jpg" alt="logo"/>
        {user ? (
          // if user exists, show logout button
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ): (
          <div className='app__loginContainer'>
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpenSignUp(true)}>Sign Up</Button>
          </div>

        )}
      </div>

      <div className="app_posts">
      {
        posts.map(({id, post}) => (
          <Post postID={id} currentUser={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
        ))
      }
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName}/> 
      ): (
        <h3>Login to Post</h3>
      )
      }


    </div>
  );
}

export default App;
