const OLLAMA_URL = "http://localhost:11434/api/chat";
const MODEL_NAME = "qwen3.5:4b";

const emptyMessage = "Veuillez saisir une chaîne de caractères.";

const producs = menu.map((product) => {
  const productInfo = {};
  productInfo.id = product.id;
  productInfo.name = product.name;
  return productInfo;
});
