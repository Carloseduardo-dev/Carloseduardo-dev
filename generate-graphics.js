const fs = require("fs");
const path = require("path");
const axios = require("axios");

// Pasta onde os gráficos serão salvos
const outputDir = path.resolve(__dirname, "public");

// Garantir que a pasta exista
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Token do GitHub (substitua pelo seu token)
const TOKEN = process.env.G_TOKEN;
const USERNAME = "Carloseduardo-dev";

// Função para buscar dados da API
async function fetchGitHubStats() {
  const headers = {
    Authorization: `token ${TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  };

  try {
    const reposResponse = await axios.get(
      `https://api.github.com/users/${USERNAME}/repos?per_page=100&type=all`,
      { headers }
    );
    const repos = reposResponse.data;

    // Generar um gráfico básico de "Most Used Languages"
    const languageCount = {};
    repos.forEach((repo) => {
      if (repo.language) {
        languageCount[repo.language] =
          (languageCount[repo.language] || 0) + repo.size;
      }
    });

    const languageGraph = JSON.stringify(languageCount, null, 2);

    // Salvar gráfico estático
    fs.writeFileSync(path.join(outputDir, "most-used-languages.json"), languageGraph);

    console.log("Gráficos gerados com sucesso!");
  } catch (error) {
    console.error("Erro ao buscar dados da API do GitHub:", error);
  }
}

fetchGitHubStats();
