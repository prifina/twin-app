import { create } from 'zustand';

import { v4 as uuidv4 } from 'uuid';

import { EVALS, } from "@/appConfig";

import { generateUniqueId } from "@/utils";
function checkStorage() {
  let session = generateUniqueId();
  if (typeof window !== 'undefined') {
    const speakToStorage = sessionStorage.getItem(EVALS.appStorage);
    // console.log(speakToStorage);

    let speakTo = {};
    if (speakToStorage !== null) {
      speakTo = JSON.parse(speakToStorage);
    }

    if (speakTo?.session === undefined) {
      speakTo["session"] = session;
      sessionStorage.setItem(EVALS.appStorage, JSON.stringify(speakTo));
    }
    session = speakTo.session;


  }
  return session;
}

function getUrl() {
  let url = "http://localhost:3333/api/v1/";
  if (typeof window !== "undefined") {
    url = window.location.origin + "/api/v1";
  }
  return url;
}
function checkLng() {

  let userlang = "en";
  if (typeof window !== "undefined") {

    userlang = navigator.language || navigator.userLanguage;
    if (userlang.startsWith("en-")) {
      userlang = userlang.toLowerCase().substring(0, 2);
    }
  }
  return userlang;
}

function updateSpeakerStorage(speaker) {
  if (typeof window !== 'undefined') {
    const speakToStorage = localStorage.getItem(EVALS.appStorage);
    let speakTo = {};
    if (speakToStorage !== null) {
      speakTo = JSON.parse(speakToStorage);
    }
    if (speakTo?.speakers === undefined) {
      speakTo["speakers"] = {};
    }
    const data = {
      active: speaker.active,
      "avatar-url": speaker["avatar-url"],
      mimeType: speaker.mimeType,
      createdAt: speaker["created_at"],
      modifiedAt: speaker["modified_at"],
      name: speaker.name,
      title: speaker.title || "",
      caption: speaker.caption || "",
      knowledgebase: speaker.knowledgebaseId
    }
    speakTo["speakers"][speaker.userId] = data;
    localStorage.setItem(EVALS.appStorage, JSON.stringify(speakTo));
  }
}



function getSpeakerStorage(userId) {

  let speakers = [];

  if (typeof window !== 'undefined') {
    const speakToStorage = localStorage.getItem(EVALS.appStorage);
    let speakTo = {};
    if (speakToStorage !== null) {
      speakTo = JSON.parse(speakToStorage);
    }
    if (speakTo?.speakers !== undefined) {
      Object.keys(speakTo.speakers).forEach(speaker => {
        speakers.push({ ...speakTo.speakers[speaker], userId: speaker, selected: (speaker === userId) })
      })
    }

  }
  return speakers;
}

const useStore = create((set, get) => ({
  url: getUrl(),
  currentUser: "",
  requestId: "",
  disclaimerStatus: false,
  getDisclaimerStatus: () => {
    return get().disclaimerStatus
  },
  setDisclaimerStatus: (value) => set(() => ({ disclaimerStatus: value })),
  /*  setDisclaimerStatus: () => {
     return get().disclaimerStatus
   }, */
  getRequestId: () => {
    return get().requestId
  },
  sessionId: checkStorage(),
  language: checkLng(),
  scoreLimit: EVALS.defaultScoreLimit,
  example: { "exampleQuestions": [], "show": false, typeOfExampleQuestions: 0, noOfExampleQuestions: 0 },
  isFooterRendered: false,
  queryActive: false,
  haveChunks: false,
  summary: "",
  lastGoodAnswer: {},
  currentTopic: 'topic-0',
  models: { 'gpt-3.5-turbo': 15000, 'gpt-3.5-turbo-1106': 15000, 'gpt-4o-mini': 100000 },
  defaultModel: "gpt-4o-mini",

  setCurrentTopic: (value) => set(() => ({ currentTopic: value })),
  setSummary: (value) => set(() => ({ summary: value })),
  setLastGoodAnswer: (value) => set(() => ({ lastGoodAnswer: value })),
  setSummary: (value) => set(() => ({ summary: value })),
  setHaveChunks: (value) => set(() => ({ haveChunks: value })),
  setQueryActive: (value) => set(() => ({ queryActive: value })),
  setIsFooterRendered: (value) => set(() => ({ isFooterRendered: value })),
  setExample: (value) => set(() => ({ example: value })),
  setSessionId: (value) => set(() => ({ sessionId: value })),

  setCurrentUser: (value) => set(() => ({ currentUser: value })),
  setRequestId: (value) => {
    const newValue = value || uuidv4();
    set(() => ({ requestId: newValue }));
    return newValue;
  },
  getSpeakerStorage: (userId) => {
    return getSpeakerStorage(userId);
  },
  updateSpeakerStorage: (value) => {
    updateSpeakerStorage(value);
  }
}));

export default useStore;