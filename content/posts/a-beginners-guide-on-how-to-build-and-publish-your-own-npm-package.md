---
title: "A beginners guide on How to build and publish your own NPM package"
date: "2024-03-15"
brief: "I built and published this super simple npm package in under 2 hours and I promise by the end of this article, you'll have your own cool npm package published."
topic: building
original: "https://reet.hashnode.dev/a-beginners-guide-on-how-to-build-and-publish-your-own-npm-package"
---

I built and published this super simple npm package in under 2 hours and I promise by the end of this article, you'll have your own cool npm package published.

Before we start building, go to your terminal and type this in and install my package!

```
npx hello-reet
```

If you like what you see, let's dive straight in!

Let's start with the basics, please!

### What is an npm package?

An npm package is a reusable unit of code that can be installed and used in your Node.js projects. It's like a pre-built Lego brick that provides specific functionalities you can easily integrate into your application.

Knowingly unknowingly I am sure you must have used npm package sometime in your life. Some popular ones include: express, body-parser, lodash, babel and more!

But now is the time to create one.

You just need an npm account to follow these steps.

Hope you have node installed in your local machine.

### First things first-

Lets create a new folder for this project, I chose to name it my-npx-package

```
mkdir my-npx-package
```

Then we will setup a project directory and initialise it on GitHub (assuming you wanna showcase what you built!)

```
cd my-npx-package
git init
```

Next we will initialise our package:

```
npm init -y
```

As soon as you hit enter, you'll see a package.json file created.

Next we are gonna name our package and change it in our package.json file.

I named my package as "hello-reet", make sure your name doesn't have any spaces.

```
{
  "name": "hello-reet",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",

  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Stick with me, we are halfway there!

Now, we will create an executable script

Your NPX command will run a JavaScript file, which acts as the entry point. Inside your project directory, create a file named `index.js`. This file will contain the code executed when your NPX command is invoked. Feel free to customize the content of this file to best introduce yourself.

For your script to be executable through NPX, you must declare it in your `package.json` file. Add the following lines:

```
bin": {
  "hello-reet": "./index.js"
}
```

Replace `"hello-reet"` with whatever you want your command to be called. I am using the same command as my file name.

### Making the script executable:

Create an index.js file and i've created a basic layout of the package here

```
#!/usr/bin/env node
// Function to log your details in the terminal
function logDetails() {
    const message = "Hey there! I'm Reet, a Software Engineer by profession. Currently hacking with frontend, building communities and public speaking!";
    const twitterLink = "https://twitter.com/reet_batra";
    const linkedinLink = "https://www.linkedin.com/in/reet-batra/";
    //const wesbiteLink = "";

    // Create a colorful box using ANSI escape codes
    const colorfulBox = `  \x1b[38;5;51m+---------------------------------------------------------------+
    |   \x1b[38;5;105m${message}\x1b[38;5;51m    |
    +---------------------------------------------------------------+
    | \x1b[38;5;93mTwitter:\x1b[0m \x1b[38;5;39m${twitterLink}                     \x1b[38;5;51m|
    | \x1b[38;5;93mLinkedIn:\x1b[0m \x1b[38;5;39m${linkedinLink}                 \x1b[38;5;51m|

    +----------------------------------------------------------------+\x1b[0m`;

    // Log the colorful box in the terminal
    console.log(colorfulBox);
  }
  // Call the function to log your details
  logDetails();
```

Before testing, ensure your script file is executable. On Linux and Mac, use the command:

```
chmod +x index.js
```

Windows users will need Git installed to run:

```
git update-index --chmod=+x index.js
```

Its done! ✨

Before we publish this package, we will test this locally with npm

```
npm link
```

Now, you can test it by running `npx <package-name>`. If everything goes as planned, don't forget to unlink your package:

```
npm unlink -g <directory-name>
```

I kept my directory name as my-npx-package

Wo-lah!

### Now lets publish our package

To share your command with the world, you'll first need an npm account. Create one by signing up at npmjs.com. After creating one, log in via the terminal:

```
npm login
```

wo-lah!

Lets hit publish 👩🏻‍💻

```
npm publish
```

Now go to [npmjs.com](http://npmjs.com) and search your package.

Don't forget to push your code on GitHub, you can check mine [here](https://github.com/reetbatra/npx-hello-reet).
