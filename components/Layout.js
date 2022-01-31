import { Box } from '@mui/system'
import MenuAppBar from '../components/MenuAppBar'
import React from 'react';


function Layout({children}) {
  return (
      <>
        <MenuAppBar {...children.props}/>
        {children}
      </>
  );
}

export default Layout