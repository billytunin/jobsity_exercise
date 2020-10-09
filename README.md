# jobsity_exercise

## Build Setup

First, we can install dependencies using Yarn or NPM
```bash
$ yarn install
```
or
```bash
$ npm install
```

Then, for DEV purposes we can launch a local server that will provide our web application. Bare in mind that this is the DEV version, so it will include sourcemaps, it will not be minified and, overall, won't be optimized regarding its size and performance. What's more, it has hotreload enabled for any file that's changed within the directory.
```bash
$ yarn dev
```
or
```bash
$ npm run dev
```

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

Finally, you can generate the static files for the web-app in case you would like to just host that (instead of having a web-serving process running somewhere). Like so:
```bash
$ yarn generate
```
or
```bash
$ npm run generate
```

For detailed explanation on how Nuxt works, check out [Nuxt.js docs](https://nuxtjs.org).
