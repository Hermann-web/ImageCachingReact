import React, { useEffect, useState } from "react";
import { fetchAndSaveFileFromUrl } from "./FetchAndSaveFileFromUrl";

const CustomImageComponent = ({ imageUrl, ...otherProps }) => {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const processImage = async () => {
      const newImageUrl = await fetchAndSaveFileFromUrl(imageUrl); // Process image URL
      setImageSrc(newImageUrl); // Set processed image URL
    };

    processImage();
  }, [imageUrl]);

  return (
    <div>
      {imageSrc ? (
        <img {...otherProps} src={imageSrc} />
      ) : (
        <img {...otherProps} alt="img loading..." />
      )}
    </div>
  );
};

export default CustomImageComponent;
