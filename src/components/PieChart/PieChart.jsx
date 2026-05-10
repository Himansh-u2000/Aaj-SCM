import { memo, useMemo } from 'react';

/**
 * PieChart — pure SVG donut/pie chart component.
 *
 * Props:
 *  - data: [{ label, value, color }]
 *  - size: diameter in px (default 180)
 *  - donut: if true, renders as donut chart (default false)
 *  - strokeWidth: donut ring width (default 35)
 *  - showLegend: show legend next to chart (default true)
 *  - title: optional chart title
 *  - className: optional wrapper class
 */
const PieChart = ({
  data = [],
  size = 180,
  donut = false,
  strokeWidth = 35,
  showLegend = true,
  title,
  className = '',
}) => {
  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);

  const segments = useMemo(() => {
    let accumulated = 0;
    return data.map((item) => {
      const percentage = total > 0 ? (item.value / total) * 100 : 0;
      const startAngle = (accumulated / 100) * 360;
      accumulated += percentage;
      const endAngle = (accumulated / 100) * 360;
      return { ...item, percentage, startAngle, endAngle };
    });
  }, [data, total]);

  const center = size / 2;
  const radius = donut ? (size - strokeWidth) / 2 : size / 2 - 2;
  const circumference = 2 * Math.PI * radius;

  // For pie chart (filled slices)
  const getSlicePath = (startAngle, endAngle) => {
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className={`${className}`}>
      {title && (
        <h3 className="text-sm font-semibold text-secondary-800 mb-4">{title}</h3>
      )}
      <div className={`flex ${showLegend ? 'items-center gap-6' : 'justify-center'} flex-wrap`}>
        {/* SVG Chart */}
        <div className="flex-shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {donut ? (
              /* Donut chart using stroke-dasharray */
              <>
                <circle cx={center} cy={center} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
                {segments.map((seg, i) => {
                  const dashLength = (seg.percentage / 100) * circumference;
                  const dashOffset = -((seg.startAngle / 360) * circumference) + circumference / 4;
                  return (
                    <circle
                      key={i}
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                      strokeDashoffset={dashOffset}
                      className="transition-all duration-500"
                      style={{ transformOrigin: 'center' }}
                    />
                  );
                })}
                {/* Center text */}
                <text x={center} y={center - 8} textAnchor="middle" className="fill-secondary-800 text-lg font-bold">
                  {total.toLocaleString()}
                </text>
                <text x={center} y={center + 10} textAnchor="middle" className="fill-secondary-400 text-[10px]">
                  Total
                </text>
              </>
            ) : (
              /* Solid pie chart */
              segments.map((seg, i) => (
                <path
                  key={i}
                  d={getSlicePath(seg.startAngle, seg.endAngle)}
                  fill={seg.color}
                  stroke="white"
                  strokeWidth="2"
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))
            )}
          </svg>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="flex flex-col gap-1.5 min-w-0">
            {segments.map((seg, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="text-xs text-secondary-600 truncate">{seg.label}</span>
                <span className="text-xs font-semibold text-secondary-800 ml-auto pl-2">{seg.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(PieChart);
