"use client";

import { toPng }
from "html-to-image";

import jsPDF
from "jspdf";

import {
  Download,
} from "lucide-react";

export default function DownloadDashboardButton() {

  async function handleDownload() {

    try {

      const dashboard =
        document.getElementById(
          "dashboard-export"
        );

      if (!dashboard) return;

      dashboard.classList.add(
        "exporting-pdf"
      );

      /*
        GENERATE IMAGE
      */

const dataUrl =
  await toPng(
    dashboard,
    {

      cacheBust: true,

      pixelRatio: 2,

      width:
        dashboard.scrollWidth,

      height:
        dashboard.scrollHeight,

      style: {

        width:
          `${dashboard.scrollWidth}px`,

        height:
          `${dashboard.scrollHeight}px`,
      },

      backgroundColor:
        "#050505",

      filter: (node) => {

        if (
          node.classList?.contains(
            "no-export"
          )
        ) {

          return false;
        }

        return true;
      },
    }
  );

      /*
        PDF
      */

      const image =
        await new Promise(
          (resolve, reject) => {

            const img =
              new Image();

            img.onload = () =>
              resolve(img);

            img.onerror =
              reject;

            img.src =
              dataUrl;
          }
        );

      const pdf =
        new jsPDF(
          "p",
          "mm",
          "a4"
        );

      const pageWidth =
        pdf.internal.pageSize.getWidth();

      const pageHeight =
        pdf.internal.pageSize.getHeight();

      const imageHeight =
        (image.height * pageWidth) /
        image.width;

      let remainingHeight =
        imageHeight;

      let yOffset = 0;

      while (
        remainingHeight > 0
      ) {

        if (yOffset > 0) {

          pdf.addPage();
        }

        pdf.addImage(

          dataUrl,

          "PNG",

          0,

          -yOffset,

          pageWidth,

          imageHeight
        );

        remainingHeight -=
          pageHeight;

        yOffset +=
          pageHeight;
      };

      pdf.save(
        "runtime-dashboard.pdf"
      );

    } catch (error) {

      console.error(error);

      alert(
        "Dashboard export failed."
      );
    } finally {

      document
        .getElementById(
          "dashboard-export"
        )
        ?.classList.remove(
          "exporting-pdf"
        );
    }
  }

  return (

<button

  onClick={
    handleDownload
  }

  className="
    no-export
    px-6
    py-3
    rounded-2xl
    bg-cyan-400
    text-black
    font-semibold
    flex
    items-center
    gap-3
    hover:scale-[1.03]
    transition-all
  "
>

      <Download size={18} />

      Download PDF

    </button>
  );
}
