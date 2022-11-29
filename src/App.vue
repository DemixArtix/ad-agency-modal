<template lang="pug">
cities-buttons(:citiesList="citiesList.slice(0,2)" @setCityId="setCityId($event)")
transition(name="bounce" appear @before-enter="onBeforeEnter" @after-leave="onAfterLeave")
  modal-form#formEl(v-if="showForm && !response && activeModal !== 'responseEl'" @mousedown="showForm = false")
transition(name="bounce" appear @before-enter="onBeforeEnter" @after-leave="onAfterLeave")
  modal-response#responseEl(v-if="response && activeModal !== 'formEl'" @mousedown="response = null")
    .modal-block(v-html="response")
</template>

<script lang="ts">
//@ts-ignore
import citiesButtons from "components/cities-buttons"
//@ts-ignore
import modalForm from "components/modal-form"
//@ts-ignore
import modalResponse from "components/modal-response"

import { defineComponent, ref, reactive, computed } from 'vue';
import {useStore} from 'vuex'
import { Ref } from 'vue';
import ICityItem from "interfaces/ICityItem";

export default defineComponent({
  name: 'App',
  components: {
    citiesButtons,
    modalForm,
    modalResponse
  },
  setup(props) {
    const store = useStore();
    const activeModal: Ref<string> = ref('formEl');
    const showForm = computed<boolean>({
      get: () => store.getters['form/showForm'],
      set: (value: boolean): void => {
        store.dispatch('form/setValueInState', {key: 'showForm', value})
      }
    });
    const response = computed<string|null>({
      get: () => store.getters['form/response'],
      set: (value: string|null): void => {
        store.dispatch('form/setValueInState', {key: 'response', value})
      }
    });
    let citiesList = computed<ICityItem[]>(() => store.getters['cities/citiesList']);
    function onBeforeEnter(el: any) {
      activeModal.value = el.id
    }
    function onAfterLeave(el: any) {
      activeModal.value = ''
    }
    function setCityId(id: number) {
      store.dispatch('form/setValueInForm', {key: 'city_id', value: id})
      showForm.value = true
    }
    return {
      citiesList,
      showForm,
      response,
      activeModal,
      onBeforeEnter,
      onAfterLeave,
      setCityId
    }
  }
});
</script>

<style lang="sass">
#app
  font-family: 'Inter', sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  position: relative
  overflow: hidden
  min-height: 100vh

.modal-overlay
  @apply bg-gray-500/75 w-[100vw] h-[100vh] absolute left-0 top-0 cursor-pointer
  &:before,&:after
    position: absolute
    content: ''
    bottom: 0
    height: 2px
    width: 30px
    border-radius: 3px
    right: 10px
    top: 20px
    z-index: 10
    @apply  bg-black
  &:before
    transform: rotate(45deg)
  &:after
    transform: rotate(-45deg)
.modal-block
  @apply cursor-auto bg-white absolute left-[50%] top-[50%] p-[24px] translate-x-[-50%] translate-y-[-50%] rounded-lg shadow-xl
  @apply md:max-w-[98vw] md:min-w-[80vw]
  @apply sm:max-w-[100vw]
  @media(max-width: 480px)
    width: calc(100vw - 20px)

.bounce-enter-active
  animation: bounce-in 0.5s
.bounce-leave-active
  animation: bounce-in 0.5s reverse

@keyframes bounce-in
  0%
    transform: scale(0)
  50%
    transform: scale(1.25)
  100%
    transform: scale(1)
</style>
