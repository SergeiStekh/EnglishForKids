export const siteDataArray = [
  './assets/images/abdomen.png',
  './assets/images/animals.png',
  './assets/images/animals.svg',
  './assets/images/antelope.png',
  './assets/images/apple.png',
  './assets/images/arrow-back-hover.svg',
  './assets/images/arrow-back.svg',
  './assets/images/aunt.png',
  './assets/images/back.png',
  './assets/images/background.jpg',
  './assets/images/banana.png',
  './assets/images/bat.png',
  './assets/images/bear.png',
  './assets/images/blizzard.png',
  './assets/images/body-background.svg',
  './assets/images/body.png',
  './assets/images/body.svg',
  './assets/images/bonnet.png',
  './assets/images/boot.png',
  './assets/images/bread.png',
  './assets/images/breeze.png',
  './assets/images/brother.png',
  './assets/images/bumper.png',
  './assets/images/burger.svg',
  './assets/images/cake.png',
  './assets/images/care.png',
  './assets/images/cars.png',
  './assets/images/cars.svg',
  './assets/images/category-background.png',
  './assets/images/category-background.svg',
  './assets/images/check_mark.svg',
  './assets/images/cheese.png',
  './assets/images/children.png',
  './assets/images/close.png',
  './assets/images/cock.png',
  './assets/images/despair.png',
  './assets/images/donkey.png',
  './assets/images/door.png',
  './assets/images/egg.png',
  './assets/images/elephant.png',
  './assets/images/family.png',
  './assets/images/family.svg',
  './assets/images/father.png',
  './assets/images/fear.png',
  './assets/images/feelings.png',
  './assets/images/feelings.svg',
  './assets/images/fog.png',
  './assets/images/food.png',
  './assets/images/food.svg',
  './assets/images/fox.png',
  './assets/images/fruits.png',
  './assets/images/fruits.svg',
  './assets/images/grandfather.png',
  './assets/images/grapefruit.png',
  './assets/images/hail.png',
  './assets/images/ham.png',
  './assets/images/hamster.png',
  './assets/images/hand.png',
  './assets/images/header-background-circle.svg',
  './assets/images/header-background-cloud1.svg',
  './assets/images/header-background-cloud2.svg',
  './assets/images/headlight.png',
  './assets/images/heart.png',
  './assets/images/heat.png',
  './assets/images/icon_rotate.svg',
  './assets/images/indicator.png',
  './assets/images/indifference.png',
  './assets/images/leg.png',
  './assets/images/lemon.png',
  './assets/images/lightning.png',
  './assets/images/loneliness.png',
  './assets/images/lose.png',
  './assets/images/madness.png',
  './assets/images/melon.png',
  './assets/images/mode-toggler-learn.svg',
  './assets/images/mode-toggler.svg',
  './assets/images/mother.png',
  './assets/images/mouth.png',
  './assets/images/mustard.png',
  './assets/images/neck.png',
  './assets/images/no.png',
  './assets/images/oops.png',
  './assets/images/orange.png',
  './assets/images/pear.png',
  './assets/images/play-button-hover.svg',
  './assets/images/play-button.svg',
  './assets/images/play.svg',
  './assets/images/potato.png',
  './assets/images/red-cross.svg',
  './assets/images/rotate.png',
  './assets/images/salmon.png',
  './assets/images/shame.png',
  './assets/images/sister.png',
  './assets/images/uncle.png',
  './assets/images/warning.png',
  './assets/images/watermelon.png',
  './assets/images/weather.png',
  './assets/images/weather.svg',
  './assets/images/wheel.png',
  './assets/images/win.png',
  './assets/images/wind.png',
  './assets/images/windscreen.png',
  './assets/images/yes.png',
  './assets/audio/finish-game.mp3',
  './assets/audio/loose-game.mp3',
  './assets/audio/rightAnswer.mp3',
  './assets/audio/wrongAnswer.mp3',
];

export function preCacheData(data: string[]) {
  data.forEach((dataEl) => {
    if (dataEl.endsWith('.png' || dataEl.endsWith('.svg'))) {
      const img: HTMLImageElement = new Image();
      img.src = dataEl;
    }
    if (dataEl.endsWith('.mp3')) {
      const audio: HTMLAudioElement = new Audio();
      audio.src = dataEl;
    }
  });
}
