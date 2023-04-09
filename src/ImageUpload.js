import React, { useState } from 'react';
import { db, storage } from './firebase';
import firebase from 'firebase/compat/app';
import './ImageUpload.css'
import { serverTimestamp } from "firebase/firestore";
import { Button } from '@material-ui/core';

function ImageUpload({username}) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    const handleUpload = (e) => {
        var form = document.getElementsByName('upload')[0];
        form.reset();
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
                // update progress bar
                const percentComplete = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(percentComplete);
            },
            (error) => {
                // catch errors
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                    .ref('images')
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        // adds post to firebase
                        db.collection("posts").add({
                            timestamp: serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        })
                    })

                
                setProgress(0);
                setCaption('');
                setImage(null);
            }
        )
    }

    return (
    <div className="imageUpload">
        <form name="upload"> 
            <progress className="imageUpload__progress" value={progress} max="100"/>
            <input type="text" placeholder="Type your caption here..." value={caption} onChange={(e) => setCaption(e.target.value)}/>
            <input type="file" onChange={handleFileChange}/>
            <Button onClick={handleUpload}>Upload</Button>
        </form>
    </div>

    )
}

export default ImageUpload;