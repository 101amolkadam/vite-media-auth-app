// Verify.js
// Import some libraries and components
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import jsQR from 'jsqr';
import { ethers } from "ethers";


// Define some styles for the component
const styles = {
  form: {
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '20px',
  },
};

// Define the Verify component
// eslint-disable-next-line react/prop-types
function Verify({ contract }) {
  // Define some state variables
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState('');
  const [creator, setCreator] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Define a function that handles the file input change
  function handleFileChange(event) {
    // Get the file from the event target
    const file = event.target.files[0];
    // Set the file state with the file
    setFile(file);
  }

  // Define a function that handles the form submit
  async function handleSubmit(event) {
    // Prevent the default behavior of the form submit
    event.preventDefault();
    try {
      // Check if the contract exists
      if (contract) {
        // Set the loading state to true
        setLoading(true);
        // Create a file reader instance
        const reader = new FileReader();
        // Define a function that handles the file load event
        // eslint-disable-next-line no-inner-declarations
        function handleFileLoad() {
          // Get the image data from the reader result
          const imageData = reader.result;
          // Create an image element
          const image = new Image();
          // Define a function that handles the image load event
          async function handleImageLoad() {
            // Get the image width and height
            const width = image.width;
            const height = image.height;
            // Create a canvas element
            const canvas = document.createElement('canvas');
            // Get the canvas context
            const context = canvas.getContext('2d');
            // Set the canvas width and height to match the image
            canvas.width = width;
            canvas.height = height;
            // Draw the image on the canvas
            context.drawImage(image, 0, 0, width, height);
            // Get the image data from the canvas context
            const imageData = context.getImageData(0, 0, width, height);
            // Decode the QR code from the image data using jsQR
            const qrCode = jsQR(imageData.data, width, height);
            // Check if the QR code exists
            if (qrCode) {
              // Get the IPFS hash from the QR code data
              const ipfsHash = qrCode.data;
              // Set the IPFS hash state with the value
              setIpfsHash(ipfsHash);
              // Check if the IPFS hash exists on the contract
              // eslint-disable-next-line react/prop-types
              if (contract.ipfsHashExists(ipfsHash)) {
                // Loop through all possible creators
                for (let i = 0; i < 10; i++) {
                  // Get the creator address from the index
                  const creator = ethers.utils.getAddress(i.toString());
                  // Get the media count for the creator
                  // eslint-disable-next-line react/prop-types
                  const mediaCount = await contract.getMediaCount(creator);
                  // Loop through all media indices for the creator
                  for (let j = 0; j < mediaCount; j++) {
                    // Get the media details by index
                    // eslint-disable-next-line react/prop-types
                    const media = await contract.getMediaByIndex(creator, j);
                    // Check if the media IPFS hash matches the QR code data
                    if (media.ipfsHash === ipfsHash) {
                      // Set the creator state with the value
                      setCreator(creator);
                      // Set the success state with a message
                      setSuccess('Media verified successfully!');
                      break;
                    }
                  }
                  // Break out of the loop if creator is found
                  if (creator) break;
                }
              } else {
                // Throw an error if IPFS hash does not exist on contract
                throw new Error('IPFS hash does not exist on contract');
              }
            } else {
              // Throw an error if QR code does not exist on image
              throw new Error('QR code does not exist on image');
            }
          }
          // Set the image source to the image data and add a listener for the load event
          image.src = imageData;
          image.onload = handleImageLoad;
        }
        // Read the file as data URL and add a listener for the load event
        reader.readAsDataURL(file);
        reader.onload = handleFileLoad;
      } else {
        // Throw an error if contract is missing
        throw new Error('Contract is not available');
      }
    } catch (error) {
      // Set the error state with the error message
      setError(error.message);
    } finally {
      // Set the loading state to false
      setLoading(false);
    }
  }

  // Return the JSX element for the component
  return (
    <Form onSubmit={handleSubmit} style={styles.form}>
      <Form.Group controlId="formFile">
        <Form.Label>File</Form.Label>
        <Form.Control type="file" accept="image/*" onChange={handleFileChange} required />
      </Form.Group>
      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? 'Verifying...' : 'Verify'}
      </Button>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {success && (
        <Alert variant="success" className="mt-3">
          {success}
          <p>IPFS Hash: {ipfsHash}</p>
          <p>Creator: {creator}</p>
        </Alert>
      )}
    </Form>
  );
}

// Export the Verify component
export default Verify;
