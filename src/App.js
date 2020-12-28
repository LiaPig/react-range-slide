import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

export default function App() {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(100);

  const startPercent = useMemo(() => {
    if (start < 0) {
      return 0;
    }
    if (start > 100) {
      return 100;
    }
    return start;
  }, [start]);
  const endPercent = useMemo(() => {
    if (end < 0) {
      return 0;
    } else if (end > 100) {
      return 100;
    } else {
      return end;
    }
  }, [end]);
  const [currentProgressPercent, setCurrentProgressPercent] = useState(
    endPercent - startPercent
  );
  const [currentLeftPercent, setCurrentLeftPercent] = useState(0);

  const startRef = useRef(null);
  const endRef = useRef(null);

  const rangeRef = useRef(null);
  const rangeWidth = useRef(0);

  const lastStartX = useRef(0);
  const lastEndX = useRef(0);

  const onStartTouchBegin = (e) => {
    const touch = e.targetTouches[0];
    lastStartX.current = touch.pageX;
  };
  const onEndTouchBegin = (e) => {
    const touch = e.targetTouches[0];
    lastEndX.current = touch.pageX;
  };
  const onStartTouchMove = (e) => {
    const touch = e.targetTouches[0];
    const distance = touch.pageX - lastStartX.current;
    setStart(
      (start) => start + Math.round((distance / rangeWidth.current) * 100)
    );
    lastStartX.current = touch.pageX;
  };
  const onEndTouchMove = (e) => {
    const touch = e.targetTouches[0];
    const distance = touch.pageX - lastEndX.current;
    setEnd((end) => end + Math.round((distance / rangeWidth.current) * 100));
    lastEndX.current = touch.pageX;
  };

  useEffect(() => {
    rangeWidth.current = rangeRef.current.offsetWidth;
  }, []);
  useEffect(() => {
    // 不赋值给常量会有语法 warining
    const startRefCurrent = startRef.current;
    const endRefCurrent = endRef.current;

    startRefCurrent.addEventListener("touchstart", onStartTouchBegin, false);
    endRefCurrent.addEventListener("touchstart", onEndTouchBegin, false);
    startRefCurrent.addEventListener("touchmove", onStartTouchMove, false);
    endRefCurrent.addEventListener("touchmove", onEndTouchMove, false);
    return () => {
      startRefCurrent.removeEventListener(
        "touchstart",
        onStartTouchBegin,
        false
      );
      endRefCurrent.removeEventListener("touchstart", onEndTouchBegin, false);
      startRefCurrent.removeEventListener("touchmove", onStartTouchMove, false);
      endRefCurrent.removeEventListener("touchmove", onEndTouchMove, false);
    };
  }, []);

  useEffect(() => {
    if (endPercent > startPercent) {
      setCurrentProgressPercent(endPercent - startPercent);
      setCurrentLeftPercent(startPercent);
      return;
    }
    setCurrentProgressPercent(startPercent - endPercent);
    setCurrentLeftPercent(endPercent);
  }, [startPercent, endPercent]);

  return (
    <div className="App">
      <div className="description">
        <div>开始结点进度：{startPercent}%</div>
        <div>结束节点进度：{endPercent}%</div>
        <div>选中区域进度：{currentProgressPercent}%</div>
      </div>
      <div ref={rangeRef} className="range">
        <div
          className="progress"
          style={{
            width: `${currentProgressPercent}%`,
            left: `${currentLeftPercent}%`,
          }}
        ></div>
        <div
          ref={startRef}
          className="start"
          style={{ left: `${startPercent}%` }}
        ></div>
        <div
          ref={endRef}
          className="end"
          style={{ left: `${endPercent}%` }}
        ></div>
      </div>
    </div>
  );
}
