// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      appName: "Skill_Rush",
      welcome: "Welcome to Skill_Rush",
      playGame: "Play Game",
      startLearning: "Start Learning",
      openFirstChapter: "Open first chapter",
      openPdf: "Open PDF",
      download: "Download",
      learn: "Learn",
      tutorial: "Tutorial",
      back: "Back",
      // game specific
      numberScramble: {
        title: "Number Scramble",
        help: "Click numbers in ascending order",
        startTutorial: "Show tutorial",
        learnTopic: "Learn about this topic",
      },
    },
  },
  od: {
    translation: {
      appName: "ସ୍କିଲ୍_ରଶ୍",
      welcome: "ସ୍କିଲ୍ ରଶ୍କୁ ସ୍ୱାଗତ",
      playGame: "ଖେଳ ଖେଳନ୍ତୁ",
      startLearning: "ଶିଖିବା ଆରମ୍ଭ",
      openFirstChapter: "ପ୍ରଥମ ଅଧ୍ୟାୟ ଖୋଲନ୍ତୁ",
      openPdf: "ପି.ଡ଼ି.ଏଫ୍ ଖୋଲନ୍ତୁ",
      download: "ଡାଉନଲୋଡ୍",
      learn: "ଶିଖନ୍ତୁ",
      tutorial: "ଟ୍ୟୁଟୋରିଆଲ୍",
      back: "ପଛକୁ",
      numberScramble: {
        title: "ସଂଖ୍ୟା ଗଠନ",
        help: "ଛୋଟରୁ ବଡ଼ ପର୍ଯ୍ୟନ୍ତ ସଂଖ୍ୟାଗୁଡ଼ିକୁ ଚୟନ କରନ୍ତୁ",
        startTutorial: "ଟ୍ୟୁଟୋରିଆଲ୍ ଦେଖନ୍ତୁ",
        learnTopic: "ବିଷୟ ବିଷୟରେ ଜାଣନ୍ତୁ",
      },
    },
  },
  ta: {
    translation: {
      appName: "Skill_Rush",
      welcome: "Skill_Rushக்கு வரவேற்கிறோம்",
      playGame: "விளையாடு",
      startLearning: "கற்றல் தொடங்கு",
      openFirstChapter: "முதல் பகுதியை திற",
      openPdf: "PDF திற",
      download: "பதிவிறக்க",
      learn: "கற்று",
      tutorial: "பயிற்சி",
      back: "மீண்டும்",
      numberScramble: {
        title: "எண்கள் அமைக்கும் விளையாட்டு",
        help: "சிறியதிலிருந்து பெரியவரை எண்களை சொடுக்குங்கள்",
        startTutorial: "பயிற்சி காண்பி",
        learnTopic: "இதைக் கற்றுக்கொள்",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("skill_rush_lang") || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
