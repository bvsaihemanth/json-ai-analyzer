"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  signIn,
} from "next-auth/react";


import {
  ArrowRight,
  Database,
  Cpu,
  Sparkles,
  Layers3,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AuthPage() {

  useEffect(() => {

    function handlePageShow(event) {

      const navigationEntry =
        performance
          .getEntriesByType("navigation")[0];

      const restoredFromHistory =
        event.persisted ||
        navigationEntry?.type === "back_forward";

      if (restoredFromHistory) {

        window.location.reload();
      }
    }

    window.addEventListener(
      "pageshow",
      handlePageShow
    );

    return () =>
      window.removeEventListener(
        "pageshow",
        handlePageShow
      );
  }, []);

  const [isSignup, setIsSignup] =
    useState(false);

  const [authError, setAuthError] =
    useState("");

  const [authMessage, setAuthMessage] =
    useState("");

  const [signupError, setSignupError] =
    useState("");

  const [errors, setErrors] =
    useState({});

  const [showLoginPassword,
    setShowLoginPassword] =
    useState(false);

  const [showSignupPassword,
    setShowSignupPassword] =
    useState(false);

  const [signupForm,
    setSignupForm] =
    useState({
      name: "",
      email: "",
      password: "",
    });

  const [loginForm,
    setLoginForm] =
    useState({
      email: "",
      password: "",
    });

  /*
    EMAIL VALIDATION
  */

  function validateEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(email);
  }

  /*
    PASSWORD VALIDATION
  */

  function validatePassword(password) {

    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
      .test(password);
  }

  /*
    SIGNUP VALIDATION
  */

  function validateSignup() {

    let newErrors = {};

    if (!signupForm.name.trim()) {

      newErrors.name =
        "Name required";

    } else if (
      signupForm.name.length < 3
    ) {

      newErrors.name =
        "Minimum 3 characters";
    }

    if (!signupForm.email) {

      newErrors.email =
        "Email required";

    } else if (
      !validateEmail(
        signupForm.email
      )
    ) {

      newErrors.email =
        "Invalid email";
    }

    if (!signupForm.password) {

      newErrors.password =
        "Password required";

    } else if (
      !validatePassword(
        signupForm.password
      )
    ) {

      newErrors.password =
        "8+ chars with uppercase, lowercase & number";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  }

  /*
    LOGIN VALIDATION
  */

  function validateLogin() {

    let newErrors = {};

    if (!loginForm.email) {

      newErrors.loginEmail =
        "Email required";

    } else if (
      !validateEmail(
        loginForm.email
      )
    ) {

      newErrors.loginEmail =
        "Invalid email";
    }

    if (!loginForm.password) {

      newErrors.loginPassword =
        "Password required";

    } else if (
      loginForm.password.length < 8
    ) {

      newErrors.loginPassword =
        "Minimum 8 characters";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  }

  /*
    LOGIN
  */
const handleLogin =
  async (e) => {

    e.preventDefault();

    setAuthError("");
    setAuthMessage("");
    setSignupError("");

    if (!validateLogin()) {
      return;
    }

    try {

      const result =
        await signIn(
          "credentials",
          {

            redirect: false,

            email:
              loginForm.email,

            password:
              loginForm.password,

            callbackUrl:
              "/builder",
          }
        );

      console.log(result);

      if (result?.error) {

        setAuthError(
          "Wrong email or password"
        );

        return;
      }

      window.location.href =
        "/builder";

    } catch (error) {

      console.error(error);

      setAuthError(
        "Login failed"
      );
    }
  };

  /*
    SIGNUP
  */

  async function handleSignup() {

    setAuthError("");
    setAuthMessage("");
    setSignupError("");

    if (!validateSignup()) {
      return;
    }

    const response =
      await fetch(
        "/api/auth/signup",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            signupForm
          ),
        }
      );

    const data =
      await response.json();

    if (!data.success) {

      setSignupError(
        data.message ||
        "Signup failed"
      );

      return;
    }

    setLoginForm({
      email:
        signupForm.email,
      password: "",
    });

    setSignupForm({
      name: "",
      email: "",
      password: "",
    });

    setErrors({});

    setAuthMessage(
      "Account created. Please sign in with your credentials."
    );

    setIsSignup(false);
  }

  /*
    INPUT STYLE
  */

  const inputStyle = `
    peer
    w-full
    rounded-2xl
    bg-white/5
    border
    border-white/10
    px-5
    pt-5
    pb-4
    pr-14
    outline-none
    text-white
    transition-all
    duration-300

    focus:border-cyan-400
    focus:ring-4
    focus:ring-cyan-400/10

    hover:border-cyan-400/50
  `;

  /*
    LABEL STYLE
  */

  const labelStyle = `
    absolute
    left-4
    top-1/2
    -translate-y-1/2
    px-2
    rounded-md
    bg-[#050505]
    transition-all
    duration-200
    pointer-events-none
    text-zinc-500
    text-base
    peer-focus:top-0
    peer-focus:text-xs
    peer-focus:text-cyan-400
    peer-not-placeholder-shown:top-0
    peer-not-placeholder-shown:text-xs
    peer-not-placeholder-shown:text-cyan-400
  `;

  return (
    <main
      className="
        min-h-screen
        bg-black
        overflow-hidden
        flex
        items-center
        justify-center
        px-4
        relative
      "
    >

      {/* BACKGROUND */}
      <div
        className="
          absolute
          top-[-250px]
          left-[-250px]
          w-[700px]
          h-[700px]
          bg-cyan-500/20
          blur-[180px]
          rounded-full
        "
      />

      <div
        className="
          absolute
          bottom-[-300px]
          right-[-300px]
          w-[700px]
          h-[700px]
          bg-white/10
          blur-[180px]
          rounded-full
        "
      />

      {/* CONTAINER */}
      <div
        className="
          relative
          w-full
          max-w-6xl
          h-[680px]
          overflow-hidden
          rounded-[40px]
          border
          border-white/10
          bg-white/5
          backdrop-blur-3xl
        "
      >

        <div className="grid grid-cols-2 h-full relative z-10">

          {/* LOGIN */}
          <div className="flex items-center justify-center px-10">

            <div
              className={`
                w-full
                max-w-md
                transition-all
                duration-500

                ${
                  isSignup
                    ? "opacity-20 scale-95 pointer-events-none"
                    : "opacity-100 scale-100 pointer-events-auto"
                }
              `}
            >

              <h2 className="text-5xl font-bold text-white">
                Sign In
              </h2>

              <p className="mt-4 text-zinc-400">
                Access your AI runtime workspace.
              </p>

              {/* ICONS */}
              <div className="flex gap-4 mt-10">

                {[Cpu, Database, Layers3, Sparkles]
                  .map((Icon, index) => (

                    <div
                      key={index}

                      className="
                        w-14
                        h-14
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/5
                        flex
                        items-center
                        justify-center
                        text-white
                        hover:scale-110
                        hover:border-cyan-400/50
                        transition-all
                      "
                    >
                      <Icon size={24} />
                    </div>
                  ))}
              </div>

              {/* FORM */}
              <div className="mt-10 space-y-5">

                {/* EMAIL */}
                <div className="relative">

                  <input
                    type="email"
                    placeholder=" "

                    value={loginForm.email}

                    className={`
                      ${inputStyle}

                      ${
                        errors.loginEmail
                        ? "border-red-500"
                        : ""
                      }
                    `}

                    onChange={(e) =>
                      setLoginForm({
                        ...loginForm,
                        email:
                          e.target.value,
                      })
                    }
                  />

                  <label
                    className={labelStyle}
                  >
                    Email
                  </label>

                  {
                    errors.loginEmail && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.loginEmail}
                      </p>
                    )
                  }

                </div>

                {/* PASSWORD */}
                <div className="relative">

                  <input
                    type={
                      showLoginPassword
                        ? "text"
                        : "password"
                    }

                    placeholder=" "

                    value={loginForm.password}

                    className={`
                      ${inputStyle}

                      ${
                        errors.loginPassword
                        ? "border-red-500"
                        : ""
                      }
                    `}

                    onChange={(e) =>
                      setLoginForm({
                        ...loginForm,
                        password:
                          e.target.value,
                      })
                    }
                  />

                  <label
                    className={labelStyle}
                  >
                    Password
                  </label>

                  {/* EYE */}
                  <button
                    type="button"

                    onClick={() =>
                      setShowLoginPassword(
                        !showLoginPassword
                      )
                    }

                    className="
                      absolute
                      right-5
                      top-1/2
                      -translate-y-1/2
                      text-zinc-400
                      hover:text-cyan-400
                      transition
                    "
                  >
                    {
                      showLoginPassword

                      ? <EyeOff size={20} />

                      : <Eye size={20} />
                    }
                  </button>

                  {
                    errors.loginPassword && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.loginPassword}
                      </p>
                    )
                  }

                </div>

                {/* AUTH ERROR */}
                {
                  authMessage && (
                    <div
                      className="
                        rounded-xl
                        border
                        border-green-500/20
                        bg-green-500/10
                        px-4
                        py-3
                        text-sm
                        text-green-300
                      "
                    >
                      {authMessage}
                    </div>
                  )
                }

                {
                  authError && (
                    <div
                      className="
                        rounded-xl
                        border
                        border-red-500/20
                        bg-red-500/10
                        px-4
                        py-3
                        text-sm
                        text-red-300
                      "
                    >
                      {authError}
                    </div>
                  )
                }

                <button
                  type="button"

                  onClick={
                    handleLogin
                  }

                  className="
                    w-full
                    rounded-2xl
                    bg-white
                    text-black
                    py-5
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-2
                    hover:scale-[1.02]
                    transition-all
                  "
                >

                  SIGN IN

                  <ArrowRight size={18} />

                </button>

              </div>

            </div>

          </div>

          {/* SIGNUP */}
          <div className="flex items-center justify-center px-10">

            <div
              className={`
                w-full
                max-w-md
                transition-all
                duration-500

                ${
                  isSignup
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-20 scale-95 pointer-events-none"
                }
              `}
            >

              <h2 className="text-5xl font-bold text-white">
                Create Account
              </h2>

              <p className="mt-4 text-zinc-400">
                Build dynamic AI runtime applications.
              </p>

              <div className="mt-10 space-y-5">

                {/* NAME */}
                <div className="relative">

                  <input
                    type="text"
                    placeholder=" "

                    value={signupForm.name}

                    className={`
                      ${inputStyle}

                      ${
                        errors.name
                        ? "border-red-500"
                        : ""
                      }
                    `}

                    onChange={(e) =>
                      setSignupForm({
                        ...signupForm,
                        name:
                          e.target.value,
                      })
                    }
                  />

                  <label
                    className={labelStyle}
                  >
                    Full Name
                  </label>

                  {
                    errors.name && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.name}
                      </p>
                    )
                  }

                </div>

                {/* EMAIL */}
                <div className="relative">

                  <input
                    type="email"
                    placeholder=" "

                    value={signupForm.email}

                    className={`
                      ${inputStyle}

                      ${
                        errors.email
                        ? "border-red-500"
                        : ""
                      }
                    `}

                    onChange={(e) =>
                      setSignupForm({
                        ...signupForm,
                        email:
                          e.target.value,
                      })
                    }
                  />

                  <label
                    className={labelStyle}
                  >
                    Email
                  </label>

                  {
                    errors.email && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.email}
                      </p>
                    )
                  }

                </div>

                {/* PASSWORD */}
                <div className="relative">

                  <input
                    type={
                      showSignupPassword
                        ? "text"
                        : "password"
                    }

                    placeholder=" "

                    value={signupForm.password}

                    className={`
                      ${inputStyle}

                      ${
                        errors.password
                        ? "border-red-500"
                        : ""
                      }
                    `}

                    onChange={(e) =>
                      setSignupForm({
                        ...signupForm,
                        password:
                          e.target.value,
                      })
                    }
                  />

                  <label
                    className={labelStyle}
                  >
                    Password
                  </label>

                  {/* EYE */}
                  <button
                    type="button"

                    onClick={() =>
                      setShowSignupPassword(
                        !showSignupPassword
                      )
                    }

                    className="
                      absolute
                      right-5
                      top-1/2
                      -translate-y-1/2
                      text-zinc-400
                      hover:text-cyan-400
                      transition
                    "
                  >
                    {
                      showSignupPassword

                      ? <EyeOff size={20} />

                      : <Eye size={20} />
                    }
                  </button>

                  {
                    errors.password && (
                      <p className="mt-2 text-sm text-red-400">
                        {errors.password}
                      </p>
                    )
                  }

                </div>

                {
                  signupError && (
                    <div
                      className="
                        rounded-xl
                        border
                        border-red-500/20
                        bg-red-500/10
                        px-4
                        py-3
                        text-sm
                        text-red-300
                      "
                    >
                      {signupError}
                    </div>
                  )
                }

                <button
                  type="button"

                  onClick={
                    handleSignup
                  }

                  className="
                    w-full
                    rounded-2xl
                    bg-cyan-400
                    text-black
                    py-5
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-2
                    hover:scale-[1.02]
                    transition-all
                  "
                >

                  CREATE ACCOUNT

                  <ArrowRight size={18} />

                </button>

              </div>

            </div>

          </div>

        </div>

        {/* SLIDER */}
        <div
          className={`
            absolute
            top-0
            h-full
            w-1/2
            z-20
            transition-all
            duration-500
            ease-in-out
            bg-gradient-to-br
            from-cyan-400
            to-cyan-600
            flex
            items-center
            justify-center
            px-10

            ${
              isSignup
                ? "left-0"
                : "left-1/2"
            }
          `}
        >

          <div className="text-center">

            <h1
              className="
                text-6xl
                font-bold
                text-white
              "
            >
              {
                isSignup
                ? "Welcome Back"
                : "Build Faster"
              }
            </h1>

            <p
              className="
                mt-6
                text-lg
                text-white/80
                leading-relaxed
                max-w-md
              "
            >
              {
                isSignup

                ? "Continue generating AI-powered runtime applications."

                : "Create full-stack applications instantly with AI runtime architecture."
              }
            </p>

            <button
              type="button"

              onClick={() =>
                {
                  setAuthError("");
                  setAuthMessage("");
                  setSignupError("");
                  setErrors({});
                  setIsSignup(
                    !isSignup
                  );
                }
              }

              className="
                mt-10
                px-10
                py-4
                rounded-full
                border
                border-white/40
                text-white
                font-semibold
                hover:bg-white
                hover:text-black
                transition-all
                duration-300
              "
            >
              {
                isSignup
                ? "SIGN IN"
                : "CREATE ACCOUNT"
              }
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}
