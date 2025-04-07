<script lang="ts">
    let email = "";
    let password = "";
    let error = "";
  
    async function handleSubmit(event: Event) {
      event.preventDefault();
      const API_URL = import.meta.env.VITE_API_URL;
      error = "";
  
      try {
        const response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        console.log(response);
        if (!response.ok) {
          throw new Error(await response.text());
        }
        const {token} = await response.json();
        // window.location.href = "/dashboard";
      } catch (err) {
        error = "Échec de la connexion";
      }
    }
  </script>
  
  <form on:submit={handleSubmit} class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-6">Connexion</h1>
    
    {#if error}
      <div class="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
    {/if}
  
    <div class="mb-4">
      <label for="email" class="block mb-2 text-sm font-medium">Email</label>
      <input
        type="email"
        id="email"
        bind:value={email}
        required
        class="w-full p-2 border rounded"
      />
    </div>
  
    <div class="mb-6">
      <label for="password" class="block mb-2 text-sm font-medium">Mot de passe</label>
      <input
        type="password"
        id="password"
        bind:value={password}
        required
        class="w-full p-2 border rounded"
      />
    </div>
  
    <button
      type="submit"
      class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
    >
      Se connecter
    </button>
  </form>