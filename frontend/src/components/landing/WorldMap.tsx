"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import DottedMap from "dotted-map";
import { useTheme } from "next-themes";

interface MapProps {
  dots?: Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>;
  lineColor?: string;
}

export default function WorldMap({
  dots = [],
  lineColor = "#0ea5e9",
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const map = new DottedMap({ height: 100, grid: "diagonal" });

  const { theme } = useTheme();
  
  // Add parallax scrolling effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 0.6]);

  const svgMap = map.getSVG({
    radius: 0.22,
    color: theme === "dark" ? "#FFFFFF40" : "#00000040",
    shape: "circle",
    backgroundColor: theme === "dark" ? "black" : "white",
  });

  const projectPoint = (lat: number, lng: number) => {
    const x = (lng + 180) * (800 / 360);
    const y = (90 - lat) * (400 / 180);
    return { x, y };
  };

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - 50;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  return (
    <div ref={containerRef} className="relative py-24 overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-black dark:to-slate-950">
      {/* Background elements with parallax */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 -z-10"
      >
        <div className="absolute -left-40 -bottom-40 w-96 h-96 bg-blue-200/20 dark:bg-blue-800/10 rounded-full filter blur-[120px]"></div>
        <div className="absolute -right-40 -top-40 w-96 h-96 bg-violet-200/20 dark:bg-violet-800/10 rounded-full filter blur-[120px]"></div>
      </motion.div>
      
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4 border border-blue-200 dark:border-blue-800/50">
            Global Coverage
          </div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-white dark:to-blue-100 bg-clip-text text-transparent"
          >
            Available Worldwide
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          >
            Find parking spaces in major cities across the globe
          </motion.p>
        </div>
        
        <div className="w-full aspect-[2/1] dark:bg-black bg-white rounded-2xl overflow-hidden shadow-xl dark:shadow-blue-900/5 border border-gray-100 dark:border-gray-800 relative">
          <img
            src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
            className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none"
            alt="world map"
            height="495"
            width="1056"
            draggable={false}
          />
          <svg
            ref={svgRef}
            viewBox="0 0 800 400"
            className="w-full h-full absolute inset-0 pointer-events-none select-none"
          >
            {dots.map((dot, i) => {
              const startPoint = projectPoint(dot.start.lat, dot.start.lng);
              const endPoint = projectPoint(dot.end.lat, dot.end.lng);
              return (
                <g key={`path-group-${i}`}>
                  <motion.path
                    d={createCurvedPath(startPoint, endPoint)}
                    fill="none"
                    stroke="url(#path-gradient)"
                    strokeWidth="1"
                    initial={{
                      pathLength: 0,
                    }}
                    animate={{
                      pathLength: 1,
                    }}
                    transition={{
                      duration: 1,
                      delay: 0.5 * i,
                      ease: "easeOut",
                    }}
                    key={`start-upper-${i}`}
                  ></motion.path>
                </g>
              );
            })}

            <defs>
              <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
                <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>

            {dots.map((dot, i) => (
              <g key={`points-group-${i}`}>
                <g key={`start-${i}`}>
                  <circle
                    cx={projectPoint(dot.start.lat, dot.start.lng).x}
                    cy={projectPoint(dot.start.lat, dot.start.lng).y}
                    r="2"
                    fill={lineColor}
                  />
                  <circle
                    cx={projectPoint(dot.start.lat, dot.start.lng).x}
                    cy={projectPoint(dot.start.lat, dot.start.lng).y}
                    r="2"
                    fill={lineColor}
                    opacity="0.5"
                  >
                    <animate
                      attributeName="r"
                      from="2"
                      to="8"
                      dur="1.5s"
                      begin="0s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.5"
                      to="0"
                      dur="1.5s"
                      begin="0s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
                <g key={`end-${i}`}>
                  <circle
                    cx={projectPoint(dot.end.lat, dot.end.lng).x}
                    cy={projectPoint(dot.end.lat, dot.end.lng).y}
                    r="2"
                    fill={lineColor}
                  />
                  <circle
                    cx={projectPoint(dot.end.lat, dot.end.lng).x}
                    cy={projectPoint(dot.end.lat, dot.end.lng).y}
                    r="2"
                    fill={lineColor}
                    opacity="0.5"
                  >
                    <animate
                      attributeName="r"
                      from="2"
                      to="8"
                      dur="1.5s"
                      begin="0s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.5"
                      to="0"
                      dur="1.5s"
                      begin="0s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
