// — for login/signup pages
import { redirect } from "react-router-dom";

export default function checkGuestOnly() {
  const token = localStorage.getItem("token");
  if (token) return redirect("/");  // already logged in
  return null;
}