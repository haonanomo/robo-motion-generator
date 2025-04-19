import React from 'react';
import { Timeline } from '@xzdarcy/react-timeline-editor';

const mockData = [
  {
    id: "0",
    actions: [
      {
        id: "action00",
        start: 0,
        end: 2,
        effectId: "effect0",
      },
    ],
  },
  {
    id: "1",
    actions: [
      {
        id: "action10",
        start: 1.5,
        end: 5,
        effectId: "effect1",
      }
    ],
  },
];

const mockEffect = {
  effect0: {
    id: "effect0",
    name: "效果0",
  },
  effect1: {
    id: "effect1",
    name: "效果1",
  },
};

export default function TimelineDemo() {
  return (
    <div style={{ padding: 20 }}>
      <h2>React Timeline Editor Demo</h2>
      <div style={{ height: 200 }}>
        <Timeline
          editorData={mockData}
          effects={mockEffect}
          onChange={(data) => {
            console.log('Timeline changed:', data);
          }}
        />
      </div>
    </div>
  );
}
