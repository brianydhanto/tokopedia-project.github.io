import Head from 'next/head'
import Link from 'next/link';
import {
  ApolloClient,
  InMemoryCache,
  gql
} from "@apollo/client";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import React from 'react';
import { css } from '@emotion/css'

const client = new ApolloClient({
  uri: 'https://graphql.anilist.co/',
  cache: new InMemoryCache()
});

export async function getStaticProps() {
  

  const { data } = await client.query({
    query: gql`
      query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
          }
          media {
            id
            title {
              english
            },
            coverImage {
              medium
              large
            }
            description
            episodes
            genres
          }
        }
      },
    `,
    variables: {
      page: 1,
      perPage: 10
    }
  });
  
  return {
    props: {
      anime: data.Page.media,
      pagination: data.Page.pageInfo,
    },
  };
}


export default function Home({anime, pagination}) {
  
  const [page, setPage] = React.useState(1);
  const [animeList, setAnime] = React.useState(anime);
  const [animePagination, setAnimePagination] = React.useState(pagination);
  
  const changePage = (event, value) => {
    const query = client.query({
      query: gql`
        query ($page: Int, $perPage: Int) {
          Page(page: $page, perPage: $perPage) {
            pageInfo {
              total
              currentPage
              lastPage
              hasNextPage
              perPage
            }
            media {
              id
              title {
                english
              },
              coverImage {
                medium
                large
              }
              description
              episodes
              genres
              averageScore
            }
          }
        },
      `,
      variables: {
        page: value,
        perPage: 10
      }
    }).then(item => {
      setAnime(item.data.Page.media);
      setAnimePagination(item.data.Page.pageInfo);
    });
    setPage(value);
  };

  
  return (
    <div className={css`
      font-family: monospace;
    `}>
      <Head>
        <title>TOKOANIME</title>
      </Head>
      
      <main>
        <ul className={css`
          list-style-type: none;
          margin: 0;
          padding: 0;
          overflow: hidden;
          background-color: #333;
        `}>
          <li>
            <Link href='/'>
            <a>List</a>
            </Link>
          </li>
          <li>
            <Link href='/collections'>
            <a>Collection</a>
            </Link>
          </li>
        </ul>
      </main>

      <Box>
        <Grid container spacing={4}>
          {animeList.map((item) => (
            <Grid item xs={4} 
            key={item.id}>
            <div className={css`
            cursor: pointer;
            `}>
              <Link href={{
                pathname: '/detail',
                query: { 
                  id: item.id,
                  source: 'list'  
                }
              }}>
              <img src={item.coverImage.medium} width="100" height="150"></img>
              </Link>
              <h4>
                {item.title.english ? item.title.english : 'no title'} 
              </h4>
            </div>
            </Grid> 
          ))}
        </Grid>
      </Box>
      
      <div className="pagination">
        <p>Page: {page}</p>
        <Pagination
        count={animePagination.total} 
        page={page}
        onChange={changePage}
        />
      </div>

      <style jsx>{`
        .pagination {
          float: right;
          padding-bottom: 30px;
        }

        p {
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
  )
}
