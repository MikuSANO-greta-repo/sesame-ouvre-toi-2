const messagesForAdvice = [];

const advicePrompt = `
You are an ordering assistant for **Sésame**. 
When you ask for your suggestion, return "id" of the product from the list and explain why you suggest it as "advice".
When you return the id, 2 ids are maximum. 
When you return the advice, it should be within 80 characters.
When you return the advice, use French.
Here is the list of products: ${JSON.stringify(producs)}.
If you can't find an answer, return null as value of id.`;

const adviceForm = document.querySelector("#ai-advice-form");
const adviceInput = document.querySelector("#ai-advice-input");
const adviceButton = document.querySelector("#ai-advice-button");
const adviceMessage = document.querySelector("#ai-advice-message");

function resetAdviceConversation() {
  messagesForAdvice.length = 0;
  messagesForAdvice.push({ role: "system", content: advicePrompt });
}

function resetAdvice() {
  menu.forEach((product) => {
    if (product.isSuggested) delete product.isSuggested;
  });
  adviceMessage.textContent = "";
}

async function askModelForAdvice(conversation) {
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
          advice: { type: "string" },
          suggestions: {
            type: "array",
            items: {
              type: "object",
              id: { type: "number" },
            },
          },
        },
        required: ["advice", "id"],
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

async function sendMessageForAdvice(text) {
  adviceMessage.textContent = "";
  adviceMessage.classList?.remove("is-error");
  resetAdvice();
  resetAdviceConversation();

  if (!text.trim()) return;

  messagesForAdvice.push({
    role: "user",
    content: text,
  });

  adviceMessage.textContent = "Qwen prend la commande…";
  adviceButton.setAttribute("disabled", "disabled");

  try {
    const response = await askModelForAdvice(messagesForAdvice);
    messagesForAdvice.push({ role: "assistant", content: response });
    const answer = JSON.parse(response);

    const validatedAdvice = validateAdvice(answer);

    if (validatedAdvice.suggestions.length === 0) {
      throw new Error("Nous n'avons trouvé aucun produit à vous recommander.");
    } else {
      const suggestedIds = validatedAdvice.suggestions.map(
        (suggestion) => suggestion.id,
      );

      menu.forEach((product, idx) => {
        if (suggestedIds.includes(product.id)) {
          const updatedProduct = { ...product, isSuggested: true };
          menu[idx] = updatedProduct;
        }
      });
      renderMenu("all");
      adviceMessage.textContent = validatedAdvice.advice;
    }
  } catch (error) {
    adviceMessage.textContent = `Oups : L'IA ne répond pas : prends la commande à la main. (le détail est dans la console, F12)`;
    console.error(error);

    adviceMessage.classList.add("is-error");
    resetAdviceConversation();
  }

  adviceButton.removeAttribute("disabled");
  adviceInput.value = "";
}

adviceForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (adviceInput.value === "") {
    adviceMessage.textContent = emptyMessage;
    return;
  }

  const askingMessage = `Asking advice: ${adviceInput.value}`;
  sendMessageForAdvice(askingMessage);
});
