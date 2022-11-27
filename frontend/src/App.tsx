import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { useDropzone } from 'react-dropzone'
import arrowIcon from './arrow.png'
import loadingIcon from './loading.jpeg'
import axios from 'axios';

const URL = 'http://localhost:5000/'

function App() {

  const [fileDataURL, setFileDataURL] = useState("");
  const [processedImage, setProcessedImage] = useState("");
  const [isUploadedImage, setIsUploadedImage] = useState(false);

  const sendImage = async (file: any) => {

    let data = new FormData();

    const dot = file.name.lastIndexOf('.');

    data.append('file', file, 'image' + file.name.substring(dot, file.name.length));

    console.log("data", data);
    const result = await axios.post(URL, data
      , {
        headers: {
          'accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.8',
          'Content-Type': `multipart/form-data;`,
        }
      }
    )

    // setProcessedImage(result.data);

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
          {isUploadedImage && <img src={fileDataURL} width="200px" height="200px" alt="preview" />}
          {isUploadedImage && <img src={arrowIcon} width="200px" height="200px" alt="preview" />}
          {!processedImage && isUploadedImage && <img src={loadingIcon} width="200px" height="200px" alt="preview" />}
          {processedImage && isUploadedImage && <img src={fileDataURL} width="200px" height="200px" alt="preview" />}
        </div>

      </main>

    </div>
  );
}

export default App;
