<template>
  <div class="login">
    <div class="container">
      <div class="row login-card">
        <div class="col-md-6">
          <img
            src="/img/images/moore_image.png"
            class="img-fluid welcome-image"
          />
        </div>
        <div class="col-md-6 input-div">
          <div class="fields">
            <div class="form-group">
              <input
                type="email"
                v-model="email"
                class="form-control user-mail"
                id="email"
                placeholder="Email"
              />
            </div>

            <div class="form-group">
              <input
                v-model="password"
                :type="passwordFieldType"
                class="form-control"
                name="Password"
                placeholder="Password"
              />
              <span
                toggle="#password-field"
                class="fa fa-fw fa-eye field-icon toggle-password"
                @click="switchVisibility"
              ></span>
            </div>

            <div class="reset-div">
              <p @click="showReset">Forgot Password</p>
            </div>

            <div class="row btn-div">
              <div class="col-md-12">
                <button class="btn login-btn" @click="login">LOGIN</button>
              </div>
            </div>

            <p class="login-link">
              Login to Admin account.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="box" v-show="isLoading">
      <div class="b b1"></div>
      <div class="b b2"></div>
      <div class="b b3"></div>
      <div class="b b4"></div>
      <img class="tx" src="/img/images/moore_image.png" />
    </div>
    <ResetPass></ResetPass>
  </div>
</template>

<script>
//firebase
import { fb, db } from "../firebase";
import axios from "axios";
const dev_url = "http://localhost:5001/mooreadvice-test/us-central1/api";
const prod_url = "https://us-central1-mooreadvice-test.cloudfunctions.net/api";

export default {
  name: "Login",
  props: {
    msg: String,
  },
  data() {
    return {
      email: "",
      password: "",
      passwordFieldType: "password",
      isLoading: false,
    };
  },
  mounted() {
    if (this.$store.state.authed) {
      this.$router.push("/");
    }
  },
  methods: {
    showReset() {
      //display password reset modal
      $("#reset").modal("show");
    },
    switchVisibility() {
      this.passwordFieldType =
        this.passwordFieldType === "password" ? "text" : "password";
    },
    validateEmail(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    login() {
      //validate
      if (this.email != "" && this.password != "") {
        if (this.validateEmail(this.email)) {
          //loading
          this.isLoading = true;

          //authenticate
          fb.auth()
            .signInWithEmailAndPassword(this.email, this.password)
            .then((user) => {
              // User is signed in.
              var uid = fb.auth().currentUser.uid;

              axios
                .get(prod_url + "/get-profile/" + uid)
                .then((response) => {
                  let data = response.data.data;

                  console.log(data);

                  //add to vuex cart
                  this.$store.commit("addUserData", data);

                  //stop loading
                  this.isLoading = false;

                  //toast.
                  Toast.fire({
                    icon: "success",
                    title: "Welcome Mr. " + data.last_name,
                  });

                  //go home
                  this.$router.push("/");
                })
                .catch((e) => {
                  if (e) {
                    //loading
                    this.isLoading = false;

                    // email validation error.
                    console.log(e.message);
                  }
                });
            })
            .catch((error) => {
              if (error) {
                //loading
                this.isLoading = false;

                // email validation error.
                Toast.fire({
                  icon: "error",
                  title: error.message,
                });
              }
            });
        } else {
          // email validation error.
          Toast.fire({
            icon: "error",
            title: "Invalid Email",
          });
        }
      } else {
        // field error.
        Toast.fire({
          icon: "error",
          title: "Some fields are empty",
        });
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.login {
  padding: 50px 20px;
  min-height: 100vh !important;
  background-image: url(/img/images/white_bubble_back.png);
  background-size: cover;
  background-position: center;
  background-attachment: fixed;

  .login-card {
    min-width: 500px;
    max-width: 100%;
    background: #fff;
    box-shadow: 3px 5px 9px #3e3e3e;
    padding: 50px 20px;
    margin-top: 10%;

    .input-div {
      .logo {
        width: 130px;
        left: 0;
      }

      .field-icon {
        float: right;
        margin-right: 10px;
        margin-top: -34px;
        position: relative;
        z-index: 2;
      }

      .fields {
        margin-top: 50px;

        .form-group {
          input {
            padding: 25px 20px;
            margin-top: 35px;

            &:focus {
              box-shadow: none;
            }
          }

          span {
            cursor: pointer;
          }
        }

        .reset-div {
          text-align: end;
          margin-top: 30px;

          p {
            color: #5a5959;
            font-size: 17px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.4s ease-in-out;

            &:hover {
              color: #267294;
            }
          }
        }

        .btn-div {
          text-align: center;
          margin-top: 30px;

          .login-btn {
            background: #2193b0;
            border: 1px solid #2193b0 !important;
            color: #fff !important;
            padding: 10px;
            border-radius: 40px !important;
            box-shadow: none !important;
            font-size: 15px;
            font-weight: 600;
            width: 90%;
            transition: all 0.3s ease-in-out;

            &:hover {
              width: 100%;
            }
          }

          .register-btn {
            background: transparent;
            border: 1px solid #2193b0;
            color: #2193b0 !important;
            padding: 10px;
            border-radius: 40px !important;
            box-shadow: none !important;
            font-size: 15px;
            font-weight: 600;
            width: 90%;
            transition: all 0.3s ease-in-out;

            &:hover {
              width: 100%;
            }
          }
        }

        .login-link {
          text-align: center;
          margin-top: 30px;
          color: #8a8a8a;
        }
      }
    }
  }
}

//loading
.box {
  background: #ffffffa4;
  margin: 0;
  padding: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  .b {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border-left: 4px solid;
    border-right: 4px solid;
    border-top: 4px solid transparent !important;
    border-bottom: 4px solid transparent !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: ro 3s infinite;
  }
  .tx {
    width: 35px;
    height: 35px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .b1 {
    border-color: #267294;
    width: 120px;
    height: 120px;
  }
  .b2 {
    border-color: #106d0d;
    width: 100px;
    height: 100px;
    animation-delay: 0.3s;
  }
  .b3 {
    border-color: #ffd700;
    width: 80px;
    height: 80px;
    animation-delay: 0.6s;
  }
  .b4 {
    border-color: #92cf48;
    width: 60px;
    height: 60px;
    animation-delay: 0.9s;
  }

  @keyframes ro {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    50% {
      transform: translate(-50%, -50%) rotate(-180deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
  }
}

@media (max-width: 768px) {
  .login {
    padding: 0;
    background-image: none;
    text-align: center;

    .login-card {
      min-width: 105%;
      width: 100%;
      background: #fff;
      box-shadow: none;
      padding: 30px 10px;
      margin-top: 0 !important;
      text-align: center;

      .input-div {
        .logo {
          visibility: collapse;
        }

        .field-icon {
          float: right;
          margin-right: 10px;
          margin-top: -34px;
          position: relative;
          z-index: 2;
        }

        .fields {
          margin-top: 10px;

          .reset-div {
            text-align: end;
            margin-top: 30px;

            p {
              color: #5a5959;
              font-size: 17px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.4s ease-in-out;

              &:hover {
                color: #267294;
              }
            }
          }

          .btn-div {
            text-align: center;
            margin-top: 30px;

            .register-btn {
              margin-top: 25px;
            }
          }
        }
      }
    }
  }
}
</style>
