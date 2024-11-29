import React from 'react';

function Headline({error}) {
  return (
    <center>
      <h1>Climate Monitor</h1>
      <p>Current Time: {new Date().toLocaleTimeString()}</p>
      {error && <p>Error: {error}</p>}
    </center>
  );
}

export default Headline;