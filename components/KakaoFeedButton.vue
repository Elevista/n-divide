<script lang="ts" setup>
import type { QBtn } from 'quasar'
const qBtn = ref<QBtn | null>(null)
const props = withDefaults(defineProps<{ content: DefaultFeedSettings['itemContent'], title?: string, description?: string }>(), { title: '정산 요청 드려요!', description: '' })
const webUrl = 'https://elevista.github.io/n-divide'
const share = () => loadKakaoSdk().then(Kakao => Kakao.Share.sendDefault({
  objectType: 'feed',
  content: {
    title: props.title,
    description: props.description,
    imageUrl: 'https://elevista.github.io/n-divide/icons/icon-512-maskable.png',
    imageHeight: 230,
    link: { webUrl, mobileWebUrl: webUrl },
  },
  buttonTitle: '나도 해보기',
  itemContent: props.content,
}))
</script>

<template>
  <QBtn ref="qBtn" round size="sm" flat
        class="flex" @click.stop="share">
    <img src="../assets/kakao.png" class="rounded-full w-[20px] h-[20px] object-cover">
  </QBtn>
</template>
