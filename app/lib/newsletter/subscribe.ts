import { request } from "./request";

export function subscribe(email: string) {
  return request({ url: "/subscribers", method: "POST", body: { email } });
}
