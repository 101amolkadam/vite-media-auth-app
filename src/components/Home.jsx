// Home.js
// Import some libraries and components
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Define some styles for the component
const styles = {
  jumbotron: {
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  button: {
    margin: '5px',
  },
};

// Define the Home component
function Home() {
  // Return the JSX element for the component
  return (
    <div style={styles.jumbotron}>
      <h1>MediaAuth</h1>
      <p>
        MediaAuth is a web application that allows you to prove the authenticity of your media using blockchain
        technology. You can upload your media files to IPFS, a distributed file system, and register them on a smart
        contract on the Ethereum blockchain. You can also generate QR codes or other badges that can be embedded in your
        media to link back to the blockchain record. You can use this service to avoid being faked by artificial
        intelligence or to verify the authenticity of other media.
      </p>
      <p>
        <Button variant="primary" as={Link} to="/upload" style={styles.button}>
          Upload Media
        </Button>{' '}
        <Button variant="secondary" as={Link} to="/verify" style={styles.button}>
          Verify Media
        </Button>
      </p>
    </div>
  );
}

// Export the Home component
export default Home;
