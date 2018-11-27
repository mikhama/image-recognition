const imageSelector = document.querySelector('#image-selector');
const selectedImage = document.querySelector('#selected-image');
const predictionList = document.querySelector('#prediction-list');
const progressText = document.querySelector('#progress-text');
const predictionButton = document.querySelector('#prediction-button');

const loadModel = async () => {
  const model = await tf.loadModel('/model/model.json');

  progressText.innerHTML = 'Model is loaded';

  return model;
};

const loadedModel = loadModel();

imageSelector.addEventListener('input', () => {
  const reader = new FileReader();

  reader.onload = () => {
    const imgUrl = reader.result;
    selectedImage.setAttribute('src', imgUrl);

    predictionList.innerHTML = '';
  };

  const file = imageSelector.files[0];
  reader.readAsDataURL(file);
});

predictionButton.addEventListener('click', async () => {
  const model = await loadedModel;
  const image = document.querySelector('#selected-image');

  const offset = tf.scalar(127.5);
  const tensor = tf.fromPixels(image)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .sub(offset)
    .div(offset)
    .expandDims();

  const prediction = await model.predict(tensor).data();
  const top5 = Array.from(prediction)
    .map((prob, idx) => ({ probability: prob, className: modelDescription[idx] }))
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 5);

  let elements = '';
  top5.forEach(({ probability, className }) => {
    elements += `<li><span class="prediction-item-name">${className}</span> <span class="prediction-item-probability">${probability}</span></li>`;
  });
  predictionList.innerHTML = elements;
});
