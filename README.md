Project Requirements:
As a user, I want to shorten a long url:
1) I can input my long url in a field and after submission it gives me a short url which
    I can share with others
2) When someone clicks on the short url, it redirects them to the long url
3) I can visit a page or call an api which gives me some information about people
who clicked on my url. For example:
    a) User who have visited the url
    b) IP address of each person
    c) When they clicked on it
    d) Click username and redirect to the article written by the user



How to run?
git clone git.repo
cd shortenurl
npm install
frontend: npm start
backend: node server.js


What to note:
Please add chrome extension to fix the CORS issue

Techonologies:  
frontend: 
    ReactJS

backend: 
    Express- Nodejs framwork for building the REST Apis
    Mongodb- Document oriented NoSQL database
    Mongoose- MongoDB object modeling tool
    Valid-url- URI validation functions

Public API Used: 
Hackernews API
https://hn.algolia.com/api