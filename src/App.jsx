//App.js
// Import some libraries and components
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { connectBlockchain, uploadToIPFS, generateQRCode } from './utils';
import { ethers } from "ethers";
import Home from './components/Home.jsx';
import Profile from './components/Profile.jsx';
import Upload from './components/Upload.jsx';
import Verify from './components/Verify.jsx';

// Define the App component
function App() {
  // Define some state variables
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  // Define a function that handles the connect button click
  async function handleConnect() {
    try {
      // Set the loading state to true
      setLoading(true);
      // Connect to the blockchain using Metamask and get the provider and signer
      const { provider, signer } = await connectBlockchain();
      // Get the user's account address
      const account = await signer.getAddress();
      console.log(import.meta.env.VITE_CONTRACT_ADDRESS);
      console.log(import.meta.env.VITE_CONTRACT_ABI);
      // Create a contract instance using the ABI and address from the environment variables
      const contract = new ethers.Contract(import.meta.env.VITE_CONTRACT_ADDRESS, JSON.parse(import.meta.env.VITE_CONTRACT_ABI), signer);
      // Set the state variables with the values
      setProvider(provider);
      setSigner(signer);
      setAccount(account);
      setContract(contract);
      setConnected(true);
    } catch (error) {
      // Log the error
      console.error(error);
    } finally {
      // Set the loading state to false
      setLoading(false);
    }
  }

  // Define an effect hook that listens for account changes
  useEffect(() => {
    // Check if the provider exists
    if (provider) {
      // Define a function that handles the account change event
      // eslint-disable-next-line no-inner-declarations
      function handleAccountChange(newAccounts) {
        // Set the account state with the new account
        setAccount(newAccounts[0]);
      }
      // Add a listener for the account change event
      provider.on('accountsChanged', handleAccountChange);
      // Return a cleanup function that removes the listener
      return () => {
        provider.off('accountsChanged', handleAccountChange);
      };
    }
  }, [provider]);

  // Define an effect hook that listens for network changes
  useEffect(() => {
    // Check if the provider exists
    if (provider) {
      // Define a function that handles the network change event
      // eslint-disable-next-line no-inner-declarations, no-unused-vars
      function handleNetworkChange(_newNetwork) {
        // Reload the page
        window.location.reload();
      }
      // Add a listener for the network change event
      provider.on('networkChanged', handleNetworkChange);
      // Return a cleanup function that removes the listener
      return () => {
        provider.off('networkChanged', handleNetworkChange);
      };
    }
  }, [provider]);

  // Return the JSX element for the component
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            MediaAuth
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/upload">
                Upload
              </Nav.Link>
              <Nav.Link as={Link} to="/verify">
                Verify
              </Nav.Link>
            </Nav>
            <Nav className="ms-auto">
              {connected ? (
                <Nav.Link as={Link} to={`/profile/${account}`}>
                  {account.slice(0, 6) + '...' + account.slice(-4)}
                </Nav.Link>
              ) : (
                <Button variant="outline-success" onClick={handleConnect} disabled={loading}>
                  {loading ? 'Connecting...' : 'Connect'}
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <Routes>
          <Route exact path="/" element={<Home />}>
          </Route>
          <Route path="/profile/:address" element={<Profile contract={contract} />}>
          </Route>
          <Route path="/upload" element={<Upload signer={signer} contract={contract} uploadToIPFS={uploadToIPFS} generateQRCode={generateQRCode} />}>
          </Route>
          <Route path="/verify" element={<Verify contract={contract} />}>
          </Route>
        </Routes>
      </Container>
    </Router>
  );
}

// Export the App component
export default App;
