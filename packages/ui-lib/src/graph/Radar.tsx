import { Group } from '@visx/group';
import { Point } from '@visx/point';
import { scaleLinear } from '@visx/scale';
import { Line, LineRadial } from '@visx/shape';
import { Text } from '@visx/text';
import { useTooltip, Tooltip, defaultStyles } from '@visx/tooltip';
import type { ReactNode } from 'react';
import React, { useCallback } from 'react';

const orange = '#ff9933';
export const pumpkin = '#f5810c';
const silver = '#d9d9d9';
export const background = '#FAF7E9';
const degrees = 360;

const y = (d: { key: string; value: number }) => d.value;

const genAngles = (length: number) =>
  [...new Array(length + 1)].map((_, i) => ({
    angle: i * (degrees / length),
  }));

const genPoints = (length: number, radius: number) => {
  const step = (Math.PI * 2) / length;
  return [...new Array(length)].map((_, i) => ({
    x: radius * Math.sin(i * step),
    y: radius * Math.cos(i * step),
  }));
};

function genPolygonPoints<Datum>(
  dataArray: Datum[],
  scale: (n: number) => number,
  getValue: (d: Datum) => number
) {
  const step = (Math.PI * 2) / dataArray.length;
  const points: { x: number; y: number }[] = new Array(dataArray.length).fill({
    x: 0,
    y: 0,
  });
  const pointString: string = new Array(dataArray.length)
    .fill('')
    .reduce((res, _, i) => {
      if (i > dataArray.length) return res;
      const xVal = scale(getValue(dataArray[i])) * Math.sin(i * step);
      const yVal = scale(getValue(dataArray[i])) * Math.cos(i * step);
      points[i] = { x: xVal, y: yVal };
      res += `${xVal},${yVal} `;
      return res;
    }, []);

  return { points, pointString };
}

const defaultMargin = { top: 40, left: 80, right: 80, bottom: 80 };

export type RadarProps = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  levels?: number;
};

export const RadarMap = ({
  width,
  height,
  levels = 3,
  margin = defaultMargin,
}: RadarProps) => {
  const data = [
    { key: 'Cav', value: 100 },
    { key: 'Inf', value: 10 },
    { key: 'Mag', value: 500 },
    { key: 'Arch', value: 100 },
  ];

  const data2 = [
    { key: 'Cav', value: 100 },
    { key: 'Inf', value: 200 },
    { key: 'Mag', value: 200 },
    { key: 'Arch', value: 100 },
  ];

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip();
  const handleMouseOver = useCallback(
    (coords: any, datum: any) => {
      showTooltip({
        tooltipLeft: coords.x,
        tooltipTop: coords.y,
        tooltipData: datum,
      });
    },
    [showTooltip]
  );

  const tooltipStyles = {
    ...defaultStyles,
    backgroundColor: 'rgba(53,71,125,0.8)',
    color: 'white',
    padding: 12,
  };

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const radius = Math.min(xMax, yMax) / 2;

  const radialScale = scaleLinear<number>({
    range: [0, Math.PI * 2],
    domain: [degrees, 0],
  });

  const yScale = scaleLinear<number>({
    range: [0, radius],
    domain: [0, Math.max(...data.map(y))],
  });

  const webs = genAngles(4);
  const points = genPoints(4, radius);
  const polygonPoints = genPolygonPoints(data, (d) => yScale(d) ?? 0, y);
  const zeroPoint = new Point({ x: 0, y: 0 });

  const polygonPoints2 = genPolygonPoints(data2, (d) => yScale(d) ?? 0, y);

  return width < 10 ? null : (
    <div>
      <svg width={width} height={height}>
        <rect fill={background} width={width} height={height} rx={14} />
        <Group top={height / 2 - margin.top} left={width / 2}>
          {[...new Array(levels)].map((_, i) => (
            <LineRadial
              key={`web-${i}`}
              data={webs}
              angle={(d) => radialScale(d.angle) ?? 0}
              radius={((i + 1) * radius) / levels}
              fill="none"
              stroke={silver}
              strokeWidth={2}
              strokeOpacity={0.8}
              strokeLinecap="round"
            />
          ))}
          {data.map((_, i) => (
            <>
              <Line
                key={`radar-line-${i}`}
                from={zeroPoint}
                to={points[i]}
                stroke={silver}
              />
              <Text
                textAnchor="middle"
                verticalAnchor="middle"
                dx={points[i].x}
                dy={points[i].y}
              >
                {data[i].key}
              </Text>
            </>
          ))}
          <polygon
            points={polygonPoints.pointString}
            fill={orange}
            fillOpacity={0.3}
            stroke={orange}
            strokeWidth={1}
          />
          {polygonPoints.points.map((point, i) => (
            <circle
              key={`radar-point-${i}`}
              cx={point.x}
              cy={point.y}
              r={4}
              fill={pumpkin}
              onMouseOver={() => {
                console.log({ i });
                console.log({ data: data[i] });
                handleMouseOver(point, `${data[i].key}: ${data[i].value}`);
              }}
              onMouseOut={hideTooltip}
            />
          ))}
          <polygon
            points={polygonPoints2.pointString}
            fill={orange}
            fillOpacity={0.3}
            stroke={orange}
            strokeWidth={1}
          />
          {polygonPoints2.points.map((point, i) => (
            <circle
              key={`radar-point-${i}`}
              cx={point.x}
              cy={point.y}
              r={4}
              fill={pumpkin}
              onMouseOver={() => {
                console.log({ i });
                console.log({ data: data[i] });
                handleMouseOver(point, `${data[i].key}: ${data[i].value}`);
              }}
              onMouseOut={hideTooltip}
            />
          ))}
        </Group>
      </svg>
      {tooltipOpen && (
        <Tooltip
          key={Math.random()}
          top={tooltipTop ? tooltipTop + height / 2 - margin.top : 0}
          left={tooltipLeft ? tooltipLeft + width / 2 : 0}
          style={tooltipStyles}
        >
          <strong>{tooltipData as ReactNode}</strong>
        </Tooltip>
      )}
    </div>
  );
};
