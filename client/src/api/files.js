function options(data) {
  return {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };
};

async function dispatch(request, options) {
  const response = await fetch(request, options);
  const data = await response.json();

  if (!response.ok) {
    throw Error(response.statusText);
  }
  return data;
};

export function download(path) {
  const filename = path[path.length - 1];

  let file;
  function set(data) {
    file = new File([data], filename);
  };

  dispatch("/api/download", options(path))
    .then(data => set(data.contents))
    .catch(error => console.log(error));

  return file;
};

export function rename(path, name) {
  let status;
  function set(data) {
      status = data;
    };

  const body = {
    oldPath: path,
    newName: name
  };

  dispatch("/api/rename", options(body))
    .then(data => {
      set(data);
    })
    .catch(error => {
      console.log(error);
    });

  return status;
};


export function remove(path) {
  let status;
  function set(data) {
    status = data;
  };

  dispatch("/api/delete", options(path))
    .then(data => set(data))
    .catch(error => console.log(error));

  return status;
};