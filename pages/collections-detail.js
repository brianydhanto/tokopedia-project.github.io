import Link from 'next/link';
import * as React from 'react';
import { css } from '@emotion/css'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

function List() {
  const params = useRouter();
  let [collection, setCollection] = React.useState([]);
  let [collectionDetail, setCollectionDetail] = React.useState([{
    name: '-',
    data: []
  }]);
  const [newMappingCollection, setNewMappingCollection] = React.useState([]);
  if (typeof window !== 'undefined') {
    if (localStorage.getItem("my_collection") === null) {
      localStorage.setItem('my_collection', '[]');
    }
    collection = JSON.parse(localStorage.getItem('my_collection'));
  }

  if (collection.length > 0) {
    collectionDetail = collection.filter(i => {
      return i.name === params.query.name;
    });
    collectionDetail = collectionDetail ? collectionDetail[0] : [];
  }


  const [open, setOpen] = React.useState(false);
  const [indexCollection, setIndex] = React.useState(null);

  const removeItem = (item) => {
    setOpen(true);
    collectionDetail.data = collectionDetail.data.filter(i => {
      return i.title.english !== item.english;
    });
    setCollection(collection);
    setNewMappingCollection(collection);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    localStorage.setItem('my_collection', JSON.stringify(newMappingCollection));
    alert('Item was Successfully Deleted');
    setOpen(false);
  };


  return (
    <>
      <h1>{collectionDetail ? collectionDetail.name : '-'}</h1>
      <Box>
        <Grid container spacing={4}>
          {collectionDetail.data.map((item, index) => (
            <Grid item xs={4} 
            key={index}>
            <div className={css`
            cursor: pointer;
            `}>
            <Link href={{
                pathname: '/detail',
                query: { 
                  id: item.id,
                  source: 'collection'  
                }
              }}>
              <img src={item.coverImage ? item.coverImage.medium : '/no_image/jpeg'} width="100" height="150"></img>
              </Link>
              <h3>
                {index+1}. {item.title ? item.title.english : 'no title'}
                &nbsp; 
                <Button 
                variant="contained" 
                color="error" 
                size="small"
                onClick={() => removeItem(item.title)}>Remove</Button> 
              </h3>
            </div>
            </Grid> 
          ))}

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Do you want to remove this item from Collection"}
            </DialogTitle>
            <DialogActions>
              <Button onClick={handleClose}>No</Button>
              <Button onClick={handleConfirm} autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Box>
    </>
  );
}

export default function CollectionsDetail() {
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

      <List />
      
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
