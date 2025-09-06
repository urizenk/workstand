<template>
  <div class="bookmark">
    <form>
      书签文件上传:
      <input type="file" @change="parse($event)" />
    </form>
    <el-card v-for="item in marks" class="mark-group" :key="item.index">
      <span>{{ item.type }}</span>
      <el-divider />
      <el-card v-for="link in item.links" class="mark-item">
        <a :href="link.href">{{ link.title }}</a>
      </el-card>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import cheerio from 'cheerio'
import { ref, reactive, toRefs, onMounted } from 'vue'
const marks = reactive([])

const parse = (event) => {
  const files = event.target.files
  const reader = new FileReader()
  reader.readAsText(files[0])
  reader.onload = (ev) => {
    const $ = cheerio.load(reader.result)
    $('H3').each((index, element) => {
      const type = $(element).text()
      const links = []
      $(element)
        .nextAll()
        .filter('dl')
        .children()
        .filter('dt')
        .children()
        .filter('a')
        .each((j, a) => {
          const href = $(a).attr('href')

          const title = $(a).text()
          links.push({ j, href, title })
        })
      marks.push({ index, type, links })
    })
  }
}
</script>
<style scoped lang="scss">
.bookmark {
  .mark-group {
    justify-content: space-around;
    margin: 10px;
    .mark-item {
      float: left;
      width: 100px;
      height: 100px;
      margin: 10px;
    }
  }
}
</style>
