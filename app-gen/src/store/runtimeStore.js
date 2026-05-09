import {
  create,
} from "zustand";

import {
  persist,
} from "zustand/middleware";

export const useRuntimeStore =
  create(

    persist(

      (set) => ({

        runtimeConfig: null,

        setRuntimeConfig:
          (config) =>

            set({

              runtimeConfig:
                config,
            }),

        clearRuntime:
          () =>

            set({

              runtimeConfig:
                null,
            }),
      }),

      {
        name:
          "runtime-storage",
      }
    )
  );