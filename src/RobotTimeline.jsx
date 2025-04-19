import React, { useState } from 'react';
import { Timeline } from '@xzdarcy/react-timeline-editor';
import { Button, Switch, Space } from 'antd';
import { PlayCircleOutlined, PlusOutlined } from '@ant-design/icons';
import './customBlock.css';

const mockEffect = {
  dance_spin: { id: "dance_spin", name: "Dance Spin" },
};

export default function RobotTimeline({ onTimelineChange, playMotion }) {
  const [editorData, setEditorData] = useState([
    { id: "BR", actions: [] },
    { id: "HK", actions: [] },
    { id: "HR", actions: [] },
    { id: "RA", actions: [] },
    { id: "LA", actions: [] },
  ]);
  const [allow, setAllow] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true); // ✅ 自动滚动控制

  const playTimeline = () => {
    let currentTime = 0;
    const maxEnd = Math.max(...editorData.flatMap(t => t.actions.map(a => a.end)));
    const totalDurationMs = maxEnd * 1000;

    const interval = setInterval(() => {
      const sec = currentTime / 1000;
      editorData.forEach(track => {
        track.actions.forEach(action => {
          if (Math.abs(sec - action.start) < 0.05) {
            playMotion("dance_spin", track.id, action.start, action.end);
          }
        });
      });

      currentTime += 100;
      if (currentTime > totalDurationMs) clearInterval(interval);
    }, 100);
  };

  const addBlockToAllTracks = () => {
    const newStart = 0;
    const newEnd = 1;

    const updated = editorData.map(track => {
      if (track.id === 'HR') return track;
      const isLocked = track.id === 'HR';
      const newBlock = {
        id: `${track.id}_block_${Date.now()}`,
        start: newStart,
        end: newEnd,
        effectId: "dance_spin",
        movable: !isLocked,
        flexible: !isLocked,
      };
      return {
        ...track,
        actions: [...track.actions, newBlock],
      };
    });

    setEditorData(updated);
    onTimelineChange?.(updated);
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '300px',
      backgroundColor: '#f0f0f0',
      padding: '10px 20px',
      boxSizing: 'border-box',
      zIndex: 10
    }}>
      <div style={{ marginBottom: '10px' }}>
        <Space direction="horizontal" size="middle">
          <Button
            type="primary"
            size="small"
            onClick={playTimeline}
            icon={<PlayCircleOutlined />}
          >
            Play Timeline
          </Button>
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={addBlockToAllTracks}
          >
            Add Block
          </Button>
          <Switch
            checkedChildren="Edit Enabled"
            unCheckedChildren="Edit Disabled"
            checked={allow}
            onChange={(e) => setAllow(e)}
          />
          <Switch
            checkedChildren="Auto Scroll"
            unCheckedChildren="No Scroll"
            checked={autoScroll}
            onChange={(v) => setAutoScroll(v)}
          />
        </Space>
      </div>
      <div style={{ overflowX: 'auto', height: '100%' }}>
      <Timeline
  editorData={editorData}
  effects={mockEffect}
  pixelPerSecond={100}
  onChange={(data) => {
    setEditorData(data);
    onTimelineChange?.(data);
  }}
  disableDrag={!allow}
  autoScroll={autoScroll}
  style={{ width: '100%' }}
  getActionRender={(action) => (
    <div className="dance-spin">
      {action.effectId} {(action.end - action.start).toFixed(1)}s
    </div>
  )}
  onDoubleClickRow={(e, { row, time }) => {
    const newAction = {
      id: `action_${Date.now()}`,
      start: Math.round(time * 10) / 10,
      end: Math.round((time + 1) * 10) / 10,
      effectId: "dance_spin",
      movable: true,
      flexible: true,
    };

    setEditorData((prev) =>
      prev.map((track) =>
        track.id === row.id
          ? { ...track, actions: [...track.actions, newAction] }
          : track
      )
    );
  }}
/>
      </div>
    </div>
  );
}
