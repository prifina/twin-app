import { useRouter } from "next/router";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
// pages/index.js
//import dynamic from 'next/dynamic';

// Ensure the component is only rendered on the client-side
// const WebSocketListener = dynamic(() => import('@/utils/WebSocketListener'), {
//   ssr: false,
// });

import {
  Alert,
  AlertDescription,
  AlertTitle,
  AlertIcon,
  Box,
  Center,
  ChakraProvider,
  Flex,
  Grid,
  GridItem,
  HStack,
  effect,
  useDisclosure,
  useMediaQuery,
  useOutsideClick,
  useToast
} from "@chakra-ui/react";

import Footer from "@/Footer";
import Header from "@/Header";
import Welcome from "@/Welcome";
import { EVALS, theme, showExamples, showSidebarList, uiTexts } from "@/appConfig";
import { fetchWithTimeout, generateUniqueId, getLanguageName } from "@/utils";
import autosize from "autosize";

import { v4 as uuidv4 } from 'uuid';
//import { newExample } from "@/utils/getExample";
import { clientInit } from "@/utils/getInit";

import { translate } from "@/utils/getTranslations";

import {
  LastCard,
  AnswerCard,
  ChatlogContainer,
  CustomSidebar,
  CustomSlide,
  QuestionCard,
  SidebarOpenButton,
} from "./components/index";

import CustomFooter from "./components/index";


import { useShallow } from "zustand/react/shallow";

import { getData, getDetails } from "@/utils/generateAnswer";

import useStore from "@/store/helper";

import ConditionalToast, { FullPageLoader, PageNotAvailable, TempolarilyNotAvailable, InvalidToken } from "./components/status-pages";
//import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

function UserPage(props) {
  //console.log("PROPS ", props);

  const router = useRouter();
  const { username } = router.query;
  //console.log("USER ", username);
  const [initError, setInitError] = useState("");
  const [haveAnswer, setHaveAnswer] = useState(false);
  const [sidebarShown, setSidebarShown] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const scrollSpan = useRef();
  const scrollSpan2 = useRef();
  const sideBar = useRef();
  const statement = useRef();

  const toast = useToast();
  const disclaimerToastID = "disclaimer-toast-init";

  //const queryActive = useRef(false);
  //const knowledgebase = useRef(props);
  const knowledgebase = useRef({ ...props }); // Shallow copy, so we can modify it
  //const requestId = useRef();

  const uniqueId = useRef();
  //const exampleStatement = useRef("Hello")
  // const summary = useRef("");
  const processingStatement = useRef(false);
  const [messageList, setMessageList] = useState([]);
  const exampleQuestionClicked = useRef(false);

  if (process.env.NEXT_PUBLIC_APP_DEV !== undefined && process.env.NEXT_PUBLIC_APP_DEV === "true") {
    console.log("test log output for playwright testing");
  }

  const [shiftTop, setShiftTop] = useState(false);

  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      //  errors: props.error ? true : false,
      errors: false,
      loading: true,
      isUpdated: true,
      debug: props.debug,
      auth: {},
      twinStatus: 0
    }
  );

  useEffect(() => {
    var messagesElement = document.getElementById("messages");
    var messagesContainer = document.getElementById("messages_container");
    if (messagesElement && messagesContainer) {
      console.log({ messagesElement, messagesContainer });
      if (messagesElement.scrollHeight > messagesContainer.clientHeight) {
        setShiftTop(true);
      }
    }
  }, [messageList]);

  const {
    currentUser,
    setCurrentUser,
    requestId,
    setRequestId,
    url,
    sessionId,
    language,
    scoreLimit,
    example,
    setExample,
    isFooterRendered,
    setIsFooterRendered,
    queryActive,
    setQueryActive,
    models,
    defaultModel,
    getDisclaimerStatus,
    setDisclaimerStatus,
    updateSpeakerStorage,
    getSpeakerStorage
  } = useStore(
    useShallow((state) => ({
      currentUser: state.currentUser,
      requestId: state.requestId,
      url: state.url,
      language: state.language,
      example: state.example,
      setExample: state.setExample,
      scoreLimit: state.scoreLimit,
      sessionId: state.sessionId,
      isFooterRendered: state.isFooterRendered,
      queryActive: state.queryActive,
      models: state.models,
      defaultModel: state.defaultModel,
      setQueryActive: state.setQueryActive,
      setIsFooterRendered: state.setIsFooterRendered,
      setRequestId: state.setRequestId,
      setCurrentUser: state.setCurrentUser,
      setDisclaimerStatus: state.setDisclaimerStatus,
      getDisclaimerStatus: state.getDisclaimerStatus,
      updateSpeakerStorage: state.updateSpeakerStorage,
      getSpeakerStorage: state.getSpeakerStorage
    }))
  );

  const showDisclaimerToast = useCallback((show = true) => {
    if (!toast.isActive(disclaimerToastID) && state.twinStatus === 0) {
      toast({
        id: disclaimerToastID,
        title: knowledgebase.current.translations.disclaimerTitle,
        description: knowledgebase.current.disclaimerText
          ? knowledgebase.current.disclaimerText : uiTexts.defaultDisclaimer,
        status: "info",
        duration: null,
        isClosable: true,
      });
    } else {
      if (!show) {
        // console.log("DISCLAIMER ALREADY SHOWN");
        toast.close(disclaimerToastID);
      }
      return null;
    }
  }, [toast, state.twinStatus]);


  const messages = useRef([]);

  const effectCalled = useRef(false);

  // const handleSidebarEvents = (opt) => {
  //   console.log("SIDEBAR EVENTS ", opt);
  // };
  // const providerValue = {
  //   sideBarEvents: handleSidebarEvents,
  // };

  const handleScrollChange = useCallback(() => {
    // Handle orientation change here
    console.log("DEVICE TURNED OR NEED FOR SCROLL");
    setTimeout(() => {
      console.log("SCROLL REF ", scrollSpan2.current);
      if (scrollSpan2.current) {
        scrollSpan2.current.scrollIntoView(true, {
          behavior: "auto",
          block: "end",
          inline: "nearest",
        });
      }

      if (scrollSpan2.current === null && scrollSpan.current) {
        scrollSpan.current.scrollIntoView(true, {
          behavior: "auto",
          block: "end",
          inline: "nearest",
        });
      }
    }, 300);
  }, []);

  useOutsideClick({
    ref: sideBar,
    handler: () => {
      if (sideBar.current !== null && sideBar.current !== undefined) {
        onClose();
      }
    },
  });

  useEffect(() => {
    if (!state.loading && knowledgebase.current.query?.q !== undefined && knowledgebase.current.query.q !== null && statement.current) {
      console.log("LOADING...", state.loading, knowledgebase.current.query);
      statement.current.value = knowledgebase.current.query.q;
      const event = new KeyboardEvent("keydown", {
        key: "Enter", // Specify the key value
        code: "Enter", // Specify the code value
        keyCode: 13, // Specify the keyCode for Enter
        which: 13, // Deprecated, but included for compatibility with older browsers
        bubbles: true, // Event should bubble up through the DOM
        cancelable: true, // Event can be canceled
      });
      delete knowledgebase.current.query.q;
      statement.current.dispatchEvent(event);
    } else if (!state.loading && !getDisclaimerStatus()) {
      setTimeout(() => {
        showDisclaimerToast();
        setDisclaimerStatus(true);
      }, 300);
    }
  }, [
    state.loading,
    showDisclaimerToast,
    getDisclaimerStatus,
    setDisclaimerStatus,
  ]);

  useEffect(() => {
    if (haveAnswer) {
      statement.current.style.height = `${EVALS.defaultHeight}px`;

      scrollSpan.current.scrollIntoView(true, {
        behavior: "auto",
        block: "end",
        inline: "nearest",
      });

      statement.current.disabled = false;
      statement.current.dataset.status = "ready";
      statement.current.focus();
    }
  }, [haveAnswer]);

  useEffect(() => {

    window.addEventListener("orientationchange", handleScrollChange);

    return () => {
      window.removeEventListener("orientationchange", handleScrollChange);
    };
  }, [handleScrollChange]);


  useEffect(() => {
    async function init() {
      effectCalled.current = true;
      console.log("INIT ", username, knowledgebase.current, knowledgebase.current?.error, (knowledgebase.current?.error !== undefined));
      if (username && knowledgebase.current?.error === undefined) {
        sessionStorage.setItem("lastVisitedSlug", username);
        let statStorage = localStorage.getItem('twin-stat-storage');
        let statStatus = false;
        if (statStorage !== null) {
          const stats = JSON.parse(statStorage);
          statStatus = stats.some(m => m.name === knowledgebase.current.stat);
          if (!statStatus) {
            statStorage = JSON.stringify([...stats, { name: knowledgebase.current.stat, twin: username }])
          }

        } else {
          statStorage = JSON.stringify([{ name: knowledgebase.current.stat, twin: username }])
        }
        localStorage.setItem('twin-stat-storage', statStorage);




        //currentUser.current = initData.result.name;
        //  setCurrentUser(initData.result.name);
        setCurrentUser(knowledgebase.current.name);
        // console.log("KNOWLEDGEBASE ", Object.keys(knowledgebase.current));
        const userLanguage = getLanguageName(language);
        const { error, data } = await clientInit(fetchWithTimeout, {
          sessionId,
          knowledgebaseId: knowledgebase.current.knowledgebaseId,
          typeOfExampleQuestions: knowledgebase.current.typeOfExampleQuestions,
          noOfExampleQuestions: knowledgebase.current.noOfExampleQuestions,
          existingExampleQuestions: knowledgebase.current.exampleQuestions ? knowledgebase.current.exampleQuestions.length : 0,
          showExamples,
          debug: state.debug,
          userLanguage,
          networkId: process.env.NEXT_PUBLIC_NETWORK_ID,
          stat: { name: knowledgebase.current.stat, status: statStatus, twin: username, storage: JSON.parse(statStorage), headers: knowledgebase.current.headers, url: knowledgebase.current.url },

        });
        console.log("CLIENT INIT ", data, error);
        if (error) {
          toast({ title: error.message || error.name, status: "error" });
          return;
        }


        let tobeTranslated = {
          'caption': knowledgebase.current.caption, 'description': knowledgebase.current.description, 'title': knowledgebase.current.title,
          'disclaimerText': knowledgebase.current.disclaimerText, 'footer': knowledgebase.current.footer.text
        };
        // knowledgebase.current.translations = {};
        Object.keys(uiTexts).forEach((m, i) => {
          knowledgebase.current.translations[m] = uiTexts[m];
        });
        if (userLanguage !== 'English') {
          let translationsExists = false;
          if (typeof window !== 'undefined') {
            const txtStorage = localStorage.getItem('twin-app-translations');
            if (txtStorage !== null) {
              const existingTranslations = JSON.parse(txtStorage);
              const uiKeys = Object.keys(uiTexts);
              const existingKeys = Object.keys(existingTranslations.source);
              // if saved uiTexts are alread present...
              if (existingTranslations?.[userLanguage] !== undefined && uiKeys.length === existingKeys.length && uiKeys.every(key => existingKeys.includes(key)) && uiKeys.some(key => uiTexts[key] === existingTranslations.source[key])) {
                // uiTexts exists already...
                translationsExists = true;
                Object.keys(uiTexts).forEach((m, i) => {
                  knowledgebase.current.translations[m] = existingTranslations[userLanguage][m];
                });
              }
            }
          }
          if (!translationsExists) {
            tobeTranslated = { ...tobeTranslated, ...uiTexts };
          }
        }

        if (knowledgebase.current.exampleQuestions.length > 0) {
          const translateThese = {};
          knowledgebase.current.exampleQuestions.forEach((m, i) => {
            translateThese[`example_${i}`] = m;
          });
          tobeTranslated = { ...tobeTranslated, ...translateThese };
        }
        // exclude list is not working reliably...
        const translated = await translate(fetchWithTimeout, { exclude: ['Speak to AI', 'AI-Twin', 'AI Twin'], content: Object.keys(tobeTranslated).map(m => tobeTranslated[m]), target: userLanguage });
        console.log("TRANSLATE ", tobeTranslated, translated);

        Object.keys(tobeTranslated).forEach((m, i) => {
          if (['caption', 'description', 'title', 'disclaimerText'].indexOf(m) > -1) {

            knowledgebase.current[m] = translated.translations.response.target[i];
          } else if (m === 'footer') {
            knowledgebase.current.footer.text = translated.translations.response.target[i];
          } else if (m.startsWith('example_')) {
            const idx = parseInt(m.replace('example_', ''));
            knowledgebase.current.exampleQuestions[idx] = translated.translations.response.target[i];
          } else if (Object.keys(uiTexts).indexOf(m) > -1) {
            knowledgebase.current.translations[m] = translated.translations.response.target[i];
          }
        });
        // save uiTexts translations...
        if (typeof window !== 'undefined') {
          localStorage.setItem('twin-app-translations', JSON.stringify({ source: uiTexts, [userLanguage]: knowledgebase.current.translations }));
        }

        //console.log("AFTER TRANSLATIONS ", knowledgebase.current);

        //exampleStatement.current = data.response.question;
        if (showExamples) {
          let exampleQuestions = data.response.exampleQuestions;
          if (knowledgebase.current.typeOfExampleQuestions === 1 || knowledgebase.current.typeOfExampleQuestions === 2) {
            exampleQuestions.push(...knowledgebase.current.exampleQuestions);
          }
          setExample({
            exampleQuestions, show: true,
            typeOfExampleQuestions: knowledgebase.current.typeOfExampleQuestions,
            noOfExampleQuestions: knowledgebase.current.noOfExampleQuestions
          });
          // it is better to show the top page after the init... instead of scrolling to the bottom
          //handleScrollChange();
        }

        updateSpeakerStorage(knowledgebase.current);

        setState({ loading: false, twinStatus: knowledgebase.current.twinStatus, authRequired: knowledgebase.current.authRequired });

      } else if (knowledgebase.current?.error !== undefined) {
        const error = JSON.parse(knowledgebase.current.error);
        console.log("ERROR ", error);
        // console.log(error.code);
        if (error.code === "Unknown") {
          console.log("UNKNOWN CODE ERROR ", error.code);
          setState({ errors: false, loading: false, twinStatus: 1 });
          //return;
        } else if (error.code === 'InvalidTwin' || error.code === 'TokenExpired' || error.code === 'TokenRequired') {
          setState({ errors: false, loading: false, twinStatus: -1, auth: error.auth });
        } else {
          setInitError(error.message);
          setState({ loading: false, errors: true, twinStatus: -1, auth: error.auth });
        }
        return;
        /*  if (knowledgebase.current?.error?.code === undefined && knowledgebase.current?.error.indexOf(`{"message":`) !== -1) {
           const error = JSON.parse(knowledgebase.current?.error);
           setInitError(error.message);
           //          toast({ title: error.message, status: "error" });
           setState({ errors: true });
           console.log("ERROR2 ", error);
           return;
         } */
      }
    }
    if (!effectCalled.current) {
      init();
    }

    autosize(statement.current);
  }, [
    username,
    toast,
    sessionId,
    url,
    setCurrentUser,
    language,
    setExample,
    showDisclaimerToast,
    defaultModel,
    state.debug,
    updateSpeakerStorage
  ]);

  useEffect(() => {

    const getAnswer = async (entry) => {
      const startTime = new Date().getTime();

      processingStatement.current = true;
      console.log("GET DATA ", sessionId, entry);
      console.log(messageList, new Date().toISOString());

      // const requestId = uuidv4();
      const msgIndex = messageList.length - 1;
      const {
        error: dataError,
        results
      } = await getData(
        entry,
        {
          url,
          userId: currentUser, sessionId, scoreLimit, defaultModel,
          chatId: uniqueId.current,
          appId: process.env.NEXT_PUBLIC_APP_ID,
          userLanguage: getLanguageName(language),
          exampleClick: exampleQuestionClicked.current,
          msgIdx: msgIndex,
        },
        knowledgebase.current.knowledgebaseId,
        requestId,
        true
      );

      console.log("AFTER GET DATA ERROR ", dataError);

      if (dataError) {
        toast({
          title: dataError.message || dataError.name,
          status: "error",
          description: dataError.cause.info,
        });

        //const updatedMessageList = [...messageList];
        //updatedMessageList[msgIndex][1].streaming = false;
        setHaveAnswer(true);
        setQueryActive(false);
        statement.current.value = "";
        return;
      }

      console.log("AFTER GET DATA ", results);

      //const tokens = updateUsedTokens({ url, userId: opts.userId, requestId: opts.requestId, followUp: opts.followUp, aggregate: opts.aggregate, entryType, langCode, currentIndex: opts.knowledgebaseId, llm: opts.llm, statement: opts.statement, session: opts.session, exampleClick: opts.exampleClick });

      // reset example click status...
      exampleQuestionClicked.current = false;

      const updatedMessageList = [...messageList];

      updatedMessageList[msgIndex][1].answer = results.answer;
      updatedMessageList[msgIndex][1].streaming = false;

      // this triggers getting request details... this is now handled in newMessage()..
      //updatedMessageList[msgIndex][1].requestId = requestId;

      // answer has html tags like this <br/>
      const cleanedAnswer = results.answer
        .replace(/<br\/>/g, "\n")
        .replace(/<\/?[^>]+(>|$)/g, " ")
        .trim();


      // const avgScore =
      //   results.scores.reduce((total, score) => total + score, 0) / results.scores.length || 0;
      // const formattedScore = avgScore > 0 ? avgScore.toFixed(2) : avgScore;

      messages.current.push({
        answer: cleanedAnswer,
        statement: entry,
      });

      // no need to update the message list.... 
      //setMessageList(updatedMessageList);
      setHaveAnswer(true);

      setQueryActive(false);
      statement.current.value = "";

      console.log("GET ANSWER TIME ", (new Date().getTime() - startTime) / 1000);

    };

    if (
      document.getElementById(uniqueId.current) !== null &&
      statement.current.value.trim() !== ""
    ) {
      setHaveAnswer(false);

      scrollSpan.current.scrollIntoView(true, {
        behavior: "auto",
        block: "end",
        inline: "nearest",
      });

      if (!processingStatement.current) {
        getAnswer(statement.current.value.trim());

      }
    }
  }, [
    messageList,
    sessionId,
    toast,
    currentUser,
    requestId,
    url,
    scoreLimit,
    language,
    setQueryActive,
    models,
    defaultModel,
  ]);

  const newMessage = useCallback((e) => {
    e.preventDefault();
    console.log("NEW MSG", statement.current.value, queryActive);
    if (!queryActive) {
      //requestId.current = uuidv4();
      const newRequesId = setRequestId();
      statement.current.disabled = true;

      statement.current.dataset.status = "processing";
      uniqueId.current = generateUniqueId();

      const userChat = {
        value: statement.current.value,
        uniqueId: uniqueId.current,
        details: "",
      };
      const aiChat = {
        uniqueId: uniqueId.current,
        answer: "",
        streaming: true,
        requestId: newRequesId,
      };

      setState({
        isUpdated: false,
      });

      setQueryActive(true);
      //setHaveChunks(false);
      // change this to true and it is not trying to get an answer...
      processingStatement.current = false;

      //setMessageList([...messageList, [userChat, aiChat, uniqueId.current]]);
      setMessageList(prevMessageList => [
        ...prevMessageList,
        [userChat, aiChat, uniqueId.current]
      ]);

    }
  }, [queryActive, setQueryActive, setRequestId]);

  const getSideBarSpeakers = useCallback(() => {
    if (!showSidebarList) {
      return [];
    }
    const speakers = getSpeakerStorage(knowledgebase.current.name);
    return speakers;
  }, [getSpeakerStorage]);

  if (state.loading && !state.errors) {
    return <ChakraProvider><FullPageLoader /></ChakraProvider>
  }

  if (!state.loading && !state.errors && state.twinStatus === 1) {

    setTimeout(() => {
      showDisclaimerToast(false);
      setDisclaimerStatus(true);
    }, 400);

    return <ChakraProvider><PageNotAvailable twin={username} /></ChakraProvider>
  }
  if (!state.loading && !state.errors && state.twinStatus === 2) {

    setTimeout(() => {
      showDisclaimerToast(false);
      setDisclaimerStatus(true);
    }, 400);

    return <ChakraProvider><TempolarilyNotAvailable twin={username} /></ChakraProvider>
  }
  if (!state.loading && !state.errors && state.auth?.authRequired === true) {
    console.log("AUTH REQUIRED ", knowledgebase.current, state.auth);
    return <ChakraProvider><InvalidToken error={state.auth} /></ChakraProvider>
  }
  //console.log("STATE ", state);
  //console.log("MESSAGES ", messageList);
  return (
    <>


      <ChakraProvider theme={theme}>
        <Flex
          backgroundColor={"#e2e2e2"}
          width={"100vw"}
          height={"100vh"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <SidebarOpenButton
            sidebarShown={sidebarShown}
            openSidebar={() => {
              setSidebarShown(!sidebarShown);
            }}
          />

          <CustomSidebar
            showDisclaimerToast={showDisclaimerToast}
            sidebarShown={sidebarShown}
            debugOption={state.debug}
            sidebarSpeakers={getSideBarSpeakers()}
            uiTexts={knowledgebase.current.translations}
          />

          <CustomSlide check={!isMobile} sidebarShown={sidebarShown}>
            <ChatlogContainer sidebarShown={sidebarShown}>
              {/* <Flex flex={1}> */}
              {!state.errors && (
                <HStack gap={"0px"} width={"100%"} height={"100%"}>
                  <Grid
                    templateAreas={`"header"
                  "main"
                  "footer"`}
                    gridTemplateRows={"auto 1fr auto"}
                    gridTemplateColumns={"1fr"}
                    h={"100%"}
                    w={"100%"}
                    marginTop={"-20px"}
                    marginBottom={"-10px"}
                    gap="1"
                    color="blackAlpha.700"
                  >
                    <GridItem area={"header"}>
                      {/*   <Header isMobile={isMobile} onClose={onClose} isOpen={isOpen} onOpen={onOpen} /> */}
                      <Header
                        isMobile={isMobile}
                        onClose={onClose}
                        onOpen={onOpen}
                      />
                    </GridItem>
                    <GridItem
                      id="messages_container"
                      area={"main"}
                      className="content"
                    // ml={[0, 5]}
                    >
                      <div
                        id="messages"
                        className="messages"
                        style={{ overflowX: "visible" }}
                      >
                        <Box
                        // visibility={{ base: "hidden", md: "visible" }}
                        //  height={"130px"}
                        // style={{
                        //   visibility: { base: "hidden", md: "visible" },
                        //   height: { base: "0px", md: "230px" },
                        // }}
                        >
                          <Box height={"100px"} backgroundColor={"#e2e2e2"}></Box>
                          <Box
                            // width={"100vw"}
                            height={"30px"}
                            marginTop={"-30px"}
                            backgroundColor={"white"}
                            borderTopLeftRadius={"30px"}
                            borderTopRightRadius={"30px"}
                          />
                        </Box>
                        <Box padding={"20px"} paddingBottom={"0px"} className="markdownStyles">

                          {messageList.map((message, key) => {
                            console.log("UI MESSAGE ", message);
                            return (
                              <div key={"chats-" + key}>
                                <div
                                  className="messageContainer"
                                  key={"chat-" + key}
                                >
                                  <QuestionCard
                                    key={"question-" + key}
                                    isMobile={isMobile}
                                    message={message[0]}
                                    uiTexts={knowledgebase.current.translations}
                                  />
                                  {(message[1].requestId && message[1].requestId === requestId) ? <LastCard message={message[1]}
                                    key={"answer-" + key}
                                    knowledgeBase={knowledgebase.current}
                                    language={language}
                                    isMobile={isMobile} /> :
                                    <AnswerCard
                                      message={message[1]}
                                      key={"answer-" + key}
                                      knowledgeBase={knowledgebase.current}
                                      language={language}
                                      isMobile={isMobile}
                                    />}
                                </div>
                              </div>
                            );
                          })}

                          <div
                            style={{
                              height: "10px",
                              width: "100%",
                              marginBottom: "25px",
                            }}
                            ref={scrollSpan}
                            id={"scroll-marker"}
                          />
                        </Box>
                      </div>
                      {state.isUpdated && example.show && isFooterRendered && (
                        <>
                          <Welcome
                            data={knowledgebase.current}
                            exampleClick={e => {
                              const idx = e.currentTarget.dataset.exampleQuestionId;
                              //data-example-question-id
                              console.log("CLICK ", idx);
                              exampleQuestionClicked.current = true;
                              statement.current.value = example.exampleQuestions[idx];
                              const event = new KeyboardEvent("keydown", {
                                key: "Enter", // Specify the key value
                                code: "Enter", // Specify the code value
                                keyCode: 13, // Specify the keyCode for Enter
                                which: 13, // Deprecated, but included for compatibility with older browsers
                                bubbles: true, // Event should bubble up through the DOM
                                cancelable: true, // Event can be canceled
                              });

                              // Dispatch the event to the target element
                              statement.current.dispatchEvent(event);
                              e.preventDefault();
                            }}

                            exampleData={example}
                          />
                          <div
                            style={{ height: "10px", width: "100%" }}
                            ref={scrollSpan2}
                            id={"scroll-marker2"}
                          />
                        </>
                      )}
                    </GridItem>
                    <GridItem area={"footer"} padding={"20px"} paddingTop={"0px"}>
                      {knowledgebase.current["test-mode"] && (
                        <Center>
                          <Box p={5} w={"50%"}>
                            <Alert status="warning">
                              <AlertIcon />
                              This is now in test mode.
                            </Alert>
                          </Box>
                        </Center>
                      )}
                      <Footer
                        ref={statement}
                        newMessage={newMessage}
                        onMounted={() => {
                          setIsFooterRendered(true);
                        }}
                      />
                    </GridItem>
                  </Grid>
                </HStack>
              )}
              {state.errors && (
                <>

                  <ConditionalToast shouldShowToast={true} speaker={username} error={initError} />
                </>
              )}
              {/* </Flex> */}
            </ChatlogContainer>

            {knowledgebase.current.hideFooter !== true && (
              <CustomFooter
                sidebarShown={sidebarShown}
                textData={knowledgebase.current.footer}
                isMobile={isMobile}
              />
            )}

          </CustomSlide>
        </Flex>

      </ChakraProvider>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req, res, resolvedUrl } = context;
  //const path = req.url; // Get the full path from the request object
  //console.log("PATH ", path);
  const host = req.headers.host; // Get the host from the request headers
  // console.log("REQ HEADERS ", req.headers, typeof req.headers);
  // for debugging incoming requests.... 
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const method = req.method;
  const url = req.url;
  const headers = req.headers;

  console.log(`API request: IP - ${ip}, Method - ${method}, URL - ${url}, User-Agent - ${userAgent}`);
  ///console.log("HOST ", host, resolvedUrl);
  // Construct the full URL for the local API request
  const protocol = req.headers["x-forwarded-proto"] || "http"; // Use 'x-forwarded-proto' if available, otherwise default to 'http'
  const fullUrl = `${protocol}://${host}${resolvedUrl}`;
  const api = `${protocol}://${host}/api/v1`;

  const urlObj = new URL(fullUrl);
  // const url = new URL(body.currentUrl);
  const name = urlObj.pathname.substring(1);
  if (name.length < 3 || name.includes(".")) {
    console.log("BAD REQUEST:", JSON.stringify({ ...headers, url }));
    return {
      notFound: true,
    }
  }
  // const q = url.searchParams.get("q");
  // const target = url.searchParams.get("target");
  // console.log("NAME ", name,);


  //const fullUrl = `${protocol}://${host}/api/meta-tags?path=${encodeURIComponent(req.url)}`;
  console.log("FULLURL ", fullUrl);
  const debug = urlObj.searchParams.get("debug") ? urlObj.searchParams.get("debug") === 'true' : false;

  const requestResponse = await fetchWithTimeout(`${api}/navigate`, {
    method: "POST",
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },

    body: JSON.stringify({
      currentUrl: fullUrl,
      debug
    }),
  });

  if (!requestResponse.ok) {
    const error = await requestResponse.text();
    console.log("ERROR ", error);

    return {
      props: { error },
    };
  }
  const initData = await requestResponse.json();
  console.log("INIT DATA ", initData);



  if (initData.result?.query && initData.result.query.target === "JSON") {

    const payload = { stream: false, "knowledgebaseId": initData.result.knowledgebaseId, "userId": initData.result.userId, "statement": initData.result.query.q }

    const requestResponse = await fetch(
      `${process.env.MIDDLEWARE_API_URL}v2/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "APP-REQUEST",
          'x-api-key': process.env.CORE_API_KEY,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!requestResponse.ok) {
      const error = await requestResponse.text();
      console.log("ERROR ", error);

      return {
        props: { error },
      };
    }

    //console.log("JSON RESPONSE ", await requestResponse.json());
    const response = await requestResponse.json();
    //console.log("JSON RESPONSE ", response);
    res.setHeader('Content-Type', 'application/json');

    // Send the JSON response and end the request
    res.end(JSON.stringify({ ...response }));

    // Return empty props since the response has already been sent
    return { props: {} };
  }

  return {
    props: { ...initData.result, debug, headers, url, translations: {} },
  };
}

export default UserPage;
