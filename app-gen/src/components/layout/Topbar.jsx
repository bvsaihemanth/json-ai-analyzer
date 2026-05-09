"use client";

import {
  useState,
} from "react";

import {
  signOut,
  useSession,
} from "next-auth/react";

import {
  LogOut,
} from "lucide-react";

export default function Topbar() {

  const {
    data: session,
  } = useSession();

  const [
    showLogout,
    setShowLogout,
  ] = useState(false);

  const userName =
    session?.user?.name ||
    session?.user?.email?.split("@")[0] ||
    "User";

  const userEmail =
    session?.user?.email ||
    "";

  const userInitial =
    userName.charAt(0).toUpperCase();

  async function handleLogout() {

    await signOut({
      redirect: false,
      callbackUrl: "/login",
    });

    setShowLogout(false);
    window.location.replace("/login");
  }


  return (

    <>

      {/* TOPBAR */}

      <header
        className="
          w-full
          h-20
          border-b
          border-white/10
          bg-[#050505]
          px-8
          flex
          items-center
          justify-between
        "
      >

        {/* LEFT */}

        <div>

          <h1
            className="
              text-2xl
              font-bold
              text-white
            "
          >
            AI Runtime Dashboard
          </h1>

          <p
            className="
              text-sm
              text-zinc-500
              mt-1
            "
          >
            Intelligent JSON analytics
            visualization platform
          </p>

        </div>

        {/* RIGHT */}

        <div
          className="
            flex
            items-center
            gap-4
          "
        >

{/* PROFILE */}

<div
  className="
    flex
    items-center
    gap-4
    pl-6
    border-l
    border-white/10
  "
>

  {/* USER INFO */}

  <div
    className="
      hidden
      md:block
      text-right
    "
  >

    <h3
      className="
        text-white
        font-semibold
        text-sm
      "
    >
      {userName}
    </h3>

    <p
      className="
        text-zinc-500
        text-xs
        mt-1
      "
    >
      {userEmail}
    </p>

  </div>

  {/* AVATAR */}

  <div
    className="
      w-14
      h-14
      rounded-2xl
      bg-cyan-400
      flex
      items-center
      justify-center
      text-black
      font-bold
      text-lg
      shadow-lg
      shadow-cyan-400/20
    "
  >

    {userInitial}

  </div>

  <button
    onClick={() =>
      setShowLogout(true)
    }
    className="
      h-12
      px-4
      rounded-2xl
      border
      border-red-500/20
      bg-red-500/10
      text-red-300
      flex
      items-center
      gap-2
      hover:bg-red-500/20
      transition-all
    "
  >
    <LogOut size={18} />
    Logout
  </button>

</div>

        </div>

      </header>

      {
        showLogout && (

          <div
            className="
              fixed
              inset-0
              z-[60]
              bg-black/70
              backdrop-blur-sm
              flex
              items-center
              justify-center
              px-4
            "
          >

            <div
              className="
                w-full
                max-w-md
                rounded-3xl
                border
                border-white/10
                bg-[#090909]
                p-7
                shadow-2xl
              "
            >

              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-red-500/10
                  border
                  border-red-500/20
                  text-red-300
                  flex
                  items-center
                  justify-center
                "
              >
                <LogOut size={24} />
              </div>

              <h2
                className="
                  text-2xl
                  font-bold
                  mt-6
                "
              >
                Log out?
              </h2>

              <p
                className="
                  text-zinc-500
                  mt-3
                  leading-relaxed
                "
              >
                You will leave this runtime workspace and return to the login page.
              </p>

              <div
                className="
                  mt-7
                  flex
                  justify-end
                  gap-3
                "
              >

                <button
                  onClick={() =>
                    setShowLogout(false)
                  }
                  className="
                    h-12
                    px-5
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    text-white
                    hover:bg-white/10
                    transition
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={handleLogout}
                  className="
                    h-12
                    px-5
                    rounded-2xl
                    bg-red-500
                    text-white
                    font-semibold
                    hover:bg-red-400
                    transition
                  "
                >
                  Logout
                </button>

              </div>

            </div>

          </div>
        )
      }

    </>
  );
}
