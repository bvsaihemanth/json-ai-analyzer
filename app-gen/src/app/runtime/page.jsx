"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import Sidebar
from "@/components/layout/Sidebar";

import Topbar
from "@/components/layout/Topbar";

import {
  useRuntimeStore,
} from "@/store/runtimeStore";

import AnalyticsDashboard
from "@/components/runtime/AnalyticsDashboard";

import DownloadDashboardButton
from "@/components/runtime/DownloadDashboardButton";

import {

  Database,

  Table2,

  BarChart3,

  Layers3,

  GitBranch,

} from "lucide-react";

export default function RuntimePage() {

  /*
    SEARCH PARAMS
  */

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
    runtimeConfig,
  } = useRuntimeStore();

  /*
    STATE
  */

  const [
    tableRows,
    setTableRows,
  ] = useState({});

  /*
    ANALYSIS
  */

  const analysis =

    runtimeConfig
      ?.analysis;

  /*
    ENTITIES
  */

  const entities =

    runtimeConfig
      ?.entities || [];

  /*
    SQL TABLES
  */

  const sqlTables =
    useMemo(
      () =>
        runtimeConfig
          ?.rawJson
          ?.sqlTables || [],
      [runtimeConfig]
    );

  /*
    RELATIONS
  */

  const relations =

    runtimeConfig
      ?.relations || [];

  /*
    JSON-DERIVED ROWS
  */

  const generatedRows =
    useMemo(
      () => {

        const rows = {};

        (
          runtimeConfig?.inserts || []
        ).forEach(
          (insert) => {

            if (!rows[insert.table]) {

              rows[insert.table] = [];
            }

            rows[insert.table].push(
              insert.row
            );
          }
        );

        return rows;
      },
      [runtimeConfig]
    );

  /*
    FETCH TABLE ROWS
  */

  useEffect(() => {

    async function fetchRows() {

      const results = {};

      for (
        const table of sqlTables
      ) {

        try {

          const response =
            await fetch(

              `/api/table-data?projectId=${projectId || ""}&table=${table.table}`
            );

          const data =
            await response.json();

          results[
            table.table
          ] = data.rows || [];

        } catch (error) {

          console.error(error);
        }
      }

      setTableRows(
        results
      );
    }

    if (
      sqlTables.length > 0
    ) {

      fetchRows();
    }

  }, [
    projectId,
    runtimeConfig,
    sqlTables,
  ]);

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

        <div
          id="dashboard-export"
          className="
            p-8
            bg-[#050505]
            text-white
          "
        >

          {/* HEADER */}

          <div
            className="
              mb-12
              flex
              items-start
              justify-between
              gap-6
            "
          >

            <div>

              <div
                className="
                  inline-flex
                  no-export
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

                Runtime Database Engine

              </div>

              <h1
                className="
                  text-5xl
                  font-bold
                "
              >
                Runtime Dashboard
              </h1>

              <p
                className="
                  text-zinc-500
                  mt-4
                  text-lg
                  max-w-3xl
                "
              >
                Dynamic relational runtime
                generated automatically
                from uploaded nested JSON
                structures.
              </p>

            </div>

            <div
              className="
                no-export
                shrink-0
                pt-8
              "
            >

              <DownloadDashboardButton />

            </div>

          </div>

          {/* ANALYTICS */}

          {
            analysis && (

              <div className="space-y-8">

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-4
                    gap-6
                  "
                >

                  {
                    [

                      {
                        label:
                          "Entities",

                        value:
                          analysis.stats
                            .entities,

                        icon:
                          Layers3,
                      },

                      {
                        label:
                          "Fields",

                        value:
                          analysis.stats
                            .totalFields,

                        icon:
                          Table2,
                      },

                      {
                        label:
                          "Arrays",

                        value:
                          analysis.stats
                            .arrays,

                        icon:
                          Database,
                      },

                      {
                        label:
                          "Relations",

                        value:
                          relations.length,

                        icon:
                          GitBranch,
                      },

                    ].map(
                      (
                        item,
                        index
                      ) => {

                        const Icon =
                          item.icon;

                        return (

                          <div
                            key={index}

                            className="
                              rounded-3xl
                              border
                              border-white/10
                              bg-white/5
                              p-6
                            "
                          >

                            <div
                              className="
                                items-center
                                flex
                                justify-center
                                justify-between
                              "
                            >

                              <div>

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

                                <Icon
                                  size={26}
                                />

                              </div>

                            </div>

                          </div>
                        );
                      }
                    )
                  }

                </div>

                <AnalyticsDashboard
                  runtimeConfig={
                    runtimeConfig
                  }
                  showStats={false}
                />

              </div>
            )
          }

          {/* GENERATED ENTITIES */}

          <div className="mt-14">

            <div
              className="
                flex
                items-center
                justify-between
                mb-8
              "
            >

              <div>

                <h2
                  className="
                    text-4xl
                    font-bold
                  "
                >
                  Generated Entities
                </h2>

                <p
                  className="
                    text-zinc-500
                    mt-2
                  "
                >
                  Runtime relational
                  entities extracted from
                  uploaded JSON.
                </p>

              </div>

            </div>

            <div
              className="
                grid
                grid-cols-1
                xl:grid-cols-2
                gap-8
              "
            >

              {
                entities.map(
                  (
                    entity,
                    index
                  ) => (

                    <div
                      key={index}

                      className="
                        rounded-3xl
                        border
                        border-white/10
                        bg-white/5
                        p-6
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          mb-6
                        "
                      >

                        <h3
                          className="
                            text-2xl
                            font-semibold
                            capitalize
                          "
                        >
                          {
                            entity.name
                          }
                        </h3>

                        <div
                          className="
                            px-3
                            py-1
                            rounded-xl
                            bg-cyan-400/10
                            border
                            border-cyan-400/20
                            text-cyan-300
                            text-sm
                          "
                        >

                          {
                            entity.fields
                              .length
                          } Fields

                        </div>

                      </div>

                      <div
                        className="
                          flex
                          flex-wrap
                          gap-3
                        "
                      >

                        {
                          entity.fields.map(
                            (
                              field,
                              fieldIndex
                            ) => (

                              <div
                                key={
                                  fieldIndex
                                }

                                className="
                                  px-4
                                  py-2
                                  rounded-2xl
                                  bg-black/30
                                  border
                                  border-white/10
                                "
                              >

                                <p
                                  className="
                                    text-sm
                                    text-zinc-400
                                  "
                                >
                                  {
                                    field.name
                                  }
                                </p>

                                <p
                                  className="
                                    text-cyan-300
                                    text-xs
                                    mt-1
                                  "
                                >
                                  {
                                    field.type
                                  }
                                </p>

                              </div>
                            )
                          )
                        }

                      </div>

                    </div>
                  )
                )
              }

            </div>

          </div>

          {/* RELATIONSHIP MAPPING */}

          <div className="mt-14">

            <div className="mb-8">

              <h2
                className="
                  text-4xl
                  font-bold
                "
              >
                Relationship Mapping
              </h2>

              <p
                className="
                  text-zinc-500
                  mt-2
                "
              >
                Extracted relational
                dependencies between
                generated entities.
              </p>

            </div>

            <div
              className="
                rounded-3xl
                border
                border-white/10
                bg-white/5
                overflow-hidden
              "
            >

              <table
                className="
                  w-full
                  text-sm
                "
              >

                <thead
                  className="
                    bg-white/5
                  "
                >

                  <tr>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-zinc-400
                      "
                    >
                      Parent Entity
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-zinc-400
                      "
                    >
                      Child Entity
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-zinc-400
                      "
                    >
                      Foreign Key
                    </th>

                    <th
                      className="
                        px-6
                        py-4
                        text-left
                        text-zinc-400
                      "
                    >
                      Relation
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {
                    relations.map(
                      (
                        relation,
                        index
                      ) => (

                        <tr
                          key={index}

                          className="
                            border-t
                            border-white/5
                          "
                        >

                          <td
                            className="
                              px-6
                              py-4
                              capitalize
                            "
                          >
                            {
                              relation.parent
                            }
                          </td>

                          <td
                            className="
                              px-6
                              py-4
                              capitalize
                            "
                          >
                            {
                              relation.child
                            }
                          </td>

                          <td
                            className="
                              px-6
                              py-4
                              text-cyan-300
                            "
                          >
                            {
                              relation.field
                            }
                          </td>

                          <td
                            className="
                              px-6
                              py-4
                            "
                          >

                            <span
                              className="
                                px-3
                                py-1
                                rounded-xl
                                bg-cyan-400/10
                                border
                                border-cyan-400/20
                                text-cyan-300
                                text-xs
                              "
                            >

                              {
                                relation.relation
                              }

                            </span>

                          </td>

                        </tr>
                      )
                    )
                  }

                </tbody>

              </table>

            </div>

          </div>

          {/* RUNTIME TABLES */}

          <div className="mt-14">

            <div className="mb-8">

              <h2
                className="
                  text-4xl
                  font-bold
                "
              >
                Runtime Tables
              </h2>

              <p
                className="
                  text-zinc-500
                  mt-2
                "
              >
                Real PostgreSQL relational
                runtime data generated
                from uploaded JSON.
              </p>

            </div>

            <div
              className="
                grid
                grid-cols-1
                gap-8
              "
            >

              {
                sqlTables.map(
                  (
                    table,
                    index
                  ) => {

                    const rows =

                      tableRows[
                        table.table
                      ]?.length
                        ? tableRows[
                            table.table
                          ]
                        : generatedRows[
                            table.table
                          ] || [];

                    return (

                      <div
                        key={index}

                        className="
                          rounded-3xl
                          border
                          border-white/10
                          bg-white/5
                          p-6
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            mb-6
                          "
                        >

                          <h3
                            className="
                              text-2xl
                              font-semibold
                              capitalize
                            "
                          >
                            {
                              table.table
                            }
                          </h3>

                          <div
                            className="
                              px-3
                              py-1
                              rounded-xl
                              bg-cyan-400/10
                              border
                              border-cyan-400/20
                              text-cyan-300
                              text-sm
                            "
                          >

                            {
                              rows.length
                            } Rows

                          </div>

                        </div>

                        <div
                          className="
                            overflow-auto
                            no-scrollbar
                            rounded-2xl
                            border
                            border-white/10
                          "
                        >

                          <table
                            className="
                              w-full
                              text-sm
                            "
                          >

                            <thead
                              className="
                                bg-white/5
                              "
                            >

                              <tr>

                                {
                                  table.columns.map(
                                    (
                                      column,
                                      columnIndex
                                    ) => (

                                      <th
                                        key={
                                          columnIndex
                                        }

                                        className="
                                          px-4
                                          py-3
                                          text-left
                                          text-zinc-400
                                          whitespace-nowrap
                                        "
                                      >

                                        {
                                          column.name
                                        }

                                      </th>
                                    )
                                  )
                                }

                              </tr>

                            </thead>

                            <tbody>

                              {
                                rows.length === 0 && (

                                  <tr>

                                    <td
                                      colSpan={
                                        table.columns.length
                                      }

                                      className="
                                        px-4
                                        py-6
                                        text-center
                                        text-zinc-500
                                      "
                                    >

                                      No runtime rows found

                                    </td>

                                  </tr>
                                )
                              }

                              {
                                rows.map(
                                  (
                                    row,
                                    rowIndex
                                  ) => (

                                    <tr
                                      key={
                                        rowIndex
                                      }

                                      className="
                                        border-t
                                        border-white/5
                                      "
                                    >

                                      {
                                        table.columns.map(
                                          (
                                            column,
                                            columnIndex
                                          ) => (

                                            <td
                                              key={
                                                columnIndex
                                              }

                                              className="
                                                px-4
                                                py-3
                                                whitespace-nowrap
                                              "
                                            >

                                              {
                                                String(

                                                  row[
                                                    column.name
                                                  ] ?? "-"
                                                )
                                              }

                                            </td>
                                          )
                                        )
                                      }

                                    </tr>
                                  )
                                )
                              }

                            </tbody>

                          </table>

                        </div>

                      </div>
                    );
                  }
                )
              }

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}
