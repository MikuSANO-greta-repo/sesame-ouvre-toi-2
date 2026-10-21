// La caisse du premier exercice est corrigée dans le dossier register/ (pour partir sur de bonnes bases).
// Tu y touches seulement quand une étape te le demande.

// ============================================================
// L'IA du comptoir. Ton code, une section par étape.
// ============================================================
const messagesForOrder = [];

const orderPrompt = `
You are an ordering assistant for **Sésame**. 
When you accept orders, return "id" and "quantity" from the list.

Here is the list of products: ${JSON.stringify(producs)}.
When you can't find the product **return null** both id and quantity.

If the order contains "pour", a person's name comes after. 
Return that value as “customer.”
If it does not contain a person's name, return an empty string.`;

const orderForm = document.querySelector("#ai-order-form");
const orderInput = document.querySelector("#ai-order-input");
const orderButton = document.querySelector("#ai-order-button");
const orderMessage = document.querySelector("#ai-order-message");

function resetOrderConversation() {
  messagesForOrder.length = 0;
  messagesForOrder.push({ role: "system", content: orderPrompt });
}

// Étape 1 · Parler à Qwen
/*
As a preparation, 
1, check weather model is ready to run `ollama list`
2, if there isn't a model which you'd like to use in the list, `ollama pull <nameOfTheModel:tag>`
*/
async function askModelForOrder(conversation) {
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
          customer: { type: "string" },
          lines: {
            type: "array",
            items: {
              type: "object",
              id: { type: "number" },
              quantity: { type: "number" },
            },
          },
        },
        required: ["customer", "id", "quantity"],
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
async function sendMessageForOrder(text) {
  orderMessage.textContent = "";
  orderMessage.classList?.remove("is-error");

  if (!text.trim()) return;

  messagesForOrder.push({
    role: "user",
    content: text,
  });

  orderMessage.textContent = "Qwen prend la commande…";
  orderButton.setAttribute("disabled", "disabled");

  try {
    const response = await askModelForOrder(messagesForOrder);
    messagesForOrder.push({ role: "assistant", content: response });
    const answer = JSON.parse(response);

    const validatedOrder = validateOrder(answer, orderMessage);

    if (validatedOrder.lines.length === 0) {
      throw new Error(
        "Nous n'avons pas trouvé le produit que vous recherchez.",
      );
    } else {
      order.customer = validatedOrder.customer;

      validatedOrder.lines.forEach((line) => {
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
    orderMessage.textContent = `Oups : L'IA ne répond pas : prends la commande à la main. (le détail est dans la console, F12)`;
    console.error(error);

    orderMessage.classList.add("is-error");
    resetOrderConversation();
  }

  orderButton.removeAttribute("disabled");
  orderInput.value = "";
}

orderForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (orderInput.value === "") {
    orderMessage.textContent = emptyMessage;
    return;
  }

  const orderingMessage = `Order: ${orderInput.value}`;
  sendMessageForOrder(orderingMessage);
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

resetOrderConversation();
