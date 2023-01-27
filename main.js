import { loadGLTF, loadAudio } from "./libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener("DOMContentLoaded", () => {
  const start = async () => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: "./assets/targets.mind",
    });
    const { renderer, scene, camera } = mindarThree;

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    const raccoon = await loadGLTF("./assets/fryd/test.gltf");

    raccoon.scene.scale.set(1, 1, 1);
    raccoon.scene.position.set(0, 0.2, 0.15);
    raccoon.scene.rotation.set(0, 4.75, 30);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(raccoon.scene);

    const audioClip = await loadAudio("./assets/sound.mp3");

    const listener = new THREE.AudioListener();
    camera.add(listener);

    const audio = new THREE.PositionalAudio(listener);
    anchor.group.add(audio);

    audio.setBuffer(audioClip);
    audio.setRefDistance(100);
    audio.setLoop(true);

    anchor.onTargetFound = () => {
      audio.play();
    };
    anchor.onTargetLost = () => {
      audio.pause();
    };

    const mixer = new THREE.AnimationMixer(raccoon.scene);
    const action = mixer.clipAction(raccoon.animations[0]);
    action.play();

    const clock = new THREE.Clock();

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      mixer.update(delta);
      renderer.render(scene, camera);
    });
  };
  start();
});
