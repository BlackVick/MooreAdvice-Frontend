<template>
  <div class="reset">
    <!-- Modal -->
    <div class="modal fade" id="reset" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <div
              class="tab-pane fade show active"
              id="pills-login"
              role="tabpanel"
              aria-labelledby="pills-login-tab"
            >
              <h5 class="text-center process-title">Reset Password</h5>
              <div class="form-group">
                <input
                  type="email"
                  v-model="email"
                  class="form-control"
                  placeholder="Enter email"
                />
              </div>

              <div class="form-group">
                <button class="btn btn-primary" @click="resetPassword">
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//firebase
import { fb } from "../firebase";

export default {
  name: "ResetPassword",
  props: {
    msg: String,
  },
  data() {
    return {
      email: "",
    };
  },
  methods: {
    validateEmail(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    resetPassword() {
      if (this.email != "" && this.validateEmail(this.email)) {
        //send reset mail
        fb.auth()
          .sendPasswordResetEmail(this.email)
          .then(() => {
            // Email sent.
            Toast.fire({
              icon: "success",
              title: "Reset Instructions Sent To Mail",
            });

            //hide password reset modal
            $("#reset").modal("hide");
          })
          .catch((error) => {
            // Email error.
            Toast.fire({
              icon: "error",
              title: error.message,
            });
          });
      } else {
        // Email error.
        Toast.fire({
          icon: "error",
          title: "Please provide valid email",
        });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.process-title {
  font-weight: 1000;
  margin-top: 20px;
}

.form-group .btn {
  border: none;
  width: 80%;
  margin-top: 20px;
  margin-left: 10%;
  margin-right: 10%;
  transition: 0.7s;
  background: #2193b0; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #6dd5ed, #2193b0);
  background: linear-gradient(to right, #6dd5ed, #2193b0);
  font-weight: 600;
}

.form-group .btn:hover {
  width: 100%;
  margin-left: 0;
}

.form-group .btn:focus {
  outline: none !important;
  box-shadow: none;
}

input:focus {
  box-shadow: none !important;
  border: 0.3px solid #757502;
}

.nav-link {
  font-weight: 900;
}

.form-group {
  margin-top: 20px;
}

.input-group {
  margin-top: 40px;
}
</style>
