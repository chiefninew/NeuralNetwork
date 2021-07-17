BrowserFS.install(window);
BrowserFS.configure({
  fs: "LocalStorage"
}, function(e) {
  if (e) {
    throw e;
  }
});
var fs = require('fs');
let defaultData = {
  data: [
    {
      input: { r: 0, g: 0, b: 0 },
      output: [1]
    },
    {
      input: { r: 1, g: 1, b: 1 },
      output: [0]
    }
  ]
};
let contents = [];
fs.readFile('/learned.json', function(err, learnedData) {
  if(!learnedData) {
    fs.writeFile('/learned.json', JSON.stringify(defaultData), function(err) {
      if(err) {
        console.log('ERROR WRITING', err);
      }
    });
  }
});


fs.readFile('/learned.json', function(err, learnedData) {
  if(learnedData) {
    const learned = JSON.parse(learnedData.toString());
    if(learned && learned.data) {
      contents = learned.data;
      console.log('CONTENTS', contents);
    }
  }
});

if(!contents) {
  console.log('No Data Found.');
}

const network = new brain.NeuralNetwork();
network.train(contents);

const colorElem = document.getElementById('color');
const guessElem = document.getElementById('guess');
let color;
setRandomColor();

function setRandomColor() {
  color = {
    r: Math.random(),
    g: Math.random(),
    b: Math.random(),
  };
  const guess = network.run(color)[0];
  const guesColor = guess > 0.5 ? 'white' : 'black';
  guessElem.style.color = guesColor
  colorElem.style.backgroundColor = `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`;
  guessElem.innerHTML = `Text color should be ${guesColor}.`;
}

function chooseColor(value) {
  contents.push({
    input: color,
    output: [value],
  });
  setRandomColor();
}

function onSave() {
  console.log('DATA', contents);
  defaultData = {
    data: contents,
  };
  fs.writeFile('/learned.json', JSON.stringify(defaultData), function(err) {
    if(err) {
      console.log('ERROR WRITING', err);
    }
  });
  setRandomColor();
}