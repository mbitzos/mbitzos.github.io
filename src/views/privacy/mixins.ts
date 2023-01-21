import { optIn, optOut } from "vue-gtag";
const STORAGE_KEY = "__michaelbitzos_ga_agree";
export default {
  methods: {
    enableGA(): void {
      console.log("You have opt'd into using cookies, thank you!");
      optIn();
      localStorage.setItem(STORAGE_KEY, "true");
    },
    disableGA(): void {
      console.log("You have opt'd out of using cookies.");
      optOut();
      localStorage.setItem(STORAGE_KEY, "false");
    },
    getAgreedState(): string | null {
      return localStorage.getItem(STORAGE_KEY);
    }
  }
};
