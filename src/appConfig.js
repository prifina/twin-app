import { defineStyle, defineStyleConfig, extendTheme } from "@chakra-ui/react";
import { Raleway } from "next/font/google";

import { avatarAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(avatarAnatomy.keys)

const superLg = defineStyle({
  width: 40,
  height: 40,
  fontSize: "6xl"
})

const sizes = {
  superLg: definePartsStyle({ container: superLg }),
}

const avatarTheme = defineMultiStyleConfig({ sizes })


export const themeColor = "#000000";
//export const themeColor = "#2C5282";

const nextFont = Raleway({
  weight: ["100", "300", "400", "500", "700", "800", "900"],
  subsets: ["latin"],
});

const customIconButton = defineStyle({
  background: `${themeColor}`,
  color: "white",

  // let's also provide dark mode alternatives
  _hover: {
    background: "blue.200",
  },
});

const buttonTheme = defineStyleConfig({
  variants: { customIconButton },
});

export const theme = extendTheme({
  // Set the fonts like this
  fonts: {
    body: nextFont.style.fontFamily,
    heading: nextFont.style.fontFamily,
  },
  components: { Button: buttonTheme, Avatar: avatarTheme },
});

export const showExamples = true;
export const showSidebarList = false;

export const headerOptions = {
  height: "105px",
  //backgroundColor: "rgba(255,255,255,1)",
  backgroundColor: themeColor,

};

export const EVALS = {
  contentLng: "en",
  defaultScoreLimit: 0.5,
  appStorage: "speakToAI",
  //initBottomContainerHeight: 174,
  defaultHeight: 50,
  minScoreValue: 0.2,
  maxScoreValue: 0.5,
  sideBarWidth: 200,
  autoCompletion: false,
};

export const footerText = {
  text: "Get your own digital AI twin.",
  link: "https://www.prifina.com/"
};

export const links = {
  support: "https://www.prifina.com/customer-support.html",
  twin: "https://www.prifina.com/ai-twin.html",
  privacyPolicy: "https://www.prifina.com/ai-twin-general-privacy-policy.html",
  termsOfUse: "https://www.prifina.com/ai-twin-general-user-terms.html"
};

export const uiTexts = {
  welcome: "Click the example question(s) below or enter your query in the text box.",
  showDisclaimer: "Show Disclaimer",
  defaultDisclaimer: "This is my personal AI twin. It interprets information I have provided. Please note that any intentional misuse is recorded.",
  disclaimerTitle: "Disclaimer",
  about: "About AI Twins",
  terms: "Terms of Use",
  policy: "Privacy Policy",
  input: "You"
};

//import { EVALS, themeColor } from "@/appConfig";
//import { headerOptions, } from "@/appConfig";

//import { EVALS, theme, links, showExamples } from "@/appConfig";

//import { footerText } from '@/appConfig';

//import { links } from "@/appConfig";