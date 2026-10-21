// La caisse du premier exercice est corrigée dans le dossier register/ (pour partir sur de bonnes bases).
// Tu y touches seulement quand une étape te le demande.

// ============================================================
// L'IA du comptoir. Ton code, une section par étape.
// ============================================================
const OLLAMA_URL = "http://localhost:11434/api/chat";
const MODEL_NAME = "qwen3.5:4b";
const messages = [];

const producs = menu.map((product) => {
  const productInfo = {};
  productInfo.id = product.id;
  productInfo.name = product.name;
  return productInfo;
});
const orderPrompt = `
You are an ordering assistant for **Sésame**. 
When you accept orders, return **id** and **quantity** from the list.
Here is the list of products: ${JSON.stringify(producs)}.
When you can't find the product **return null as value** both id and quantity.`;

const orderEmptyMessage = "Veuillez saisir une chaîne de caractères.";

const orderForm = document.querySelector("#ai-order-form");
const orderInput = document.querySelector("#ai-order-input");
const orderButton = document.querySelector(".ai-box .field-row button");
const orderMessage = document.querySelector("#ai-order-message");

function startConversation() {
  messages.length = 0;
  messages.push({ role: "system", content: orderPrompt });
}

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
      format: {
        type: "object",
        properties: {
          lines: {
            type: "array",
            items: {
              type: "object",
              id: { type: "number" },
              quantity: { type: "number" },
            },
          },
        },
        required: ["id", "quantity"],
      },
      options: {
        temperature: 0,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data.message.content;
}

// Étape 2 · La carte dans le prompt système
async function sendMessage(text) {
  orderMessage.textContent = "";

  if (!text.trim()) return;

  messages.push({
    role: "user",
    content: text,
  });

  orderMessage.textContent = "Qwen prend la commande…";
  orderButton.setAttribute("disabled", "disabled");

  try {
    const response = await askModel(messages);
    messages.push({ role: "assistant", content: response });
    const answer = JSON.parse(response);

    const validtedOrder = validateOrder(answer, orderMessage);

    if (validtedOrder.length === 0) {
      throw new Error(
        "Nous n'avons pas trouvé le produit que vous recherchez.",
      );
    }

    if (validtedOrder.length > 0) {
      validtedOrder.forEach((line) => {
        const orderdProduct = menu.find((product) => product.id === line.id);
        let counter = 0;
        while (counter < line.quantity) {
          order.add(orderdProduct);
          counter++;
        }
      });
      renderTicket();
    }
  } catch (error) {
    orderMessage.textContent = `Oups : ${error.message} (le détail est dans la console, F12)`;
    console.error(error);
  }

  orderButton.removeAttribute("disabled");
  orderInput.value = "";
}

orderForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (orderInput.value === "") {
    orderMessage.textContent = orderEmptyMessage;
    return;
  }

  const orderingMessage = `Order: ${orderInput.value}`;
  sendMessage(orderingMessage);
});

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

startConversation();
