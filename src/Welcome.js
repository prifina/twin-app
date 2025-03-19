import { useState, forwardRef } from "react";
import {
  VStack,
  Text,
  Card,
  CardBody,
  Box,
  SimpleGrid, Avatar, AvatarBadge
} from "@chakra-ui/react";

//import { uiTexts } from "./appConfig";


const ExampleGrid = ({ exampleClick, exampleData }) => {
  // example: { "exampleQuestions": [], "show": false, typeOfExampleQuestions: 0, noOfExampleQuestions: 0 },

  return <SimpleGrid
    width={"100%"}
    gap={"15px"}
    columns={{
      base: 1,
      md: exampleData.exampleQuestions.length > 1 ? 2 : 1,
    }}
    paddingLeft={"6%"}
    marginRight={"-3%"}
  >
    {exampleData.exampleQuestions
      .map((exampleQuestion, i) => {

        return (
          <Card
            key={"example-question-" + i}
            data-example-question-id={i}
            borderColor={"#9E9E9E"}
            w="90%"
            borderWidth={"1px"}
            onClick={exampleClick}
            cursor={"pointer"}
          >
            <CardBody>
              <Text textAlign={"center"}>
                {exampleQuestion}
              </Text>
            </CardBody>
          </Card>
        );
      })}
  </SimpleGrid>

}

const Welcome = ({
  data,
  exampleQuestions,
  exampleText,
  asPartOfConvo = false,
  isMobile = true,
  exampleClick,
  exampleData,
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <>
      <Box className="welcomeContainer" key={"init-2"} pl={"10px"} {...props}>
        <Box pt={"10px"} pb={"32px"}>
          <VStack align={"center"}>
            <Box h="200px" position="relative" width="100%" overflow="hidden">
              <div
                style={{ height: "100%", width: "100%", position: "relative" }}
              >
                <Box position="relative" display="flex" justifyContent="center" alignItems="center">
                  <Box position="relative" width="auto">
                    <Avatar
                      src={data['avatar-url']}
                      size="superLg"
                    >
                      {data.addBadge &&
                        <AvatarBadge boxSize="1em" borderColor="white" bg="black" borderWidth={"3px"}>
                          <Text fontSize={"35px"} fontWeight={700}>AI</Text>
                        </AvatarBadge>
                      }
                    </Avatar>
                    {/* <Image
                      src={data['avatar-url']}
                      alt="header"
                      layout="fill"
                      objectFit="contain"
                      onLoadingComplete={() => setImageLoaded(true)}
                      style={{
                        visibility: imageLoaded ? "visible" : "hidden",
                        cursor: asPartOfConvo ? "default" : "pointer",
                      }}
                    /> */}
                  </Box>

                </Box>
              </div>
            </Box>

            {!asPartOfConvo && (
              <>
                <Text as="b">{data.title}</Text>
                <Text>{data.caption || ""}</Text>

                {(exampleData.exampleQuestions.length > 0) && (
                  <>

                    <Text mt={"15px"} textAlign={"center"}>
                      {data.translations.welcome}
                    </Text>
                    <ExampleGrid exampleClick={exampleClick} exampleData={exampleData} />

                  </>
                )}
              </>
            )}
          </VStack>
        </Box>
      </Box>
    </>
  );
};

export default Welcome;
