/*
 * source: https://dev.to/ascorbic/a-more-realistic-html-canvas-paint-tool-313b
 */
const addPaintTools = (canvas, context, colour = '#3d34a5', strokeWidth = 25, opacity = 0.2) => {
  // Drawing state
  let latestPoint;
  let drawing = false;
  context.globalAlpha = opacity;
  // context.globalCompositeOperation = 'source-over';
  context.globalCompositeOperation = 'destination-atop';
  // Drawing functions
  const continueStroke = newPoint => {
    context.beginPath();
    context.moveTo(latestPoint[0], latestPoint[1]);
    context.strokeStyle = colour;
    context.lineWidth = strokeWidth;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineTo(newPoint[0], newPoint[1]);
    context.stroke();

    latestPoint = newPoint;
  };

  // Event helpers
  const startStroke = point => {
    drawing = true;
    latestPoint = point;
  };

  const BUTTON = 0b01;
  const mouseButtonIsDown = buttons => (BUTTON & buttons) === BUTTON;

  // Mouse event handlers
  const mouseMove = evt => {
    if (!drawing) {
      return;
    }
    continueStroke([evt.offsetX, evt.offsetY]);
  };

  const mouseDown = evt => {
    if (drawing) {
      return;
    }
    evt.preventDefault();
    canvas.addEventListener('mousemove', mouseMove, false);
    startStroke([evt.offsetX, evt.offsetY]);
  };

  const mouseEnter = evt => {
    if (!mouseButtonIsDown(evt.buttons) || drawing) {
      return;
    }
    mouseDown(evt);
  };

  const endStroke = evt => {
    if (!drawing) {
      return;
    }
    drawing = false;
    evt.currentTarget.removeEventListener('mousemove', mouseMove, false);
  };

  canvas.addEventListener('mousedown', mouseDown, false);
  canvas.addEventListener('mouseup', endStroke, false);
  canvas.addEventListener('mouseout', endStroke, false);
  canvas.addEventListener('mouseenter', mouseEnter, false);

  // Touch event handlers
  const getTouchPoint = evt => {
    if (!evt.currentTarget) {
      return [0, 0];
    }
    const rect = evt.currentTarget.getBoundingClientRect();
    const touch = evt.targetTouches[0];
    return [touch.clientX - rect.left, touch.clientY - rect.top];
  };

  const touchStart = evt => {
    if (drawing) {
      return;
    }
    evt.preventDefault();
    startStroke(getTouchPoint(evt));
  };

  const touchMove = evt => {
    if (!drawing) {
      return;
    }
    continueStroke(getTouchPoint(evt));
  };

  const touchEnd = () => {
    drawing = false;
  };

  canvas.addEventListener('touchstart', touchStart, false);
  canvas.addEventListener('touchend', touchEnd, false);
  canvas.addEventListener('touchcancel', touchEnd, false);
  canvas.addEventListener('touchmove', touchMove, false);
};

export default addPaintTools;
