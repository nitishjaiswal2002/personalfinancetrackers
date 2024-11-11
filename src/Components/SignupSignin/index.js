import React, { useState } from 'react';
import "./style.css";
import Input from '../Input/index';
import Button from '../Button/Index';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup} from "firebase/auth";
import 'react-toastify/dist/ReactToastify.css';
import { auth, setDoc, doc, db,provider } from '../../firebase';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getDoc } from 'firebase/firestore';

const SignupSignin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setloginForm] = useState(false);
  const navigate = useNavigate();

  const signupwithEmail = (event) => {
    event.preventDefault(); // Prevent form submission
    setLoading(true);
    console.log("name", name);
    console.log("email", email);
    console.log("password", password);
    console.log("confirmpassword", confirmpassword);

    if (name !== "" && email !== "" && password !== "" && confirmpassword !== "") {
      if (password === confirmpassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log("user>>>", user);
            toast.success("User created!");
            setLoading(false);
            setName("");
            setPassword("");
            setEmail("");
            setConfirmPassword(""); // Add this line
            createDoc(user);
            setTimeout(() => {
              navigate("/dashboard");
            }, 2000); // Delay navigation by 2 seconds
          })
          .catch((error) => {
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
          });
      } else {
        toast.error("Password or Confirm Password don't match!");
        setLoading(false);
      }
    } else {
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }

  function loginUsingEmail() {
    console.log("email", email);
    console.log("password", password);
    setLoading(true);
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          toast.success("User Logged In!");
          console.log("User Logged In", user);
          setLoading(false);
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000); // Delay navigation by 2 seconds
        })
        .catch((error) => {
          //const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage)
          setLoading(false);
        });
    } else {
      toast.error("All fields are mandatory");
      setLoading(false);
    }
  }

  async function createDoc(user) {
    if (!user) {
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      try {
        await setDoc(userRef, {
          name: user.displayName || name,
          email: user.email,
          photoURL: user.photoURL || "",
          createdAt: new Date(),
        });
        toast.success("Doc Created!");
      } catch (e) {
        toast.error(e.message);
      }
    } else {
      setLoading(false);
      //toast.error("Doc already exists");
    }
  }

  function googleAuth() {
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          console.log("user>>>", user)
          toast.success("User authenticated!");
          createDoc(user);
          setLoading(false);
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000); // Delay navigation by 2 seconds
        })
        .catch((error) => {
          // Handle Errors here.
          //const errorCode = error.code;
          setLoading(false)
          const errorMessage = error.message;
          toast.error(errorMessage);
        });
    } catch (e) {
      setLoading(false);
      toast.error(e.message);
    }
 }


  return (
    <>
      <ToastContainer />
      {loginForm ? (
        <div className='login-wrapper signup-wrapper'>
          <h2 className='title'>Login on <span style={{ color: "var(--theme)" }}>Financely.</span></h2>
          <form>
            <Input
              label={"Email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={"JohnDoe@gmail.com"}
            />
            <Input
              type="password"
              label={"Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={"Example@123"}
            />
            <Button disabled={loading} text={loading ? "Loading..." : "Login using Email and password"} onClick={loginUsingEmail} />
            <p className='p-login'>or</p>
            <Button onClick={googleAuth} text={loading ? "Loading..." : "Login using Google"} blue={true} />
            <p className='p-login' onClick={() => setloginForm(!loginForm)}>or Don't Have an Account Already? Click Here</p>
          </form>
        </div>
      ) : (
        <div className='signup-wrapper'>
          <h2 className='title'>Sign up on <span style={{ color: "var(--theme)" }}>Financely.</span></h2>
          <form>
            <Input
              label={"Full Name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={"John Doe"}
            />
            <Input
              label={"Email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={"JohnDoe@gmail.com"}
            />
            <Input
              type="password"
              label={"Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={"Example@123"}
            />
            <Input
              type="password"
              label={"Confirm Password"}
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={"Example@123"}
            />
            <Button disabled={loading} text={loading ? "Loading..." : "Signup using Email and password"} onClick={signupwithEmail} />
            <p className='p-login'>or</p>
            <Button onClick={googleAuth} text={loading ? "Loading..." : "Signup using Google"} blue={true} />
            <p className='p-login' onClick={() => setloginForm(!loginForm)}>or Don't Have an Account Already ? Click Here</p>
          </form>
        </div>
      )}
    </>
  );
}

export default SignupSignin;