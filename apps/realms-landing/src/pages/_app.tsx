import { UserAgentProvider } from '@quentin-sommer/react-useragent';
import { StarknetProvider } from '@starknet-react/core';
import type { AppProps } from 'next/app';
import React, { useEffect } from 'react';
import '../styles/global.css';
import 'keen-slider/keen-slider.min.css';
/* import PageTransition from '@/components/navigation/PageTransition'; 
import { animated, Transition } from '@react-spring/web'; */

const PageWrapper = (Comp: any) =>
  class InnerPageWrapper extends React.Component<{ ua: string }> {
    /*
     * Need to use args.ctx
     * See https://nextjs.org/docs/advanced-features/custom-document
     */
    static async getInitialProps(args: any) {
      return {
        ua: args.ctx.req
          ? args.ctx.req.headers['user-agent']
          : navigator.userAgent,
        ...(Comp.getInitialProps ? await Comp.getInitialProps(args) : null),
      };
    }

    render() {
      const { ua, ...props } = this.props;
      return (
        <UserAgentProvider ua={ua}>
          <Comp {...props} />
        </UserAgentProvider>
      );
    }
  };
const queries = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
};

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default PageWrapper(MyApp);
