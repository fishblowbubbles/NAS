function options(data) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };
}

async function dispatch(request, options, type) {
  const response = await fetch(request, options);
  const data = await eval(`response.${type}()`);

  if (!response.ok) {
    throw Error(response.statusText);
  }
  return data;
}

export function login(credentials, callback) {
  dispatch("/auth/login", options(credentials), "json")
    .then(data => callback(data))
    .catch(error => console.log(error));
}

export function logout(credentials, callback) {
  dispatch("/auth/logout", options(credentials), "json")
    .then(data => callback(data))
    .catch(error => console.log(error));
}
