import { signIn } from "next-auth/react";
import Button from "../atoms/Button";

function GoogleButon() {
  return (
    <Button onClick={() => signIn("google")}>
      <img
        className="w-6 h-6 mr-2"
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        loading="lazy"
        alt="google logo"
      />
      <span>Login with Google</span>
    </Button>
  );
}

export default GoogleButon;
