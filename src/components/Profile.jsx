// Profile.js
// Import some libraries and components
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, ListGroup, Image } from 'react-bootstrap';
import { formatDistanceToNow } from 'date-fns';

// Define some styles for the component
const styles = {
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
  },
};

// Define the Profile component
// eslint-disable-next-line react/prop-types
function Profile({ contract }) {
  // Define some state variables
  const [loading, setLoading] = useState(false);
  const [mediaCount, setMediaCount] = useState(0);
  const [mediaList, setMediaList] = useState([]);

  // Get the address parameter from the URL
  const { address } = useParams();

  // Define an effect hook that fetches the media count and list from the contract
  useEffect(() => {
    // Check if the contract exists
    if (contract) {
      // Define an async function that fetches the data
      // eslint-disable-next-line no-inner-declarations
      async function fetchData() {
        try {
          // Set the loading state to true
          setLoading(true);
          // Get the media count from the contract
          // eslint-disable-next-line react/prop-types
          const count = await contract.getMediaCount(address);
          // Set the media count state with the value
          setMediaCount(count.toNumber());
          // Initialize an empty array for the media list
          const list = [];
          // Loop through the media indices
          for (let i = 0; i < count; i++) {
            // Get the media details from the contract by index
            // eslint-disable-next-line react/prop-types
            const media = await contract.getMediaByIndex(address, i);
            // Push the media object to the list array
            list.push(media);
          }
          // Set the media list state with the array
          setMediaList(list);
        } catch (error) {
          // Log the error
          console.error(error);
        } finally {
          // Set the loading state to false
          setLoading(false);
        }
      }
      // Call the fetch data function
      fetchData();
    }
  }, [contract, address]);

  // Return the JSX element for the component
  return (
    <Card style={styles.card}>
      <Card.Header>Profile</Card.Header>
      <Card.Body>
        <Card.Title>{address}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Media Count: {mediaCount}</Card.Subtitle>
        {loading ? (
          <Card.Text>Loading...</Card.Text>
        ) : (
          <ListGroup variant="flush">
            {mediaList.map((media, index) => (
              <ListGroup.Item key={index}>
                <Image src={`${import.meta.env.VITE_IPFS_GATEWAY}${media.ipfsHash}`} thumbnail style={styles.image} />
                <p>Title: {media.title}</p>
                <p>Description: {media.description}</p>
                <p>Timestamp: {formatDistanceToNow(new Date(media.timestamp.toNumber() * 1000), { addSuffix: true })}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
}

// Export the Profile component
export default Profile;
