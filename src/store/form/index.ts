import axios from "axios";

import IForm from "interfaces/IForm";

export default {
  namespaced: true,
  state: {
    form:{
      name: '',
      phone: '',
      email: '',
      ['city_id']: ''
    } as IForm,
    showForm: true as boolean,
    response: null as string|null,
  },
  getters: {
    form: ({form}: any, getters: any, rootState: any, rootGetters: any) => {
      if(!form['city_id'])
        form['city_id'] = rootGetters['cities/citiesList'][0].id;
      return form
    },
    showForm: ({showForm}: any) => showForm,
    response: ({response}: any) => response,
  },
  mutations: {
    SET_VALUE_IN_STATE(state: any, {key, value}: any) {
      state[key] = value
    },
    SET_VALUE_IN_FORM(state: any, {key, value}: any) {
      state.form[key] = value
    },
  },
  actions: {
    setValueInState({commit}: any, {key, value}: any) {
      commit('SET_VALUE_IN_STATE', {key, value})
    },
    setValueInForm({commit}: any, {key, value}: any) {
      commit('SET_VALUE_IN_FORM', {key, value})
    },
    async sendForm({commit, state}: any, ) {
      return await axios({
        method: 'post',
        url: 'http://hh.autodrive-agency.ru/test-tasks/front/task-7/',
        data: state.form,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        commit('SET_VALUE_IN_STATE', {key: 'response', value: res.data})
        commit('SET_VALUE_IN_STATE', {
          key: 'form',
          value: {
            name: '',
            phone: '',
            email: '',
            ['city_id']: ''
          }
        });
        return true;
      }).catch(err => {
        commit('SET_VALUE_IN_STATE', {key: 'response', value: err.response.data})
        return false;
      })
    }
  }
}