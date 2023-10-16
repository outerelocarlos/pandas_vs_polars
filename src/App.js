import React from 'react';
import {Container} from '@mui/material';
import NotebookViewer from './NotebookViewer';

function App() {
  return (
    <div className="App">
      {/* <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            My Dashboard
          </Typography>
        </Toolbar>
      </AppBar> */}
      <Container>
        {/* <DataLoader /> */}
        <NotebookViewer />
      </Container>
    </div>
  );
}

export default App;