<template>
  <div class="edit-task">
    <div class="container main">
      <h1>Edit Task</h1>
      <div class="row">
        <!-- main task details -->
        <div class="col-md-8 main-item-detail">
          <div class="form-group">
            <input
              type="text"
              placeholder="Task Title"
              v-model="task.title"
              class="form-control"
              maxlength="50"
            />
          </div>

          <div class="form-group">
            <textarea
              name="Description"
              class="form-control"
              placeholder="Full Task Description"
              v-model="task.description"
              cols="30"
              rows="10"
              maxlength="600"
              @keyup.enter="newline"
            ></textarea>
          </div>
        </div>
        <!-- task extra details -->
        <div class="col-md-4 extra-item-detail">
          <h4 class="display-6">Task Details</h4>
          <hr />

          <div class="form-group">
            <input
              type="text"
              placeholder="Task Time Allowance (hours)"
              v-model="task.timeFrame"
              class="form-control"
            />
          </div>

          <div class="form-group">
            <select v-model="task.assignee" class="form-control">
              <option value disabled selected>{{ task.assignee }}</option>
              <option v-for="employee in employees" :key="employee.index">
                {{ employee }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <select v-model="task.priority" class="form-control">
              <option value disabled selected>{{ task.priority }}</option>
              <option v-for="priority in priority" :key="priority.index">
                {{ priority }}
              </option>
            </select>
          </div>

          <p>Update Task Status</p>
          <div class="form-group">
            <select v-model="task.status" class="form-control">
              <option value disabled selected>{{ task.status }}</option>
              <option v-for="status in status" :key="status.index">
                {{ status }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!--edit button-->
      <div class="btn-wrapper">
        <button class="update-btn" @click="updateTask">UPDATE</button>
      </div>
    </div>

    <!-- loading -->
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
import { fb } from "../firebase";
import axios from "axios";
const dev_url = "http://localhost:5001/mooreadvice-test/us-central1/api";
const prod_url = "https://us-central1-mooreadvice-test.cloudfunctions.net/api";

export default {
  name: "edit",
  props: {
    taskToken: String,
  },
  data() {
    return {
      task: {
        title: "",
        description: "",
        assignee: "",
        timeFrame: "",
        priority: "",
        status: "",
      },
      priority: ["Low", "Medium", "High", "Essential"],
      employees: ["John Deere", "John McTavish", "Hesh Walker", "Simon Riley"],
      status: ["Active", "Pending", "Finished"],
      isLoading: false,
    };
  },
  mounted() {
    this.fetchTask();
  },
  methods: {
    fetchTask() {
      //start loading
      this.isLoading = true;

      //fetch
      axios
        .get(prod_url + "/get-task/" + this.taskToken)
        .then((response) => {
          //set current task data
          this.task.title = response.data.data.task_title;
          this.task.description = response.data.data.task_description;
          this.task.assignee = response.data.data.task_assignee;
          this.task.timeFrame = response.data.data.task_time_frame;
          this.task.priority = response.data.data.task_priority;
          this.task.status = response.data.data.task_status;

          //stop loading
          this.isLoading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateTask() {
      //validate fields
      if (
        this.task.title != "" &&
        this.task.description != "" &&
        this.task.assignee != "" &&
        this.task.timeFrame != "" &&
        this.task.priority != ""
      ) {
        //loading
        this.isLoading = true;

        //call add function
        axios
          .post(prod_url + "/update-task", {
            task_title: this.task.title,
            task_description: this.task.description,
            task_assignee: this.task.assignee,
            task_time_frame: this.task.timeFrame,
            task_priority: this.task.priority,
            task_token: this.taskToken,
            task_status: this.task.status,
          })
          .then((response) => {
            //show success
            Toast.fire({
              icon: "success",
              title: response.data.message,
            }).then(() => {
              //go back
              this.$router.go(-1);
            });
          })
          .catch((e) => {
            //stop loading
            this.isLoading = true;

            //log error
            console.log(e);
          });
      } else {
        //show success
        Toast.fire({
          icon: "error",
          title: "One or more fields are empty",
        });
      }
    },
    newline() {
      this.description = `${this.description}\n`;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.edit-task {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  background-image: url(/img/images/white_bubble_back.png);
  background-size: cover;
  background-position: center;
  background-attachment: fixed;

  h1 {
    font-size: 30px;
    margin-top: 10px;
    font-weight: 500;
  }
}

.main-item-detail {
  margin-top: 20px;

  input:focus {
    box-shadow: none;
    border: 0.2px solid #2193b0;
  }

  textarea:focus {
    box-shadow: none;
    border: 0.2px solid #2193b0;
  }
}

.extra-item-detail {
  input:focus {
    box-shadow: none;
    border: 0.2px solid #2193b0;
  }

  select:focus {
    box-shadow: none;
    border: 0.2px solid #2193b0;
  }

  .tag {
    color: #a8a8a8;
    background: transparent;
    border: 0.1px solid #a8a8a8;
    border-radius: 15px;
    text-align: center;
    margin: 0 4px;
    padding: 3px 10px !important;
  }
}

.btn-wrapper {
  align-items: center;
  text-align: center;
  align-content: center;
}

.update-btn {
  margin-left: auto;
  margin-right: auto;
  width: 90%;
  padding: 10px;
  margin: 20px 0;
  background: #2193b0; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #6dd5ed, #2193b0);
  background: linear-gradient(to right, #6dd5ed, #2193b0);
  border-radius: 4px;
  transition: 0.6s;
  color: #fff;
  font-size: 17px;
  font-weight: 600;
  box-shadow: none;
  outline: none;
  border: none;

  &:hover {
    width: 100%;
  }
}
</style>
