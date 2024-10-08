import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { Button, Typography } from "@material-tailwind/react";
import Login from "./Login";
import Register from "./Register";
import { useNavigate } from "react-router-dom";

const Layout = ({ sidebarContent, mainContent }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isLoginMode, setIsLoginMode] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log(currentUser);
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("User logged out");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  // Register function
  const handleRegister = async ({ email, password }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      navigate("/");
      console.log("User signed up:", userCredential.user);
    } catch (error) {
      alert("Error register: " + error.message.toString());
      console.error("Error signing up:", error.message);
    }
  };

  // Login function
  const handleLogin = async ({ email, password }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser(userCredential.user);
      navigate("/");
      console.log("User logged in:", userCredential.user);
    } catch (error) {
      alert("Error logging in: " + error.message.toString());
      console.error("Error logging in:", error.message);
    }
  };

  return (
    <>
      {!user ? (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
          {isLoginMode ? (
            <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
              <Login onLogin={handleLogin} />
              <p>
                Don't have an account?{" "}
                <span
                  onClick={() => setIsLoginMode(false)}
                  style={{ cursor: "pointer", color: "blue" }}
                >
                  Register here
                </span>
              </p>
            </div>
          ) : (
            <div className="w-full max-w-md p-8 bg-white shadow-md rounded-lg">
              <Register onRegister={handleRegister} />
              <p>
                Already have an account?{" "}
                <span
                  onClick={() => setIsLoginMode(true)}
                  style={{ cursor: "pointer", color: "blue" }}
                >
                  Login here
                </span>
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex min-h-screen">
          <div className="w-1/6 bg-gray-400 flex-shrink-0 h-auto flex justify-center items-center">
            {sidebarContent}
          </div>

          <div className="w-5/6 flex flex-col">
            <div className="flex justify-between items-center bg-gray-300 h-16 flex-shrink-0">
              <Typography variant="h5" className="ml-5">
                Welcome, {user.email}
              </Typography>
              <Button
                onClick={handleLogout}
                variant="text"
                className="flex items-center gap-2"
              >
                Logout{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </Button>
            </div>
            <div className="flex-grow m-4 rounded-lg">{mainContent}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Layout;
