import { AppProps } from "next/dist/shared/lib/router/router";
import { useRouter } from "next/router";
import { animated, useTransition } from "@react-spring/web";

const PageTransition = ({ Component, pageProps }: any) => {
  const router = useRouter();
  const items = [
    {
      id: router.pathname,
      Component,
      pageProps,
    },
  ];

  const transitions = useTransition(items, {
    keys: (items) => items.id,
    from: { display: 'none', transform: 'scale(0.9)', opacity: 0 },
    enter: { display: 'block', transform: 'scale(1)', opacity: 1 },
    leave: { display: 'none' }
  });

  return transitions((styles, item) => (
    <animated.div style={{ ...styles, width: "100%" }}>
      <Component {...pageProps} />
    </animated.div>
  ));
};

export default PageTransition;