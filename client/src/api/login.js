const { options, send } = require("./commons.js");

export function login(credentials, callback) {
  send("/auth/login", options(credentials), "json")
    .then(data => callback(data))
    .catch(error => console.log(error));
}

export function logout(credentials, callback) {
  send("/auth/logout", options(credentials), "json")
    .then(data => callback(data))
    .catch(error => console.log(error));
}
