import { Button, Modal, Paper, Typography } from "@mui/material"
import LoadingButton from '@mui/lab/LoadingButton';
import {DropzoneArea} from 'material-ui-dropzone'
import { Box } from "@mui/system";
import React, { useEffect } from 'react'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { SkynetClient } from "skynet-js";
import { Divider } from "@mui/material";
import { RoomPreferencesSharp } from "@mui/icons-material";



export default function Photos(props){

    const [modal, setModal] = React.useState(false)
    const handleUpload = () => setModal(true);
    const handleClose = () => setModal(false);
    const [loading, setLoading] = React.useState(false);
    const [filePath, setFilePath] = React.useState();
    const [userData, setUserData] = React.useState([]);

    const [file, setFile] = React.useState()

  useEffect(() => {

    async function handleFetch(filePath){

      if(props.mySky){
        console.log("Filepath: ", filePath);
        var { data } = await props.mySky.getJSONEncrypted(filePath)
        if(!data){
          console.log("New user! Initializing data. . .")
          data = await props.mySky.setJSONEncrypted(filePath, {items: []})
          console.log("Initialized new user to: ", data)
        }
        else{
          console.log("JSON Data on Get: ", data)
          setUserData(data.items)
        }

      }
    }
    const fp = "https://siasky.net/" + props.userID
    setFilePath(fp)
    handleFetch(fp)
  }, [props.userID])

  async function handleSubmit() {
    setLoading(true)
        // Assume we have a file from an input form.
        try {
            const { skylink } = await props.client.uploadFile(file);
            console.log(file)

            const img = await props.client.getSkylinkUrl(skylink);
            console.log(`Upload successful, skylink: ${img}`);
            const title = file['name']
            const metaData = {
              img,
              title
            }

            const items = userData
            items.push(metaData)
            setUserData(items)
            const object = {
              items
            }
            const {data} = await props.mySky.setJSONEncrypted(filePath, object)
            console.log("JSON Data on Upload: ", data)


            handleClose()
        } catch (error) {
            console.log(error)
        }
      setLoading(false)
    }

    async function handleFetch() {
    }

    return(
        <div>
            <h1>My Photos</h1>
            <Button onClick={handleUpload} variant='outlined'>Upload</Button>
            <Button onClick={handleFetch} variant='outlined'>Fetch Data</Button>
            <Modal
              open={modal}
              onClose={handleClose}>
                  <Box sx={{
                    position: 'absolute',
                    top: '50%', 
                    left: '50%', 
                    width: 400, 
                    height: 400,
                    transform: 'translate(-50%, -50%)'
                    }}>
                    <Paper>
                      <DropzoneArea 
                        acceptedFiles={['image/*']}
                        dropzoneText="Drag and drop or click to add an image"
                        filesLimit={1}
                        onChange={(file) => setFile(file[0])}
                        useChipsForPreview
                        showPreviews={true}
                        showPreviewsInDropzone={false}
                        showAlerts={false}
                        previewText="Selected Files:"
                        />
                        <LoadingButton 
                        onClick={handleSubmit}
                        loading={loading}
                        >
                          Submit
                        </LoadingButton>
                    </Paper>
                  </Box>
              </Modal>
               <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                {userData.map((item) => (
                  <ImageListItem key={item.img}>
                    <img
                      src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                      srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                      alt={item.title}
                      loading="lazy"
                    />
                  </ImageListItem>
                ))}
            </ImageList>
        </div>
        
    )
}