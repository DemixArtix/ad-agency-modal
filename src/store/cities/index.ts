import ICityItem from "interfaces/ICityItem";

export default {
  namespaced: true,
  state: {
    citiesList: [
      {
        id: 1,
        name: "Москва"
      },
      {
        id: 2,
        name: "Санкт-Петербург"
      },
      {
        id: 3,
        name: "Казань"
      }
    ] as ICityItem[]
  },
  getters: {
    citiesList: ({citiesList}: any) => citiesList,

  },
  mutations: {

  },
  actions: {

  }
}