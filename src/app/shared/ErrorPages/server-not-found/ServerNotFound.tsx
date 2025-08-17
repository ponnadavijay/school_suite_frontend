import React from 'react';
import { Button,Container } from '@mui/material';
import './ServerNotFound.css';

const ServerNotFound: React.FC = () => {
  return (
    <Container className="notfound-container">
      <img
        src="src/assets/404-not-found.svg" 
        alt="404 Not Found"
        className="notfound-image"
      />
      <div className="notfound-subtitle">
        Page Not Found
      </div>
      <div className="notfound-description">
        This page doesn’t exist or was removed! We suggest you go back to home.
      </div>
      <Button 
        variant="contained" 
        color="primary" 
        className="notfound-button"
        onClick={() => window.location.href = '/'}
      >
        Home
      </Button>
    </Container>
  );
};

export default ServerNotFound;