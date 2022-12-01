import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { useDropzone } from 'react-dropzone'
import arrowIcon from './arrow.png'
import loadingIcon from './loading.gif'
import axios from 'axios';
import ImagePreviewer from './config/npm/ImagePreviewer';


const URL = 'http://localhost:5000/'

const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

function App() {

  const [fileDataURL, setFileDataURL] = useState("");
  const [processedImage, setProcessedImage] = useState(false);
  const [isUploadedImage, setIsUploadedImage] = useState(false);
  const [id, setId] = useState("")

  const sendImage = async (file: any) => {

    let data = new FormData();

    const dot = file.name.lastIndexOf('.');

    console.log("filename", file.name)
    const fileName = file.name.slice(0, dot);
    setId(fileName);

    data.append('file', file, 'image' + file.name.substring(dot, file.name.length));

    console.log("data", data);
    try{
      const result = await axios.post(URL, data
        , {
          headers: {
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            'Content-Type': `multipart/form-data;`,
          }
        }
      )
    }
    catch {
      console.log("error")
    }

    const sleepTime = Math.floor(Math.random() * (15000 - 10000 + 1) + 10000);

    await sleep(sleepTime)

    setProcessedImage(true);

  }


  const onDrop = useCallback((acceptedFiles: any) => {

    if (!acceptedFiles.length) {
      throw new Error('No file was uploaded!');
    }

    if (acceptedFiles.length !== 1) {
      throw new Error("Only one file can be uploaded at a time!");
    }

    const file = acceptedFiles[0];
    const reader = new FileReader()

    reader.onabort = () => alert('file reading was aborted')
    reader.onerror = () => alert('file reading has failed')

    reader.onload = (e: any) => {
      const { result } = e.target;
      if (result) {
        setFileDataURL(result)
      }
    }

    reader.readAsDataURL(file)
    
    setIsUploadedImage(true);

    sendImage(file)
      .then((res) => {
        console.log("res", res)
      })
      .catch((e) => {
        console.log("Error:", e)
      })


  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })


  return (
    <div className="App">

      {/* <header className="App-header">
        Colourizing black&white Images With GANs

      </header> */}
      <main className="App-main" >
        <div {...getRootProps({
          style: { border: '20px solid #27829b', padding: '0px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }
        })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>

        <div className="image">
          {isUploadedImage && <img src={fileDataURL} width="500px" height="250px" alt="preview" />}
          {isUploadedImage && <img className="arrow" src={arrowIcon} width="100px" height="100px" alt="preview" />}
          {!processedImage && isUploadedImage && <img className="loadingImage" src={loadingIcon} width="300px" height="150px" alt="preview" />}
          {processedImage && isUploadedImage && id && <ImagePreviewer id={id}/>}
        </div>

      </main>

    </div>
  );
}

export default App;
