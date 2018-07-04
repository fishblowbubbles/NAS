export function options(data) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  };
}

export async function send(request, options, type) {
  const response = await fetch(request, options);
  const data = await eval(`response.${type}()`);
  
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return data;
}

export function convertBytes(sizeInBytes) {
  const kiloBytes = sizeInBytes / Math.pow(2, 10);
  if (kiloBytes >= 100) {
    const megaBytes = kiloBytes / Math.pow(2, 10);
    if (megaBytes >= 100) {
      const gigaBytes = megaBytes / Math.pow(2, 10);
      return gigaBytes.toFixed(1) + " GB";
    } else {
      return megaBytes.toFixed(1) + " MB";
    }
  } else {
    return kiloBytes.toFixed(1) + " KB";
  }
};

export function setIcon(type) {
  let src = "/assets/file.png";
  if (type === "folder") {
    src = "/assets/folder.png";
  } else if (type === ".js") {
    src = "/assets/js.png";
  } else if (type === ".json") {
    src = "/assets/json.png";
  }
  return src;
};