<template>
  <div class="home">
    <div class="container title-column">
      <div class="row">
        <div class="col-md-3">
          <img alt="Vue logo" src="../assets/logo.png" />
        </div>
        <div class="col-md-6">
          <h1>Moore Advice Task Manager</h1>
        </div>
        <div class="col-md-3">
          <button class="btn create-btn" @click="createTask">
            CREATE TASK
          </button>
        </div>
      </div>
    </div>

    <div class="row tasks-column">
      <div class="col-md-4">
        <h3>Active Tasks</h3>
        <div class="container">
          <ul>
            <li
              class="task-item"
              v-for="(task, index) in activeTasks"
              :key="index"
            >
              <div class="row">
                <div class="col-md-9 details-div">
                  <div class="media-body">
                    <h5 class="mt-0" @click="gotoDetails(task.task_token)">
                      {{ task.task_title }}
                    </h5>
                    <h4 class="mt-0">
                      {{ task.task_description }}
                    </h4>
                    <p class="mt-0">{{ task.task_assignee }}</p>
                    <p class="mt-0">{{ task.task_priority }}</p>
                  </div>
                  <div class="row btn-slip">
                    <div class="col-md-4">
                      <button id="editBtn" @click="editTask(task.task_token)">
                        EDIT
                      </button>
                    </div>
                    <div class="col-md-4">
                      <button
                        id="deleteBtn"
                        @click="deleteTask(task.task_token)"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-md-4">
        <h3>Pending Tasks</h3>
        <div class="container">
          <ul>
            <li
              class="task-item"
              v-for="(task, index) in pendingTasks"
              :key="index"
            >
              <div class="row">
                <div class="col-md-9 details-div">
                  <div class="media-body">
                    <h5 class="mt-0" @click="gotoDetails(task.task_token)">
                      {{ task.task_title }}
                    </h5>
                    <h4 class="mt-0">
                      {{ task.task_description }}
                    </h4>
                    <p class="mt-0">{{ task.task_assignee }}</p>
                    <p class="mt-0">{{ task.task_priority }}</p>
                  </div>
                  <div class="row btn-slip">
                    <div class="col-md-4">
                      <button id="editBtn" @click="editTask(task.task_token)">
                        EDIT
                      </button>
                    </div>
                    <div class="col-md-4">
                      <button
                        id="deleteBtn"
                        @click="deleteTask(task.task_token)"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-md-4">
        <h3>Finished Tasks</h3>
        <div class="container">
          <ul>
            <li
              class="task-item"
              v-for="(task, index) in finishedTasks"
              :key="index"
            >
              <div class="row">
                <div class="col-md-9 details-div">
                  <div class="media-body">
                    <h5 class="mt-0" @click="gotoDetails(task.task_token)">
                      {{ task.task_title }}
                    </h5>
                    <h4 class="mt-0">
                      {{ task.task_description }}
                    </h4>
                    <p class="mt-0">{{ task.task_assignee }}</p>
                    <p class="mt-0">{{ task.task_priority }}</p>
                  </div>
                  <div class="row btn-slip">
                    <div class="col-md-4">
                      <button id="editBtn" @click="editTask(task.task_token)">
                        EDIT
                      </button>
                    </div>
                    <div class="col-md-4">
                      <button
                        id="deleteBtn"
                        @click="deleteTask(task.task_token)"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!--loading-->
    <div class="box" v-show="isLoading">
      <div class="b b1"></div>
      <div class="b b2"></div>
      <div class="b b3"></div>
      <div class="b b4"></div>
      <img class="tx" src="/img/images/moore_image.png" />
    </div>
  </div>
</template>

<script>
import { fb, db, fv } from "../firebase";
import axios from "axios";
const dev_url = "http://localhost:5001/mooreadvice-test/us-central1/api";
const prod_url = "https://us-central1-mooreadvice-test.cloudfunctions.net/api";

export default {
  name: "Home",
  props: {
    src: String,
  },
  data() {
    return {
      activeTasks: [],
      pendingTasks: [],
      finishedTasks: [],
      isLoading: false,
    };
  },
  mounted() {
    if (!this.$store.state.authed) {
      this.$router.push("/login");
    } else {
      //loading
      this.isLoading = true;

      //get user favorites
      this.getTasks();
    }
  },
  methods: {
    createTask() {
      this.$router.push("/create");
    },
    getTasks() {
      //clear array
      this.activeTasks = [];
      this.pendingTasks = [];
      this.finishedTasks = [];

      //stop loading
      this.isLoading = false;

      //fetch active
      axios
        .get(prod_url + "/get-tasks")
        .then((response) => {
          for (let doc of response.data.data) {
            if (doc.task_status == "Active") {
              this.activeTasks.push(doc);
            }

            if (doc.task_status == "Pending") {
              this.pendingTasks.push(doc);
            }

            if (doc.task_status == "Finished") {
              this.finishedTasks.push(doc);
            }
          }

          //stop loading
          this.isLoading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    editTask(taskToken) {
      this.$router.push("/edit/" + taskToken);
    },
    deleteTask(taskToken) {
      //choice dialog
      Swal.fire({
        title: "Delete Task",
        text: "Are you sure you want to delete task?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2193b0",
        cancelButtonColor: "#d33",
        confirmButtonText: "Delete",
      }).then((result) => {
        if (result.value) {
          //start loading
          this.isLoading = true;

          //delete task
          axios
            .delete(prod_url + "/delete-task/" + taskToken)
            .then((response) => {
              //show success
              Toast.fire({
                icon: "success",
                title: response.data.message,
              });

              //stop loading
              this.isLoading = false;

              //reload
              this.getTasks();
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.home {
  padding: 50px 20px;
  min-height: 100vh !important;
  background-image: url(/img/images/white_bubble_back.png);
  background-size: cover;
  background-position: center;
  background-attachment: fixed;

  .title-column {
    img {
      height: 50px;
    }
    h1 {
      font-weight: 700;
    }
    .create-btn {
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
  }

  .tasks-column {
    margin-top: 30px;

    h3 {
      text-align: center;
    }

    .task-item {
      background: rgb(69, 139, 197);
      border-radius: 4px;
      margin: 15px auto;
      list-style-type: none;
      padding: 15px;

      .details-div {
        margin-top: 20px;

        h5 {
          margin: 20px 3px;
          font-size: 22px;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease-in-out;

          &:hover {
            color: #3e3e3e;
          }
        }

        h4 {
          margin: 10px 3px;
          font-size: 15px;
          color: #e3e3e3;
          font-weight: 500;
        }

        p {
          font-size: 15px;
          border: 1px solid #e3e3e3;
          border-radius: 4px;
          padding: 7px;
          margin: 20px 20px 10px 0;
          display: inline;
          color: #fff;
        }

        .btn-slip {
          margin-top: 20px;

          #editBtn {
            margin-left: auto;
            margin-right: auto;
            width: 90%;
            padding: 10px;
            background: #06c28a;
            border-radius: 4px;
            transition: 0.6s;
            color: #fff;
            font-size: 15px;
            font-weight: 700;
            box-shadow: none;
            outline: none;
            border: none;
          }

          #deleteBtn {
            margin-left: auto;
            margin-right: auto;
            width: 90%;
            padding: 10px;
            background: #ce0f0f;
            border-radius: 4px;
            transition: 0.6s;
            color: #fff;
            font-size: 15px;
            font-weight: 700;
            box-shadow: none;
            outline: none;
            border: none;
          }
        }
      }
    }
  }
}
</style>
