<template>
  <div>
    <h1 class="text-3xl">Todos</h1>
    <div v-for="todo in todos" :key="todo.id">
      <button class="mr-6" @click="deleteTodo(todo)">Delete</button>
      <input type="checkbox" v-model="todo.checked" v-on:change="updateTodo(todo)" />
      <h1 class="inline-block">{{ todo.text }}</h1>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "GoogleKeep",
  data: function() {
    return {
      todos: null
    };
  },
  props: {
    endpoint: String
  },
  methods: {
    getTodos: function() {
      axios.get(`${this.endpoint}/gk/todos`).then(response => {
        this.todos = response.data;
      });
    },
    updateTodo: function(todo) {
      axios.put(`${this.endpoint}/gk/todos`, todo);
    },
    deleteTodo: function(todo) {
      this.todos = this.todos.filter(function(td) {
        return td.id !== todo.id;
      });
      axios.delete(`${this.endpoint}/gk/todos`, { data: todo });
    }
  },
  mounted: function() {
    this.getTodos();
  }
};
</script>