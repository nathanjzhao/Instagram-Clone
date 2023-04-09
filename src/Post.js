import React from 'react'
import './Post.css'
import { db } from './firebase';
import Avatar from '@material-ui/core/Avatar'
import { useState } from 'react';
import { useEffect } from 'react';
import { Button } from '@material-ui/core';
import { serverTimestamp } from 'firebase/firestore';


function Post({postID, currentUser, username, caption, imageUrl}) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    let unsubscribe;
    if(postID) {
      unsubscribe = db.collection("posts").doc(postID).collection("comments").orderBy('timestamp','desc').onSnapshot((snapshot) =>{
        setComments(snapshot.docs.map((doc) => doc.data()));
      });
    };

    return () => {
      unsubscribe();
    };
  }, [postID]);

  const postComment = (e) => {
    e.preventDefault();

    db.collection("posts").doc(postID).collection("comments").add({
      timestamp: serverTimestamp(),
      username: currentUser.displayName,
      text: comment,
    })

    setComment('');
  }

  return (
    <div className="post">
        <div className="post__header">
            <Avatar 
                className="post__avatar"
                alt={username}
                // need to add profile pics
                src="image.jpg"
                />
            <h3>{username}</h3>
        </div>

        <img className="post__image" src={imageUrl}/>

        <h4 className="post__text"><strong>{username}: </strong>{caption}</h4>

        <div className="post__comments">
        {
          comments.map((comment) => (
            <p><strong>{comment.username}: </strong>{comment.text}</p>
          ))
        }
        </div>
        
        {currentUser && ( 
          <form className='post__commentBox'>
            <input
              className="post__comment"
              type="text"
              placeholder="Comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button 
              className="post__commentButton"
              disabled={!comment} // disable button if there is nothing written in comment
              type="submit"
              onClick={postComment}
            >Comment</Button>
          </form>
        )}
    </div>

  )
}

export default Post