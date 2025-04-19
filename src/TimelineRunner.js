export default function runTimeline(events, { motionAPI, setExpression }) {
  
    for (const evt of events) {
      const delay = evt.time * 1000;
      setTimeout(() => {
        if (evt.type === 'motion') {
          motionAPI.play(evt.key);
        } else if (evt.type === 'face') {
          setExpression(evt.key);
        }
      }, delay);
    }
  }
  