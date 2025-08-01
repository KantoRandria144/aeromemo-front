import { jwtDecode } from "jwt-decode";
import { IDecodedToken } from "../../types/user";

export const decodeToken = (source: string) => {
  var token;
  if (source === "pr") {
    token = localStorage.getItem("_au_pr");
  } else if (source === "ad") {
    token = token = localStorage.getItem("_au_ad");
  }
  if (token) {
    try {
      const decoded = jwtDecode<IDecodedToken>(token);
      return decoded;
    } catch (error) {
      console.error(`Invalid token ${error}`);
    }
  }
};
