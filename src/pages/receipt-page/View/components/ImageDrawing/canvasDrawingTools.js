const getTouchPos = e => {
  if (!e.currentTarget) {
    return [0, 0];
  }
  const rect = e.currentTarget.getBoundingClientRect();
  const touch = e.targetTouches[0];
  return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
};

const getMousePos = e => {
  const rect = e.currentTarget.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
};

const addDrawingTools = (canvas, context, colour = 'red', strokeWidth = 25, opacity = 1) => {
  let isDrawing;

  context.globalAlpha = opacity;
  context.lineWidth = strokeWidth;
  context.strokeStyle = colour;
  context.lineJoin = context.lineCap = 'round';
  context.globalCompositeOperation = 'source-over';

  const onStartDraw = getPosFn => e => {
    const pos = getPosFn(e);
    isDrawing = true;
    context.beginPath();
    context.moveTo(pos.x, pos.y);
  };
  const onMove = getPosFn => e => {
    if (isDrawing) {
      const pos = getPosFn(e);
      context.lineTo(pos.x, pos.y);
      context.stroke();
    }
  };

  const onEnd = () => {
    isDrawing = false;
  };

  canvas.onmousedown = onStartDraw(getMousePos);
  canvas.onmousemove = onMove(getMousePos);
  canvas.onmouseup = onEnd;

  canvas.addEventListener('touchstart', onStartDraw(getTouchPos), false);
  canvas.addEventListener('touchmove', onMove(getTouchPos), false);
  canvas.addEventListener('touchend', onEnd, false);
};

export default addDrawingTools;
