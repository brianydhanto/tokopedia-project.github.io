import Link from 'next/link';
import * as React from 'react';
import { css } from '@emotion/css'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function Collections() {
  
  let [collection, setCollection] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [name, setNameOfCollection] = React.useState(null);

  if (typeof window !== 'undefined') {
    if (localStorage.getItem("my_collection") !== null) {
      collection = JSON.parse(localStorage.getItem("my_collection"));
    } else {
      collection = [];
    }
  } else {
    collection = [];
  }

  const addNewCollection = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    const check = collection.filter(item => {
      return item.name.toLowerCase() === name.toLowerCase(); 
    });

    if (check.length > 0) {
      alert('Collection Already Exist');
      setNameOfCollection(null);
    } else {
      collection.push({
        data: [],
        name: name
      });
      localStorage.setItem('my_collection', JSON.stringify(collection));
      setOpen(false);
    }
  }

  const handleInput = (e) => {
    name = e.target.value;
  }

  return (
    <div className={css`
    font-family: monospace;
  `}>
      <main>
        <ul className={css`
          list-style-type: none;
          margin: 0;
          padding: 0;
          overflow: hidden;
          background-color: #333;
        `}>
          <li>
            <Link href="/">
            <a>List</a>
            </Link>
          </li>
          <li>
            <Link href="/collections">
            <a>Collection</a>
            </Link>
          </li>
        </ul>
      </main>

      <Button variant="contained" onClick={addNewCollection}>ADD NEW COLLECTION</Button>


      <Box sx={{ pt: 2}}>
        <Grid container spacing={4}>
        {collection.map((item, index) => (
            <Grid item xs={4} 
            key={index}>
            <Link href={{
                pathname: '/collections-detail',
                query: { 
                  name: item.name
                }
            }}>
            <div className={css`
            cursor: pointer;
            `}>
                <img src={item.data.length > 0 ? item.data[0].coverImage.large : '/no_image.jpeg'} width="200" height="250"></img>
                <h2>{index+1}. {item.name}</h2>
            </div>
            </Link>
            </Grid> 
        ))}
        </Grid>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Collection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Input Name of Collection
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            type="text"
            fullWidth
            value={name}
            onChange={handleInput}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>

      
      <style jsx>{`
        body {
          font-family: monospace;
        }  

        ul {
          list-style-type: none;
          margin: 0;
          padding: 0;
          overflow: hidden;
          background-color: #333;
        }
        
        li {
          float: left;
        }
        
        li a {
          display: block;
          color: white;
          text-align: center;
          padding: 14px 16px;
          text-decoration: none;
        }
        
        li a:hover {
          background-color: #111;
        }

        main {
          padding-bottom: 10pt;
        }
      `}</style>   
    </div>
    
  );
}
