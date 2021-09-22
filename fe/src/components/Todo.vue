<template>
  <div class="hello">
    <div class="todos" id="app">
      <h3 class="todos__title">
        Todo List - VueJS
        <span v-show="itemsTodo.length"> ({{ itemsTodo.length }} pending)</span>
      </h3>
      <input
        class="todos__input"
        type="text"
        @keyup.enter="addTodo"
        @keyup="checkInput"
        v-model="newTodo"
        placeholder="Type and press enter..."
      />
      <p class="todos__error" v-show="error">{{ error }}</p>
      <ul class="todos__list">
        <li
          class="todos__item"
          v-for="todo in todos"
          :key="todo._id"
          :class="{ todos__completed: todo.completed }"
          @click="
            todo.completed = !todo.completed;
            updateTodo(todo);
          "
          transition="fade"
        >
          <button class="todos__delete" @click.stop="removeTodo(todo._id)">
            &times;
          </button>
          {{ todo.text }}
        </li>
      </ul>
      <p class="todos__empty" v-show="!todos.length">
        Nothing to do... yet!
      </p>

      <a
        class="todos__clear"
        href="#"
        @click.prevent="clearCompleted"
        v-show="itemsDone.length"
        >Clear completed tasks</a
      >
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Todo",
  props: {
    msg: String,
  },
  data() {
    return {
      newTodo: "",
      todos: [],
      error: null,
    };
  },
  methods: {
    getTodos() {
      axios
        .get("http://localhost:3000/todos/list")
        .then((response) => {
          this.todos = response.data.todos;
        })
        .catch((err) => {
          console.log(err);
          this.error = err;
        });
    },
    addTodo() {
      const newEntry = {
        text: this.newTodo,
        completed: false,
      };
      if (this.newTodo.length >= 5) {
        axios
          .post("http://localhost:3000/todos/create-todo", newEntry)
          .then((response) => {
            console.log(`Successfully inserted to database: ${response}`);
            this.newTodo = "";
            this.getTodos();
          })
          .catch((err) => {
            console.log(err);
            this.error = err;
          });
      }
    },
    //to update the complete status in database
    updateTodo(todo) {
      const todoStatus = { _id: todo._id, completed: todo.completed };
      axios
        .put(`http://localhost:3000/todos/${todo._id}`, todoStatus)
        .then((resData) => {
          console.log(resData);
          const todo = {
            _id: resData.todo._id,
            completed: resData.todo.completed,
          };
          return todo;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    removeTodo(id) {
      axios
        .delete(`http://localhost:3000/todos/${id}`)
        .then((response) => {
          console.log(response);
          this.getTodos();
        })
        .catch((err) => {
          console.log(err);
          this.error = err;
        });
    },
    clearCompleted() {
      let vm = this;
      vm.todos = vm.todos.filter((todo) => {
        if (todo.completed) {
          axios.delete("http://localhost:3000/todos/" + todo._id);
        }
        return !todo.completed;
      });
    },
    checkInput() {
      if (this.newTodo.length < 5) {
        return (this.error =
          "Please insert a value with minimum 5 characters.");
      } else {
        this.error = "";
      }
    },
  },
  mounted() {
    this.getTodos();
  },
  computed: {
    itemsDone() {
      return this.todos.filter((todo) => todo.completed);
    },
    itemsTodo() {
      return this.todos.filter((todo) => !todo.completed);
    },
  },
};
</script>

<style scoped lang="css">
@import url("https://fonts.googleapis.com/css?family=Open+Sans:400,700");
body {
  padding: 1rem 1.5rem;
  background: #f7f7f7;
  font-family: "Open Sans", sans-serif;
}
@media (min-width: 500px) {
  body {
    padding-top: 3rem;
  }
}
.todos__title {
  margin-bottom: 1rem;
}
.todos__input {
  padding: 0.5rem 0.75rem;
  border: solid 2px #d9d9d9;
  width: 15rem;
  margin: 0.5rem 0 1rem;
}
.todos__input:focus {
  outline: none;
}
.todos__list {
  margin: 1rem 0;
  padding: 0;
}
.todos__item {
  position: relative;
  list-style: none;
  padding: 0.5rem;
  margin: 0 0.3rem 0.3rem 0;
  background: #fff;
  display: inline-block;
  color: #999;
}
.todos__item:hover {
  cursor: pointer;
  color: #666;
}
.todos__delete {
  margin-right: 0.5rem;
  background: #ff6347;
  border: none;
  color: #fff;
  border-radius: 50%;
  height: 1rem;
  width: 1rem;
  display: inline-block;
  line-height: 1;
  font-size: 0.8rem;
  text-align: center;
  padding: 0;
}
.todos__delete:hover {
  background: #f92600;
}
.todos__completed {
  background: #f6feff;
  text-decoration: line-through;
  color: #09a;
}
.todos__completed:hover {
  color: #008290;
}
.todos__clear {
  font-size: 0.8rem;
  color: #09a;
}
.todos__empty {
  font-size: 0.9rem;
  color: #666;
}
.todos__error {
  font-size: 0.9rem;
  color: rgb(226, 38, 38);
}
/* ##### transitions ##### */
.fade-transition {
  transition: all 0.2s;
}
.fade-enter {
  opacity: 0;
}
.fade-leave {
  display: none;
}
</style>
