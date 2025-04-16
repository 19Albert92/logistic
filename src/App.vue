<template>
  <div style="display: flex; gap: 10px; margin-bottom: 20px;">
    <div>
      <input v-model.number="params.price" v-debounce="300" @input="updateField('price')" placeholder="цена" />
      <div>Цена: {{ params.price }}</div>
    </div>

    <div>
      <input v-model.number="params.qty" v-debounce="300" @input="updateField('qty')" placeholder="количество" />
      <div>Кол-во: {{ params.qty }}</div>
    </div>

    <div>
      <input v-model.number="params.amount" v-debounce="300" @input="updateField('amount')" placeholder="сумма" />
      <div>Сумма: {{ params.amount }}</div>
    </div>

    <div>
      <button @click="submitData">Отправить</button>
      <div>localStorage: {{ localStorageData }}</div>
    </div>
  </div>

  <div>
    <h3>События:</h3>
    <div v-for="(event, index) in events" :key="index">
      {{ event }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'

type Fields = 'price' | 'qty' | 'amount';

const lastChangedField = ref<'price' | 'qty' | 'amount' | null>(null)

const params = ref({
  price: '',
  qty: '',
  amount: ''
})

const localStorageData = ref('');

const counter = ref(parseInt(localStorage.getItem('counter') || '0'))

const events = ref<string[]>([])

const updateLocalStorage = () => {
  const data = {
    counter: counter.value,
    price: params.value.price,
    qty: params.value.qty,
    amount: params.value.amount,
  }
  localStorage.setItem('counter', counter.value.toString())

  Object.entries(params.value).forEach(([key, value]) => {
    localStorage.setItem(key, value)
  })
  return data
}

const updateField = (field: 'price' | 'qty' | 'amount') => {
  recalculation(field)
  events.value.unshift(`Изменено поле ${field}: Цена=${params.value.price}, Кол-во=${params.value.qty}, Сумма=${params.value.amount}`)
}

const recalculation = (field: Fields) => {

  if (!lastChangedField.value) return lastChangedField.value = field

  params.value[lastChangedField.value] = params.value[lastChangedField.value] *  params.value[field]
}

const submitData = () => {
  const currentData = {
    price: params.value.price,
    qty: params.value.qty,
    amount: params.value.amount,
  }
  counter.value += 1

  events.value.unshift(`Отправка данных: ${JSON.stringify(currentData)} (до сохранения: ${localStorageData.value})`)

  setTimeout(() => {
    const success = params.value.amount % 2 === 0
    if (success) {
      const stored = updateLocalStorage()
      events.value.unshift(`{success: true} ${JSON.stringify(stored)} (в localStorage: ${localStorageData.value})`)

      getDataLocaleStorage();

    } else {
      events.value.unshift(`{success: false, msg: 'amount нечетное' } ${JSON.stringify(currentData)} (в localStorage: ${localStorageData.value})`) // пример события когда сервер вернул {success: false}
    }
  }, 1000)
}

const getDataLocaleStorage = () => {
  if (localStorage.getItem('counter') || localStorage.getItem('qty') || localStorage.getItem('amount'))
    localStorageData.value = JSON.stringify({
      counter: localStorage.getItem('counter'),
      price: localStorage.getItem('price'),
      qty: localStorage.getItem('qty'),
      amount: localStorage.getItem('amount')
    })
}

onMounted(() => {
  getDataLocaleStorage()
})
</script>
