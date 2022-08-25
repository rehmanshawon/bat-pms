import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export { RouteGuard };

function RouteGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    router.events.on("routeChangeStart", hideContent);

    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function authCheck(url) {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = ["/signin", "/signup"];
    const path = url.split("?")[0];
    const user = JSON.parse(localStorage.getItem("user"));
    const isLoggedIn = user && user.access_token;
    //const isLoggedIn=true;
    if (!isLoggedIn && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: "/signin",
      });
    } else {
      setAuthorized(true);
    }
  }
  // setAuthorized(true);
  return authorized && children;
}
