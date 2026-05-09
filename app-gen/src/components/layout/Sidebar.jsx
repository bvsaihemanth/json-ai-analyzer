"use client";

import Link
from "next/link";

import {
  usePathname,
  useSearchParams,
} from "next/navigation";

import {
  useEffect,
  useState,
} from "react";

import {

  LayoutDashboard,

  Hammer,

  Activity,

  FolderOpen,

  Database,

  Sparkles,

  PanelLeftClose,

  PanelLeftOpen,

} from "lucide-react";

export default function Sidebar() {

  /*
    ROUTER
  */

  const pathname =
    usePathname();

  const searchParams =
    useSearchParams();

  /*
    COLLAPSE
  */

  const [
    collapsed,
    setCollapsed,
  ] = useState(false);

  const [
    projectName,
    setProjectName,
  ] = useState("");

  /*
    PROJECT ID
  */

  const projectId =
    searchParams.get(
      "projectId"
    );

  useEffect(() => {

    async function fetchProjectName() {

      try {

        if (!projectId) {

          setProjectName("");
          return;
        }

        const response =
          await fetch(
            `/api/projects/${projectId}/config`
          );

        const data =
          await response.json();

        setProjectName(
          data.success
            ? data.data?.name || ""
            : ""
        );

      } catch (error) {

        console.error(error);
        setProjectName("");
      }
    }

    fetchProjectName();

  }, [projectId]);

  /*
    ROUTES
  */

  const routes = [

    {
      label:
        "Projects",

      icon:
        LayoutDashboard,

      href:
        "/dashboard",
    },

    {
      label:
        "Builder",

      icon:
        Hammer,

      href:
        projectId

          ? `/builder?projectId=${projectId}`

          : "/builder",
    },

    {
      label:
        "Runtime",

      icon:
        Activity,

      href:
        projectId

          ? `/runtime?projectId=${projectId}`

          : "/runtime",
    },

    {
      label:
        "Uploads",

      icon:
        FolderOpen,

      href:
        projectId

          ? `/uploads?projectId=${projectId}`

          : "/uploads",
    },

  ];

  return (

    <aside
      className={`
        ${
          collapsed
            ? "w-[110px]"
            : "w-[300px]"
        }

        min-h-screen
        border-r
        border-white/10
        bg-[#050505]
        backdrop-blur-2xl
        flex
        flex-col
        justify-between
        transition-all
        duration-300
      `}
    >

      <div>

        {/* TOP */}

        <div
          className="
            p-6
            border-b
            border-white/10
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >

            {/* LOGO */}

            <div
              className={`
                flex
                items-center
                gap-4

                ${
                  collapsed
                    ? "justify-center w-full"
                    : ""
                }
              `}
            >

              <div
                className="
                  min-w-[58px]
                  h-[58px]
                  rounded-3xl
                  bg-cyan-400/10
                  border
                  border-cyan-400/20
                  flex
                  items-center
                  justify-center
                  text-cyan-400
                "
              >

                <Database
                  size={28}
                />

              </div>

              {
                !collapsed && (

                  <div>

                    <h1
                      className="
                        text-3xl
                        font-bold
                        tracking-tight
                      "
                    >
                      AppGen
                    </h1>

                    <p
                      className="
                        text-zinc-500
                        text-sm
                        mt-1
                      "
                    >
                      Runtime Platform
                    </p>

                  </div>
                )
              }

            </div>

            {/* TOGGLE */}

            {
              !collapsed && (

                <button

                  onClick={() =>
                    setCollapsed(
                      true
                    )
                  }

                  className="
                    w-11
                    h-11
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    flex
                    items-center
                    justify-center
                    hover:bg-white/10
                    transition
                  "
                >

                  <PanelLeftClose
                    size={20}
                  />

                </button>
              )
            }

          </div>

          {/* OPEN BUTTON */}

          {
            collapsed && (

              <button

                onClick={() =>
                  setCollapsed(
                    false
                  )
                }

                className="
                  mt-5
                  w-full
                  h-12
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  flex
                  items-center
                  justify-center
                  hover:bg-white/10
                  transition
                  text-zinc-300
                "
              >

                <PanelLeftOpen
                  size={20}
                />

              </button>
            )
          }

        </div>

        {/* ACTIVE PROJECT */}

        {
          projectId &&
          !collapsed && (

            <div
              className="
                mx-5
                mt-6
                rounded-3xl
                border
                border-cyan-400/20
                bg-gradient-to-br
                from-cyan-400/10
                to-transparent
                p-5
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >

                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-cyan-400/10
                    border
                    border-cyan-400/20
                    flex
                    items-center
                    justify-center
                    text-cyan-400
                  "
                >

                  <Sparkles
                    size={24}
                  />

                </div>

                <div>

                  <p
                    className="
                      text-zinc-500
                      text-xs
                      uppercase
                      tracking-widest
                    "
                  >
                    Active Project
                  </p>

                  <h2
                    className="
                      text-xl
                      font-semibold
                      mt-1
                      leading-tight
                      break-words
                    "
                  >
                    {
                      projectName ||
                      `Project #${projectId}`
                    }
                  </h2>

                </div>

              </div>

            </div>
          )
        }

        {/* NAVIGATION */}

        <nav
          className="
            mt-8
            px-4
            space-y-3
          "
        >

          {
            routes.map(
              (
                route,
                index
              ) => {

                const Icon =
                  route.icon;

                const active =

                  pathname ===
                  route.href.split("?")[0];

                return (

                  <Link
                    key={index}

                    href={
                      route.href
                    }

                    className={`
                      group
                      flex
                      items-center
                      ${
                        collapsed
                          ? "justify-center"
                          : "gap-4"
                      }
                      px-5
                      py-4
                      rounded-3xl
                      transition-all
                      duration-300
                      border

                      ${
                        active

                          ? `
                            bg-cyan-400/10
                            border-cyan-400/20
                            text-cyan-300
                          `

                          : `
                            border-transparent
                            text-zinc-400
                            hover:bg-white/5
                            hover:text-white
                          `
                      }
                    `}
                  >

                    <div
                      className={`
                        w-12
                        h-12
                        rounded-2xl
                        flex
                        items-center
                        justify-center
                        transition

                        ${
                          active

                            ? `
                              bg-cyan-400/10
                              text-cyan-300
                            `

                            : `
                              bg-white/5
                              text-zinc-400
                              group-hover:text-white
                            `
                        }
                      `}
                    >

                      <Icon
                        size={22}
                      />

                    </div>

                    {
                      !collapsed && (

                        <span
                          className="
                            text-[16px]
                            font-medium
                          "
                        >
                          {route.label}
                        </span>
                      )
                    }

                  </Link>
                );
              }
            )
          }

        </nav>

      </div>

      {/* FOOTER */}

      {
        !collapsed && (

          <div
            className="
              p-5
              border-t
              border-white/10
            "
          >

            <div
              className="
                rounded-3xl
                border
                border-white/10
                bg-white/5
                p-5
              "
            >

              <p
                className="
                  text-sm
                  text-zinc-500
                "
              >
                AI Runtime Infrastructure
              </p>

              <h3
                className="
                  text-xl
                  font-semibold
                  mt-2
                "
              >
                Dynamic App Generation
              </h3>

              <p
                className="
                  text-sm
                  text-zinc-500
                  mt-3
                  leading-relaxed
                "
              >
                Generate dashboards,
                runtime APIs,
                dynamic tables,
                analytics,
                and PostgreSQL-backed
                applications.
              </p>

            </div>

          </div>
        )
      }

    </aside>
  );
}
