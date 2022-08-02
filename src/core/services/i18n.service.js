const i18nService = {
  defaultLanguage: "se",

  languages: [
    {
      lang: "en",
      name: "English",
      flag: process.env.BASE_URL + "assets/flags/226-united-states.svg"
    },
    {
      lang: "se",
      name: "Swedish",
      flag: process.env.BASE_URL + "assets/flags/184-sweden.svg"
    }
  ],

  /**
   * Keep the active language in the localStorage
   * @param lang
   */
  setActiveLanguage(lang) {
    localStorage.setItem("language", lang);
  },

  /**
   * Get the current active language
   * @returns {string | string}
   */
  getActiveLanguage() {
    return localStorage.getItem("language") || this.defaultLanguage;
  }
};

export default i18nService;
