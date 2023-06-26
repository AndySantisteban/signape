import * as tf from "@tensorflow/tfjs";
import { Labels } from "./labels";

const preprocess = (source, modelWidth, modelHeight) => {
  const input = tf.tidy(() => {
    const img = tf.browser.fromPixels(source);
    const [h, w] = img.shape.slice(0, 2);
    const maxSize = Math.max(w, h);
    const imgPadded = img.pad([
      [0, maxSize - h],
      [0, maxSize - w],
      [0, 0],
    ]);

    return tf.image
      .resizeBilinear(imgPadded, [modelWidth, modelHeight])
      .div(255.0)
      .expandDims(0);
  });

  return [input];
};

/**
 * The `detectVideo` function uses a YOLOv5 model to detect objects in a video stream and render
 * bounding boxes around the detected objects on a canvas.
 * @param vidSource - The video source, which is likely a video element.
 * @param model - The YOLOv5 model used for object detection.
 * @param classThreshold - The minimum confidence threshold for a detected object to be considered a
 * valid detection. Objects with a confidence score below this threshold will be ignored.
 * @param canvasRef - A reference to the canvas element on which the bounding boxes will be rendered.
 */

export const detectVideo = (
  vidSource,
  model,
  classThreshold,
  canvasRef,
  func
) => {
  const [modelWidth, modelHeight] = model.inputShape.slice(1, 3);
  const detectFrame = () => {
    setTimeout(async () => {
      if (vidSource.videoWidth === 0 && vidSource.srcObject === null) {
        const ctx = canvasRef.getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        return;
      }
      tf.engine().startScope();

      const [input] = preprocess(vidSource, modelWidth, modelHeight);
      await model.net.executeAsync(input).then((res) => {
        const [boxes, scores, classes] = res.slice(0, 3);
        const classes_data = classes.dataSync();
        if (func) func(Labels[classes_data[0]]);
        tf.dispose(res);
      });
      requestAnimationFrame(detectFrame);
      tf.engine().endScope();
    }, 1000);
  };

  detectFrame();
};
