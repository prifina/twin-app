import React from 'react';

import { Box, IconButton, HStack, } from '@chakra-ui/react'

//import { HamburgerIcon } from '@chakra-ui/icons'

import styled from "@emotion/styled";
import { headerOptions, } from "@/appConfig";


//position: ${props => props.ismobile === "true" ? "sticky" : "fixed"};
const StyledHeader = styled(Box)`
/* padding-left:80px; */
/* position:fixed; */
/*
position: ${props => props.ismobile === "true" ? "sticky" : "fixed"};
x:0;
y:0;
top:0;
*/
height:${headerOptions.height}
background-color:${headerOptions.backgroundColor};
/* background-color:#2C5282; */
/*
background-color:rgba(255,255,255,1)
*/
/* width:100%; */
`;

const Header = ({ onClose, onOpen, isOpen = false, isMobile, ...props }) => {
  return <>

    <StyledHeader pl={[0, 5, 5, 5]} {...props} ismobile={isMobile.toString()}>
      <HStack h={"100%"} alignItems={"center"} >
        <Box />
        {/* 
        {!isOpen &&
          <IconButton variant={"ghost"} icon={<HamburgerIcon boxSize={"1.7em"} onClick={onOpen} />} />
        } */}

      </HStack>
    </StyledHeader>
  </>
}

export default Header;