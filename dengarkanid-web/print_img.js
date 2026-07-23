const fs = require('fs');
const Jimp = require('jimp');

Jimp.read('/Users/aziz/.gemini/antigravity-ide/brain/7c625cbb-7699-4887-a89a-dbcbfa48876f/media__1784795674762.png').then(img => {
  img.resize(20, 20);
  let ascii = '';
  for(let y=0; y<20; y++) {
    for(let x=0; x<20; x++) {
      const color = Jimp.intToRGBA(img.getPixelColor(x, y));
      if(color.a < 128) ascii += ' ';
      else if(color.r > 200 && color.g > 200 && color.b > 200) ascii += '.';
      else ascii += '#';
    }
    ascii += '\n';
  }
  console.log(ascii);
}).catch(console.error);
