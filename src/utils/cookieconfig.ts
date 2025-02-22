export const getCookieOptions = () => ({
    path: "/",
    domain: process.env.NODE_ENV === "production" ? ".onrender.com" : "localhost",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" as const : "lax" as const,
    signed: true,
  });