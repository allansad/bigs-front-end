import { makeAutoObservable } from "mobx";

class UserStore {
  emailPrefix: string = "";

  constructor() {
    makeAutoObservable(this);
  }

  setEmailPrefix(email: string) {
    const prefix = email.split("@")[0];
    this.emailPrefix = prefix;
  }
}

export const userStore = new UserStore();
