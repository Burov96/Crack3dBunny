import * as PIXI from "pixi.js";
interface Bonuses {
  sprite: PIXI.Sprite;
  points: number;
  time: number;
}
(async () => {

  let skorostZaSpawnvaneNaGoodies: number = 3000;
  let maxItems: number = 2;
  let benTweaking: number = 0;
  let benWatching: number = 0;
  let benWatchReversing: number = 0;
  let benStill: number = 0;
  let animationSpeed: number = 18;
  let frameCounter: number = 0;
  let currentFrame: number = 0;
  let boost: boolean = false;
  let score: number = 0;
  let highscore: number = 0;
  let time: number = 5;
  let framesSinceLastSecond:number=0;
  let isHappyTriggered: boolean = false;
  let xSpeed:number=5;
  let ySpeed:number=4;
  let gameEnded:boolean=false;
  let menuShown = false;  
  let spawnInterval = null

  const manifest = {
    bundles: [
      {
        name: "game-assets",
        assets: {
          background: "https://i.ibb.co/Kczwj2gw/background2editted.png",
          textureStill:
            "https://i.ibb.co/qLPV9SDJ/Gemini-Generated-Image-fq3lvcfq3lvcfq3l.png",
          textureStill2: "https://i.ibb.co/MyMGn78d/still2.png",
          textureStill3: "https://i.ibb.co/Tx2hmyRH/still1.png",
          textureWalk1: "https://i.ibb.co/v4Z4RHKw/Walk1.png",
          textureWalk2: "https://i.ibb.co/HLPPcvrL/Walk2.png",
          textureWalk3: "https://i.ibb.co/VY6yjvdb/Walk3.png",
          textureOuch: "https://i.ibb.co/sdbtDWBj/ouch.png",
          watchTexture0R: "https://i.ibb.co/cXgZXqbp/watchR0.png",
          watchTexture1R: "https://i.ibb.co/QFYrs3JH/watchR1.png",
          watchTexture2R: "https://i.ibb.co/dwfd4b08/watchR2j.png",
          watchTexture4: "https://i.ibb.co/twNhVYyf/watchR34.png",
          happy43: "https://i.ibb.co/Z6T6kwPh/happy43.png",
          happy1r: "https://i.ibb.co/fdt1qVdg/happy1r.png",
          happy2r: "https://i.ibb.co/qYz1wdsx/happy2r.png",
          goodies: "https://i.ibb.co/9k8qcFGr/goodies.png",
          gameOver1: "https://i.ibb.co/ZpYbCBXb/game-over1.png",
          gameOver2: "https://i.ibb.co/3mW5L52f/game-over2.png",
          gameOver3: "https://i.ibb.co/twLr6pzd/game-over3.png",
          gameOver4: "https://i.ibb.co/fGTMdVvs/game-over4.png",
          gameOver5: "https://i.ibb.co/NnCJ1GhX/game-over5.png",
          gameOver6: "https://i.ibb.co/8nq3KNZn/game-over6.png",
        },
      },
    ],
  };

  await PIXI.Assets.init({ manifest });
  const textures = await PIXI.Assets.loadBundle("game-assets");

  const app = new PIXI.Application();
  await app.init({ background: "#123d", resizeTo: window });


  // upper text setting
  const scoreText = new PIXI.Text({
    text: `SCORE: ${score}`,
    style: {
      fontFamily: "Pixelify Sans",
      fontSize: 96,
      fill: 0xffffff,
    },
  });

  const timeText = new PIXI.Text({
    text: `${time}`,
    style: {
      fontFamily: "Pixelify Sans",
      fontSize: 156,
      fill: 0xffffff,
    },
  });

  const highScoreText = new PIXI.Text({
    text: `HI-SCORE: ${highscore}`,
    style: {
      fontFamily: "Pixelify Sans",
      fontSize: 96,
      fill: 0xffffff,
    },
  });

  scoreText.position.set(app.screen.width/50, 10);
  timeText.position.set(app.screen.width/2-90, 20);
  highScoreText.position.set(app.screen.width-app.screen.width/3, 10);
  app.stage.addChild(scoreText, highScoreText, timeText);

function createButton(text, x, y) {
  const btn = new PIXI.Container();
  btn.x = x;
  btn.y = y;
  btn.eventMode = 'static';
  btn.cursor = 'pointer';

    const bg = new PIXI.Graphics();
  bg.beginFill(0x48bb78);
  bg.lineStyle(3, 0x2f855a, 1);
  bg.drawRoundedRect(-80, -20, 160, 45, 8);
  bg.endFill();
  btn.addChild(bg);

    const btnText = new PIXI.Text({
    text: text,
    style: {
      fontFamily: 'Pixelify Sans',
      fontSize: 28,
      fill: 0xffffff,
    },
  });
  btnText.anchor.set(0.5);
  btn.addChild(btnText);

    btn.on('pointerover', () => {
    bg.tint = 0xcccccc;
  });
  btn.on('pointerout', () => {
    bg.tint = 0xffffff;
  });

  return btn;
}

function createIconButton(icon, x, y, color) {
  const btn = new PIXI.Container();
  btn.x = x;
  btn.y = y;
  btn.eventMode = 'static';
  btn.cursor = 'pointer';

    const bg = new PIXI.Graphics();
  bg.beginFill(color);
  bg.lineStyle(2, 0xffffff, 1);
  bg.drawCircle(0, 0, 25);
  bg.endFill();
  btn.addChild(bg);

    const iconText = new PIXI.Text({
    text: icon,
    style: {
      fontFamily: 'Pixelify Sans',
      fontSize: 20,
      fill: 0xffffff,
      fontWeight: 'bold',
    },
  });
  iconText.anchor.set(0.5);
  btn.addChild(iconText);

    btn.on('pointerover', () => {
    bg.scale.set(1.1);
  });
  btn.on('pointerout', () => {
    bg.scale.set(1);
  });

  return btn;
}

let menuContainer = null;  

function showMenu() {
  // Create container to hold all menu elements
  menuContainer = new PIXI.Container();
  
  // Create overlay
  const overlay = new PIXI.Graphics();
  overlay.beginFill(0x000000, 0.7);
  overlay.drawRect(0, 0, app.screen.width, app.screen.height);
  overlay.endFill();
  menuContainer.addChild(overlay);

  // Menu background
  const menuWidth = 400;
  const menuHeight = 350;
  const menuBg = new PIXI.Graphics();
  menuBg.beginFill(0x2d3748);
  menuBg.lineStyle(4, 0x4a5568, 1);
  menuBg.drawRect(0, 0, menuWidth, menuHeight);
  menuBg.endFill();
  menuBg.x = (app.screen.width - menuWidth) / 2;
  menuBg.y = (app.screen.height - menuHeight) / 2;
  menuContainer.addChild(menuBg);

  // Title text
  const titleText = new PIXI.Text({
    text: 'GAME OVER',
    style: {
      fontFamily: 'Pixelify Sans',
      fontSize: 48,
      fill: 0xffffff,
    },
  });
  titleText.anchor.set(0.5);
  titleText.position.set(menuBg.x + menuWidth / 2, menuBg.y + 60);
  menuContainer.addChild(titleText);

  // Score display
  const finalScoreText = new PIXI.Text({
    text: `Score: ${score}\nBest: ${highscore}`,
    style: {
      fontFamily: 'Pixelify Sans',
      fontSize: 32,
      fill: 0xffd700,
      align: 'center',
    },
  });
  finalScoreText.anchor.set(0.5);
  finalScoreText.position.set(menuBg.x + menuWidth / 2, menuBg.y + 130);
  menuContainer.addChild(finalScoreText);

  // Restart button - NOW CALLS resetGame()
  const restartBtn = createButton('RESTART', menuBg.x + menuWidth / 2, menuBg.y + 210);
  restartBtn.on('pointerdown', () => {
    resetGame();  // ← Changed from location.reload()
  });
  menuContainer.addChild(restartBtn);

  // LinkedIn button
  const linkedinBtn = createIconButton('in', menuBg.x + menuWidth / 2 - 80, menuBg.y + 280, 0x0077b5);
  linkedinBtn.on('pointerdown', () => {
    window.open('https://www.linkedin.com/in/teodor-burov-b5ba12bb/', '_blank');
  });
  menuContainer.addChild(linkedinBtn);

  const githubBtn = createIconButton('GH', menuBg.x + menuWidth / 2 + 80, menuBg.y + 280, 0x333333);
  githubBtn.on('pointerdown', () => {
    window.open('https://github.com/Burov96', '_blank');
  });
  menuContainer.addChild(githubBtn);

  app.stage.addChild(menuContainer);
}


function resetGame() {
    score = 0;
    time = 45;
    gameEnded = false;
    menuShown = false;
  
    currentAnimation = still;
    currentFrame = 0;
    frameCounter = 0;
    framesSinceLastSecond = 0;
  
    benTweaking = 0;
    benWatching = 0;
    benWatchReversing = 0;
    benStill = 0;
    
    current.x = app.screen.width / 2;
    current.y = app.screen.height / 2;

    activeGoodies.forEach(goodie => {
    app.stage.removeChild(goodie.sprite);
  });
    activeGoodies.length = 0;    
    timeText.text = `${time}`;
    timeText.position.set(app.screen.width/2-90, 20);    scoreText.text = `SCORE: ${score}`;
  
    if (menuContainer) {
    app.stage.removeChild(menuContainer);
    menuContainer = null;
  }
}


  const visualize = (
    xStart: number,
    yStart: number,
    width: number,
    height: number,
    source: PIXI.TextureSource,
    scale: number,
    x: number,
    y: number
  ): void => {
    const frame = new PIXI.Rectangle(xStart, yStart, width, height);
    const texture = new PIXI.Texture({
      source: source.source,
      frame: frame,
    });
    const sprite = new PIXI.Sprite(texture);
    app.stage.addChild(sprite);
    sprite.scale.set(scale);
    sprite.anchor.set(0.5);
    sprite.x = app.screen.width / x;
    sprite.y = app.screen.height / y;
  };

  const cutToSprite = (
    xStart: number,
    yStart: number,
    width: number,
    height: number,
    source: PIXI.TextureSource,
    r?: boolean
  ): PIXI.Sprite => {
    const frame = new PIXI.Rectangle(xStart, yStart, width, height);
    const texture = new PIXI.Texture({
      source: source.source,
      frame: frame,
    });
    const res: PIXI.Sprite = new PIXI.Sprite(texture);
    if (r) {
      res.scale.x = -1;
    }
    return res;
  };

  const renderSprite = (
    sprite: PIXI.Sprite,
    scale: number = 0.2,
    x: number = 2,
    y: number = 2
  ) => {
    app.stage.addChild(sprite);
    sprite.scale.set(scale);
    sprite.anchor.set(0.5);
    sprite.x = app.screen.width / x;
    sprite.y = app.screen.height / y;
  };

  const cutMultiple = (
    configs: Array<[number, number, number, number, string, boolean?]>,
    textures: any
  ): PIXI.Sprite[] => {
    return configs.map(([x, y, w, h, tex, flip]) =>
      cutToSprite(x, y, w, h, textures[tex], flip)
    );
  };

  const zaycheStill1 = cutToSprite(80, 150, 420, 800, textures.textureStill);

  const happy = cutMultiple(
    [
      [550, 150, 450, 900, "happy1r"],
      [550, 150, 450, 900, "happy2r"],
      [550, 100, 450, 1000, "happy43"],
    ],
    textures
  );

  const watch = cutMultiple(
    [
      [550, 150, 450, 900, "watchTexture0R"],
      [550, 150, 450, 900, "watchTexture1R"],
      [550, 150, 450, 900, "watchTexture2R"],
      [550, 150, 450, 900, "watchTexture4"],
      [550, 150, 450, 900, "watchTexture4"],
    ],
    textures
  );

  const walkLeft = cutMultiple(
    [
      [550, 150, 450, 800, "textureWalk1"],
      [550, 150, 450, 800, "textureWalk2"],
      [550, 150, 450, 800, "textureWalk3"],
    ],
    textures
  );

  const walkRight = cutMultiple(
    [
      [80, 150, 420, 800, "textureWalk1", true],
      [80, 150, 420, 800, "textureWalk2", true],
      [80, 150, 420, 800, "textureWalk3", true],
    ],
    textures
  );

  const still = cutMultiple(
    [
      [80, 150, 420, 800, "textureStill2"],
      [80, 150, 420, 800, "textureStill3"],
      [550, 150, 450, 800, "textureStill2"],
    ],
    textures
  );

  const gameOver = cutMultiple(
    [
      [0, 0, 1000, 1080, "gameOver1"],
      [0, 0, 1000, 1080, "gameOver2"],
      [0, 0, 1000, 1080, "gameOver3"],
      [0, 0, 1000, 1080, "gameOver4"],
      [0, 0, 1000, 1080, "gameOver5"],
      [0, 0, 1000, 1080, "gameOver6"],
    ],
    textures
  );

  const ouch = cutMultiple(
    [
      [550, 150, 450, 800, "textureOuch"],
      [80, 150, 420, 800, "textureOuch"],
    ],
    textures
  );

  const currentMasiv = cutMultiple(
    [
      [80, 150, 420, 800, "textureStill"],
      [80, 150, 420, 800, "textureStill"],
      [80, 150, 420, 800, "textureStill"],
    ],
    textures
  );

  const morkov = cutToSprite(0, 0, 705, 650, textures.goodies);
  const zelka = cutToSprite(0, 600, 420, 500, textures.goodies);
  const qgodka = cutToSprite(650, 500, 400, 550, textures.goodies);
  const chasovnik = cutToSprite(700, 0, 370, 470, textures.goodies);

  const goodieTypes: Bonuses[] = [
    { sprite: morkov, points: 10, time: 0 },
    { sprite: zelka, points: 5, time: 2 },
    { sprite: qgodka, points: 15, time: 0 },
    { sprite: chasovnik, points: 0, time: 10 },
  ];
  const activeGoodies: Array<{ sprite: PIXI.Sprite; type: Bonuses }> = [];

  const spawnGoodie = () => {
      if (gameEnded) return;  
    const type = goodieTypes[Math.floor(Math.random() * goodieTypes.length)];
    const goodie = new PIXI.Sprite(type.sprite.texture);

    goodie.anchor.set(0.5);
    goodie.scale.set(0.13);

    goodie.x = Math.random() * (app.screen.width - 100) + 50;
    goodie.y = Math.random() * (app.screen.height - 100) + 50;

    app.stage.addChild(goodie);
    activeGoodies.push({ sprite: goodie, type });
  };

  spawnInterval = setInterval(() => {
    if (activeGoodies.length < maxItems&& !gameEnded) {
      spawnGoodie();
    }
  }, skorostZaSpawnvaneNaGoodies);

  const walk = [...walkLeft, ...walkRight];
  const watchReverse = [...watch].reverse();

  const current = new PIXI.Sprite(zaycheStill1.texture);

    const background = new PIXI.Sprite(textures.background);
  background.width = app.screen.width;
  background.height = app.screen.height;
  app.stage.addChildAt(background, 0);


  renderSprite(current);


  interface pressed {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
  }
  let keys: pressed = {
    up: false,
    down: false,
    left: false,
    right: false,
  };


    window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") keys.right = true;
    if (e.key === "ArrowLeft") keys.left = true;
    if (e.key === "ArrowUp") keys.up = true;
    if (e.key === "ArrowDown") keys.down = true;
  });
  window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") keys.right = false;
    if (e.key === "ArrowLeft") keys.left = false;
    if (e.key === "ArrowUp") keys.up = false;
    if (e.key === "ArrowDown") keys.down = false;
  });

  let currentAnimation: PIXI.Sprite[];

app.ticker.add((ticker) => {
  if (time <= 0 && !gameEnded) {
    gameEnded = true;
    currentAnimation = gameOver;
    currentFrame = 0;
    frameCounter = 0;
    timeText.text = 'GAME OVER';
    timeText.position.set(app.screen.width/3-50, app.screen.height/2);
    
    setTimeout(() => {
      if (!menuShown) {
        showMenu();
        menuShown = true;
      }
    }, 2000);
  }

  if (gameEnded) {
    frameCounter += ticker.deltaTime;
    if (frameCounter > animationSpeed) {
      frameCounter = 0;
      currentFrame++;
      if (currentFrame >= gameOver.length) {
        currentFrame = gameOver.length - 1;  
      }
    }
    const sourceSprite = currentAnimation[currentFrame];
    current.texture = sourceSprite.texture;
    return;  
  }

  const playerBounds = current.getBounds();
  activeGoodies.forEach((goodie, index) => {
    const goodieBounds = goodie.sprite.getBounds();
    const isColliding =
      playerBounds.x < goodieBounds.x + goodieBounds.width &&
      playerBounds.x + playerBounds.width > goodieBounds.x &&
      playerBounds.y < goodieBounds.y + goodieBounds.height &&
      playerBounds.y + playerBounds.height > goodieBounds.y;
    if (isColliding) {
      score += goodie.type.points;
      time += goodie.type.time;
      app.stage.removeChild(goodie.sprite);
      activeGoodies.splice(index, 1);
      isHappyTriggered = true;
      benTweaking = 0;
      benStill = 0;
      benWatching = 0;
      benWatchReversing = 0;
      setTimeout(
        () => {
          isHappyTriggered = false;
        },
        50 * (1000 / 60)
      );
    }
  });

  if(score >= highscore) {
    highscore = score;
  }
  scoreText.text = `Score: ${score}`;
  highScoreText.text = `HI-SCORE: ${highscore}`;

  framesSinceLastSecond += ticker.deltaTime;
  if(framesSinceLastSecond >= 60) {
    time--;
    timeText.text = `${time}`;
    framesSinceLastSecond = 0;
  }

  let desiredScale = 0.3;
  let isMoving = false;

  if (keys.right) {
    benStill = 0;
    benWatchReversing = 0;
    benWatching = 0;
    benTweaking = 0;
    desiredScale *= -1;
    if (current.x > app.screen.width - 18) {
      current.x = 0;
    }
    current.x += xSpeed * ticker.deltaTime;
    isMoving = true;
  }

  if (keys.left) {
    benStill = 0;
    benWatchReversing = 0;
    benWatching = 0;
    benTweaking = 0;
    current.x -= xSpeed * ticker.deltaTime;
    if (current.x < 18) {
      current.x = app.screen.width;
    }
    isMoving = true;
  }

  if (keys.up) {
    benStill = 0;
    benWatchReversing = 0;
    benWatching = 0;
    benTweaking = 0;
    if (current.y > 60) {
      current.y -= ySpeed * ticker.deltaTime;
      isMoving = true;
    }
  }

  if (keys.down) {
    benStill = 0;
    benWatchReversing = 0;
    benWatching = 0;
    benTweaking = 0;
    if (current.y < app.screen.height - 60) {
      current.y += ySpeed * ticker.deltaTime;
      isMoving = true;
    }
  }

  if (isMoving && !isHappyTriggered) {
    currentAnimation = walk;
    animationSpeed = 18;
  } else if (isHappyTriggered) {
    currentAnimation = happy;
    animationSpeed = 18;
  } else {
    currentAnimation = still;
  }

  if (isHappyTriggered) {
    currentAnimation = happy;
    animationSpeed = 18;
  }
  
  frameCounter += ticker.deltaTime;

  if (frameCounter > animationSpeed) {
    frameCounter = 0;
    currentFrame++;
  }
  if (currentFrame >= currentAnimation.length) {
    currentFrame = 0;
  }

  if (currentAnimation == still) {
    benTweaking += ticker.deltaTime;
    if (benTweaking > 7 * 60) {
      currentAnimation = currentMasiv;
      benStill += ticker.deltaTime;
    }
    if (benStill > 3 * 60) {
      animationSpeed = 30;
      currentAnimation = watch;
    }
  }
  
  if (currentAnimation == watch) {
    benWatching += ticker.deltaTime;
    if (benWatching > 1 * 60) {
      currentAnimation = watchReverse;
    }
  }
  
  if (currentAnimation === watchReverse) {
    benWatchReversing += ticker.deltaTime;
    if (benWatchReversing > 1 * 60) {
      currentAnimation = still;
      benStill = 0;
      benWatchReversing = 0;
      benWatching = 0;
      benTweaking = 0;
      animationSpeed = 18;
    }
  }

  const sourceSprite = currentAnimation[currentFrame];
  current.texture = sourceSprite.texture;
  current.scale.x = sourceSprite.scale.x * desiredScale;
});

  

  document.body.appendChild(app.canvas);
})();



const comments = `
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
