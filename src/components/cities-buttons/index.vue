<template lang="pug">
.container.btn__list.flex(
class=`
  gap-[20px]
  py-[20px]
  md:gap-[17px]
  sm:gap-[10px]
  sm:flex-col
  sm:p-[10px]
`)
  button.btn(
    v-for="(city, index) in formattedList"
    :class="[`${colorsList[index % (colorsList.length - 1)]}`,]"
    @click="$emit('setCityId', city.id)"
    ) Заказать в {{city.name}}
</template>

<script lang="ts">
  import _ from "lodash"

  import { defineComponent, ref, reactive, computed } from 'vue';
  import { Ref } from 'vue';
  import ICityItem from "interfaces/ICityItem";

  export default {
    name: "index",
    props: {
      citiesList: {
        type: Array,
        default: () => [
          {
            id: 1,
            name: "Москва"
          },
        ]
      }
    },
    setup({citiesList}: any) {
      let colorsList: string[] = [
        'bg-blue-500',
        'bg-teal-600',
        'bg-fuchsia-500',
        'bg-rose-600'
      ];

      const formattedList = computed<ICityItem[]>(() => {
        return _.cloneDeep(citiesList).map((item: ICityItem) => {
          if(item.name.slice(-1) === 'а') {
            item.name = item.name.slice(0,-1) + 'у'
          }
          return item;
        })
      });


      return {
        colorsList,
        formattedList,
      }
    }

  }
</script>

<style scoped lang="sass">
.btn
  @apply text-white rounded-md text-base px-[17px] py-[9px]


</style>