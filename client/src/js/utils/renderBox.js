/**
 * The function renders boxes with labels and scores on a canvas based on input data.
 * @param canvasRef - A reference to the canvas element on which the boxes will be rendered.
 * @param classThreshold - The minimum score threshold for a detected object to be displayed. Objects
 * with scores below this threshold will not be displayed.
 * @param boxes_data - An array of bounding box coordinates for detected objects in the format [x1, y1,
 * x2, y2]. Each set of four values represents the coordinates of the top-left and bottom-right corners
 * of a bounding box.
 * @param scores_data - An array of confidence scores for each detected object in the image.
 * @param classes_data - An array of integers representing the predicted class for each detected object
 * in the image.
 * @param ratios - The ratios parameter is an array of two values representing the scaling ratios for
 * the width and height of the canvas element. These ratios are used to convert the bounding box
 * coordinates from the model's output to the actual pixel coordinates on the canvas.
 */
export const renderBoxes = (
  canvasRef,
  classThreshold,
  boxes_data,
  scores_data,
  classes_data,
  ratios,
  result
) => {
  const ctx = canvasRef;
  ctx.innerHTML = `${result}`;
  // const ctx = canvasRef.getContext("2d");
  // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // const colors = new Colors();

  // const font = `${Math.max(
  //   Math.round(Math.max(ctx.canvas.width, ctx.canvas.height) / 40),
  //   14
  // )}px Arial`;
  // ctx.font = font;
  // ctx.textBaseline = "top";

  // for (let i = 0; i < scores_data.length; ++i) {
  //   if (scores_data[i] > classThreshold) {
  //     const klass = Labels[classes_data[i]];
  //     const color = colors.get(classes_data[i]);
  //     const score = (scores_data[i] * 100).toFixed(1);

  //     let [x1, y1, x2, y2] = boxes_data.slice(i * 4, (i + 1) * 4);
  //     x1 *= canvasRef.width * ratios[0];
  //     x2 *= canvasRef.width * ratios[0];
  //     y1 *= canvasRef.height * ratios[1];
  //     y2 *= canvasRef.height * ratios[1];
  //     const width = x2 - x1;
  //     const height = y2 - y1;

  //     ctx.fillStyle = Colors.hexToRgba(color, 0.2);
  //     ctx.fillRect(x1, y1, width, height);
  //     ctx.strokeStyle = color;
  //     ctx.lineWidth = Math.max(
  //       Math.min(ctx.canvas.width, ctx.canvas.height) / 200,
  //       2.5
  //     );
  //     ctx.strokeRect(x1, y1, width, height);

  //     ctx.fillStyle = color;
  //     const textWidth = ctx.measureText(klass + " - " + score + "%").width;
  //     const textHeight = parseInt(font, 10);
  //     const yText = y1 - (textHeight + ctx.lineWidth);
  //     ctx.fillRect(
  //       x1 - 1,
  //       yText < 0 ? 0 : yText,
  //       textWidth + ctx.lineWidth,
  //       textHeight + ctx.lineWidth
  //     );

  //     ctx.fillStyle = "#ffffff";
  //     ctx.fillText(klass + " - " + score + "%", x1 - 1, yText < 0 ? 0 : yText);
  //   }
  // }
};

/* `Colors` is a class that generates a palette of colors and provides a method to retrieve a
color from the palette based on an input index. It also includes a static method to convert a
hexadecimal color code to an RGBA color code with a specified alpha value. */
class Colors {
  constructor() {
    this.palette = [
      "#FF3838",
      "#FF9D97",
      "#FF701F",
      "#FFB21D",
      "#CFD231",
      "#48F90A",
      "#92CC17",
      "#3DDB86",
      "#1A9334",
      "#00D4BB",
      "#2C99A8",
      "#00C2FF",
      "#344593",
      "#6473FF",
      "#0018EC",
      "#8438FF",
      "#520085",
      "#CB38FF",
      "#FF95C8",
      "#FF37C7",
    ];
    this.n = this.palette.length;
  }

  get = (i) => this.palette[Math.floor(i) % this.n];

  static hexToRgba = (hex, alpha) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgba(${[
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ].join(", ")}, ${alpha})`
      : null;
  };
}
