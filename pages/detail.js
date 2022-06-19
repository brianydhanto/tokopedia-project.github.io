import Link from 'next/link';
import { useRouter } from 'next/router'
import {
  ApolloClient,
  InMemoryCache,
  gql,
} from "@apollo/client";
import * as React from 'react';
import { css } from '@emotion/css'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


const client = new ApolloClient({
  uri: 'https://graphql.anilist.co/',
  cache: new InMemoryCache()
});

export default function Detail() {
  const params = useRouter();
  const btnDisable = params.query.source === 'collection' ? true : false;

  let [collection, setCollection] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [animeDetail, setAnimeDetail] = React.useState([]);
  let [animeCollection, setAnimeCollection] = React.useState([]);
  const [checked, setChecked] = React.useState(false);

  if (typeof window !== 'undefined') {
    if (localStorage.getItem("my_collection") !== null) {
      collection = JSON.parse(localStorage.getItem("my_collection"));
    } else {
      collection = [];
    }
  } else {
    collection = [];
  }

  const query = client.query({
    query: gql`
      query ($id: Int)  {
        Media(id: $id) {
          id
          title {
            english
          }
          coverImage {
            large
            medium
          }
          averageScore
          bannerImage
          episodes
          duration
          chapters
          volumes
          genres
          rankings {
            allTime
          }
          popularity
          description
        }
      }
    `,
    variables: {
      id: params.query ? params.query.id : null
    }
  }).then(item => {
    setAnimeDetail(item.data.Media)
  }).catch(error => {
  
  });

  const addCollection = () => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem("my_collection") === null) {
        const collection = [{
          name: 'My New Collection',
          data: [animeDetail] 
        }]
        localStorage.setItem('my_collection', JSON.stringify(collection))
        alert('Data was Successfully Added to Collection');
      } else {
        setOpen(true);
      }
    }
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, item) => {
    setChecked(event.target.checked);
    if (event.target.checked === true) {
      animeCollection.push(item);
    } else {
      const filterCollection = animeCollection.filter(i => {
        return i !== item;
      });
      animeCollection = filterCollection;
    }
  };

  const handleSubmit = () => {
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }
    if (animeCollection.length > 0) {
      animeCollection = animeCollection.filter(onlyUnique);
      
      for(let i = 0; i < animeCollection.length; i++) {
        for(let j = 0; j < collection.length; j++) {
          if (animeCollection[i] === collection[j].name) {
            collection[j].data.push(animeDetail);
          }
        }
      }

      localStorage.setItem('my_collection', JSON.stringify(collection));
      alert("Item was Successfully Added to Collection Selected");
      setOpen(false);
    }
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

      <div>
          <div className={css`
            text-align: center;
          `}>
            <img src={animeDetail.coverImage ? animeDetail.coverImage.large : '/no_image.jpeg'}></img>
          </div>
          <div>
      
            <h2>{animeDetail.title ? animeDetail.title.english ? animeDetail.title.english : 'no title' : 'no title'} <Button variant="contained" disabled={btnDisable} onClick={addCollection}>{'Add to Collection'}</Button></h2>
          
            <p>Description :</p>
            <p>{animeDetail.description ? animeDetail.description : '-'}</p>
            <p>Numbe of Episodes : {animeDetail.episodes ? animeDetail.episodes : '-'}</p>
            <p>Genres : {animeDetail.genres ?  animeDetail.genres.map(e => e).join(', ') : '-'}</p>
            <p>Rating : {animeDetail.averageScore ? animeDetail.averageScore : '-'}</p>
          </div>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Choose Collection</DialogTitle>
        <DialogContent>
          {collection.map((item, index) => (
          <div key={index+1}>
          <input
            key={index+1}
            type="checkbox"
            id={index+1}
            name={index+1}
            value={item.name}
            checked={checked}
            onChange={(e) => handleChange(e, item.name)}
          />
          {item.name}
          </div>
          ))}
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
