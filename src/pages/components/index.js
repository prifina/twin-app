import { useState, useEffect, useRef, useCallback, forwardRef } from "react";
import {
  Avatar,
  AvatarGroup, AvatarBadge,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  HStack,
  Image,
  Link,
  Slide,
  Spacer,
  Text,
  Textarea,
  VStack,
  Select,
  Heading, IconButton, Tooltip, Divider,
  List,
  ListItem,
  UnorderedList, useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";

import { links } from "@/appConfig";
//import { Image } from '@chakra-ui/next-js';
import NextImage from "next/image";
import NextLink from 'next/link'
import { MdOutlinePrivacyTip } from "react-icons/md";
import { PiWarningCircleLight } from "react-icons/pi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import aboutIcon from "@/assets/about.svg";
import termsOfUseIcon from "@/assets/terms-of-use.svg";
import { RxHamburgerMenu } from "react-icons/rx";

import { ExternalLinkIcon, } from '@chakra-ui/icons'

import { useShallow } from "zustand/react/shallow";
import useStore from "@/store/helper";
import { MDXRemote } from 'next-mdx-remote';
import useWebSocket from "@/hooks/useWebsocket";

export const ChakraAvatar = ({ img, badge, avatarSize, fontSize }) => {

  if (Array.isArray(img)) {
    return (
      <AvatarGroup size='md' max={3}>
        {img.map((avatar, index) => (
          <Avatar key={"avatar-" + index} name={avatar.name} src={avatar.url} />
        ))}
      </AvatarGroup>
    );
  }

  //console.log("Avatar ", img, badge);
  return (
    <div className="profile">
      <Avatar src={img} size={avatarSize}>
        {badge &&
          <AvatarBadge boxSize="1em" borderColor="white" bg="black" borderWidth={"1px"}>
            <Text fontSize={fontSize} fontWeight={700}>AI</Text>
          </AvatarBadge>
        }
      </Avatar>
      {/* <Image src={img} borderRadius="full" boxSize="48px" alt={"avatar"} /> */}
    </div>
  );
};
/* 
  <Avatar
                      src={data['avatar-url']}
                      size="superLg"
                    >
                      {data.addBadge &&
                        <AvatarBadge boxSize="1em" borderColor="white" bg="black" borderWidth={"3px"}>
                          <Text fontSize={"35px"} fontWeight={700}>AI</Text>
                        </AvatarBadge>
                      }
                    </Avatar>*/


export const CustomSlide = (props) => {
  if (!props.check) {
    return (
      <Slide
        direction="right"
        style={{
          zIndex: 2,
          backgroundColor: "#e2e2e2",
          // width: { base: "100vw", md: sidebarShown ? "40vw" : "100vw" },
        }}
        in={!props.sidebarShown}
      >
        <Flex>{props.children}</Flex>
      </Slide>
    );
  } else {
    return props.children;
  }
};

export const FooterText = ({ textData }) => {
  if (typeof textData === 'object') {
    return (
      <>
        {textData?.link &&
          <Link
            textDecoration={"underline"}
            href={textData.link}
          >
            {textData.text}
          </Link>
        }
        {textData?.link === undefined && <>
          {textData.text}
        </>
        }
      </>
    );
  } else {
    return textData;
  }
};

const SidebarSpeaker = ({ speaker }) => {

  return <>
    <Card w={"100%"} onClick={(e) => {
      const { speakerId, selectedSpeaker } = e.currentTarget.dataset;
      if (selectedSpeaker === "false") {
        window.location.replace("/" + speakerId);
      }
      e.preventDefault();
    }} data-speaker-id={speaker.userId} data-selected-speaker={speaker.selected} >
      <HStack >
        <Box w={"100%"}>
          <HStack m={"2px"} alignItems={"start"}>
            <Tooltip label={speaker.caption} >
              <Avatar name={speaker.name} src={speaker['avatar-url']} />
            </Tooltip>
            <VStack>

              <Heading size='sm'>{speaker.name}</Heading>
              <Text fontSize={"x-small"}>{speaker.title}</Text>
            </VStack>
          </HStack>
        </Box>
        <Box >
          <IconButton
            variant='ghost'
            colorScheme='gray'
            aria-label='Open'
            icon={<ExternalLinkIcon />}
          />
        </Box>
      </HStack>
    </Card>
  </>
}

export const SidebarBottomLink = ({ icon, event, text }) => {
  return (
    <Flex marginTop={"20px"} cursor={"pointer"} onClick={event}>
      <Flex
        width={"30px"}
        height={"30px"}
        marginRight={"5px"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {icon}
      </Flex>

      <Text>{text}</Text>
    </Flex>
  );
};

export const CustomSidebar = ({ sidebarShown, showDisclaimerToast, debugOption, sidebarSpeakers = [], uiTexts }) => {
  // const [selectedModalDialog, setSelectedModalDialog] = useState(0);

  // const openModalDialog = () => {
  //   setSelectedModalDialog(1);
  // };
  // if (process.env.NEXT_PUBLIC_APP_DEV !== undefined && process.env.NEXT_PUBLIC_APP_DEV === "true")
  //console.log("ENV ", process.env.NEXT_PUBLIC_APP_DEBUG)
  return (
    <>
      <Flex
        display={{ base: "flex", md: sidebarShown ? "flex" : "none" }}
        zIndex={1}
        flexDirection={"column"}
        width={{ base: "100vw", md: "300px" }}
        backgroundColor={"#3b2e8b"}
        height={"100vh"}
        paddingTop={"100px"}
        paddingBottom={"50px"}
        paddingLeft={"20px"}
        color={"white"}
        marginRight={"auto"}
      >
        {/*  {debugOption && <>
          <Flex marginTop={"20px"} cursor={"pointer"}>
            <Flex
              width={"30px"}
              height={"30px"}
              marginRight={"5px"}
              justifyContent={"center"}
              alignItems={"center"}
            ></Flex>

            <Button
              variant={"ghost"}
              onClick={(e) => {
                e.preventDefault();
                setSelectedModalDialog(1);
              }}
            >
              Debug dialog
            </Button>
          </Flex>
        </>
        } */}
        <VStack marginTop={"20px"} cursor={"pointer"} w={"95%"}>
          {sidebarSpeakers.length > 0 && sidebarSpeakers.map((speaker, i) => {
            return <SidebarSpeaker key={"sidebar-speaker-" + i} speaker={speaker} />
          })}
        </VStack>

        <Spacer />
        <SidebarBottomLink
          event={() => {
            showDisclaimerToast();
          }}
          icon={<PiWarningCircleLight size={"30px"} />}
          text={uiTexts.showDisclaimer}
        />
        <SidebarBottomLink
          event={() => {
            window.open(links.speakTo);
          }}
          icon={<NextImage alt={uiTexts.about} src={aboutIcon} />}
          text={uiTexts.about}
        />

        <SidebarBottomLink
          event={() => {
            window.open(links.termsOfUse);
          }}
          icon={<NextImage alt={uiTexts.terms} src={termsOfUseIcon} />}
          text={uiTexts.terms}
        />
        <SidebarBottomLink
          event={() => {
            window.open(links.privacyPolicy);
          }}
          icon={<MdOutlinePrivacyTip size={"24"} />}
          text={uiTexts.policy}
        />
      </Flex>


    </>
  );
};

export const SidebarOpenButton = ({ sidebarShown, openSidebar }) => {
  return (
    <Box
      data="sidebar-toggle"
      id="sidebar-toggle"
      backgroundColor={{
        base: sidebarShown ? "#3b2e8b" : "rgba(255, 255, 255, 0.5)",
        md: "unset",
      }}
      backdropFilter={"blur(5px)"}
      position={"absolute"}
      borderRadius={"5px"}
      left={"20px"}
      top={"20px"}
      padding={"2px"}
      zIndex={5}
    >
      <RxHamburgerMenu
        color={sidebarShown ? "white" : "#9f9f9f"}
        _hover={{ bg: "#f5f7f9" }}
        cursor={"pointer"}
        size={"30px"}
        onClick={() => {
          openSidebar();
        }}
      />
    </Box>
  );
};

export const ChatlogContainer = (props) => {
  return (
    <Box
      style={{ zIndex: 3 }}
      display={{ base: "block", md: "block" }}
      backgroundColor={"white"}
      width={{
        base: "100vw",
        md: props.sidebarShown ? "80vw" : "90vw",
      }}
      maxWidth={{
        base: "100vw",
        md: props.sidebarShown ? "1536px" : "1728px",
      }}
      height={"90vh"}
      marginRight={{ base: "0px", md: "auto" }}
      marginLeft={{ base: "0px", md: "auto" }}
      // marginTop={"auto"}
      marginBottom={"auto"}
      verticalAlign={"middle"}
      borderBottomRightRadius={"30px"}
      borderBottomLeftRadius={"30px"}
    // padding={"10px"}
    >
      {props.children}
    </Box>
  );
};

const CustomFooter = ({ sidebarShown, textData, isMobile }) => {

  return (
    <Box
      width={isMobile ? "100%" : "unset"}
      display={isMobile ? (sidebarShown ? "none" : "block") : "block"}
      color={"#8D8D8D"}
      position={"absolute"}
      bottom={"20px"}
      textAlign={"center"}
      alignItems={"center"}
      justifyContent={"center"}
      zIndex={2}
      backgroundColor={"#e2e2e2"}
      paddingLeft={isMobile ? "0px" : sidebarShown ? "300px" : "0px"}
      alignSelf={"center"}
    >
      {textData && (
        <>
          <Text textAlign={"center"} fontWeight={700}>
            <FooterText textData={textData} />
          </Text>
        </>
      )}
    </Box>
  );
};


const Details = ({ requestId, ...prop }) => {

  const { url } = useStore(
    useShallow((state) => ({
      url: state.url,
    }))
  );

  const [detailsData, setDetailsData] = useState({});
  const effectCalled = useRef(false);
  useEffect(() => {
    async function details() {
      effectCalled.current = true;
      const data = await fetch(`${url}/get-details?requestId=${requestId}`, {
        method: 'GET',
        headers: new Headers({ 'Content-Type': 'application/json', Accept: 'application/json' })
      });
      let detailsObj = {};
      if (data.ok) {
        detailsObj = await data.json();
      }
      const links = [];
      if (detailsObj.response?.metadata !== undefined && detailsObj.response.metadata.length > 0) {
        detailsObj.response.metadata.forEach(meta => {
          if (meta.addons.length > 0) {
            meta.addons.forEach(addon => {
              if (addon?.['prifina-addon-v1'] !== undefined) {
                if (addon['prifina-addon-v1']?.['image'] !== undefined) {
                  links.push({ url: addon['prifina-addon-v1']['image']['#text'], title: addon['prifina-addon-v1']['image']['@_']['@_description'] })
                }
                if (addon['prifina-addon-v1']?.['url'] !== undefined) {
                  links.push({ url: addon['prifina-addon-v1']['url']['#text'], title: addon['prifina-addon-v1']['url']['@_']['@_description'] })
                }
              }
            })
          }
        });
      }
      console.log("LINKS ", links);
      console.log("DETAILS OBJ ", detailsObj);
      setDetailsData({ isFollowUp: detailsObj.response.statementIsFollowUp || false, isInformational: detailsObj.response.statementIsInformational || false, quality: detailsObj.response.quality || "", extracted: { parts: detailsObj.response.extract || [], score: detailsObj.response.originAverage || 0.00 }, links });
    }
    if (!effectCalled.current) {
      details();
    }
  }, [url, requestId]);

  if (detailsData?.extracted === undefined) {
    return null;
  }

  return (
    <HStack spacing={4} align="start">
      {/* Left Box - Extracted Parts */}
      <Box>
        <Text fontWeight="bold">Extracted Details</Text>
        <Text>{`Answer quality: ${detailsData.quality}`}</Text>
        {detailsData.extracted.parts.map((item, index) => (
          <Box key={"item-" + index} mb={4}>
            <Text>{index + 1}. Part: {item.text}</Text>
            <Text>Type: {item.type}</Text>
            <Text>Sentiment: {item.sentiment}</Text>
            <Text>Language: {item.language}</Text>
          </Box>
        ))}
        <Text>Score: {detailsData.extracted.score.toFixed(2)}</Text>
        <Text>FollowUp: {detailsData.isFollowUp ? "Yes" : "No"}</Text>
        <Text>Informational: {detailsData.isInformational ? 'Yes' : 'No'}</Text>
      </Box>

      {/* Divider between the two boxes */}
      <Divider orientation="vertical" height="auto" />

      {/* Right Box - Links */}
      <Box>
        <Text fontWeight="bold">Links</Text>
        <UnorderedList spacing={2} mt={2}>
          {detailsData.links.map((link, index) => (
            <ListItem key={"link-" + index}>
              <Link as={NextLink} href={link.url} isExternal>
                {link.title}
              </Link>
            </ListItem>
          ))}
        </UnorderedList>
      </Box>
    </HStack>
  );
};

export const LastCard = ({
  knowledgeBase,
  message,
  language
}) => {
  // console.log("MSG ", (message?.component !== undefined));
  // Define the size based on the breakpoint
  const avatarSize = useBreakpointValue({ base: "sm", md: "md" });
  const fontSize = useBreakpointValue({ base: "8px", md: "12px" });
  const [compiledMDX, setCompiledMDX] = useState(null);
  const [info, setInfo] = useState([]);
  const endOfListRef = useRef(null);
  const { isOpen, onToggle } = useDisclosure();

  const handleNewNotiffication = useCallback((msg) => {
    console.log("NEW NOTIFICATION ", msg);
    if (!isOpen && info.length === 0) {
      onToggle();
    }
    setInfo((prev) => [...prev, msg]);

  }, [isOpen, onToggle, info]);


  // Call the hook with the requestId and the custom onMessage callback.
  useWebSocket(message.requestId, handleNewNotiffication);


  useEffect(() => {
    async function fetchCompiledMDX() {
      try {
        const res = await fetch('/api/v1/compile-mdx', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mdx: message.answer }),
        });
        const data = await res.json();
        if (res.ok) {
          setCompiledMDX(data.mdxSource);
        } else {
          console.error('Error from API:', data.error);
        }
      } catch (err) {
        console.error('Failed to fetch compiled MDX:', err);
      }
    }

    // Re-fetch and recompile when message.answer changes.
    if (message.answer) {
      fetchCompiledMDX();
    }
  }, [message.answer]);


  useEffect(() => {
    if (endOfListRef.current) {
      endOfListRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [info]);
  console.log("LAST CARD ", message.requestId);
  //const ExtraComponent = <div>Testing</div>;
  return (
    <Card
      variant={"unstyled"}
      // key={"answer-" + key}
      mr={[0, "0px"]}
      mb={"20px"}
      data-answer-card={`answer-${message.uniqueId}`}
      display={message.hidden ? "none" : "block"}
    >
      <CardBody className="answer ai">
        <HStack alignItems={"normal"}>
          <Box>
            <ChakraAvatar img={knowledgeBase['avatar-url']} badge={knowledgeBase['addBadge']} avatarSize={avatarSize} fontSize={fontSize} />
          </Box>
          <Box w={"100%"}>
            <Text fontWeight={600}>
              {knowledgeBase.title || message.title}
            </Text>
            <Box className="message" id={message.uniqueId}>

              {(message.streaming && message.answer === "") && <>
                <HStack >
                  {info.length > 0 &&
                    <IconButton
                      variant='ghost'
                      aria-label='Open'
                      icon={isOpen ? <FaChevronUp color="black" /> : <FaChevronDown color="black" />}
                      onClick={onToggle}
                    />
                  }
                  <Box className="dots" />

                </HStack>

                {(isOpen && info.length > 0) &&
                  <UnorderedList
                    maxH="150px"          // set your desired maximum height
                    overflowY="auto"      // make it scrollable vertically when content exceeds max height
                    border="1px solid"    // add a simple 1px border
                    borderColor="gray.200"// choose a border color (you can customize this)
                    borderRadius="md"     // optional: add rounded corners
                    p={4}
                  >
                    {info.map((item, index) => (
                      <ListItem key={index}>{item.event}</ListItem>
                    ))}
                    {/* Dummy list item for scrolling */}
                    <ListItem ref={endOfListRef} style={{ listStyleType: 'none', padding: 0, margin: 0 }} />
                  </UnorderedList>
                }

              </>}

              {message.streaming && <Box className="question-answer" />}

              {(!message.streaming && message.answer !== "" && compiledMDX) && (
                <>
                  <Box className="question-answer" data="response">
                    <MDXRemote {...compiledMDX} />

                  </Box>
                  <Box id={`reply-${message.requestId}`}></Box>

                </>
              )}
            </Box>
          </Box>

        </HStack>
      </CardBody>
    </Card>
  );
};

export const AnswerCard = ({
  knowledgeBase,
  message,
  language
}) => {
  // console.log("MSG ", (message?.component !== undefined));
  // Define the size based on the breakpoint
  const avatarSize = useBreakpointValue({ base: "sm", md: "md" });
  const fontSize = useBreakpointValue({ base: "8px", md: "12px" });
  const [compiledMDX, setCompiledMDX] = useState(null);

  useEffect(() => {
    async function fetchCompiledMDX() {
      try {
        const res = await fetch('/api/v1/compile-mdx', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mdx: message.answer }),
        });
        const data = await res.json();
        if (res.ok) {
          setCompiledMDX(data.mdxSource);
        } else {
          console.error('Error from API:', data.error);
        }
      } catch (err) {
        console.error('Failed to fetch compiled MDX:', err);
      }
    }

    // Re-fetch and recompile when message.answer changes.
    if (message.answer) {
      fetchCompiledMDX();
    }
  }, [message.answer]);

  /*   const [mdxSource, setMdxSource] = useState(null);
    useEffect(() => {
      async function getMdxSource() {
        const mdxSource = await serialize(message.answer, {
          // You can pass MDX options here (e.g. remark/rehype plugins) as needed.
          // mdxOptions: { ... }
        });
        setMdxSource(mdxSource);
      }
      getMdxSource();
    }, [message.answer]);
   */
  //const ExtraComponent = <div>Testing</div>;
  return (
    <Card
      variant={"unstyled"}
      // key={"answer-" + key}
      mr={[0, "0px"]}
      mb={"20px"}
      data-answer-card={`answer-${message.uniqueId}`}
      display={message.hidden ? "none" : "block"}
    >
      <CardBody className="answer ai">
        <HStack alignItems={"normal"}>
          <Box>
            <ChakraAvatar img={knowledgeBase['avatar-url']} badge={knowledgeBase['addBadge']} avatarSize={avatarSize} fontSize={fontSize} />
          </Box>
          <Box w={"100%"}>
            <Text fontWeight={600}>
              {knowledgeBase.title || message.title}
            </Text>
            <Box className="message" id={message.uniqueId}>
              {(message.streaming && message.answer === "") && <Box className="dots" />}

              {message.streaming && <Box className="question-answer" />}

              {(!message.streaming && message.answer !== "" && compiledMDX) && (
                <>
                  <Box className="question-answer" data="response">
                    <MDXRemote {...compiledMDX} />

                  </Box>
                  <Box id={`reply-${message.requestId}`}></Box>

                </>
              )}
            </Box>
          </Box>

        </HStack>
      </CardBody>
    </Card>
  );
};

export const QuestionCard = ({ message, isMobile, uiTexts }) => {
  return (
    <Card variant={"unstyled"} mr={[0, "0px"]} mb={"20px"}>
      <CardBody className="question user">
        <HStack spacing={"10px"} alignItems={"normal"}>
          <Box>
            <Avatar size={isMobile ? "sm" : "md"} />
          </Box>
          <Box>
            <Text fontWeight={600}>{uiTexts.input}</Text>
            <Box
              className="message user-question"
              id={`user-${message.uniqueId}`}
            >
              {message.value}

            </Box>
          </Box>
        </HStack>
      </CardBody>
    </Card>
  );
};

// there have to be one default export in component files...
export default CustomFooter;