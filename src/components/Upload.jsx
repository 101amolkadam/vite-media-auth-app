// Upload.js
// Import some libraries and components
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Form, Button, Alert, Image } from 'react-bootstrap';

// Define some styles for the component
const styles = {
  form: {
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '20px',
  },
  image: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
  },
};

// Define the Upload component
// eslint-disable-next-line react/prop-types
function Upload({ signer, contract, uploadToIPFS, generateQRCode }) {
  // Define some state variables
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Define a function that handles the file input change
  function handleFileChange(event) {
    // Get the file from the event target
    const file = event.target.files[0];
    // Set the file state with the file
    setFile(file);
  }

  // Define a function that handles the title input change
  function handleTitleChange(event) {
    // Get the value from the event target
    const value = event.target.value;
    // Set the title state with the value
    setTitle(value);
  }

  // Define a function that handles the description input change
  function handleDescriptionChange(event) {
    // Get the value from the event target
    const value = event.target.value;
    // Set the description state with the value
    setDescription(value);
  }

  // Define a function that handles the form submit
  async function handleSubmit(event) {
    // Prevent the default behavior of the form submit
    event.preventDefault();
    try {
      // Check if the signer and contract exist
      if (signer && contract) {
        // Set the loading state to true
        setLoading(true);
        // Upload the file to IPFS and get the hash
        const ipfsHash = await uploadToIPFS(file);
        // Generate a QR code for the IPFS hash and get the data URL
        const qrCode = await generateQRCode(ipfsHash);
        // Register the media on the contract and wait for the transaction to be mined
        // eslint-disable-next-line react/prop-types
        await contract.registerMedia(ipfsHash, title, description, { value: await contract.fee() });
        // Set the IPFS hash and QR code state with the values
        setIpfsHash(ipfsHash);
        setQrCode(qrCode);
        // Set the success state with a message
        setSuccess('Media uploaded successfully!');
      } else {
        // Throw an error if signer or contract are missing
        throw new Error('Signer or contract are not available');
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
        <Form.Control type="file" accept="image/*,audio/*,video/*" onChange={handleFileChange} required />
      </Form.Group>
      <Form.Group controlId="formTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control type="text" placeholder="Enter title" value={title} onChange={handleTitleChange} required />
      </Form.Group>
      <Form.Group controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control type="text" placeholder="Enter description" value={description} onChange={handleDescriptionChange} required />
      </Form.Group>
      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </Button>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {success && (
        <Alert variant="success" className="mt-3">
          {success}
          <p>IPFS Hash: {ipfsHash}</p>
          <p>QR Code:</p>
          <Image src={qrCode} style={styles.image} />
        </Alert>
      )}
    </Form>
  );
}

// Export the Upload component
export default Upload;
