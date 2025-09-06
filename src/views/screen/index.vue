<template>
  <div id="screen" class="screen">数据大屏</div>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs, onMounted, getCurrentInstance } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
let { proxy } = getCurrentInstance()
let THREE = proxy.$THREE

const plane = (scene) => {
  let point = new THREE.SpotLight(0xffffff) //设置灯光的颜色
  point.position.set(80, 100, 80) //点光源位置
  point.angle = Math.PI / 10 //设置投影的程度
  point.shadow.mapSize.set(1024, 1024)
  scene.add(point)
  point.castShadow = true //灯光投影
}

const cube = (scene) => {
  let cubeGeometry = new THREE.BoxGeometry(4, 4, 4) //长宽高
  let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 }) //材质颜色
  let cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.position.x = 3 //三轴的位置
  cube.position.y = 8
  cube.position.z = 3
  scene.add(cube)
  cube.castShadow = true //立方体投影
}

const point = (scene) => {
  let point = new THREE.SpotLight(0xffffff) //设置灯光的颜色
  point.position.set(80, 100, 80) //点光源位置
  point.angle = Math.PI / 10 //设置投影的程度
  point.shadow.mapSize.set(1024, 1024)
  scene.add(point)
  point.castShadow = true //灯光投影
}

onMounted(() => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  )
  camera.position.z = -30
  camera.position.x = 40
  camera.position.y = 30
  camera.lookAt(scene.position)

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0xeeeeee)
  renderer.shadowMap.enabled = true

  plane(scene)
  cube(scene)
  point(scene)

  document.getElementById('screen').appendChild(renderer.domElement)
  renderer.render(scene, camera)
  let controls = new OrbitControls(camera, renderer.domElement)
  controls.addEventListener('change', () => {
    renderer.render(scene, camera)
  })
})
</script>
<style scoped lang="scss"></style>
