const imageSelector = document.querySelector('#image-selector');
const selectedImage = document.querySelector('#selected-image');
const predictionList = document.querySelector('#prediction-list');
const progressStatus = document.querySelector('#progress-status');
const progress = document.querySelector('#progress');

const loadModel = async () => {
  const model = await tf.loadModel('./model/model.json');

  progressStatus.innerHTML = 'Idle';
  progress.classList.remove('-loading');

  return model;
};

const loadedModel = loadModel();

const selectImage = async () => {
  progress.classList.add('-recognition');
  progressStatus.innerHTML = 'Recognition...';

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const imgUrl = reader.result;
      selectedImage.setAttribute('src', imgUrl);

      predictionList.innerHTML = '';

      setTimeout(() => {
        resolve(reader);
      }, 0);
    };

    const file = imageSelector.files[0];
    reader.readAsDataURL(file);
  });
};

const predict = async () => {
  const model = await loadedModel;

  const offset = tf.scalar(127.5);
  const tensor = tf.fromPixels(selectedImage)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .sub(offset)
    .div(offset)
    .expandDims();

  const prediction = await model.predict(tensor).data();

  const top5 = Array.from(prediction)
    .map((prob, idx) => ({ probability: prob, name: modelDescription[idx] }))
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 5);

  let elements = '';
  top5.forEach(({ probability, name }) => {
    const percent = Number(probability * 100).toFixed(2);
    elements += `<li class="prediction-list-item"><span class="prediction-item-name">${name}</span> <span class="prediction-item-probability">${percent}%</span></li>`;
  });
  predictionList.innerHTML = elements;

  progress.classList.remove('-recognition');
  progressStatus.innerHTML = 'Idle';
};

imageSelector.addEventListener('change', () => {
  selectImage().then(() => {
    predict();
  });
});
