the app is a simple weather app that allows you to search for a location and see the current weather, temperature, sunrise and sunset times.

to run the app:
    npm install && npm run dev
    open http://localhost:5173/ in your browser

to run the tests:
    npm test




# Approach to the Problem

To tackle the project, I followed a structured approach:

1. **Understand Requirements**: Reviewed the project requirements and wireframe.
2. **Break Down the Problem**: Divided the project into smaller, manageable parts.
3. **Set Up the Template**: Used React and Vite to create the app template.
4. **Home Page Development**: Built the home page with default locations and a search bar, integrating the OpenWeatherMap API to display weather data.
5. **Weather Details Page**: Developed the weather details page, fetching and displaying weather data from the OpenWeatherMap API.
6. **Styling**: Focused on styling after all components were functional.
7. **Testing**: Implemented test scripts to ensure functionality.
8. **Stretch Goals**: Added local storage to save weather data and recently entered locations.
























-----------------------------------

Take Home Exercise
Frontend Engineer

Task 			
You are part of a team tasked with developing a web or mobile front-end of a new, intelligent weather Forecasting service. While the data science team is reading the clouds, the Venture is keen to get a proof of concept up and running. Few things worth noting here: 							
The application should use the OpenWeatherMap API or similar, as the eventual smart data will have a comparable structure. 
Users must be able to provide their location, and see at least the current weather, temperature, sunrise and sunset times.
This app is expected to be accessed primarily by mobile devices but should support all major browsers. 

Required 
 Build a web or mobile application that uses the OpenWeatherMap API (sign up to access the API) to retrieve and display current weather information for a user-entered location. Alternatively, if you prefer another weather API, feel free to use that instead.
In terms of UI, the app must include a dashboard and weather details screen:
Dashboard: List of two default locations like Berlin & London, in addition to the ability to use one’s own location. You can refer to the wireframe below for reference.

 

Weather details: Detailed weather information of a given location. This must include current weather, temperature, sunrise and sunset at the very least. 
						
The application must be resilient and user-communicative regarding errors. 
Ensure that the application meets basic accessibility criteria in general and uses good semantic HTML in the case of web. 

Stretch 
Use React Typescript 
You are free to include any tools that you use in general that can help you work on this task like linters, code style checkers, etc. 
Display the remaining information from the API call: visibility, wind, humidity, etc.
Provide some personalization settings. Preferred units (°C/°F), for example. 
Store and recall these settings from local storage, as well as the user's recently entered locations. 

Our expectations 					
We expect this task to take 2-4 hours but we purposefully don't specify a hard time-limit. This is because we don't want this task to take over your weekend, nor do we want to impose an unnecessarily stressful deadline.   Once receiving this exercise, you have 1 week to submit your solution.
How you approach the problem is more important to us than completing the challenge, therefore we expect you to include the following: 
A README that documents how to set up and run the application, how you approached it and what you would improve. 
Compress the solution into one zip file with git commit history. This provides us with a view of how you break down problems and how you work. 
Tip: delete node_modules before zipping to help save space.  
Unit testing is an important part of how we work and we would love to see basic unit tests in your solution, but not mandatory. 

How we review				
When reviewing your solution, we try to make sure we’re consistent in our evaluation by following five core themes:					
Correctness - We don’t expect you to handle all the possible edge cases, but we do expect the solution to adhere to the core requirements laid out in this document.
Documentation - For us, this is more about including a clear and concise README and the commit history and less about covering the codebase in comments.
Testing - automated testing and whether there's a reasonable mix of functional (or integration) tests and unit tests is a plus, but not a red flag 
Readability - Writing code in a team requires having empathy for how other team members will interpret that code. Here we look for things like duplication, method names, variable names, consistency and also, we take great care how folder structure is set up
Application architecture - We look at whether the solution follows a conventional architecture based on the language and framework. We also expect to see some modularization with a few separate components that have clear responsibilities

Questions we may ask 
What would you add or do differently if you had more time? 
How would you implement CI/CD?
How would you approach translation and localization? 
How would you implement tracking and analytics? 
What testing did you do and why? 

Thank you for reading and thanks for taking part in our interview process. We look forward to receiving your solution!

Credits
This exercise was created by Brain IT.
