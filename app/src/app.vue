<template>
  <div id="app">
    <main>
      <!-- Рендеринг текущей страницы -->
      <router-view />
    </main>

    <footer>
      <p>&copy; 2024 My Vue Project</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
/* Базовые стили */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
}

header {
  background-color: #35495e;
  padding: 1rem;
  color: white;
}

header nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

header nav ul li {
  display: inline;
}

header nav ul li a {
  color: white;
  text-decoration: none;
}

header nav ul li a:hover {
  text-decoration: underline;
}

main {
  padding: 2rem;
}

footer {
  background-color: #35495e;
  color: white;
  padding: 1rem;
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
