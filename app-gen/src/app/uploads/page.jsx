"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
  useRouter,
} from "next/navigation";

import Sidebar
from "@/components/layout/Sidebar";

import Topbar
from "@/components/layout/Topbar";

import {

  FileJson,

  Trash2,

  Clock3,

  Database,

} from "lucide-react";

export default function UploadsPage() {

  /*
    ROUTER
  */

  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  const projectId =
    searchParams.get(
      "projectId"
    );

  /*
    STATE
  */

  const [
    uploads,
    setUploads,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    restoring,
    setRestoring,
  ] = useState(null);

  const [
    deleting,
    setDeleting,
  ] = useState(null);

  /*
    LOAD UPLOADS
  */

  useEffect(() => {

    async function fetchUploads() {

      try {

        const response =
          await fetch(

            `/api/projects/${projectId}/uploads`
          );

        const data =
          await response.json();

        if (data.success) {

          setUploads(
            data.data || []
          );
        }

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    }

    if (projectId) {

      fetchUploads();
    }

  }, [projectId]);

  /*
    DELETE
  */

  async function deleteUpload(
    id
  ) {

    try {

      setDeleting(id);

      const response =
        await fetch(

          `/api/uploads/${id}`,

          {
            method: "DELETE",
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {

        alert(
          data.message ||
          "Failed to delete upload"
        );

        return;
      }

      setUploads(

        (currentUploads) =>
          currentUploads.filter(
          (upload) =>
            upload.id !== id
          )
      );

    } catch (error) {

      console.error(error);

      alert(
        "Failed to delete upload"
      );

    } finally {

      setDeleting(null);
    }
  }

  /*
    RESTORE RUNTIME
  */

  async function restoreRuntime(
    upload
  ) {

    try {

      setRestoring(
        upload.id
      );

      /*
        ANALYSIS
      */

      const analysis =
        upload.analysis ||
        upload.content?.analysis ||
        null;

      /*
        RESTORE PROJECT CONFIG
      */

      await fetch(

        `/api/projects/${projectId}/config`,

        {
          method: "POST",

          headers: {

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            config:
              upload.content,

            analysis,
          }),
        }
      );

      /*
        REDIRECT
      */

      router.push(

        `/runtime?projectId=${projectId}`
      );

    } catch (error) {

      console.error(error);

    } finally {

      setRestoring(null);
    }
  }

  return (

    <main
      className="
        flex
        min-h-screen
        bg-[#050505]
        text-white
      "
    >

      <Sidebar />

      <div className="flex-1">

        <Topbar />

        <div className="p-8">

          {/* HEADER */}

          <div className="mb-10">

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-xl
                bg-cyan-400/10
                border
                border-cyan-400/20
                text-cyan-300
                text-sm
                mb-5
              "
            >

              <Database size={16} />

              Project Upload Storage

            </div>

            <h1
              className="
                text-5xl
                font-bold
              "
            >
              Uploads Workspace
            </h1>

            <p
              className="
                text-zinc-500
                mt-4
                text-lg
                max-w-2xl
              "
            >
              Manage uploaded runtime
              configurations, generated
              schemas, analysis snapshots,
              and runtime versions.
            </p>

          </div>

          {/* LOADING */}

          {
            loading && (

              <div
                className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/5
                  p-10
                  text-center
                  text-zinc-500
                "
              >
                Loading uploads...
              </div>
            )
          }

          {/* EMPTY */}

          {
            !loading &&
            uploads.length === 0 && (

              <div
                className="
                  rounded-3xl
                  border
                  border-dashed
                  border-white/10
                  bg-white/5
                  p-16
                  text-center
                "
              >

                <div
                  className="
                    w-24
                    h-24
                    rounded-3xl
                    bg-cyan-400/10
                    border
                    border-cyan-400/20
                    flex
                    items-center
                    justify-center
                    text-cyan-400
                    mx-auto
                  "
                >

                  <FileJson
                    size={42}
                  />

                </div>

                <h2
                  className="
                    text-3xl
                    font-semibold
                    mt-8
                  "
                >
                  No Uploads Yet
                </h2>

                <p
                  className="
                    text-zinc-500
                    mt-4
                    max-w-xl
                    mx-auto
                  "
                >
                  Upload runtime JSON
                  configurations from the
                  Builder page to populate
                  this project workspace.
                </p>

              </div>
            )
          }

          {/* UPLOADS */}

          {
            !loading &&
            uploads.length > 0 && (

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  xl:grid-cols-3
                  gap-6
                "
              >

                {
                  uploads.map(
                    (upload) => (

                      <div
                        key={upload.id}

                        onClick={() => {

                          if (
                            restoring ===
                            upload.id ||
                            deleting ===
                            upload.id
                          ) {

                            return;
                          }

                          restoreRuntime(upload);
                        }}

                        onKeyDown={(event) => {

                          if (
                            event.key === "Enter" ||
                            event.key === " "
                          ) {

                            event.preventDefault();
                            restoreRuntime(upload);
                          }
                        }}

                        role="button"
                        tabIndex={0}
                        className={`
                          group
                          min-h-[120px]
                          rounded-3xl
                          border
                          border-white/10
                          bg-white/5
                          p-5
                          text-left
                          flex
                          items-center
                          justify-between
                          gap-4
                          hover:border-cyan-400/40
                          hover:bg-cyan-400/5
                          transition
                          ${
                            restoring === upload.id
                              ? "opacity-60"
                              : "cursor-pointer"
                          }
                        `}
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-4
                            min-w-0
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
                              shrink-0
                            "
                          >

                            <FileJson
                              size={24}
                            />

                          </div>

                          <div className="min-w-0">

                            <h2
                              className="
                                text-lg
                                font-semibold
                                truncate
                              "
                            >
                              {
                                upload.fileName
                              }
                            </h2>

                            <div
                              className="
                                mt-2
                                flex
                                items-center
                                gap-2
                                text-zinc-500
                                text-sm
                              "
                            >

                              <Clock3
                                size={15}
                              />

                              <span className="truncate">
                                {
                                  new Date(
                                    upload.createdAt
                                  ).toLocaleString()
                                }
                              </span>

                            </div>

                            <p
                              className="
                                mt-2
                                text-sm
                                text-cyan-300
                              "
                            >
                              {
                                restoring ===
                                upload.id
                                  ? "Opening dashboard..."
                                  : "Open dashboard"
                              }
                            </p>

                          </div>

                        </div>

                        <span
                          className="
                            text-zinc-500
                            group-hover:text-cyan-300
                            transition
                            text-xl
                            shrink-0
                          "
                        >
                          →
                        </span>

                        <button
                          type="button"

                          onClick={(event) => {

                            event.stopPropagation();

                            deleteUpload(
                              upload.id
                            );
                          }}

                          disabled={
                            deleting ===
                            upload.id
                          }

                          className="
                            w-10
                            h-10
                            rounded-2xl
                            border
                            border-red-500/20
                            text-red-400
                            flex
                            items-center
                            justify-center
                            hover:bg-red-500/10
                            transition
                            shrink-0
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                          "
                        >

                          <Trash2
                            size={17}
                          />

                        </button>

                      </div>
                    )
                  )
                }

              </div>
            )
          }

        </div>

      </div>

    </main>
  );
}
