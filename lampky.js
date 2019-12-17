const {sin, cos, PI, log, abs, sign, cbrt} = Math;
const cos2 = x => cos(x)*cos(x);
const sin2 = x => sin(x)*sin(x);
const nlog = x => log(abs(x+1)) * sign(x);
const ccbrt = x => cbrt(cbrt(x));

let referenceTime = null;
let freezeTime = false;
function update(timestamp) {
  if (referenceTime === null || freezeTime) referenceTime = timestamp;
  const lampkis = document.querySelectorAll('.lampka');
  for (let i=0; i<lampkis.length; ++i) {
    const color = getColorForIndex(i, (timestamp-referenceTime)/1000);
    lampkis[i].style.setProperty('--c', color);
  }
  window.requestAnimationFrame(update);
}

const config = {
  // Initial values here are treated funny:
  // if value is X, then default is 0 and range is 0..X
  // if value is -X, then default is 0 and range is -X..X
  LeftColor: 1,
  BrightnessWidth: PI/2,
  BrigthnessSpeed:  -100,
  RightColor: 1,
  HueWidth: PI/2,
  HueSpeed: -100,
  HueShiftSpeed: 1,
};

Object.entries(config).forEach(([name, value]) => {
  const div = document.createElement('div');
  div.className = "config-slider"
  const slider = document.createElement('input');
  slider.type = "range"
  if (value >= 0) {
    slider.min = 0
    slider.max = value
  } else {
    slider.min = value
    slider.max = -value
  }
  
  slider.step = "any"
  config[name] = slider.value = 0
  if (/Speed/.test(name)) {
    // Prevent glitching out during dragging. Still not lovely but what can you do...
    slider.addEventListener("mousedown", () => {
      freezeTime = true;
    });
    slider.addEventListener("mouseup", () => {
      freezeTime = false;
    })
  }
  slider.addEventListener("input", event => {
    const newValue = +slider.value
    config[name] = newValue
    saveConfig('default')
  });
  slider.addEventListener("contextmenu", event => {
      event.preventDefault();
      slider.value = config[name] = 0;
      saveConfig('default')

  });
  div.appendChild(document.createTextNode(name));
  div.appendChild(slider)
  document.body.appendChild(div);
});


/* nice preset

const config = {
  HueWidth: 0.5,
  HueSpeed: -2,
  LeftColor: 0,
  RightColor: 0.2,
  BrightnessWidth: 0.5,
  BrigthnessSpeed: -0.5,
  HueShiftSpeed: 0.1,
};
*/

function getColorForIndex(n, time) {
  // const brightness = cos(time) * cos(time);
  // return monoHex(brightness);

  const bValue = cos2(n*config.BrightnessWidth - time*cbrt(config.BrigthnessSpeed));

  const nValue = sin2(n*config.HueWidth - time*cbrt(config.HueSpeed));
  const color1 = HSVtoRGB(config.LeftColor + time * config.HueShiftSpeed, 1, bValue);
  const color2 = HSVtoRGB(config.RightColor + time * config.HueShiftSpeed, 1, bValue);
  const color = lerp(color1, color2, nValue);
  return fullColorHex(color);

}

requestAnimationFrame(update);


function saveConfig(key) {
  localStorage.setItem(`preset-${key}`, JSON.stringify(config));
}

function loadConfig(key) {
  let savedConfig = localStorage.getItem(`preset-${key}`);
  if (savedConfig) {
    Object.assign(config, JSON.parse(savedConfig));
  }

  const sliders = document.querySelectorAll('.config-slider input');
  Object.keys(config).forEach((key, index) => {
    sliders[index].value = config[key];
  });
}
loadConfig('default')