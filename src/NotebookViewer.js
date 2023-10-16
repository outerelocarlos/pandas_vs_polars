import React, { useEffect, useState } from 'react';
import axios from 'axios';

function NotebookViewer() {
  const [notebookHtml, setNotebookHtml] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/notebook')
      .then(response => {
        setNotebookHtml(response.data);
      });
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: notebookHtml }} />
  );
}

export default NotebookViewer;
