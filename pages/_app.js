import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import '../styles/globals.css'
import { Permission, PermCategory, PermType, SkynetClient } from "skynet-js"



function MyApp({ Component, pageProps }) {

  const client = new SkynetClient("https://siasky.net")

  const [filePath, setFilePath] = useState();
  const [dataKey, setDataKey] = useState('');
  const [auth, setAuth] = useState(false);
  const [mySky, setMySky] = useState(null);
  const [userID, setUserID] = useState(null);
  const [loading, setLoading] = useState(false);
  const dataDomain = 'localhost';


  useEffect(() => {
    setFilePath(dataDomain + '/' + dataKey);
  }, [dataKey]);

  useEffect(() => {
  async function initMySky() {
    try {
      // load invisible iframe and define app's data domain
      // needed for permissions write
      setLoading(true)
      const mySky = await client.loadMySky(dataDomain);

      // load necessary DACs and permissions
      await mySky.addPermissions(new Permission('localhost', 'https://siasky.net', PermCategory.Discoverable, PermType.Write));
      await mySky.addPermissions(new Permission('https://siasky.net', 'https://siasky.net', PermCategory.Discoverable, PermType.Read));
      await mySky.addPermissions(new Permission('https://siasky.net', 'https://siasky.net', PermCategory.Hidden, PermType.Read));
      await mySky.addPermissions(new Permission('https://siasky.net', 'https://siasky.net', PermCategory.Hidden, PermType.Write));

      // check if user is already logged in with permissions
      const loggedIn = await mySky.checkLogin();

      // set react state for login status and
      // to access mySky in rest of app
      setMySky(mySky);
      setAuth(loggedIn)
      if (loggedIn) {
        setUserID(await mySky.userID());
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false)
  }

  initMySky(); }, []);

  async function handleLogin() {
    if(!mySky){
      const ms = await client.loadMySky(dataDomain);
      setMySky(mySky)
    }
    await mySky.addPermissions(new Permission('https://siasky.net', 'https://siasky.net', PermCategory.Discoverable, PermType.Write));
    await mySky.addPermissions(new Permission('https://siasky.net', 'https://siasky.net', PermCategory.Discoverable, PermType.Read));
    await mySky.addPermissions(new Permission('localhost', 'https://siasky.net', PermCategory.Hidden, PermType.Read));
    await mySky.addPermissions(new Permission('localhost', 'https://siasky.net', PermCategory.Hidden, PermType.Write));
    const status = await mySky.requestLoginAccess();
    // set react state
    setAuth(status);
    if (status) {
      setUserID(await mySky.userID());
    }
  }

  async function handleLogout(){
      await mySky.logout();
      setAuth(false);
      setUserID('');
      setFilePath('')
      location.reload()
  }

  async function getPermissions() {
    try {
      await mySky.addPermissions(new Permission('https://siasky.net', 'https://siasky.net', PermCategory.Discoverable, PermType.Write));
      await mySky.addPermissions(new Permission('https://siasky.net', 'https://siasky.net', PermCategory.Discoverable, PermType.Read));
      await mySky.addPermissions(new Permission('https://siasky.net', 'https://siasky.net', PermCategory.Hidden, PermType.Read));
      await mySky.addPermissions(new Permission('https://siasky.net', 'https://siasky.net', PermCategory.Hidden, PermType.Write));
    } catch (error) {
      console.log(error)
    }
}

  const authProps = {
    auth,
    setAuth,
    handleLogin,
    handleLogout,
    client,
    userID,
    getPermissions,
    mySky,
    loading
  }

  return(
    <Layout>
      <Component {...pageProps} {...authProps}/>
    </Layout>
  )
}

export default MyApp
