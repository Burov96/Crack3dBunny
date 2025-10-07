import * as PIXI from "pixi.js";

// Asynchronous IIFE
(async () => {
  //load the image
  const texture = await PIXI.Assets.load(
    "https://i.ibb.co/qLPV9SDJ/Gemini-Generated-Image-fq3lvcfq3lvcfq3l.png",
  );

  //custom izrezki
  //1
  const frame1Rect = new PIXI.Rectangle(80, 150, 420, 800);
  const texture1 = new PIXI.Texture({
    source: texture.source,
    frame: frame1Rect,
  });
  // const zayche1 = new PIXI.Sprite(texture1);

  //2
  const frame2Rect = new PIXI.Rectangle(550, 150, 450, 800);
  const texture2 = new PIXI.Texture({
    source: texture.source,
    frame: frame2Rect,
  });
  const zayche2 = new PIXI.Sprite(texture2);

  // Create a PixiJS application.
  const app = new PIXI.Application();
  app.stage.addChild(zayche2);

  // Intialize the application.
  await app.init({ background: "#123d", resizeTo: window });

  //animation:
  // app.ticker.add((time)=>{
  //   zayche2.rotation +=0.01*time.deltaTime
  // })

  zayche2.scale.set(0.2);
  zayche2.anchor.set(0.5);
  zayche2.x = app.screen.width / 2;
  zayche2.y = app.screen.height / 2;
  // Then adding the application's canvas to the DOM body.
  document.body.appendChild(app.canvas);
})();
