## Author: Bryam Loaiza
## 04-01-2024

## Getting Started

You can open the project on Visual Studio Code or any other editor.

Run the following command to install the dependencies needed to run the project:

```bash
npm install
```

If NextJS is not installed for some reason, run the following command in the terminal. 

```bash
nvm install next
```

If you get the following error : "nvm not found", you might have to install node first.

Please check this link to install node.js: `https://github.com/nvm-sh/nvm`

Then try to run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Set Up

To start using the application to upload and get back image descriptions, please add your own OpenAI API Key to the .env file 

You can remove the .example from env.example file created for you and rename it .env 

## Docker Container

If you prefer to run the web application using Docker, follow the instructions:

Build Docker Image:

`docker build -t imagegpt .`

Run Docker Container:

`docker run -p 3000:3000 imagegpt`

## API Overview 

This application is a simple RESTful API where users upload an image, make an API call to OpenAI GPT-4 Vision model and as a result get the description of the submitted image on the screen.

To expand on the application, we take an image from the users and convert it into a base64 string which is basically a representation of the image in form of a string. This string is passed to the backend and then passed to Open AI for processing where the GPT-4 Vision processes it and sends back the response as a stream text response which we call in our front end to show users the description of the image.

## How to generate an image description

- Add your OpenAI key to the .env file
- Run the server by issuing the command `npm run server` and go to http://localhost:3000
- Click on "Get Image Description!"
- Wait a few seconds, and the description of the image will be shown in the screen.

## Tests
To run the tests, issue the following command 

```bash
npm test
```