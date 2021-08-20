# SpotiMe 🎧 - MLH Fellowship Pod 3.3.0 Team 1 
SpotiMe is a react web app that uses the Spotify API and Machine Learning Emotion detection to recommend music based on emotions and music taste.
Once the user logs in with their spotify account, the website shows the summary of the user's music breakdown. 
The user can click the button "Play" to initiate a camera to capture the user's face (through front camera/webcam) which is analyzed by our ML model to detect the user's emotion. Based on the emotion detected, the user will receive a customized playlist by SpotiME!

Give it a try! https://spotime.duckdns.org

![Welcome Page](./documentation/welcome.png)
![Home Page](./documentation/home.png)

## What it does 🖥
- Shows breakdown & summary of the user's spotify account
- Recommends a playlist based on the user's current emotion and prefered genres.

Test it Out!
- Happy
![Happy](./documentation/spotime-happy.png)

- Sad
![Sad](./documentation/spotime-sad.png)

- Fear
![Fear](./documentation/spotime-fear.png)

- Angry
![Angry](./documentation/spotime-angry.png)

- Surprise
![Surprise](./documentation/spotime-surprise.png)

- Neutral
![Neutral](./documentation/spotime-neutral.png)

## How we built it 🛠

![Architecture](./documentation/spotime-archi.png)
__To collaborate, we used:__
 - Git 
 - Discord chat / voice call

__To design the website, we used:__
 - Figma

__To build the website, we used:__
 - React 
 - Flask
 - [Spotify API](https://developer.spotify.com/documentation/web-api/)
 - ML Emotion Detection Library [FER](https://pypi.org/project/fer/)

__We deployed our website using:__
   - AWS EC2
   - Duck DNS
   - Nginx

__We tested and monitored it with:__
   - Github Actions
   - cAdvisor
   - Prometheus
   - Grafana

__We set up our database using:__
   - mongoDB

## Challenges we ran into 😡
- Our ML module was hard to deploy. We failed to deploy it on Haroku and ended up migrating it on AWS.
- Another issue we kept facing an Nginx and CORS error.
- Miscellaneous errors such as a bug 403 Forbidden page or connection issue, as well as a process such as integrating all frontend and backend was challenging but we were able to 

## Accomplishments that we're proud of 🌟
- We are proud of our overall project. However, we are specifically proud of successfully athenticaing Spotify API, connecting the ML module with the captured photo to detect the emotion, clean and user friendly UI, being able to tackle challenging issues that arised during the deployment. The team had excellent communication skills and collaboration to successfully accomplishing the project! In addition, we are very proud that what we've built hasn't commonly done before - that we are one of the pioneers of the new way of song recommendation. 

