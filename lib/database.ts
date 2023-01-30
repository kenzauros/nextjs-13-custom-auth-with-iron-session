import { User } from "./session";

export async function tryLogin(params: {
  username: string;
  password: string;
}): Promise<User | null> {
  if (params.username === "hoge" && params.password === "hogehoge") {
    // logged in
    return {
      username: params.username,
    };
  } else {
    // failed to log in
    return null;
  }
}
