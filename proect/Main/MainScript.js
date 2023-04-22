const MazeButton = document.getElementById('MazeButton');
const AntAlgorithmButtton = document.getElementById('AntAlgorithmButton');
const video = document.getElementById('background-video');

/*
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(function(stream) {
    console.log('Разрешение на воспроизведение звука получено');
  })
  .catch(function(err) {
    console.log('Разрешение на воспроизведение звука не получено: ' + err);
  });
*/
video.style.width = window.innerWidth + 'px';
video.style.height = window.innerHeight + 'px';

window.addEventListener('resize', () => {
  video.style.width = window.innerWidth + 'px';
  video.style.height = window.innerHeight + 'px';
});
/*
MazeButton.addEventListener('click', MazeButtonFunc);
function MazeButtonFunc() {
    window.location.replace("./MazeIndex.html");
}

AntAlgorithmButtton.addEventListener('click', AntAlgorithmButttonFunc);
function AntAlgorithmButttonFunc() {
    window.location.replace("Main/AntAlgorithm/AntAlgorithmIndex.html");
}*/