# Custom Learning Experience MFE for OpenEDX

## Development

For development, you need to have a running OpenEDX instance configured to serve this MFE in such a way that CORS is not an issue.

This project includes a set of scripts to automate the configuration of a minimal dev environment using tutor with minimal customizations.

### Prerequisites

In order for the dev scripts to work correctly, you need to have the following software installed:

- Docker Desktop
- pyenv
- pipenv

### Default test user

By default, a test user with the following credentials is created:

staff@example.com
You will be asked to input a password during the initial setup

### Initial setup

Run the following command to setup your environment, THIS SHOULD ONLY BE RUN ONCE:

**IMPORTANT:** make sure to answer "n" to the first Interactive platform configuration question (Are you configuring a production platform? Type 'n' if you are just testing Tutor on your local computer [y/N]).

```
make setup
```

This will setup the venv, install tutor, launch openedx, and customize the OpenEDX Caddyfile to add a route to our react dev server. Finally it will run npm install.

### Starting OpenEDX

If for some reason you OpenEDX containers are stopped (your computer restarted, etc.), you should restart it with:

**IMPORTANT:** make sure to answer "n" to the first Interactive platform configuration question (Are you configuring a production platform? Type 'n' if you are just testing Tutor on your local computer [y/N]).

```
make start-tutor
```

### Starting the react dev server

Start the webpack-dev-server so you can work on the React code:

```
npm start
```

### Logging in

Go to http://apps.local.overhang.io/authn/login?next=%2F

### Accessing the MFE

Go to http://apps.local.overhang.io/wgulearning

### Running tutor commands

Tutor is installed inside a venv created with pipenv. To run tutor, you need to enter the venv by running:

```
# Inside this project's root folder
pipenv shell
```

After doing that, you can run tutor commands inside that shell as normal.
