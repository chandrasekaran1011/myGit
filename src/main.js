import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import Vuelidate from "vuelidate";
import VueResource from "vue-resource";

Vue.use(Vuelidate);

Vue.use(VueResource);
Vue.http.interceptors.push((request, next) => {
  console.log(request);
  request.headers.set("_token", "tok123");
  next();
});
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
