# colourizing-b-w-images-with-GANs

One of the most exciting applications of deep learning is colorizing black and white images. This task needs a lot of human input and hardcoding several years ago but now the whole process can be done end-to-end with the power of AI and deep learning. You might think that you need huge amount of data or long training times to train your model from scratch for this task but in the last few weeks I worked on this and tried many different model architectures, loss functions, training strategies, etc. and finally developed an efficient strategy to train such a model, using the latest advances in deep learning, on a rather small dataset and with really short training times. In this article, I'm going to explain what I did to make this happen, including the code!, and the strategies that helped and also those that were not useful. Before that, I will explain the colorization problem and a give you a short review of what has been done in recent years. 


## Scope

Image Colorization is an interesting gan project to work on. We all have some old photographs and reels which were shot in the times when colored filmography was a talk of the future. Wouldn’t it be amazing if you can colorize those black and white images bringing them back to life? This repository talks about that! 

This repository is dedicated for implmentation of a software solution that would help facilitate users to upload a black-white images and get a coloured image 

## Project Details
The project is divided into three parts that are:
1. Building the model with GANs.
2. Building a front-end on which we can display the results.
3. Building a back-end on which we can mount our model.

## Technology
1. Python
2. Flask
3. GAN
4. React
5. Typescript

## Run
1. Create a copy of the project.
2. Open command prompt and change you current path to folder where you can find `app.py` file.
3. Download the [model](https://drive.google.com/drive/folders/1VhotvmQcCcPtLSGMyLe5LoDXkMC0F8Ql) and save it into the project folder.
4. Use command below to install required dependencies `python -m pip install -r requirements.txt`
5. Start the back-end by command given `python app.py`
6. Start the front-end `npm install && npm start`
7. You can now upload image and check the generated result.

## Interface

Our web application provide the ability of uploading a gray image and our system will do the work to run the model and colorize the given image.

![fs](https://i.ibb.co/NxbGScW/Screenshot-2022-12-05-at-15-56-33.png)


Then the image will be sent to our backend so that the model can process it, colorize it, and send it back to the frontend

![fd](https://i.ibb.co/sRRtm40/Screenshot-2022-12-05-at-15-57-09.png)


And this is how the resulting image appears

![fs](https://i.ibb.co/QDx2Gkf/Screenshot-2022-12-05-at-15-57-26.png)


## Demo
[Link](https://www.loom.com/share/c7e975e6618a4d31975fb6ba04f110cb)
