import { useEffect, useState } from "react";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  browserSessionPersistence,
  setPersistence,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(true); // Track if the form is for sign-in or sign-up
  const [isRememberMe, setIsRememberMe] = useState(false); // Track if the form is for remember-me
  const [verificationSent, setVerificationSent] = useState(false); // Track if verification email has been sent
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      if (isRememberMe) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await setPersistence(auth, browserSessionPersistence)
          .then(async () => {
            await signInWithEmailAndPassword(auth, email, password);
          })
          .catch((err) => {
            console.log(err.code);
            if (err.code === "auth/invalid-credential") {
              alert("Invalid credentials");
            } else {
              alert("Failed to sign in! Please try again later.");
            }
          });
      }

      // Reload user data to check email verification status
      const user = auth.currentUser;
      if (user) {
        await user.reload(); // Ensure we have the latest user info
        if (user.emailVerified) {
          navigate("/dashboard");
        } else {
          alert("Please verify your email address before signing in.");
        }
      }

      console.log(userName);
      await updateProfile(auth.currentUser, {
        displayName: userName,
      })
        .then(() => {
          // Profile updated!
          // ...
          console.log("display name added");
        })
        .catch((error) => {
          // An error occurred
          // ...
        });
    } catch (error) {
      console.log(error.code);
      if (error.code === "auth/invalid-credential") {
        alert("Invalid credentials");
      } else {
        alert("Failed to sign in! Please try again later.");
      }
      console.error("Error:", error);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await handleEmailVerification();
    } catch (error) {
      console.log(error.code);
      if (error.code === "auth/email-already-in-use") {
        alert("Failed to sign up! Email already used");
      } else {
        alert("Failed to sign up! Please try again later.");
      }
      console.error("Error:", error);
    }
  };

  const handleEmailVerification = async () => {
    await sendEmailVerification(auth.currentUser).then(() => {
      // Email verification sent!
      // ...
      setVerificationSent(true);
      alert(
        "Sign-up successful. Please check your email to verify your account."
      );
    });
  };

  const handleGoogleSignIn = async () => {
    const provider = await new GoogleAuthProvider();

    await signInWithPopup(auth, provider);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(function (user) {
      if (user && user.emailVerified) {
        setIsLoggedIn(true);  
        navigate("/dashboard");
      } else {

        setIsLoggedIn(false);  // User logged out, so set isLoggedIn to false
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  if (isLoggedIn === null) {
    return ""
  }

  return (
    !isLoggedIn && (
      <section>
        <div className="flex flex-col items-center justify-center px-6 py-8 my-12 mx-auto sm:h-fit lg:py-0">
          <h1 className="mb-10">Welcome Back</h1>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-lg xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                {isSignIn ? "Sign In" : "Sign Up"}
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={isSignIn ? handleSignIn : handleSignUp}
                autoComplete="off"
              >
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="username123"
                    required
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@gmail.com"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {isSignIn && (
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="remember"
                            aria-describedby="remember"
                            type="checkbox"
                            onChange={(e) => setIsRememberMe(e.target.checked)}
                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="remember"
                            className="text-gray-500 dark:text-gray-300"
                          >
                            Remember me
                          </label>
                        </div>
                      </div>
                      <div
                        onClick={() => {
                          navigate("/forgot");
                        }}
                        className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500 cursor-pointer"
                      >
                        Forgot password?
                      </div>
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full text-md text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  {isSignIn ? "Sign In" : "Sign Up"}
                </button>
                <div
                  onClick={handleGoogleSignIn}
                  className="w-full flex justify-center cursor-pointer items-center gap-3 border p-2 rounded-lg hover:bg-gray-600 "
                >
                  <FcGoogle size={30} />
                  {isSignIn ? "Sign In With Google" : "Sign Up With Google"}
                </div>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  {!isSignIn
                    ? "Have an account? "
                    : "Don't have an account yet? "}
                  <a
                    onClick={() => setIsSignIn(!isSignIn)}
                    className="cursor-pointer font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    {!isSignIn ? "Sign In" : "Sign Up"}
                  </a>
                </p>
                {verificationSent && (
                  <p className="text-sm text-primary-600 dark:text-primary-500 mb-2">
                    Please check your email to verify your account. If you
                    didn't receive the email, please <br />
                    <a
                      onClick={handleSignUp}
                      className="text-primary-600 dark:text-primary-500 underline cursor-pointer text-primary-600"
                    >
                      request a new verification email
                    </a>
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    )
  );
}

export default SignIn;
