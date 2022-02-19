import { useUIContext } from "~/hooks/useUIContext";
import { TheOrders, OrderDetails } from "~/util/theOrders";
import {
  JSXElementConstructor,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import Left from "../../../public/svg/chevron-left.svg";
import Right from "../../../public/svg/chevron-right.svg";
import { OrderIcon } from "~/shared/OrderIcon";
import { animated, useSpring } from "@react-spring/web";
import { useBreakpoint } from "~/hooks/useBreakPoint";
import { Queries } from "~/types";
type Props = {
  children: React.ReactNode;
  open: boolean;
};

export const BaseSideBar = (props: Props) => {
  const { toggleTheOrdersMenu, theOrdersMenu } = useUIContext();
  const breakpoints = useBreakpoint();

  const responsiveAnimations = {
    sm: props.open ? `translateX(0%)` : `translateX(100%)`,
    md: props.open ? `translateX(0%)` : `translateX(100%)`,
    lg: props.open ? `translateX(66.66666667%)` : `translateX(100%)`,
    xl: props.open ? `translateX(66.66666667%)` : `translateX(100%)`,
    "2xl": props.open ? `translateX(66.66666667%)` : `translateX(100%)`,
  };

  const getMediaQuery = (breakpoints: any) => {
    console.log(breakpoints);
    if (breakpoints["2xl"]) {
      return responsiveAnimations["2xl"];
    } else if (breakpoints.xl) {
      return responsiveAnimations.xl;
    } else if (breakpoints.lg) {
      return responsiveAnimations.lg;
    } else if (breakpoints.md) {
      return responsiveAnimations.md;
    } else if (breakpoints.sm) {
      return responsiveAnimations.sm;
    } else {
      return responsiveAnimations.sm;
    }
  };

  const animation = useSpring({
    opacity: props.open ? 1 : 0,
    transform: getMediaQuery(breakpoints),
  });

  return (
    <animated.div
      className="absolute top-0 bottom-0 right-0 z-20 overflow-x-hidden backdrop-blur-md bg-black/80 "
      style={animation}
    >
      {props.children}
    </animated.div>
  );
};
