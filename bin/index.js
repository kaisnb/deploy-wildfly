#! /usr/bin/env node

const fs = require('fs');
const request = require('request');

console.warn('');
console.warn('################ BEGIN DEPLOYMENT ################');

// parsing cli arguments. need to skip the first two.
const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const splitted = process.argv[i].split("=");
  args[splitted[0]] = splitted[1];
}

// reading config file at the given path
console.log('Reading config file at ' + args.config);
const configFile = fs.readFileSync(args.config);
const CONF = JSON.parse(configFile);

(async () => {
  try {
    await unDeploy(CONF.ADDRESS, CONF.DEPLOYMENT_NAME);
    console.warn('Successfully undeployed deployment ' + CONF.DEPLOYMENT_NAME);

    await removeDeployment(CONF.ADDRESS, CONF.DEPLOYMENT_NAME);
    console.warn('Successfully removed deployment ' + CONF.DEPLOYMENT_NAME);

    const resp = await createDeployment(CONF.ADDRESS, CONF.PATH_TO_WAR);
    console.warn('Successfully created deployment ' + CONF.PATH_TO_WAR);

    const BYTES_VALUE = JSON.parse(resp).result.BYTES_VALUE;
    await doDeploy(CONF.ADDRESS, BYTES_VALUE, CONF.DEPLOYMENT_NAME);
    console.warn('Successfully enabled deployment ' + CONF.DEPLOYMENT_NAME);
  }
  catch (e) {
    console.error('An Error occured during deployment:')
    console.error(' Code : ' + (e.response && e.response.statusCode))
    console.error(' Error : ' + e.error)
    console.error(' Body : ' + e.body)
  }
})();

async function unDeploy(ADDR, DEPLOYMENT_NAME) {
  return new Promise((resolve, reject) => {
    request({
      uri: ADDR + '/management',
      method: 'POST',
      headers: {
        'content-Type': 'application/json'
      },
      body: JSON.stringify({
        operation: 'undeploy',
        address: [{ deployment: DEPLOYMENT_NAME }]
      }),
      auth: createAuth()
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body);
      } else {
        reject({ error, response, body });
      }
    });
  });
}

async function removeDeployment(ADDR, DEPLOYMENT_NAME) {
  return new Promise((resolve, reject) => {
    request({
      uri: ADDR + '/management',
      method: 'POST',
      headers: {
        'content-Type': 'application/json'
      },
      body: JSON.stringify({
        operation: 'remove',
        address: [{ deployment: DEPLOYMENT_NAME }]
      }),
      auth: createAuth()
    }, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        resolve(body);
      } else {
        reject({ error, response, body });
      }
    });
  });
}

async function createDeployment(ADDR, path) {
  return new Promise((resolve, reject) => {
    request({
      uri: ADDR + '/management/add-content',
      method: 'POST',
      formData: { file: fs.createReadStream(path) },
      auth: createAuth()
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body);
      } else {
        reject({ error, response, body });
      }
    });
  });
}

async function doDeploy(ADDR, BYTES_VALUE, DEPLOYMENT_NAME) {
  return new Promise((resolve, reject) => {
    request({
      uri: ADDR + '/management/',
      method: 'POST',
      headers: {
        'content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: [{ hash: { BYTES_VALUE } }],
        address: [{ deployment: DEPLOYMENT_NAME }],
        operation: 'add',
        enabled: 'true'
      }),
      auth: createAuth()
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body);
      } else {
        reject({ error, response, body });
      }
    });
  });
}

function createAuth() {
  return {
    user: CONF.USER,
    pass: CONF.PASS,
    sendImmediately: false
  };
}