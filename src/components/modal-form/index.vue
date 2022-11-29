<template lang="pug">
.modal-form.modal-overlay
  .modal-form__block.modal-block(
    @mousedown.stop)
    h2.modal-form__title(class=`
      font-medium
      text-[24px]
      mb-[23px]
      text-left`) Заказать звонок
    form.modal-form__main(
      @submit.prevent="sendForm"
      class=``)
      .modal-form__item
        label.modal-form__label(for="name") Имя*
        input#name.modal-form__input(:class="[{'!border-red-500': v$.name.$error}]" v-model="form.name" type="text" name="name" placeholder="Иван Иванов")
        .modal-form__errors(v-if="v$.name.$error")
          .error-msg Обязательно поле
      .modal-form__item
        label.modal-form__label(for="phone") Телефон*
        input#phone.modal-form__input(:class="[{'!border-red-500': v$.phone.$error}]" @input="setPhone" v-mask="'+7(###) ###-##-##'" type="tel" name="phone" placeholder="+7 (___) ___-__-__")
        .modal-form__errors(v-if="v$.phone.$error")
          .error-msg Обязательно поле
      .modal-form__item
        label.modal-form__label(for="email") Email*
        input#email.modal-form__input(:class="[{'!border-red-500': v$.email.$error}]" v-model="form.email" type="text" name="email" placeholder="you@example.com")
        .modal-form__errors(v-if="v$.email.$error")
          .error-msg Обязательно поле
      .modal-form__item.relative(class="md:col-span-2 sm:col-span-1")
        label.modal-form__label(for="city") Город*
        #city.modal-form__input.w-full.flex.justify-between.items-center(@click.stop="selectActivated = !selectActivated")
          .modal-form__city.truncate {{citiesList.find(({id}) => id === form['city_id']).name}}
          .modal-form__arrow.transition-all.duration-500(:class="{'rotate-180 !mt-[10px]': selectActivated}")
        transition(name="bounce" appear @click.stop)
          .modal-form__select.absolute.left-0.rounded-md.overflow-x-hidden.cursor-pointer.overflow-y-auto.w-full(
            v-if="selectActivated"
            class="top-[105%] max-h-[145px] sm:top-[auto] sm:bottom-[70%]"
          )
            .modal-form__option.truncate(
              v-for="city in citiesList"
              :key="city.id"
              :value="city.id"
              @click="() => { form['city_id'] = city.id; selectActivated = false}"
            ) {{city.name}}
      .modal-form__submit.col-end-5(class="md:col-end-4 md:flex md:items-end sm:col-end-auto")
        button(type="submit" class=" py-[11px] w-full").text-white.bg-green-600.rounded-md Отправить

</template>

<script lang="ts">
  //@ts-ignore
  import {mask} from 'vue-the-mask'
  import { useVuelidate } from '@vuelidate/core'
  import { required, email, minLength } from '@vuelidate/validators'
  import { defineComponent, ref, reactive, computed, onMounted, onUnmounted } from 'vue';
  import {useStore} from 'vuex'
  import { Ref } from 'vue';
  import ICityItem from "interfaces/ICityItem";
  import IForm from "interfaces/IForm";

  export default defineComponent({
    name: "index",
    //@ts-ignore
    directives: {mask},
    setup() {
      const store = useStore();

      let citiesList = computed<ICityItem[]>(() => store.getters['cities/citiesList']);

      let selectActivated: Ref<boolean> = ref(false);

      function documentClick() {
        if(selectActivated.value) selectActivated.value = false
      }

      onMounted(() => {
        document.addEventListener('click', documentClick)
      });

      onUnmounted(() => {
        document.removeEventListener('click', documentClick)
      });

      const form = computed<IForm>(() => store.getters['form/form']);

      function setPhone(e: any) {
        form.value.phone = e.target.value.replace(/[^+|\d;]/g, '');
      }

      const rules = {
        name: {
          required,
          minLengthValue: minLength(2),
          alpha: (value: string) => /^[A-Za-zА-Яа-я\s]+$/.test(value),
        },
        phone: {
          required,
          realPhone: (value: string) => /^(\s*)?(\+)?([- ():=+]?\d[- ():=+]?){7,14}(\s*)?$/.test(value),
          minLengthValue: minLength(12),
        },
        email: {
          required,
          email,
          realEmail: (value: string) => /^[A-Za-z0-9]+([a-zA-Z0-9_.-]+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/i.test(value),
        },
        ['city_id']: {
          required
        },
      };

      const v$ = useVuelidate(rules, form);

      async function sendForm() {
        await v$.value.$validate();
        if(!v$.value.$invalid) {
          let success = await store.dispatch('form/sendForm');
          if(success) v$.value.$reset();
        }
      }


      return {
        citiesList,
        selectActivated,
        setPhone,
        sendForm,
        form,
        v$,
      }
    },
  })
</script>

<style scoped lang="sass">
.modal-form
  &__
    &main
      @apply grid grid-rows-2 grid-cols-[repeat(4,_minmax(170px,_1fr))] gap-[20px]
      @apply md:grid-cols-[repeat(3,_minmax(130px,_1fr))]
      @apply sm:grid-cols-[repeat(1,_minmax(100%,_1fr))]
    &item
      @apply flex flex-col items-start relative
    &label
      @apply text-[16px] font-medium mb-[4px]
    &input
      max-width: fill-available
      @apply text-[16px] px-[13px] py-[9px] border rounded-md border-gray-300 cursor-pointer sm:w-full
    &arrow
      position: relative
      @apply mx-[7px] my-[5px] w-[11px] h-[6px] px-[5.5px]
      &:before,&:after
        position: absolute
        content: ''
        bottom: 0
        height: 2px
        width: 7px
        border-radius: 3px
        @apply  bg-gray-500
      &:before
        left: 0
        transform: rotate(45deg)
      &:after
        right: 0
        transform: rotate(-45deg)
    &select
      @apply border
      scroll-snap-type: y mandatory
      &::-webkit-scrollbar
        width: 0
    &option
      scroll-snap-align: start
      @apply transition px-[13px] py-[9px] bg-white hover:bg-gray-100
      &:not(:last-child)
        @apply border-b
    &errors
      @apply absolute top-full text-[12px] text-red-500

</style>