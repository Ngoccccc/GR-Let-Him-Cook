function generateRandom() {
  let randomNumber = Math.floor(Math.random() * 1000000) + Date.now();
  return randomNumber;
}

export default generateRandom;
