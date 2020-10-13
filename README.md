## Build Setup

First, we can install dependencies using Yarn or NPM
```bash
$ yarn install
```
or
```bash
$ npm install
```

<br/>
<br/>

Then, for DEV purposes we can launch a local server that will provide our web application. Bare in mind that this is the DEV version, so it will include sourcemaps, it will not be minified and, overall, won't be optimized regarding its size and performance. What's more, it has hotreload enabled for any file that's changed within the directory.
```bash
$ yarn dev
```
or
```bash
$ npm run dev
```

<br/>
<br/>

On the other hand, if you want to compile the optimized version, you may run:
```bash
$ yarn build
$ yarn start
```
or
```bash
$ npm run build
$ npm run start
```
You would want to run those on whatever server you are hosting the web-app on.

<br/>
<br/>

Finally, you can generate the static files for the web-app in case you would like to just host that (instead of having a web-serving process running somewhere). Like so:
```bash
$ yarn generate
```
or
```bash
$ npm run generate
```
You'll find the static files generated by that command on the directory "/dist" under the root directory.

<br/>
<br/>

For detailed explanation on how Nuxt works, check out [Nuxt.js docs](https://nuxtjs.org).

## Unit Testing

For Unit Testing we are using Jest and the vue-test-utils library to assert behaviour and template renderization is what we expect.
To run them, simply issue
```bash
$ yarn test
```
or
```bash
$ npm run test
```
on the root directory.

## Considerations

- Considering there is no back-end saving and returning the reminder objects we are creating in this app, I've decided to use their dateTime (as a string) as unique identifiers; instead of creating random id numbers or using their array's index. This brings its own advantages and disadvantages. One of the disadvantages is that you shall not create two reminders on the exact same date & time. This is a considered validation within the app. I assumed this wouldn't be a problem, but if it was a problem from a business point of view... we could just switch to using reminder's array index or random integers as unique identifiers. Those approaches are valid as well.
- I'm using a library called `nuxt-vuex-localstorage` which allows to save the application's state within the localStorage. For this app I'm just saving the reminders, not all state. Meaning that after refreshing the page, you will still have your reminders. You will also see them across browser tabs. They will be removed only if you clear your cache for the application (which can be done from the browser's tools)
- I've added the possibility to get the weather either in Celsius Units or Fahrenheit units
- For optimization purposes, the weather forecasts are stored in the state of the application as well. Meaning that after fetching the weather for, say, Berlin the first time... it will not re-fetch again each time you want to see the weather for that same city. The weather forecasts are saved by city. This is also helpful when using the same city across multiple reminders. This state does get reset when refreshing the page though. And also gets refreshed when switching from Fahrenheit to Celsisus or viceversa.
- As we are using the free plan of [OpenWeather](https://openweathermap.org/)'s API, the weather data we can get is limited to: today's forecast and next 7 day's forecast. That's why if you add a reminder on an older date than today or a later date than the next 7 days, the application will show no data available.
- The whole application is based on user's timezone. No UTC. If date/time is changed on the user's machine or user's browser, it will be reflected on the application.