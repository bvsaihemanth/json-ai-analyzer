"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  Database,
  Activity,
  Layers3,
  BarChart3,
} from "lucide-react";

export default function AnalyticsDashboard({

  runtimeConfig,

  showStats = true,
}) {

  /*
    ENTITY ANALYTICS
  */

  const analyticsData =
    runtimeConfig?.entities?.map(
      (entity) => ({

        name:
          entity.name,

        fields:
          entity.fields?.length || 0,

        records:
          runtimeConfig
            ?.inserts
            ?.filter(
              (insert) =>
                insert.table ===
                entity.name
            )
            .length || 0,
      })
    ) || [];

  /*
    PIE DATA
  */

  const pieData =
    analyticsData.map(
      (item) => ({

        name:
          item.name,

        value:
          item.records,
      })
    );

  const COLORS = [

    "#22d3ee",

    "#06b6d4",

    "#0891b2",

    "#155e75",
  ];

  return (

    <div className="space-y-8">

      {/* TOP STATS */}
      {
        showStats && (

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-4
              gap-6
            "
          >

            {/* ENTITIES */}
            <div
              className="
                rounded-3xl
                border
                border-white/10
                bg-white/5
                backdrop-blur-2xl
                p-6
              "
            >

          <Database
            className="
              text-cyan-400
              mb-4
            "
            size={28}
          />

          <p className="text-zinc-500">
            Entities
          </p>

          <h2
            className="
              text-4xl
              font-bold
              mt-2
            "
          >
            {
              runtimeConfig?.entities
                ?.length || 0
            }
          </h2>

            </div>

            {/* FIELDS */}
            <div
              className="
                rounded-3xl
                border
                border-white/10
                bg-white/5
                backdrop-blur-2xl
                p-6
              "
            >

          <Layers3
            className="
              text-cyan-400
              mb-4
            "
            size={28}
          />

          <p className="text-zinc-500">
            Total Fields
          </p>

          <h2
            className="
              text-4xl
              font-bold
              mt-2
            "
          >
            {
              analyticsData.reduce(
                (
                  total,
                  entity
                ) =>

                  total +
                  entity.fields,

                0
              )
            }
          </h2>

            </div>

            {/* RECORDS */}
            <div
              className="
                rounded-3xl
                border
                border-white/10
                bg-white/5
                backdrop-blur-2xl
                p-6
              "
            >

          <Activity
            className="
              text-cyan-400
              mb-4
            "
            size={28}
          />

          <p className="text-zinc-500">
            Runtime Records
          </p>

          <h2
            className="
              text-4xl
              font-bold
              mt-2
            "
          >
            {
              analyticsData.reduce(
                (
                  total,
                  entity
                ) =>

                  total +
                  entity.records,

                0
              )
            }
          </h2>

            </div>

            {/* STATUS */}
            <div
              className="
                rounded-3xl
                border
                border-cyan-400/20
                bg-cyan-400/5
                backdrop-blur-2xl
                p-6
              "
            >

          <BarChart3
            className="
              text-cyan-400
              mb-4
            "
            size={28}
          />

          <p className="text-zinc-500">
            Runtime Status
          </p>

          <h2
            className="
              text-3xl
              font-bold
              mt-2
              text-cyan-400
            "
          >
            Active
          </h2>

            </div>

          </div>
        )
      }

      {/* CHART GRID */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-8
        "
      >

        {/* BAR CHART */}
        <div
          className="
            rounded-3xl
            border
            border-white/10
            bg-white/5
            backdrop-blur-2xl
            p-6
          "
        >

          <h2
            className="
              text-2xl
              font-semibold
              mb-6
            "
          >
            Entity Field Distribution
          </h2>

          <div className="h-[320px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={analyticsData}
              >

                <CartesianGrid
                  stroke="#67e8f9"
                  strokeOpacity={0.16}
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  axisLine={{
                    stroke: "#67e8f9",
                  }}
                  tick={{
                    fill: "#a5f3fc",
                  }}
                  tickLine={{
                    stroke: "#67e8f9",
                  }}
                />

                <YAxis
                  axisLine={{
                    stroke: "#67e8f9",
                  }}
                  tick={{
                    fill: "#a5f3fc",
                  }}
                  tickLine={{
                    stroke: "#67e8f9",
                  }}
                />

                <Tooltip
                  cursor={{
                    fill: "rgba(103, 232, 249, 0.08)",
                  }}
                  contentStyle={{
                    background: "#082f49",
                    border:
                      "1px solid rgba(103, 232, 249, 0.35)",
                    borderRadius: "12px",
                    color: "#e0f2fe",
                  }}
                />

                <Bar
                  dataKey="fields"
                  fill="#67e8f9"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* PIE CHART */}
        <div
          className="
            rounded-3xl
            border
            border-white/10
            bg-white/5
            backdrop-blur-2xl
            p-6
          "
        >

          <h2
            className="
              text-2xl
              font-semibold
              mb-6
            "
          >
            Runtime Record Distribution
          </h2>

          <div className="h-[320px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >

                  {
                    pieData.map(
                      (
                        entry,
                        index
                      ) => (

                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index %
                              COLORS.length
                            ]
                          }
                        />
                      )
                    )
                  }

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </div>
  );
}
