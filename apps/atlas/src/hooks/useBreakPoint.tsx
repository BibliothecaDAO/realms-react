import React, { useState, useEffect, createContext, useContext } from "react";
import { Queries } from "~/types";
const defaultValue = {};

const BreakpointContext = createContext(defaultValue);

interface BreakpointProviderProps {
  children: React.ReactNode;
  queries: Queries;
}

const BreakpointProvider = (props: BreakpointProviderProps) => {
  const [queryMatch, setQueryMatch] = useState({});

  useEffect(() => {
    const mediaQueryLists: any = {};
    const keys = Object.keys(props.queries);
    let isAttached = false;
    const handleQueryListener = () => {
      const updatedMatches = keys.reduce((acc: any, media: any) => {
        acc[media] = !!(
          mediaQueryLists[media] && mediaQueryLists[media].matches
        );
        return acc;
      }, {});
      setQueryMatch(updatedMatches);
    };

    if (window && window.matchMedia) {
      const matches: any = {};
      keys.forEach((media) => {
        if (typeof props.queries[media as keyof Queries] === "string") {
          mediaQueryLists[media] = window.matchMedia(
            props.queries[media as keyof Queries]
          );
          matches[media] = mediaQueryLists[media].matches;
        } else {
          matches[media] = false;
        }
      });
      setQueryMatch(matches);
      isAttached = true;
      keys.forEach((media) => {
        if (typeof props.queries[media as keyof Queries] === "string") {
          mediaQueryLists[media].addListener(handleQueryListener);
        }
      });
    }

    return () => {
      if (isAttached) {
        keys.forEach((media) => {
          if (typeof props.queries[media as keyof Queries] === "string") {
            mediaQueryLists[media].removeListener(handleQueryListener);
          }
        });
      }
    };
  }, [props.queries]);

  return (
    <BreakpointContext.Provider value={queryMatch}>
      {props.children}
    </BreakpointContext.Provider>
  );
};

function useBreakpoint() {
  const context = useContext(BreakpointContext);
  if (context === defaultValue) {
    throw new Error("useBreakpoint must be used within BreakpointProvider");
  }
  return context;
}
export { useBreakpoint, BreakpointProvider };
