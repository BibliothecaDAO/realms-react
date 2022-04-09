import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useWindowSize } from '@/hooks/useWindowSize';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface RangeSliderFilterProps {
  name: string;
  min: number;
  max: number;
  defaultValue?: number;
  onChange(value: number): void;
}

export function RangeSliderFilter(props: RangeSliderFilterProps) {
  // Slider state
  const [state, setState] = useState({
    isDragging: false,
    animate: true,
    origin: { x: 0, y: 0 },
    translation: { x: 0, y: 0 },
    selectedValue: 0,
  });

  useEffect(() => {
    setState({ ...state, selectedValue: props.defaultValue ?? props.min });
  }, [props.defaultValue, props.min]);

  // Check for window resizes
  const windowSize = useWindowSize();

  // Utilities
  const getSelectedValue = (x: number) => {
    let idx = boundaries.findIndex((boundary) => boundary > x);
    if (idx === -1) idx = range;
    return props.min + idx;
  };

  const getSliderState = (clientX: number, animate: boolean) => {
    const translation = {
      x:
        clientX < boundingRect.x
          ? 0
          : Math.min(clientX - boundingRect.x, boundingRect.width - sliderSize),
      y: 0,
    };
    return {
      ...state,
      translation,
      animate,
      selectedValue: getSelectedValue(translation.x),
    };
  };

  // Calculate boundaries
  const range = props.max - props.min;
  const sliderSize = 10;
  const [boundingRect, setBoundingRect] = useState<Rect>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const containerRef = useCallback(
    (node) => {
      if (node !== null) {
        const { width, height, x, y } = node.getBoundingClientRect();
        setBoundingRect({ width, height, x, y });
      }
    },
    [windowSize]
  );

  const [boundaries, setBoundaries] = useState<number[]>([]);
  useMemo(() => {
    const boundaries: any[] = [];
    const step = (boundingRect.width - sliderSize) / range;
    for (let i = step / 2; i < boundingRect.width - sliderSize; i = i + step) {
      boundaries.push(i);
    }

    setBoundaries(boundaries);

    // Initialize slider if defaultValue is given
    if (props.defaultValue) {
      const updatedState = getSliderState(
        step * props.defaultValue + boundingRect.x,
        false
      );
      setState({ ...updatedState, isDragging: false });
    }
  }, [boundingRect]);

  // Handle Mouse Events
  const handleMouseDown = useCallback(({ clientX, clientY }) => {
    setState((state) => ({
      ...state,
      isDragging: true,
      animate: false,
      origin: { x: clientX, y: clientY },
    }));
  }, []);

  const handleMouseUp = useCallback(() => {
    setState((state) => ({
      ...state,
      isDragging: false,
    }));
  }, []);

  const handleMouseMove = useCallback(
    ({ clientX }) => {
      const updatedState = getSliderState(clientX, false);
      setState(updatedState);

      // Notify drag state here, if needed
    },
    [state.origin, boundaries]
  );

  const handleMouseClick = ({ clientX }: { clientX: number }) => {
    const updatedState = getSliderState(clientX, true);
    setState(updatedState);
    props.onChange(getSelectedValue(updatedState.translation.x));
  };

  useEffect(() => {
    if (state.isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      props.onChange(state.selectedValue);
    }
  }, [state.isDragging]);

  // Update slider style on transition changes
  const styles = useMemo(
    () => ({
      cursor: state.isDragging ? '-webkit-grabbing' : '-webkit-grab',
      transform: `translate(${state.translation.x}px)`,
      transition:
        !state.animate || state.isDragging ? 'none' : 'transform 500ms',
      zIndex: state.isDragging ? 2 : 1,
      borderRadius: sliderSize,
      width: sliderSize,
      height: sliderSize,
    }),
    [state.isDragging, state.translation]
  );

  return (
    <div className="relative w-full my-2">
      <div className="text-sm tracking-widest text-center uppercase">
        {props.name}
      </div>
      <div
        className="relative w-full"
        style={{ height: styles.height }}
        ref={containerRef}
      >
        <div
          className="bg-[#bd9e3a] inline-block absolute select-none"
          style={styles as any}
          onMouseDown={handleMouseDown}
          role="button"
          aria-hidden="true"
        ></div>
        <div
          role="button"
          className="w-full h-full cursor-pointer"
          onClick={handleMouseClick}
          aria-hidden="true"
        >
          <div className="absolute w-full bg-[#bd9e3a] h-[2px] top-1/2"></div>
        </div>
      </div>
      <div className="flex justify-between w-full uppercase text-[16px] top-3 select-none mt-2">
        <span> {state.selectedValue}</span>
        <span> {props.max}</span>
      </div>
    </div>
  );
}
