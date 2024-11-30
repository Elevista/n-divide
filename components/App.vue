<script setup lang="ts">
const showItem = ref(false), store = useStore()
</script>
<template>
  <Toolbar class="p-s top-0 zi-1" @item-dialog="showItem=true" />
  <QList v-if="store.items.length" dense padding class="f-1"
         @dragover.prevent
         @drop="removeNFromPerson()">
    <Flip><Item v-for="item of store.items" :key="item.id" :item="item" /></Flip>
  </QList>
  <div v-else class="f-1 fd-r ai-c jc-c text-body2">
    <QBtn flat round dense icon="playlist_add"
          @click="showItem=true" /> 버튼을 눌러 품목을 추가해주세요.
  </div>
  <PersonList />
  <ItemDialog v-model="showItem" />
</template>
