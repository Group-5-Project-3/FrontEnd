// import React, { useState, useContext } from "react";
// import { AuthContext } from "../AuthContext";
// import { uploadProfilePicture } from "../components/APICalls/UserController";

// const Test = () => {
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const { user } = useContext(AuthContext); // Assuming user object contains 'id'

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);

//       // Preview the image
//       const reader = new FileReader();
//       reader.onload = () => {
//         setPreview(reader.result); // Base64 representation of the image
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async () => {
//     if (image) {
//       try {
//         // Call the uploadProfilePicture function
//         const response = await uploadProfilePicture(user.id, image);
//         console.log("Image uploaded successfully:", response);

//         // Optionally, provide feedback to the user
//         alert("Profile picture uploaded successfully!");
//       } catch (error) {
//         console.error("Error uploading image:", error);
//         alert("Failed to upload profile picture. Please try again.");
//       }
//     } else {
//       alert("Please select an image to upload.");
//     }
//   };

//   return (
//     <div>
//       <input type="file" accept="image/*" onChange={handleImageChange} />
//       {preview && (
//         <img
//           src={preview}
//           alt="Preview"
//           style={{ maxWidth: "300px", marginTop: "20px" }}
//         />
//       )}
//       <button onClick={handleSubmit}>Submit</button>
//     </div>
//   );
// };

// export default Test;

import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { uploadTrailImage, getImagesByTrailId } from "../components/APICalls/TrailImageController";

const Test = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [trailId, setTrailId] = useState("6738ed9bb054676b73d85135"); // Input for trail ID
  const [description, setDescription] = useState(""); // Input for description
  const [trailImages, setTrailImages] = useState([]); // State to store fetched trail images
  const { user } = useContext(AuthContext); // Assuming user object contains 'id'

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);

      // Preview the image
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result); // Base64 representation of the image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (image && trailId && description) {
      try {
        // Call the uploadTrailImage function
        const response = await uploadTrailImage(image, trailId, user.id, description);
        console.log("Trail image uploaded successfully:", response);

        // Optionally, provide feedback to the user
        alert("Trail image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading trail image:", error);
        alert("Failed to upload trail image. Please try again.");
      }
    } else {
      alert("Please fill all fields and select an image before submitting.");
    }
  };

  const handleFetchImages = async () => {
    try {
      // Fetch images by trail ID
      const images = await getImagesByTrailId(trailId);
      console.log("Fetched trail images:", images);
      setTrailImages(images); // Update state with fetched images
    } catch (error) {
      console.error("Error fetching trail images:", error);
      alert("Failed to fetch trail images. Please try again.");
    }
  };

  return (
    <div>
      <h1>Upload and Fetch Trail Images</h1>
      
      <label>
        Trail ID:
        <input
          type="text"
          value={trailId}
          onChange={(e) => setTrailId(e.target.value)}
          placeholder="Enter trail ID"
        />
      </label>
      
      <label>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
        />
      </label>
      
      <label>
        Upload Image:
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </label>
      
      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{ maxWidth: "300px", marginTop: "20px" }}
        />
      )}
      
      <button onClick={handleSubmit}>Submit</button>

      <hr />

      <h2>Fetch Trail Images</h2>
      <button onClick={handleFetchImages}>Fetch Images</button>
      
      <div>
        {trailImages.length > 0 ? (
          trailImages.map((img, index) => (
            <div key={index}>
              <img
                src={img.imageUrl} // Assuming the backend returns 'imageUrl' for each image
                alt={img.description || `Trail Image ${index + 1}`}
                style={{ maxWidth: "300px", margin: "10px" }}
              />
              <p>{img.description}</p>
            </div>
          ))
        ) : (
          <p>No images found for this trail.</p>
        )}
      </div>
    </div>
  );
};

export default Test;
