import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { auth, providerForFacebook } from "./Firebase.config";
import { signInWithPopup } from "firebase/auth";

const FacebookOauth = (props) => {
  const { type } = props;
  const navigate = useNavigate();

  useEffect(() => {
    if (props.isLoggedIn === true) navigate("/");
  }, [props.isLoggedIn]);

  //handle facebook Oauth
  const handleFacebookOauth = () => {
    signInWithPopup(auth, providerForFacebook).then((data) => {
      if (type === "login") {
        localStorage.setItem("userPhoto", data.user.photoURL);
        const email = data.user.email
          ? data.user.email
          : data.user.providerData[0]?.email;
        const password = data.user.uid;
        props
          .loginForOAuth({ email, password })
          .then(() => {
            navigate("/dashboard");
          })
          .catch(() => {
            navigate("/login");
          });
      } else {
        const name = data.user.providerData[0].displayName;
        const email = data.user.providerData[0].email
          ? data.user.providerData[0].email
          : data.user.email;
        const password = data.user.uid;
        const imageUrl = data.user.providerData[0].photoURL
          ? data.user.providerData[0].photoURL
          : data.user.photoURL;
        const provider = data.user.providerData[0].providerId;
        const uId = data.user.providerData[0].uid;
        props
          .createUserForOauth({
            name,
            email,
            password,
            imageUrl,
            provider,
            uId,
          })
          .then((res) => {
            navigate("/login");
          })
          .catch(() => {
            navigate("/signup");
          });
      }
    });
  };
  return (
    <>
      <Button
        onClick={handleFacebookOauth}
        style={{ background: "#fff", padding: "10px 30px" }}
        className="flex gap-20 items-center"
      >
        <i
          className="pi pi-facebook"
          style={{ color: "blue", fontSize: "20px" }}
        ></i>
        <div
          style={{
            color: "#000",
            fontSize: "1.2rem",
            marginLeft: "20px",
          }}
        >
          {type === "login" ? "Login with Facebook" : "Sign up with Facebook"}
        </div>
      </Button>
    </>
  );
};

const mapState = (state) => {
  const { isLoggedIn, passwordPolicyErrors } = state.auth;
  return { isLoggedIn, passwordPolicyErrors };
};
const mapDispatch = (dispatch) => ({
  createUserForOauth: (data) => dispatch.auth.createUserForOauth(data),
  loginForOAuth: (data) => dispatch.auth.loginForOAuth(data),
  alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(FacebookOauth);
