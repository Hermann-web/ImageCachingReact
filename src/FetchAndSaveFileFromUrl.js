/**
 * Converts a data URI to a Blob object.
 * @param {string} dataURI - The data URI string.
 * @returns {Blob} The resulting Blob object.
 */
const dataURItoBlob = (dataURI) => {
  // Retrieve byte string and MIME type
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // Convert to ArrayBuffer and create Uint8Array
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const int8Array = new Uint8Array(arrayBuffer);

  // Map byteString characters to int8Array
  for (let i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
  }

  // Return blob from ArrayBuffer
  return new Blob([arrayBuffer], { type: mimeString });
};

/**
 * Retrieves the base64 representation of a file from a Blob object.
 * @param {Blob} blob - The Blob object containing the file data.
 * @returns {Promise<string>} A Promise resolving to the base64 representation of the file.
 */
const getBase64FileFromBlob = (blob) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = function () {
        const base64File = reader.result;
        resolve(base64File); // Resolve the Promise with base64 file
      };
      reader.onerror = function (error) {
        reader.abort();
        reject(error); // Reject if there's an error
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error getting file:", error);
      reject(error); // Reject if there's an error
    }
  });
};

/**
 * Fetches a file URL and returns a Blob object.
 * @param {string} fileUrl - The URL of the file to fetch.
 * @returns {Promise<Blob|null>} A Promise resolving to the fetched Blob object, or null if an error occurs.
 */
async function fetchFileUrl(fileUrl) {
  try {
    const response = await fetch(fileUrl); // Fetch file URL
    const blob = await response.blob(); // Convert response to blob
    return blob;
  } catch (error) {
    console.error("Error fetching:", error);
    return null;
  }
}

/**
 * Fetches a file from a URL, processes it, saves it in local storage, and returns its displayable URL.
 * @param {string} fileUrl - The URL of the file to fetch.
 * @returns {Promise<string|null>} A Promise resolving to the displayable URL of the file, or null if an error occurs.
 * @example
 * // Usage example:
 * const fileUrl = 'https://example.com/file.pdf';
 * fetchAndSaveFileFromUrl(fileUrl)
 *   .then((displayableFileUrl) => {
 *     console.log('Processed file URL:', displayableFileUrl);
 *     // Use the displayableFileUrl as needed
 *   })
 *   .catch((error) => {
 *     console.error('Error processing file:', error);
 *   });
 */
export const fetchAndSaveFileFromUrl = async (fileUrl) => {
  const [retrieveSavedFile, saveFileToStorage] = [
    () => localStorage.getItem(`savedFile:${fileUrl}`),
    (url) => localStorage.setItem(`savedFile:${fileUrl}`, url),
  ];

  const fetchAndSaveFile = async () => {
    if (retrieveSavedFile()) return; // If file exists in storage, return
    const blob = await fetchFileUrl(fileUrl); // Fetch file blob
    if (!blob) {
      console.error("No blob found");
      return; // If no blob, return
    }
    const base64File = await getBase64FileFromBlob(blob);
    if (!base64File) {
      console.error("No base64File generated from blob");
      return;
    } // If no base64File, return
    saveFileToStorage(base64File);
  };

  const getAndDisplayFile = () => {
    const base64File = retrieveSavedFile(); // Retrieve base64 file from storage
    if (!base64File) {
      console.error("No base64File found in local storage");
      return;
    } // If no base64File, return
    const blob = dataURItoBlob(base64File); // Convert base64 to blob
    const newFileUrl = URL.createObjectURL(blob); // Create object URL for blob
    return newFileUrl; // Return object URL
  };

  return Promise.resolve()
    .then(fetchAndSaveFile)
    .then(getAndDisplayFile)
    .catch((error) => console.error(error));
};
