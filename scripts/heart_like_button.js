// https://mojs.github.io/

async function playLikeAnimation(button) {
  const COLOR_RED = "#eb2940";
  const COLOR_WHITE = "#f7fafe";
  const COLOR_BLACK = "#111111";
  const DURATION_MULTIPLIER = 20;

  const moTimeline = new mojs.Timeline();
  const moScaleCurve = mojs.easing.path("M0 100H15.5C51 54.5 14.5 7.5 100 0");

  const moTween1 = new mojs.Burst({
    parent: button,
    angle: { 0: 45 },
    // y: -10,
    x: 10,
    count: 8,
    radius: 50,
    children: {
      shape: "circle",
      radius: 14,
      fill: [COLOR_RED, COLOR_BLACK],
      duration: 60 * DURATION_MULTIPLIER,
    },
  });

  const moTween2 = new mojs.Tween({
    duration: 90 * DURATION_MULTIPLIER,
    onUpdate: (progress) => {
      const moScaleProgress = moScaleCurve(progress);
      button.style.transform = `translate(-50%, -50%) scale3d(${moScaleProgress}, ${moScaleProgress}, 1)`;
    },
  });

  moTimeline.add(moTween1, moTween2);
  moTimeline.play();
}
