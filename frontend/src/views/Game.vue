<template>
  <div>
    <div ref="sortable" class="sortable-list">
      <div v-for="(word, index) in shuffledWords" :key="word" class="sortable-item">
        {{ word }}
      </div>
    </div>
    <button @click="submit">Submit</button>
  </div>
</template>

<script setup lang="ts">
// import Sortable from 'sortablejs';
import { ref, onMounted } from 'vue';

const sortableRef = ref(null);
const originalWords: string[] = ['She', 'is', 'a', 'good', 'teacher'];
const shuffledWords = ref(shuffle(originalWords));

function shuffle(array: string[]) {
  return array.slice().sort(() => Math.random() - 0.5);
}

onMounted(() => {

});

function submit() {
  const sortedWords = shuffledWords.value.map((word) => word.trim());
  const isCorrect = JSON.stringify(sortedWords) === JSON.stringify(originalWords);

  if (isCorrect) {
    alert('Correct! You submitted the correct sentence.');
  } else {
    alert('Incorrect. Please try again.');
  }
}
</script>

<style scoped>
.sortable-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
}

.sortable-item {
  border: 1px solid #ddd;
  padding: 10px;
  margin: 5px;
  cursor: move;
}
</style>
