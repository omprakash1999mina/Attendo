export const handleFileInputChange = (e, setLoading, setFile, setbase64URL, setEncoding) => {
  if (e.target.files[0] != undefined) {
    setLoading(true);
    setFile(e.target.files[0]);
    setEncoding(null);
  } else {
    setFile(null);
    setbase64URL("");
    setLoading(false);
    setEncoding(null);
  }
};

export const getBase64 = (file) => {
  return new Promise((resolve) => {
    let baseURL = "";
    // Make new FileReader
    let reader = new FileReader();

    // Convert the file to base64 text
    reader.readAsDataURL(file);

    // on reader load somthing...
    reader.onload = () => {
      baseURL = reader.result;
      resolve(baseURL);
    };
  });
};
