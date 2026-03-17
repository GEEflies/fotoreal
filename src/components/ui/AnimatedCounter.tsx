import { useEffect, useState, useRef } from "react";

interface AnimatedCounterProps {
  value: string;
  duration?: number;
  className?: string;
}

function parseValue(value: string): {
  prefix: string;
  number: number;
  suffix: string;
  hasSpaces: boolean;
} {
  // Handle formats like "847+", "+15 000 €", "100%", "4.9"
  const match = value.match(/^([+\-]?)[\s]*([\d\s.,]+)[\s]*(.*)$/);
  
  if (!match) {
    return { prefix: "", number: 0, suffix: value, hasSpaces: false };
  }

  const prefix = match[1] || "";
  const numberStr = match[2].replace(/\s/g, "").replace(",", ".");
  const suffix = match[3] || "";
  const hasSpaces = match[2].includes(" ");

  return {
    prefix,
    number: parseFloat(numberStr),
    suffix,
    hasSpaces,
  };
}

function formatNumber(num: number, hasSpaces: boolean, isDecimal: boolean): string {
  if (isDecimal) {
    return num.toFixed(1);
  }
  
  const rounded = Math.round(num);
  
  if (hasSpaces) {
    return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
  
  return rounded.toString();
}

export function AnimatedCounter({
  value,
  duration = 2000,
  className,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState("0");
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  const { prefix, number, suffix, hasSpaces } = parseValue(value);
  const isDecimal = number % 1 !== 0;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) {
      setDisplayValue(formatNumber(0, hasSpaces, isDecimal));
      return;
    }

    const startTime = performance.now();
    const startValue = 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValue + (number - startValue) * easeOut;
      setDisplayValue(formatNumber(currentValue, hasSpaces, isDecimal));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [hasAnimated, number, duration, hasSpaces, isDecimal]);

  return (
    <span ref={elementRef} className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}
