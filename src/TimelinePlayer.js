import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import React, { useEffect, useState } from 'react';

const { Option } = Select;
const Rates = [0.5, 1.0, 1.5, 2.0];

const TimelinePlayer = ({ timelineState, autoScrollWhenPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const engine = timelineState.current;
    if (!engine) return;

    engine.listener.on('play', () => setIsPlaying(true));
    engine.listener.on('paused', () => setIsPlaying(false));
    engine.listener.on('afterSetTime', ({ time }) => setTime(time));
    engine.listener.on('setTimeByTick', ({ time }) => {
      setTime(time);
      if (autoScrollWhenPlay.current) {
        const left = time * 100 - 500; // 可根据 pixelPerSecond 调整
        engine.setScrollLeft(left);
      }
    });

    return () => {
      engine.pause();
      engine.listener.offAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlayOrPause = () => {
    const engine = timelineState.current;
    if (!engine) return;
    engine.isPlaying ? engine.pause() : engine.play({ autoEnd: true });
  };

  const handleRateChange = (rate) => {
    timelineState.current?.setPlayRate(rate);
  };

  const timeRender = (t) => {
    const float = (parseInt((t % 1) * 100 + '') + '').padStart(2, '0');
    const min = (parseInt(t / 60 + '') + '').padStart(2, '0');
    const sec = (parseInt((t % 60) + '') + '').padStart(2, '0');
    return `${min}:${sec}.${float}`;
  };

  return (
    <div className="timeline-player">
      <div className="play-control" onClick={handlePlayOrPause}>
        {isPlaying ? <PauseOutlined /> : <CaretRightOutlined />}
      </div>
      <div className="time">{timeRender(time)}</div>
      <div className="rate-control">
        <Select size="small" defaultValue={1.0} onChange={handleRateChange}>
          {Rates.map((r) => (
            <Option key={r} value={r}>
              {`${r.toFixed(1)}x`}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default TimelinePlayer;
