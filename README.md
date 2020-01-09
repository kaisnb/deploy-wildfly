# Deploy-Wildfly Tool

Tool to deploy a file to wildfly from your commandline.

## Installation

Run `npm install -D git+https://github.com/kaisnb/deploy-wildfly.git` to install the tool directly from github.

## Run

To run the tool call `deploy-wildfly config="path\to\config.json"`. The command `deploy-wildfly` is availabe inside npm scripts.

## Configuration

These are all possible configration parameters. They are all required and have no defaults.

```json
{
  "DEPLOYMENT_NAME": "application.war",
  "PATH_TO_WAR": "./dist/application.war",
  "ADDRESS": "http://192.168.8.46:9990",
  "USER": "username",
  "PASS": "password"
}
```
-   **DEPLOYMENT_NAME** — Name of the deployment.

-   **PATH_TO_WAR** — Path to the archive which should be deployed.

-   **ADDRESS** — Network address to wildfly server.

-   **USER** — Username for the wildfly management interface.

-   **PASS** — Password for the wildfly management interface.

## TODO

- Fix error for initial deployments when no war is currently deployed

## License

Everything in this repository is [licensed under the MIT License][license] unless otherwise specified.

Copyright (c) 2019 Kai Schönberger

[license]: https://github.com/kaisnb/create-war/blob/master/LICENSE
