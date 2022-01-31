import { Typography, Button } from '@mui/material'
import React from 'react'
import LoadingButton from '@mui/lab/LoadingButton';


export default function Home(props) {


  return (
    <div>
        <Typography variant="h1" mt={20} align='center'>
          Welcome to Sonarch!
          <br></br>
        {!props.auth && <LoadingButton loading={props.loading} variant='contained' onClick={props.handleLogin}>Login</LoadingButton>}
          <br></br>
        {props.auth && <Button href='my-files/photos' variant='outlined' onClick={props.getPermissions}>Start Uploading!</Button>}
        </Typography>
        {props.auth && <Typography align='center'>Welcome {props.userID}</Typography>}
    </div>
  )
}

