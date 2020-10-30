import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import jQuery from "jquery";
import { fb } from "./firebase";
import "popper.js";
import "bootstrap";
import "./assets/app.scss";
import "./registerServiceWorker";

Vue.config.productionTip = false;

//sweet alert
import Swal from "sweetalert2";
window.Swal = Swal;

//toast
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
window.Toast = Toast;

//set global jquery use
window.$ = window.jQuery = jQuery;

//register components
Vue.component("ResetPass", require("./components/ResetPassword.vue").default);

let app = "";

fb.auth().onAuthStateChanged(function(user) {
  if (!app) {
    new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount("#app");
  }
});
