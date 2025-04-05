<script setup lang="ts">
  const { data } = await useAsyncData(`books-pb`, () => {
  return queryCollection('content').first();
});

console.log('data', data);
</script>

<style>
.book-md {
  font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
  background-color: #fefcf6;
  color: #2d1f14;
  line-height: 1.8;
  padding: 3rem;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border: 4px double #b4975a;
  border-radius: 10px;
}

/* Cabeçalhos */
.book-md h1 {
  font-size: 2.8rem;
  margin-bottom: 1.2rem;
  color: #7a0000;
  border-bottom: 3px solid #b4975a;
  padding-bottom: 0.3rem;
  font-variant: small-caps;
}

.book-md h2 {
  font-size: 2.2rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #b4975a;
  padding-bottom: 0.2rem;
  color: #5c1d0f;
  font-variant: small-caps;
}

.book-md h3 {
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 0.8rem;
  color: #3a1a10;
  font-weight: bold;
}

.book-md h4, .book-md h5, .book-md h6 {
  font-size: 1.2rem;
  margin-top: 1rem;
  color: #3a1a10;
  font-style: italic;
}

/* Parágrafos */
.book-md p {
  margin-bottom: 1.2rem;
  font-size: 1.1rem;
}

/* Negrito e Itálico */
.book-md strong {
  color: #7a0000;
  font-weight: bold;
}

.book-md em {
  font-style: italic;
}

/* Listas */
.book-md ul,
.book-md ol {
  margin: 1.2rem 0;
  padding-left: 2rem;
}

.book-md li {
  margin-bottom: 0.5rem;
}

/* Links */
.book-md a {
  color: #7a0000;
  text-decoration: underline;
}

.book-md a:hover {
  color: #b40000;
}

/* Blockquotes */
.book-md blockquote {
  border-left: 5px solid #b4975a;
  background-color: #f9f5e8;
  padding: 1rem 1.5rem;
  margin: 2rem 0;
  font-style: italic;
  color: #4b3a2c;
}

/* Tabelas */
.book-md table {
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
  font-size: 1rem;
}

.book-md th,
.book-md td {
  border: 1px solid #b4975a;
  padding: 0.75rem 1rem;
  text-align: left;
}

.book-md th {
  background-color: #e9dbc5;
  color: #2d1f14;
  font-weight: bold;
}

/* Código e pré-formatado */
.book-md pre {
  background-color: #f4efe2;
  padding: 1rem;
  overflow-x: auto;
  border: 1px solid #d4c4a2;
  border-radius: 4px;
  font-family: 'Courier New', Courier, monospace;
  margin-bottom: 1rem;
}

.book-md code {
  background-color: #f1e8d0;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'Courier New', Courier, monospace;
}

/* HR */
.book-md hr {
  border: none;
  border-top: 2px dashed #b4975a;
  margin: 2rem 0;
}

/* Títulos especiais estilo caixa */
.book-md .chapter-title {
  font-size: 2rem;
  font-weight: bold;
  color: #7a0000;
  margin-top: 3rem;
  border-top: 2px solid #b4975a;
  border-bottom: 2px solid #b4975a;
  padding: 0.5rem 0;
  font-variant: small-caps;
  text-align: center;
  background-color: #f9f4e7;
}

.book-md .chapter-title::before {
  content: 'Capítulo';
  font-size: 1.5rem;
  color: #7a0000;
  font-weight: bold;
  margin-right: 0.5rem;
}
</style>

<template>
  <div class="book-md">
    <ContentRenderer :value="data?.meta.body" />
  </div>
</template>