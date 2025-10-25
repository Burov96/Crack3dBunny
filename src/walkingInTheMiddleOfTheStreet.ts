import * as PIXI from "pixi.js";
import { gsap } from "gsap";

interface Bonuses {
  sprite: PIXI.Sprite;
  points: number;
  time: number;
}
(async () => {

  let currentLevel = 1;
  let skorostZaSpawnvaneNaGoodies: number ;
  let clearGoodieTimeout:number ;
  let maxItems: number;
  let eagleSpeed: number;
  let eagleChaseSpeed: number;
  let ySpeed:number=4;
  let xSpeed:number=5;
  let benTweaking: number = 0;
  let benWatching: number = 0;
  let benWatchReversing: number = 0;
  let benStill: number = 0;
  let animationSpeed: number = 18;
  let frameCounter: number = 0;
  let currentFrame: number = 0;
  let score: number = 0;
  let highscore: number = 0;
  let time: number = 30;
  let framesSinceLastSecond:number=0;
  let orelPassedXsecondsAgo: number = 4;
  let boost: boolean = false;
  let isHappyTriggered: boolean = false;
  let gameEnded:boolean=false;
  let menuShown = false;  
  let orelPassed: boolean = false;
  let gameStarted: boolean = false;

  let pwnd = false;  
  let spawnInterval = null
  let activeEagle: { sprite: PIXI.Sprite; frame: number; reachedBunnyY: boolean } | null = null;
  let gameMusic:HTMLAudioElement;
  let menuMusic:HTMLAudioElement;
  let uoh:HTMLAudioElement;
  let currentAnimation: PIXI.Sprite[];


//audio 
  gameMusic=new Audio ('https://nu.vgmtreasurechest.com/soundtracks/bomberman-music-from/mlrdqvde/09.%20BGM1.mp3')
  gameMusic.loop = true;
  gameMusic.volume = 0.5;

  menuMusic=new Audio ('https://nu.vgmtreasurechest.com/soundtracks/bomberman-music-from/opjzvfpj/04.%20Title.mp3')
  menuMusic.loop = true;
  menuMusic.volume = 0.5;

  uoh=new Audio ('https://www.myinstants.com/media/sounds/uoh.mp3')
  uoh.loop = false;
  uoh.volume = 0.5;

  const manifest = {
    bundles: [
      {
        name: "game-assets",
        assets: {
          background: "https://i.ibb.co/Kczwj2gw/background2editted.png",
          textureStill:
            "https://i.ibb.co/pjsBTxyk/Gemini-Generated-Image-fq3lvcfq3lvcfq3l.png",
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
          orel: "https://i.ibb.co/s93fdkJG/eagle.png",
        },
      },
    ],
  };

  const levelConfig = {
  1: { xSpeed: 6, ySpeed: 5, eagleSpeed: 5, eagleChaseSpeed: 2, maxItems: 2, spawnRate: 3000, timeLimit: 30, skorostZaSpawnvaneNaGoodies: 5000,clearGoodieTimeout:5000 },
  2: { xSpeed: 7, ySpeed: 6, eagleSpeed: 6, eagleChaseSpeed: 3, maxItems: 3, spawnRate: 2500, timeLimit: 35, skorostZaSpawnvaneNaGoodies: 4000,clearGoodieTimeout:4000},
  3: { xSpeed: 8, ySpeed: 7, eagleSpeed: 7, eagleChaseSpeed: 4, maxItems: 4, spawnRate: 2000, timeLimit: 40, skorostZaSpawnvaneNaGoodies: 3000,clearGoodieTimeout:3500 },
  4: { xSpeed: 9, ySpeed: 8, eagleSpeed: 8, eagleChaseSpeed: 5, maxItems: 4, spawnRate: 1500, timeLimit: 45, skorostZaSpawnvaneNaGoodies: 2000,clearGoodieTimeout:3000},
};

function applyLevel(level: number) {
  const config = levelConfig[level];
  xSpeed = config.xSpeed;
  ySpeed = config.ySpeed;
  maxItems = config.maxItems;
  skorostZaSpawnvaneNaGoodies = config.spawnRate;
  clearGoodieTimeout = config.clearGoodieTimeout;
  time = config.timeLimit;
  
  clearInterval(spawnInterval);
  spawnInterval = setInterval(() => {
    if (activeGoodies.length < maxItems && !gameEnded) {
      spawnGoodie();
    }
  }, skorostZaSpawnvaneNaGoodies);
}

  await PIXI.Assets.init({ manifest });
  const textures = await PIXI.Assets.loadBundle("game-assets");

  const app = new PIXI.Application();
  await app.init({ background: "#123d", resizeTo: window });


  // upper text setting
  const scoreBoard = new PIXI.Text({
    text: `SCORE: ${score}`,
    style: {
      fontFamily: "VT323",
      fontSize: app.screen.width * 0.05,
      fill: 0xffffff,
    },
  });
    const levelText = new PIXI.Text({
    text: `LEVEL: ${currentLevel}`,
    style: {
      fontFamily: "VT323",
      fontSize: app.screen.width * 0.02,
      fill: 0xffffff,
    },
  });




  //trichislieto
  const timeOnesText = new PIXI.Text({
  text: "0",
  style: {
    fontFamily: "VT323",
    fontSize: app.screen.width * 0.1,
    fill: 0xffffff,
  },
});

const timeTensText = new PIXI.Text({
  text: "0",
  style: {
    fontFamily: "VT323",
    fontSize: app.screen.width * 0.1,
    fill: 0xffffff,
  },
});

const timeHundredsText = new PIXI.Text({
  text: "0",
  style: {
    fontFamily: "VT323",
    fontSize: app.screen.width * 0.1,
    fill: 0xffffff,
  },
});

  const highScoreText = new PIXI.Text({
    text: `HI-SCORE: ${highscore}`,
    style: {
      fontFamily: "VT323",
      fontSize: 96,
      fill: 0xffffff,
    },
  });
   const titleText = new PIXI.Text({
    text: '👾 Cracked Bunny 💀',
    style: {
      fontFamily: "VT323",
      fontSize: app.screen.width * 0.07,
      fill: 0xffffff,
    },
  });
  scoreBoard.position.set(app.screen.width/50, app.screen.width * 0.01);

      timeHundredsText.visible=false
      timeTensText.visible=false
      timeOnesText.visible=false
    timeHundredsText.anchor.set(0.5, 0);
    timeHundredsText.position.set(app.screen.width / 2 - 60, app.screen.width * 0.075);
  
    timeTensText.anchor.set(0.5, 0);
    timeTensText.position.set(app.screen.width / 2, app.screen.width * 0.075);

  timeOnesText.anchor.set(0.5, 0);
  timeOnesText.position.set(app.screen.width / 2 + 60, app.screen.width * 0.075);

  highScoreText.position.set(app.screen.width-app.screen.width/3, app.screen.width * 0.01);
  titleText.anchor.set(0.5,0)
  titleText.position.set(app.screen.width/2, app.screen.width * 0.09);
  levelText.position.set(app.screen.width * 0.03,app.screen.height-app.screen.width * 0.05);

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
      fontFamily: 'VT323',
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
      fontFamily: 'VT323',
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
      fontFamily: 'VT323',
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
      fontFamily: 'VT323',
      fontSize: 32,
      fill: 0xffd700,
      align: 'center',
    },
  });
  finalScoreText.anchor.set(0.5);
  finalScoreText.position.set(menuBg.x + menuWidth / 2, menuBg.y + 130);
  menuContainer.addChild(finalScoreText);

  const restartBtn = createButton('RESTART', menuBg.x + menuWidth / 2, menuBg.y + 210);
  restartBtn.on('pointerdown', () => {
    resetGame(); 
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
    gameMusic.volume = 0;
    menuMusic.currentTime = 0;
    menuMusic.volume = 0.5;
}

function resetGame() {
  currentLevel = 1;
  applyLevel(1);
  score = 0;
  time = 30; // промени от 3 на 30 (видях че си го оставил 3 :D)
  gameEnded = false;
  menuShown = false;
  pwnd = false;

  if (activeEagle) {
    app.stage.removeChild(activeEagle.sprite);
    activeEagle = null;
  }
  
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
  
  scoreBoard.text = `SCORE: ${score}`;

  if (menuContainer) {
    app.stage.removeChild(menuContainer);
    menuContainer = null;
  }
  
  timeDigitsEditor(true);
  timeHundredsText.position.set(app.screen.width / 2 - 60, app.screen.width * 0.075);
  timeTensText.position.set(app.screen.width / 2, app.screen.width * 0.075);
  timeOnesText.position.set(app.screen.width / 2 + 60, app.screen.width * 0.075);

  
  gsap.from([timeOnesText, timeTensText, timeHundredsText], {
    alpha: 0,
    y: "-=30",
    duration: 0.5,
    stagger: 0.1,
    ease: "power2.out",
    onStart: () => {
      previousTime = time;
      updateTimeDisplay(time, false);
    }
  });
  
  menuMusic.volume = 0;
  gameMusic.currentTime = 0;
  gameMusic.volume = 0.5;
  
  setTimeout(() => {
    spawnEagle();
  }, 5000);
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

  const orel = cutMultiple(
    [
      [0, 10, 500, 450, "orel", false],
      [0, 490, 580, 490, "orel", true],
      [500, 490, 580, 490, "orel", false],
      [500, 10, 580, 450, "orel", true],
    ],
    textures
  );

  const spawnEagle = () => {
  if (gameEnded || activeEagle || pwnd) return;

  const eagle = new PIXI.Sprite(orel[0].texture);
  eagle.anchor.set(0.5);
  eagle.scale.set(0.3);
  
  // Spawn от максимално Y (най-високо = 0)
  eagle.x = Math.random() * app.screen.width;
  eagle.y = 0;
  
  app.stage.addChild(eagle);
  activeEagle = { sprite: eagle, frame: 0, reachedBunnyY: false };
};

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
      if (gameEnded || !gameStarted) return;  
    const type = goodieTypes[Math.floor(Math.random() * goodieTypes.length)];
    const goodie = new PIXI.Sprite(type.sprite.texture);

    goodie.anchor.set(0.5);
    goodie.scale.set(0.2);

    goodie.x = Math.random() * (app.screen.width - 100) + 50;
    goodie.y = Math.random() * (app.screen.height - 100) + 50;

    app.stage.addChild(goodie);

  const goodieObj = { sprite: goodie, type };
  activeGoodies.push(goodieObj);

  setTimeout(() => {
    app.stage.removeChild(goodie);
    const idx = activeGoodies.indexOf(goodieObj);
    if (idx > -1) activeGoodies.splice(idx, 1);
  }, clearGoodieTimeout);
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

let previousTime = 30;

function updateTimeDisplay(newTime: number, isBonus: boolean = false) {
  const oldOnes = previousTime % 10;
  const oldTens = Math.floor((previousTime % 100) / 10);
  const oldHundreds = Math.floor(previousTime / 100);
  
  const newOnes = newTime % 10;
  const newTens = Math.floor((newTime % 100) / 10);
  const newHundreds = Math.floor(newTime / 100);
  
  const direction = isBonus ? -1 : 1;
  const yOffset = direction * 50;
  
  // 🎯 Дефинирай постоянните Y позиции
  const onesOriginalY = app.screen.width * 0.075;
  const tensOriginalY = app.screen.width * 0.075;
  const hundredsOriginalY = app.screen.width * 0.075;
  
  // newOnes ? timeOnesText.visible = true : timeOnesText.visible = false;
  newTens ? timeTensText.visible = true : timeTensText.visible = false;
  newHundreds ? timeHundredsText.visible = true : timeHundredsText.visible = false;

  if (oldOnes !== newOnes) {
    // 🎯 УБИЙ ПРЕДИШНИТЕ TWEENS
    gsap.killTweensOf(timeOnesText);
    
    gsap.fromTo(timeOnesText, 
      { y: onesOriginalY - yOffset, alpha: 0 },
      { 
        y: onesOriginalY,
        alpha: 1, 
        duration: 0.3,
        ease: "back.out(1.7)",
        onStart: () => {
          timeOnesText.text = newOnes.toString();
        }
      }
    );
  }
  
  if (oldTens !== newTens) {
    // 🎯 УБИЙ ПРЕДИШНИТЕ TWEENS
    gsap.killTweensOf(timeTensText);
    
    gsap.fromTo(timeTensText,
      { y: tensOriginalY - yOffset, alpha: 0 },
      { 
        y: tensOriginalY,
        alpha: 1, 
        duration: 0.3,
        delay: 0.05,
        ease: "back.out(1.7)",
        onStart: () => {
          timeTensText.text = newTens.toString();
        }
      }
    );
  }
  
  if (oldHundreds !== newHundreds) {
    // 🎯 УБИЙ ПРЕДИШНИТЕ TWEENS
    gsap.killTweensOf(timeHundredsText);
    
    gsap.fromTo(timeHundredsText,
      { y: hundredsOriginalY - yOffset, alpha: 0 },
      { 
        y: hundredsOriginalY,
        alpha: 1, 
        duration: 0.3,
        delay: 0.1,
        ease: "back.out(1.7)",
        onStart: () => {
          timeHundredsText.text = newHundreds.toString();
        }
      }
    );
  }
  
  previousTime = newTime;
}


function timeDigitsEditor (show:boolean, text?:string){
  timeOnesText.visible = show;
  timeTensText.visible = show;
  timeHundredsText.visible = show;
  if(text){
    timeTensText.visible=true;
    timeTensText.text=text
    timeTensText.anchor.set(0.5, 0);
    timeTensText.position.set(app.screen.width / 2, app.screen.height / 2);
  }
}

app.ticker.add((ticker) => {
    if (!gameStarted) return;
  const playerBounds = current.getBounds();

if (activeEagle && !gameEnded) {
  const eagle = activeEagle.sprite;
  
  activeEagle.frame++;
  if (activeEagle.frame > 15) {
    const nextOrelFrame = Math.floor(activeEagle.frame / 15) % orel.length;
    eagle.texture = orel[nextOrelFrame].texture;
    activeEagle.frame = 0;
  }
  
  if (!activeEagle.reachedBunnyY) {
    const dx = current.x - eagle.x;
    const dy = current.y - eagle.y; //tva nqma da mi trqbva za sq
    eagle.scale.x = Math.sign(dx) * Math.abs(eagle.scale.x) *-1;//obrushta mi orela v zavisimost na kude se dviji
  eagle.x += Math.sign(dx) * levelConfig[currentLevel].eagleChaseSpeed * ticker.deltaTime;
  eagle.y += levelConfig[currentLevel].eagleSpeed * ticker.deltaTime;

    if (eagle.y >= current.y) {
      activeEagle.reachedBunnyY = true;
    }
  } else {
    eagle.y += 4 * ticker.deltaTime;
  }
  
if (isColliding({ sprite: eagle })) {
  pwnd = true;
  gameEnded = true;
  currentAnimation = gameOver;
  currentFrame = 0;
  frameCounter = 0;
  uoh.currentTime = 0;
  uoh.volume = 0.5;
  uoh.play();
  
  timeDigitsEditor(false, "GAME OVER")

  gsap.from(timeTensText, {
    y: -100,
    alpha: 0,
    duration: 0.8,
    ease: "bounce.out"
  });
  
  
  setTimeout(() => {
    if (!menuShown) {
      gsap.to(timeTensText, {
        y: app.screen.height * 0.12,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          showMenu();
          menuShown = true;
        }
      });
    }
  }, 2000);
}

  if (eagle.y >= app.screen.height) {
    app.stage.removeChild(eagle);
    activeEagle = null;
    orelPassed = true;
    
    setTimeout(() => {
      orelPassed = false;
    }, orelPassedXsecondsAgo * 1000);
    
    const nextSpawnTime = (Math.random() * 6 + 1) * 1000;
    setTimeout(() => {
      spawnEagle();
    }, nextSpawnTime);
  }
}

  
  if ((time <= 0) && !gameEnded) {
    gameEnded = true;
    currentAnimation = gameOver;
    currentFrame = 0;
    frameCounter = 0;
    timeDigitsEditor(true,'TIME UP!')
  gsap.from(timeTensText, {
    scale: 0,
    alpha: 0,
    duration: 0.6,
    ease: "back.out(2)"
  });
  
  currentLevel = 1;
  
  setTimeout(() => {
    if (!menuShown) {
      gsap.to(timeTensText, {
        y: app.screen.height * 0.12,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          showMenu();
          menuShown = true;
        }
      });
    }
  }, 2000);
  }

  if (gameEnded || pwnd) {
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
    function isColliding(object:any):boolean{
      //if true, it means the obejct and the bunny colide
      const objectBounds = object.sprite.getBounds();
      const result = playerBounds.x < objectBounds.x + objectBounds.width &&
      playerBounds.x + playerBounds.width > objectBounds.x &&
      playerBounds.y < objectBounds.y + objectBounds.height &&
      playerBounds.y + playerBounds.height > objectBounds.y;
      return result
    }
  activeGoodies.forEach((goodie, index) => {
    if (isColliding(goodie)) {
      score += goodie.type.points;
      const oldTime = time;
      time += goodie.type.time;


      //animaciq na tochkite
          gsap.to(scoreBoard.scale, {
      x: 1.3,
      y: 1.3,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "back.out(1.7)"
    });

    //animaciq na vremeto
        if (goodie.type.time > 0) {
      updateTimeDisplay(time, true); // true = bonus, т.е. се качва
    }
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
  scoreBoard.text = `Score: ${score}`;
  highScoreText.text = `HI-SCORE: ${highscore}`;
  levelText.text = `LEVEL: ${currentLevel}`;


if (score >= currentLevel * 50 && currentLevel < 4) { 
  const oldLevel = currentLevel;
  currentLevel++;
  levelText.text = `LEVEL: ${currentLevel}`;
  
  // 🎯 Временен "LEVEL UP!" текст
  const levelUpText = new PIXI.Text({
  text: `LEVEL ${currentLevel}!`,
  style: {
    fontFamily: 'VT323',
    fontSize: app.screen.width * 0.12,
    fill: 0x00ff00,
    stroke: {           // 🎯 stroke е обект
      color: 0xffffff,  // цветът на stroke
      width: 4          // debелината (не strokeThickness)
    }
  },
});

  levelUpText.anchor.set(0.5);
  levelUpText.position.set(app.screen.width / 2, app.screen.height / 2);
  levelUpText.scale.set(0);
  app.stage.addChild(levelUpText);
  
  // 🎯 Timeline за цялата анимация
  const tl = gsap.timeline();
  
  // Текстът изскача
  tl.to(levelUpText.scale, {
    x: 1.2,
    y: 1.2,
    duration: 0.4,
    ease: "elastic.out(1, 0.6)"
  })
  // Леко се люшка
  .to(levelUpText, {
    rotation: 0.1,
    duration: 0.1,
    yoyo: true,
    repeat: 3,
    ease: "sine.inOut"
  }, "-=0.2")
  // Изчезва нагоре
  .to(levelUpText, {
    y: app.screen.height / 4,
    alpha: 0,
    duration: 0.4,
    ease: "power2.in",
    onComplete: () => {
      app.stage.removeChild(levelUpText);
    }
  }, "+=0.3");
  
  // Едновременно - pulse на UI елементите
  gsap.to([scoreBoard.scale, levelText.scale], {
    x: 1.3,
    y: 1.3,
    duration: 0.2,
    yoyo: true,
    repeat: 1,
    ease: "power2.inOut"
  });
  
  applyLevel(currentLevel);
}

  framesSinceLastSecond += ticker.deltaTime;


  if(framesSinceLastSecond >= 60) {
  time--;
  updateTimeDisplay(time, false); // false = не е bonus, т.е. пада
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
    // overlay predi start game
  const overlay = new PIXI.Graphics();
  overlay.beginFill(0x000000, 0.7);
  overlay.drawRect(0, 0, app.screen.width, app.screen.height);
  overlay.endFill();
  app.stage.addChild(overlay);
  app.stage.addChild(titleText)

const startButton = createButton('START GAME', app.screen.width / 2, app.screen.height / 1.2);
app.stage.addChild(startButton);
  renderSprite(current);


startButton.on('pointerdown', () => {
  applyLevel(1);
  gameStarted = true;
  app.stage.removeChild(startButton, titleText, overlay);
  app.stage.addChild(scoreBoard, highScoreText, levelText);
  app.stage.addChild(timeHundredsText, timeTensText, timeOnesText);
  timeDigitsEditor(true);
  
  previousTime = time; 
  timeOnesText.text = (time % 10).toString();
  timeTensText.text = Math.floor((time % 100) / 10).toString();
  timeHundredsText.text = Math.floor(time / 100).toString();
  
  // Покажи нужните
  timeOnesText.visible = true;
  timeTensText.visible = true;
  time >= 100? timeHundredsText.visible = true:timeHundredsText.visible=false

  gameMusic.volume = 0.5;
  menuMusic.volume = 0;
  gameMusic.loop = true;
  menuMusic.loop = true;
  uoh.volume = 0;
  uoh.loop = false;

  
  gameMusic.play();
  menuMusic.play();
  uoh.play();
  
  
  setTimeout(() => {
    spawnEagle();
  }, 5000);
});

  document.body.appendChild(app.canvas);
})();


