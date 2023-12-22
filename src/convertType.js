function convertType(object, keysToConvert, type) {
  const newObject = {};

  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const value = object[key];
      const keyPath = keysToConvert.find((k) => k === key);

      if (keyPath && value) {
        switch (type) {
          case "Date":
            newObject[key] = new Date(value);
            break;
          case "JSON":
            newObject[key] = JSON.parse(value);
            break;
        }
      } else if (typeof value === "object" && value && !Array.isArray(value)) {
        const newKeysToConvert = [];
        for (let keyToConvert of keysToConvert) {
          if (keyToConvert.includes(".")) {
            keyToConvert = keyToConvert.split(".");
            keyToConvert.shift();
            keyToConvert = keyToConvert.join(".");
            newKeysToConvert.push(keyToConvert);
          }
        }
        newObject[key] = convertType(value, newKeysToConvert, type);
      } else {
        newObject[key] = value;
      }
    }
  }

  return newObject;
}

export default convertType;
