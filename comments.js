const comments = `

  // const timeText = new PIXI.Text({
  //   text: 'time',
  //   style: {
  //     fontFamily: "VT323",
  //     fontSize: app.screen.width * 0.1,
  //     fill: 0xffffff,
  //   },
  // });


  // if(framesSinceLastSecond >= 60) {    //tova e na red 875 predi da go premestq
  //   time--;
  //   timeText.text = 'time';
  //   framesSinceLastSecond = 0;
  // }


  // renderSprite(morkov, 0.13, 1 + Math.random(), 1 + 1 + Math.random());
  // renderSprite(zelka, 0.13, 1 + Math.random(), 1 + 1 + Math.random());
  // renderSprite(qgodka, 0.13, 1 + Math.random(), 1 + 1 + Math.random());
  // renderSprite(chasovnik, 0.13, 1 + Math.random(), 1 + 1 + Math.random());

  // const happy1rSprite = cutToSprite(550, 150, 450, 900, textures.happy1r);
  // const happy2rSprite = cutToSprite(550, 150, 450, 900, textures.happy2r);
  // const happy43SpriteR = cutToSprite(550, 100, 450, 1000, textures.happy43);
  // // const happy43SpriteL = cutToSprite(80, 150, 480, 800, textures.happy43, true);
  // const happy: PIXI.Sprite[] = [
  //   happy1rSprite,
  //   happy2rSprite,
  //   happy43SpriteR,
  //   // happy43SpriteL,
  // ];

  // const watchTexture0RSprite: PIXI.Sprite = cutToSprite(
  //   550,
  //   150,
  //   450,
  //   900,textures.
  //   watchTexture0R
  // );
  // const watchTexture1RSprite: PIXI.Sprite = cutToSprite(
  //   550,
  //   150,
  //   450,
  //   900,textures.
  //   watchTexture1R
  // );
  // const watchTexture2RSprite: PIXI.Sprite = cutToSprite(
  //   550,
  //   150,
  //   450,
  //   900,textures.
  //   watchTexture2R
  // );
  // const watchTexture4Sprite: PIXI.Sprite = cutToSprite(
  //   550,
  //   150,
  //   450,
  //   900,textures.
  //   watchTexture4
  // );
  // const watchTexture4SpriteCopy: PIXI.Sprite = cutToSprite(
  //   550,
  //   150,
  //   450,
  //   900,textures.
  //   watchTexture4
  // );
  // const watch: PIXI.Sprite[] = [
  //   watchTexture0RSprite,
  //   watchTexture1RSprite,
  //   watchTexture2RSprite,
  //   watchTexture4Sprite,
  //   watchTexture4SpriteCopy,
  // ];
  // const watchReverse: PIXI.Sprite[] = [
  //   watchTexture4SpriteCopy,
  //   watchTexture4Sprite,
  //   watchTexture2RSprite,
  //   watchTexture1RSprite,
  //   watchTexture0RSprite,
  // ];

  // const walkLeft1 = cutToSprite(550, 150, 450, 800, textures.textureWalk1);
  // const walkLeft2 = cutToSprite(550, 150, 450, 800, textures.textureWalk2);
  // const walkLeft3 = cutToSprite(550, 150, 450, 800, textures.textureWalk3);
  // const walkLeft: PIXI.Sprite[] = [walkLeft1, walkLeft2, walkLeft3];

  // // const walkRight1 = cutToSprite(80, 150, 420, 800, textures.textureWalk1);
  // // const walkRight2 = cutToSprite(80, 150, 420, 800, textures.textureWalk2);
  // // const walkRight3 = cutToSprite(80, 150, 420, 800, textures.textureWalk3);
  // const walkRight1 = cutToSprite(80, 150, 420, 800, textures.textureWalk1, true);
  // const walkRight2 = cutToSprite(80, 150, 420, 800, textures.textureWalk2, true);
  // const walkRight3 = cutToSprite(80, 150, 420, 800, textures.textureWalk3, true);
  // const walkRight: PIXI.Sprite[] = [walkRight1, walkRight2, walkRight3];

  // const walk: PIXI.Sprite[] = [
  //   walkLeft1,
  //   walkLeft2,
  //   walkLeft3,
  //   walkRight1,
  //   walkRight2,
  //   walkRight3,
  // ];

  // const current2 = cutToSprite(80, 150, 420, 800, textures.textureStill);
  // const current3 = cutToSprite(80, 150, 420, 800, textures.textureStill);
  // const zaycheStill2 = cutToSprite(80, 150, 420, 800, textures.textureStill2);
  // const zaycheStill3 = cutToSprite(80, 150, 420, 800, textures.textureStill3);
  // const zaycheStill4 = cutToSprite(550, 150, 450, 800, textures.textureStill2);
  // // const zaycheStill5 = cutToSprite(550, 150, 450, 800, textures.textureStill3);
  // const currentMasiv: PIXI.Sprite[] = [zaycheStill1, current2, current3];
  // const still: PIXI.Sprite[] = [
  //   // current,
  //   zaycheStill2,
  //   zaycheStill3,
  //   zaycheStill4,
  //   // zaycheStill5,
  // ];

  // const ouch1 = cutToSprite(550, 150, 450, 800, textures.textureOuch);
  // const ouch2 = cutToSprite(80, 150, 420, 800, textures.textureOuch);
  // const ouch: PIXI.Sprite[] = [ouch1, ouch2];

const frame1Rect = new PIXI.Rectangle(80, 150, 420, 800);
const texture1 = new PIXI.Texture({
      source: textureStill.source,
      frame: frame1Rect,
    });
    const zayche1 = new PIXI.Sprite(texture1);
  
    const frame2Rect = new PIXI.Rectangle(550, 150, 450, 800);
    const texture2 = new PIXI.Texture({
          source: textureStill.source,
          frame: frame2Rect,
          });
          const zayche2 = new PIXI.Sprite(texture2);
          app.stage.addChild(zayche1);
          app.stage.addChild(zayche2);

          zayche1.scale.set(0.2);
          zayche1.anchor.set(0.5);
          zayche1.x = app.screen.width / 1.5;
          zayche1.y = app.screen.height / 2;
        
          zayche2.scale.set(0.2);
          zayche2.anchor.set(0.5);
          zayche2.x = app.screen.width / 2;
          zayche2.y = app.screen.height / 2;

              // if (isHappy) {
    //   currentAnimation = happy;
    // } else if (isHurt) {
    //   currentAnimation = ouch;
    // } else if (isMovingRight) {
    //   currentAnimation = walk;
    //   desiredScale *= -1;
    //   if (current.x > app.screen.width - 18) {
    //     current.x = 0;
    //   }
    //   // current.scale.x = 0.3;
    //   current.x += 5;
    // } else if (isMovingLeft) {
    //   currentAnimation = walk;
    //   // current.scale.x = 0.3;
    //   current.x -= 5;
    //   if (current.x < 18) {
    //     current.x = app.screen.width;
    //   }
    // }
    // if (isMovingDown) {
    //   if (current.y < app.screen.height - 60) {
    //     console.log(current.y);
    //     currentAnimation = walk;
    //     current.y += 3;
    //   }
    // } else if (isMovingUp) {
    //   if (current.y > 60) {
    //     console.log(current.y);
    //     currentAnimation = walk;
    //     current.y -= 3;
    //   }
    // }


      // let stayStill: boolean = false;
  // let isMovingRight: boolean = false;
  // let isMovingLeft: boolean = false;
  // let isMovingUp: boolean = false;
  // let isMovingDown: boolean = false;
  // let isHappy: boolean = false;
  // let isHurt: boolean = false;
      `;
