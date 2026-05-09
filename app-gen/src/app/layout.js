import AuthProvider
from "@/components/providers/SessionProvider";

import "./globals.css";

export const metadata = {

  title:
    "AI Runtime App Generator",

  description:
    "Dynamic Full Stack Application Generator",

  icons: {

    icon:
      "/icon.svg",

    shortcut:
      "/icon.svg",

    apple:
      "/icon.svg",
  },
};

export default function RootLayout({
  children,
}) {

  return (

    <html
      lang="en"

      className="
        h-full
        antialiased
      "
    >

      <body
        className="
          min-h-full
          flex
          flex-col
          bg-black
          text-white
        "
      >

        <AuthProvider>

          {children}

        </AuthProvider>

      </body>

    </html>
  );
}
