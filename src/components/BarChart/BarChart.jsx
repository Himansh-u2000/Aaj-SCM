import { memo, useMemo, useState } from 'react';

/**
 * BarChart — pure SVG bar chart with time-period toggle (Daily/Weekly/Monthly).
 *
 * Props:
 *  - datasets: { daily: [...], weekly: [...], monthly: [...] }
 *    Each item: { label, value }
 *  - height: chart height in px (default 220)
 *  - barColor: CSS color (default primary)
 *  - title: optional chart title
 *  - className: optional wrapper class
 */
const BarChart = ({
  datasets = {},
  height = 220,
  barColor = '#c5202c',
  title,
  className = '',
}) => {
  const periods = Object.keys(datasets);
  const [activePeriod, setActivePeriod] = useState(periods[0] || 'weekly');

  const data = datasets[activePeriod] || [];
  const maxValue = useMemo(() => Math.max(...data.map((d) => d.value), 1), [data]);

  const padding = { top: 20, right: 16, bottom: 32, left: 44 };
  const chartWidth = 100; // percentage-based
  const barGap = data.length > 12 ? 2 : 4;

  // Y-axis ticks
  const yTicks = useMemo(() => {
    const step = Math.ceil(maxValue / 4 / 10) * 10;
    const ticks = [];
    for (let i = 0; i <= 4; i++) ticks.push(step * i);
    return ticks;
  }, [maxValue]);

  const yMax = yTicks[yTicks.length - 1] || maxValue;

  return (
    <div className={className}>
      {/* Header with title + period toggle */}
      <div className="flex items-center justify-between mb-4">
        {title && <h3 className="text-sm font-semibold text-secondary-800">{title}</h3>}
        <div className="flex bg-secondary-100 rounded-lg p-0.5">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors capitalize ${
                activePeriod === period
                  ? 'bg-white text-secondary-800 shadow-sm'
                  : 'text-secondary-500 hover:text-secondary-700'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ height }} className="relative">
        <svg width="100%" height="100%" viewBox={`0 0 500 ${height}`} preserveAspectRatio="none">
          {/* Grid lines */}
          {yTicks.map((tick, i) => {
            const y = padding.top + ((height - padding.top - padding.bottom) * (1 - tick / yMax));
            return (
              <g key={i}>
                <line x1={padding.left} x2={500 - padding.right} y1={y} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                <text x={padding.left - 6} y={y + 3} textAnchor="end" className="fill-secondary-400" style={{ fontSize: '10px' }}>
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((item, i) => {
            const barAreaWidth = (500 - padding.left - padding.right) / data.length;
            const barWidth = Math.max(barAreaWidth - barGap * 2, 4);
            const barHeight = ((item.value / yMax) * (height - padding.top - padding.bottom));
            const x = padding.left + barAreaWidth * i + (barAreaWidth - barWidth) / 2;
            const y = padding.top + (height - padding.top - padding.bottom) - barHeight;

            return (
              <g key={i}>
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={barWidth > 8 ? 4 : 2}
                  fill={barColor}
                  opacity={0.85}
                  className="transition-all duration-300 hover:opacity-100"
                />
                {/* Value on top */}
                <text
                  x={x + barWidth / 2}
                  y={y - 4}
                  textAnchor="middle"
                  className="fill-secondary-600"
                  style={{ fontSize: '8px', fontWeight: 600 }}
                >
                  {item.value}
                </text>
                {/* Label at bottom */}
                <text
                  x={x + barWidth / 2}
                  y={height - padding.bottom + 14}
                  textAnchor="middle"
                  className="fill-secondary-500"
                  style={{ fontSize: data.length > 15 ? '7px' : '9px' }}
                >
                  {item.label}
                </text>
              </g>
            );
          })}

          {/* Bottom axis line */}
          <line
            x1={padding.left}
            x2={500 - padding.right}
            y1={height - padding.bottom}
            y2={height - padding.bottom}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
};

export default memo(BarChart);
