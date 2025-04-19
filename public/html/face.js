class FaceController {
  constructor(elements = {}) {
    Object.assign(this, elements);
  }

  animateProperty(target, property, value, duration = 1000) {
    anime({
      targets: target,
      [property]: value,
      duration,
      easing: "easeInOutQuad",
    });
  }

  blink(duration = 150) {
    this.animateProperty(
      [this.leftEye, this.rightEye],
      "scaleY",
      [1, 0, 1],
      duration
    );
  }

  startBlinking() {
    this.blinkingTimeline = anime.timeline({
      easing: "easeInOutQuad",
      loop: true,
      duration: 1800,
    });

    this.blinkingTimeline.add(
      {
        targets: [this.leftEye, this.rightEye],
        scaleY: [1, 0, 1],
        duration: 500,
      },
      1700
    );
  }

  stopBlinking() {
    if (this.blinkingTimeline) {
      this.blinkingTimeline.pause();
      this.blinkingTimeline = null;
      anime({
        targets: [this.leftEye, this.rightEye],
        scaleY: 1,
        duration: 500,
        easing: "easeOutQuad",
      });
    }
  }

  startTalking() {
    this.talkingTimeline = anime.timeline({
      easing: "easeInOutQuad",
      loop: true,
      duration: 200,
    });

    this.talkingTimeline
      .add({
        targets: this.mouth,
        scaleY: [1, 1.2],
        scaleX: [1, 1.1],
        duration: 200,
      })
      .add({
        targets: this.mouth,
        scaleY: 1,
        scaleX: 1,
        duration: 200,
      });
  }

  stopTalking() {
    if (this.talkingTimeline) {
      this.talkingTimeline.pause();
      this.talkingTimeline = null;

      anime({
        targets: this.mouth,
        scaleY: 1,
        scaleX: 1,
        duration: 500,
        easing: "easeOutQuad",
      });
    }
  }

  startBreathing() {
    this.breathingTimeline = anime.timeline({
      easing: "easeInOutQuad",
      loop: true,
    });

    this.breathingTimeline
      .add({
        targets: [this.leftEye, this.rightEye],
        scaleY: [1, 0.9, 1],
        duration: 1000,
      })
      .add({
        targets: this.face,
        scale: [0.99, 1.01],
        duration: 1500,
      })
      .add({
        targets: this.face,
        scale: [1.01, 0.99],
        duration: 1500,
      });
  }

  stopBreathing() {
    if (this.breathingTimeline) {
      this.breathingTimeline.pause();
      this.breathingTimeline = null;

      anime({
        targets: [this.leftEye, this.rightEye],
        scaleY: 1,
        duration: 500,
        easing: "easeOutQuad",
      });

      anime({
        targets: this.face,
        scale: 1,
        duration: 500,
        easing: "easeOutQuad",
      });
    }
  }

  reset() {
    this.stopBlinking();
    this.stopBreathing();
    this.stopTalking();
  }
}

window.FaceController = FaceController;
