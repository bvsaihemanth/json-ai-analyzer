import {
  withAuth,
} from "next-auth/middleware";

export default withAuth({

  pages: {

    signIn: "/login",
  },
});

export const config = {

  matcher: [

    "/runtime/:path*",

    "/builder/:path*",

    "/deploy/:path*",

    "/dashboard/:path*",
  ],
};
