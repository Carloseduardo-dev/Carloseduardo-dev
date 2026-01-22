const fs = require("fs");
const path = require("path");
const axios = require("axios");

// Pasta onde os gráficos serão salvos
const outputDir = path.resolve(__dirname, "public");

// Garantir que a pasta exista
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Variáveis de ambiente do workflow
const TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = process.env.USERNAME;

if (!TOKEN || !USERNAME) {
  console.error("Erro: Variáveis de ambiente USERNAME ou GITHUB_TOKEN não estão definidas.");
  process.exit(1); // Encerra execução se estiver incompleto
}

// Função para buscar dados da API do GitHub
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

    // Gerar gráfico simples de "Most Used Languages"
    const languageCount = {};
    repos.forEach((repo) => {
      if (repo.language) {
        languageCount[repo.language] = (languageCount[repo.language] || 0) + repo.size;
      }
    });

    const languageGraph = JSON.stringify(languageCount, null, 2);

    // Salvar arquivos na pasta "public"
    fs.writeFileSync(path.join(outputDir, "most-used-languages.json"), languageGraph);

    console.log(`Gráficos gerados com sucesso para o usuário ${USERNAME}!`);
  } catch (error) {
    console.error("Erro ao buscar dados da API:", error.message);
  }
}

fetchGitHubStats();
