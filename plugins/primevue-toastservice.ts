import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";

export default defineNuxtPlugin((nuxtApp): any => {
  nuxtApp.vueApp.use(PrimeVue);
  nuxtApp.vueApp.use(ToastService);
  nuxtApp.vueApp.component("Toast", Toast);

  return {
    provide: {
      toast: nuxtApp.vueApp.config.globalProperties.$toast
    }
  }
});