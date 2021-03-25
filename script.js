const audio1 = document.getElementById("audio1");
const file = document.getElementById("fileupload");

const audioCtx = new AudioContext();

const container = document.getElementById("container");
const canvas = document.getElementById("canvas1");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

let audioSource;
let analyser;

const drawVisualizer = (bufferLength, x, barWidth, barHeight, dataArray) => {
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * 2;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((i * Math.PI * 4) / bufferLength);
    const hue = i * 15;
    ctx.fillStyle = "hsl(" + hue + ",100%, 50%)";
    ctx.fillRect(0, 0, barWidth, barHeight);

    x += barWidth;
    ctx.restore();
  }
};

container.addEventListener("click", () => {
  audio1.play();
  audioSource = audioCtx.createMediaElementSource(audio1);
  analyser = audioCtx.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioCtx.destination);
  analyser.fftSize = 1024;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const barWidth = canvas.width / 2 / bufferLength;
  let barHeight;
  let x;

  function animate() {
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    drawVisualizer(bufferLength, x, barWidth, barHeight, dataArray);

    requestAnimationFrame(animate);
  }
  animate();
});

file.addEventListener("change", function () {
  const files = this.files;
  audio1.src = URL.createObjectURL(files[0]);
  audio1.load();
  audio1.play();
});
