import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DataItem {
  name: string;
  value: number;
  color?: string;
}

interface BarListProps {
  data: DataItem[];
  valueFormatter?: (value: number) => string;
  className?: string;
  showAnimation?: boolean;
  color?: string;
  onClick?: (item: DataItem) => void;
  isVertical?: boolean;
}

interface BarProps {
  value: number;
  maxValue: number;
  color?: string;
  showAnimation?: boolean;
  className?: string;
  isVertical?: boolean;
}

interface TooltipProps {
  active: boolean;
  item?: DataItem;
  valueFormatter?: (value: number) => string;
}

const Tooltip = ({ active, item, valueFormatter = (v) => `${v}` }: TooltipProps) => {
  if (!active || !item) return null;

  return (
    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-md shadow-md p-2 min-w-[100px] z-50 text-center">
      <p className="text-sm font-medium">{item.name}</p>
      <p className="text-sm">{valueFormatter(item.value)}</p>
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-card"></div>
    </div>
  );
};

const VerticalBar = ({
  value,
  maxValue,
  color = "#0EA5E9",
  showAnimation = true,
  className,
}: BarProps) => {
  const [height, setHeight] = useState(0);
  const percentage = (value / maxValue) * 100;

  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => {
        setHeight(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setHeight(percentage);
    }
  }, [percentage, showAnimation]);

  return (
    <div className={cn("w-full h-full flex items-end", className)}>
      <div 
        className="w-full bg-transparent relative group"
        style={{ height: '100%' }}
      >
        <div 
          className="absolute bottom-0 w-full rounded-t-md transition-all duration-700 ease-out"
          style={{ 
            height: `${height}%`, 
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}40`
          }} 
        />
      </div>
    </div>
  );
};

const HorizontalBar = ({
  value,
  maxValue,
  color = "#0EA5E9",
  showAnimation = true,
  className,
}: BarProps) => {
  const [width, setWidth] = useState(0);
  const percentage = (value / maxValue) * 100;

  useEffect(() => {
    if (showAnimation) {
      const timer = setTimeout(() => {
        setWidth(percentage);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setWidth(percentage);
    }
  }, [percentage, showAnimation]);

  return (
    <div className={cn("h-3 w-full bg-muted rounded-full overflow-hidden", className)}>
      <div 
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ 
          width: `${width}%`, 
          backgroundColor: color,
          boxShadow: `0 1px 3px ${color}40`
        }} 
      />
    </div>
  );
};

export const BarList = ({
  data,
  valueFormatter = (value) => `${value}`,
  className,
  showAnimation = true,
  color = "#0EA5E9",
  onClick,
  isVertical = false,
}: BarListProps) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (isVertical) {
    return (
      <div className={cn("h-full", className)}>
        <div className="flex h-full items-end justify-between gap-2">
          {data.map((item, index) => {
            const barWidth = `${100 / data.length - 2}%`;
            
            return (
              <div 
                key={index}
                className="relative h-full flex flex-col"
                style={{ width: barWidth }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => onClick?.(item)}
              >
                <div className="relative h-[90%] w-full">
                  <VerticalBar
                    value={item.value} 
                    maxValue={maxValue}
                    color={item.color || color}
                    showAnimation={showAnimation}
                  />
                  {activeIndex === index && (
                    <Tooltip
                      active={activeIndex === index}
                      item={item}
                      valueFormatter={valueFormatter}
                    />
                  )}
                </div>
                <div className="mt-2 text-center truncate">
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Horizontal bar list (original)
  return (
    <div className={cn("space-y-4 w-full", className)}>
      {data.map((item, index) => (
        <div 
          key={index} 
          className={cn(
            "flex flex-col space-y-2", 
            onClick ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
          )}
          onClick={() => onClick?.(item)}
          onMouseEnter={() => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{item.name}</span>
            <span className="text-sm font-medium">
              {valueFormatter(item.value)}
            </span>
          </div>
          <div className="relative">
            <HorizontalBar 
              value={item.value} 
              maxValue={maxValue} 
              color={item.color || color}
              showAnimation={showAnimation}
            />
            {activeIndex === index && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-md shadow-md p-2 z-50">
                <p className="text-xs">{valueFormatter(item.value)}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

interface BarChartProps {
  data: DataItem[];
  valueFormatter?: (value: number) => string;
  className?: string;
  showAnimation?: boolean;
  color?: string;
  onClick?: (item: DataItem) => void;
}

export const BarChart = ({ 
  data,
  valueFormatter = (value) => `${value}`,
  className,
  showAnimation = true,
  color = "#0EA5E9",
  onClick,
}: BarChartProps) => {
  return (
    <div className={cn("h-full w-full", className)}>
      <BarList 
        data={data} 
        valueFormatter={valueFormatter}
        showAnimation={showAnimation}
        color={color}
        onClick={onClick}
        isVertical={true}
      />
    </div>
  );
};

export { HorizontalBar as Bar };
