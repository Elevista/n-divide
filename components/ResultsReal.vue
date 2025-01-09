<script lang="ts" setup>
const store = useStore(), q = useQuasar()

const data = useSimpleData()
const people = computed(() => data.people
  .map(x => ({ ...x, sum: intFormat(x.items.reduce((acc, cur) => acc + cur.sum, 0)) })))

const copy = () => {
  navigator.clipboard.writeText(people.value.flatMap(x => [
    `${x.name} ${x.sum}원`,
    ...x.items.filter(x => x.sum).map((item, i, arr) => ` ${i + 1 < arr.length ? '├' : '└'}─ ${item.name} ${intFormat(item.sum)}원`),
  ]).concat(store.accountInfo).join('\n').trim())
  q.notify('텍스트가 클립보드로 복사 되었습니다.')
}

const showAccountInfo = ref(false)
const accountInfo = ref(store.accountInfo)
const restAccountInfo = () => { accountInfo.value = store.accountInfo }
const saveAccountInfo = () => {
  store.accountInfo = accountInfo.value
  showAccountInfo.value = false
}
</script>

<template>
  <ResultsDisplay share :account-info="store.accountInfo" :items="data.items" :people="people">
    <template #buttons>
      <QBtn icon="content_copy" round flat size="sm"
            @click="copy" />
      <QBtn v-if="people.length && people.length<=5" round size="sm" flat>
        <KakaoFeedButton
          :description="accountInfo"
          :content="{profileText: `정산 결과`, items: people.map(x => ({item: x.name,itemOp: x.sum + '원'}))}" />
      </QBtn>
      <QBtn icon="settings" round flat size="sm"
            @click="showAccountInfo=true" />
    </template>
    <QDialog v-model="showAccountInfo" full-width @hide="restAccountInfo">
      <QCard>
        <QCardSection tag="form" @submit.prevent="saveAccountInfo()">
          <QInput v-model="accountInfo" autofocus placeholder="예시) 카카오페이 또는 N분은행 123-456" label="입금 정보" />
        </QCardSection>
        <QCardActions align="right" class="text-primary">
          <QBtn v-close-popup flat label="취소" />
          <QBtn v-close-popup flat label="확인" @click="saveAccountInfo" />
        </QCardActions>
      </QCard>
    </QDialog>
  </ResultsDisplay>
</template>
