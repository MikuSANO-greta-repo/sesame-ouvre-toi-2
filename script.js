// La caisse du premier exercice est corrigée dans le dossier register/ (pour partir sur de bonnes bases).
// Tu y touches seulement quand une étape te le demande.

// ============================================================
// L'IA du comptoir. Ton code, une section par étape.
// ============================================================
const OLLAMA_URL = "http://localhost:11434/api/chat";
const MODEL_NAME = "qwen3.5:4b";

// Étape 1 · Parler à Qwen
/*
As a preparation, 
1, check weather model is ready to run `ollama list`
2, if there isn't a model which you'd like to use in the list, `ollama pull <nameOfTheModel:tag>`
*/
async function askModel(conversation) {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: conversation,
      think: false,
      stream: false,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data.message.content;
}

// Étape 2 · La carte dans le prompt système


// Étape 3 · Une réponse en JSON


// Étape 4 · Le ticket se remplit


// Étape 5 · La caisse décide


// Étape 6 · Quand l'IA ne répond pas


// Étape 7 · Le prénom aussi


// Étape 8 · Le conseil du barista


// Bonus


// Premier affichage
renderMenu("all");
renderTicket();
