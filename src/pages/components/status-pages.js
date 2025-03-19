
import { useEffect, useRef, useState } from "react";
import { Flex, Box, Spinner, Text, Button, Alert, AlertIcon, AlertDescription, AlertTitle, Link } from "@chakra-ui/react";

import NextLink from 'next/link'
import { links, } from "@/appConfig";

const ConditionalToast = ({ shouldShowToast, speaker, error }) => {
  const [ErrorComponent, setErrorComponent] = useState(null);

  const effectCalled = useRef(false);
  useEffect(() => {
    if (!effectCalled.current) {

      effectCalled.current = true;
      if (shouldShowToast) {

        setErrorComponent(<Alert status="error">
          <AlertIcon />
          <AlertTitle>{`Errors occured with [${speaker}]`}</AlertTitle>
          <AlertDescription>
            {"Try again later. If the problem persists, please contact support"} <Link textDecoration={"underline"} as={NextLink} href={links.support} isExternal> {`${links.support}.`}</Link>
          </AlertDescription>
        </Alert>);
        // setTimeout(function () {
        //   window.location.href = links.speakTo;
        // }, 10000);
      }
    }
  }, [shouldShowToast, speaker]);

  return ErrorComponent

}

export const FullPageLoader = () => {
  return (
    <Flex
      height="100vh"
      width="100vw"
      justifyContent="center"
      alignItems="center"
      bg="#e2e2e2"



    >
      <Box>
        <Spinner
          thickness="6px"
          speed="0.75s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
          width="100px"
          height="100px"
        />
      </Box>
    </Flex>
  );
};



export const PageNotAvailable = (props) => {
  const effectCalled = useRef(false);
  useEffect(() => {
    // console.log("HERE ", speaker, effectCalled.current);
    // locally, the first round the page is not yet ready...
    if (!effectCalled.current) {

      effectCalled.current = true;

      setTimeout(function () {
        window.location.href = links.twin;
      }, 10000);
    }

  }, []);
  return (
    <Flex
      height="100vh"
      width="100vw"
      justifyContent="center"
      alignItems="center"
      bg="#f8f9fa"
      direction="column"
      textAlign="center"
    >
      <Box mb={8}>
        {/* Relevant SVG Illustration */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          height="200"
          width="200"
          fill="none"
        >
          <circle cx="32" cy="32" r="30" stroke="#E53E3E" strokeWidth="4" />
          <line
            x1="20"
            y1="20"
            x2="44"
            y2="44"
            stroke="#E53E3E"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="44"
            y1="20"
            x2="20"
            y2="44"
            stroke="#E53E3E"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </Box>
      <Text fontSize="2xl" fontWeight="bold" color="gray.700" mb={4}>
        {`Oops! ${props.twin} Page Not Available`}
      </Text>
      <Text fontSize="lg" color="gray.500" mb={6}>
        {`Sorry, we can't find the "${props.twin}" page you're looking for.`}
      </Text>
      <Button
        onClick={() => (window.location.href = links.twin)} // Redirect to home page
        colorScheme="blue"
        variant="solid"
      >
        {`Go to ${links.twin}`}
      </Button>
    </Flex>
  );
};

export const TempolarilyNotAvailable = (props) => {
  const effectCalled = useRef(false);

  useEffect(() => {
    if (!effectCalled.current) {
      effectCalled.current = true;
      setTimeout(() => {
        window.location.href = props.redirectUrl || "/";
      }, 15000); // Redirect after 15 seconds
    }
  }, [props.redirectUrl]);

  return (
    <Flex
      height="100vh"
      width="100vw"
      justifyContent="center"
      alignItems="center"
      bg="#f8f9fa"
      direction="column"
      textAlign="center"
    >
      <Box mb={8}>
        {/* New SVG Illustration */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          height="200"
          width="200"
          fill="none"
        >
          <circle cx="32" cy="32" r="30" stroke="#3182CE" strokeWidth="4" />
          <path
            d="M20 40 L32 25 L44 40"
            fill="none"
            stroke="#3182CE"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <line
            x1="32"
            y1="40"
            x2="32"
            y2="50"
            stroke="#3182CE"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </Box>
      <Text fontSize="2xl" fontWeight="bold" color="gray.700" mb={4}>
        {`Page Temporarily Unavailable`}
      </Text>
      <Text fontSize="lg" color="gray.500" mb={6}>
        {`We're sorry, the "${props.twin}" page is temporarily unavailable. Please check back later.`}
      </Text>
      <Button
        onClick={() => (window.location.href = links.twin)}
        colorScheme="blue"
        variant="solid"
      >
        {`Go to ${links.twin}`}
      </Button>
    </Flex>
  );
};

export const InvalidToken = ({ error }) => {

  const effectCalled = useRef(false);

  useEffect(() => {
    if (!effectCalled.current) {
      effectCalled.current = true;
      setTimeout(() => {
        window.location.href = error.authRedirect
      }, 15000); // Redirect after 15 seconds
    }
  }, [error]);



  return <>
    <Alert status="error">
      <AlertIcon />
      <AlertTitle>{`Invalid token`}</AlertTitle>
      <AlertDescription>
        {`Page will be automatically redirected to the "${error.authRedirect}"`}
      </AlertDescription>
    </Alert>
  </>

}

export default ConditionalToast;