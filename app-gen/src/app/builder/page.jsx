"use client";

import {
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import Sidebar
from "@/components/layout/Sidebar";

import Topbar
from "@/components/layout/Topbar";

import {
  useRuntimeStore,
} from "@/store/runtimeStore";

import {
  jsonAnalyzer,
} from "@/lib/runtime/analyzeJsonData";

import {
  generateInsertQueries,
} from "@/lib/runtime/generateInsertQueries";

import {
  generateRelations,
} from "@/lib/runtime/generateRelations";

import {

  UploadCloud,

  Sparkles,

  Database,

  FileJson,

  CheckCircle2,

  AlertTriangle,

} from "lucide-react";

export default function BuilderPage() {

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
    STORE
  */

  const {
    setRuntimeConfig,
  } = useRuntimeStore();

  /*
    STATE
  */

  const [
    configText,
    setConfigText,
  ] = useState("");

  const [
    uploadedFile,
    setUploadedFile,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    validation,
    setValidation,
  ] = useState(null);

  const [
    analysis,
    setAnalysis,
  ] = useState(null);

  /*
    GENERATE RUNTIME
  */

  async function generateRuntime() {

    try {

      if (!projectId) {

        setValidation({

          success: false,

          error:
            "Create or select a project before uploading JSON.",
        });

        return;
      }

      setLoading(true);

      /*
        PARSE JSON
      */

      const parsed =
        JSON.parse(
          configText
        );

      /*
        ANALYZE JSON
      */

      const analyzed =
        jsonAnalyzer(
          parsed
        );

      /*
        GENERATE RELATIONS
      */

      const relations =

        generateRelations(
          analyzed.entities
        );

      /*
        GENERATE INSERTS
      */

      const insertQueries =

        generateInsertQueries(
          parsed
        );

      /*
        SAVE ANALYSIS
      */

      setAnalysis(
        analyzed.analysis
      );

      /*
        VALIDATION
      */

      setValidation({

        success: true,
      });

      /*
        STORE RUNTIME
      */

      setRuntimeConfig({

        entities:
          analyzed.entities,

        rawJson:
          analyzed,

        analysis:
          analyzed.analysis,

        inserts:
          insertQueries,

        relations,
      });

      /*
        CREATE TABLES
      */

      await fetch(

        "/api/runtime/create-tables",

        {
          method: "POST",

          headers: {

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            sqlTables:
              analyzed.sqlTables,
          }),
        }
      );

      /*
        INSERT DATA
      */

      await fetch(

        "/api/runtime/insert-data",

        {
          method: "POST",

          headers: {

            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            inserts:
              insertQueries,
          }),
        }
      );

      /*
        SAVE PROJECT CONFIG
      */

      if (projectId) {

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
                analyzed,

              analysis:
                analyzed.analysis,

              relations,
            }),
          }
        );

        /*
          SAVE UPLOAD
        */

        if (uploadedFile) {

          await fetch(

            `/api/projects/${projectId}/uploads`,

            {
              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                fileName:
                  uploadedFile.name,

                fileType:
                  uploadedFile.type,

                content:
                  analyzed,

                analysis:
                  analyzed.analysis,

                rawContent:
                  parsed,
              }),
            }
          );
        }
      }

      /*
        REDIRECT
      */

      router.push(

        `/runtime?projectId=${projectId}`
      );

    } catch (error) {

      console.error(error);

      setValidation({

        success: false,

        error:
          error.message,
      });

    } finally {

      setLoading(false);
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

              <Sparkles
                size={16}
              />

              Runtime Builder

            </div>

            <h1
              className="
                text-5xl
                font-bold
              "
            >
              Dynamic JSON Runtime Engine
            </h1>

            <p
              className="
                text-zinc-500
                mt-4
                text-lg
                max-w-3xl
              "
            >
              Upload nested JSON
              structures to automatically
              generate PostgreSQL tables,
              runtime entities,
              relationships,
              relational schemas,
              and populated runtime data.
            </p>

          </div>

          {/* GRID */}

          <div
            className="
              grid
              grid-cols-1
              xl:grid-cols-2
              gap-8
            "
          >

            {/* LEFT PANEL */}

            <div
              className="
                rounded-3xl
                border
                border-white/10
                bg-white/5
                backdrop-blur-2xl
                p-8
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-4
                  mb-8
                "
              >

                <div
                  className="
                    w-16
                    h-16
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

                  <UploadCloud
                    size={30}
                  />

                </div>

                <div>

                  <h2
                    className="
                      text-3xl
                      font-semibold
                    "
                  >
                    Upload JSON
                  </h2>

                  <p
                    className="
                      text-zinc-500
                      mt-2
                    "
                  >
                    Generate relational
                    runtime systems
                  </p>

                </div>

              </div>

              {/* FILE INPUT */}

              <label
                className="
                  flex
                  flex-col
                  items-center
                  justify-center
                  border-2
                  border-dashed
                  border-cyan-400/20
                  rounded-3xl
                  p-14
                  bg-cyan-400/5
                  cursor-pointer
                  hover:bg-cyan-400/10
                  transition
                  has-[:disabled]:cursor-not-allowed
                  has-[:disabled]:opacity-50
                "
              >

                <FileJson
                  size={60}
                  className="
                    text-cyan-400
                  "
                />

                <h3
                  className="
                    text-3xl
                    font-semibold
                    mt-6
                  "
                >
                  {
                    projectId
                      ? "Select JSON File"
                      : "Create Project First"
                  }
                </h3>

                <p
                  className="
                    text-zinc-500
                    mt-4
                  "
                >
                  {
                    projectId
                      ? "Upload deeply nested relational JSON"
                      : "JSON files are stored inside the selected project"
                  }
                </p>

                {
                  uploadedFile && (

                    <div
                      className="
                        mt-6
                        px-5
                        py-3
                        rounded-2xl
                        bg-cyan-400/10
                        border
                        border-cyan-400/20
                        text-cyan-300
                        text-sm
                      "
                    >

                      {
                        uploadedFile.name
                      }

                    </div>
                  )
                }

                <input

                  type="file"

                  accept=".json"

                  className="hidden"

                  disabled={!projectId}

                  onChange={async (e) => {

                    const file =
                      e.target.files?.[0];

                    if (!file)
                      return;

                    setUploadedFile(
                      file
                    );

                    const text =
                      await file.text();

                    setConfigText(
                      text
                    );
                  }}
                />

              </label>

              {/* GENERATE */}

              <button

                onClick={
                  generateRuntime
                }

                disabled={
                  loading ||
                  !configText ||
                  !projectId
                }

                className="
                  mt-8
                  w-full
                  h-[68px]
                  rounded-3xl
                  bg-cyan-400
                  text-black
                  text-lg
                  font-semibold
                  hover:scale-[1.01]
                  transition
                  disabled:opacity-50
                "
              >

                {
                  loading

                    ? "Generating Runtime..."

                    : projectId
                      ? "Generate Runtime System"
                      : "Create Project To Continue"
                }

              </button>

            </div>

            {/* RIGHT PANEL */}

            <div className="space-y-6">

              {/* VALIDATION */}

              <div
                className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/5
                  p-8
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
                    className={`
                      w-16
                      h-16
                      rounded-3xl
                      flex
                      items-center
                      justify-center

                      ${
                        validation?.success

                          ? `
                            bg-green-500/10
                            border
                            border-green-500/20
                            text-green-400
                          `

                          : `
                            bg-red-500/10
                            border
                            border-red-500/20
                            text-red-400
                          `
                      }
                    `}
                  >

                    {
                      validation?.success

                        ? (
                          <CheckCircle2
                            size={30}
                          />
                        )

                        : (
                          <AlertTriangle
                            size={30}
                          />
                        )
                    }

                  </div>

                  <div>

                    <h2
                      className="
                        text-3xl
                        font-semibold
                      "
                    >
                      Validation Engine
                    </h2>

                    <p
                      className="
                        text-zinc-500
                        mt-2
                      "
                    >
                      Relationship extraction
                      & runtime analysis
                    </p>

                  </div>

                </div>

                <div className="mt-8">

                  {
                    !validation && (

                      <div
                        className="
                          text-zinc-500
                        "
                      >
                        Upload JSON to begin
                        relational runtime
                        generation.
                      </div>
                    )
                  }

                  {
                    validation?.success && (

                      <div
                        className="
                          rounded-2xl
                          bg-green-500/10
                          border
                          border-green-500/20
                          p-5
                          text-green-300
                        "
                      >
                        Runtime generated
                        successfully with
                        relational extraction
                        and PostgreSQL
                        population.
                      </div>
                    )
                  }

                  {
                    validation &&
                    !validation.success && (

                      <div
                        className="
                          rounded-2xl
                          bg-red-500/10
                          border
                          border-red-500/20
                          p-5
                          text-red-300
                        "
                      >
                        {
                          validation.error
                        }
                      </div>
                    )
                  }

                </div>

              </div>

              {/* ANALYTICS */}

              <div
                className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/5
                  p-8
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-4
                    mb-8
                  "
                >

                  <div
                    className="
                      w-16
                      h-16
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
                      size={30}
                    />

                  </div>

                  <div>

                    <h2
                      className="
                        text-3xl
                        font-semibold
                      "
                    >
                      Runtime Analytics
                    </h2>

                    <p
                      className="
                        text-zinc-500
                        mt-2
                      "
                    >
                      Generated relational
                      metadata
                    </p>

                  </div>

                </div>

                {
                  analysis && (

                    <div
                      className="
                        grid
                        grid-cols-2
                        gap-5
                      "
                    >

                      {
                        [

                          {
                            label:
                              "Entities",

                            value:
                              analysis
                                .stats
                                .entities,
                          },

                          {
                            label:
                              "Fields",

                            value:
                              analysis
                                .stats
                                .totalFields,
                          },

                          {
                            label:
                              "Arrays",

                            value:
                              analysis
                                .stats
                                .arrays,
                          },

                          {
                            label:
                              "Relations",

                            value:
                              analysis
                                .stats
                                .nestedObjects,
                          },

                        ].map(
                          (
                            item,
                            index
                          ) => (

                            <div
                              key={index}

                              className="
                                rounded-2xl
                                border
                                border-white/10
                                bg-black/30
                                p-5
                              "
                            >

                              <p
                                className="
                                  text-zinc-500
                                  text-sm
                                "
                              >
                                {
                                  item.label
                                }
                              </p>

                              <h3
                                className="
                                  text-5xl
                                  font-bold
                                  mt-4
                                "
                              >
                                {
                                  item.value
                                }
                              </h3>

                            </div>
                          )
                        )
                      }

                    </div>
                  )
                }

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}
