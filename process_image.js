import Jimp from 'jimp';

async function processImage() {
  try {
    const image = await Jimp.read('c:/Users/mikap/Documents/Nuvio-Wiki/docs/public/logo.png');
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    
    console.log(`Loaded image: ${width}x${height}`);
    
    // Inspect corners
    const corners = [
      { x: 0, y: 0 },
      { x: width - 1, y: 0 },
      { x: 0, y: height - 1 },
      { x: width - 1, y: height - 1 }
    ];
    
    for (const corner of corners) {
      const pixelColor = image.getPixelColor(corner.x, corner.y);
      const rgba = Jimp.intToRGBA(pixelColor);
      console.log(`Corner (${corner.x}, ${corner.y}): R=${rgba.r}, G=${rgba.g}, B=${rgba.b}, A=${rgba.a}`);
    }

    // Let's replace white background with transparency
    // White background is typically R=255, G=255, B=255, A=255 (or near white)
    let modifiedCount = 0;
    image.scan(0, 0, width, height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      const a = this.bitmap.data[idx + 3];
      
      // If it is very close to white, make it transparent
      // We can use a threshold of 240 to be safe (since compressed PNGs might have artifacts near borders)
      if (r > 240 && g > 240 && b > 240) {
        this.bitmap.data[idx + 3] = 0; // Set alpha to 0
        modifiedCount++;
      }
    });
    
    console.log(`Modified ${modifiedCount} pixels to transparent`);
    
    if (modifiedCount > 0) {
      await image.writeAsync('c:/Users/mikap/Documents/Nuvio-Wiki/docs/public/logo.png');
      console.log('Successfully wrote transparent image back to logo.png');
    }
  } catch (err) {
    console.error('Error processing image:', err);
  }
}

processImage();
