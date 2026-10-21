function validateOrder(order, messageElement) {
  const message = [];
  const validatedOrder = {};
  const validatedLines = [];

  order.lines.forEach((line) => {
    const product = menu.find((product) => product.id === line.id);
    if (!product) {
      message.push(
        `Votre commande contient des articles que nous ne vendons pas.`,
      );
    } else if (!product.available) {
      message.push(`${product.name} est épuisé.`);
    } else if (
      !Number.isInteger(line.quantity) ||
      line.quantity > 10 ||
      line.quantity < 1
    ) {
      message.push(`La quantité de ${product.name} dépasse 10.`);
    } else {
      validatedLines.push(line);
    }
  });

  validatedOrder.customer = order.customer ? order.customer : "";
  validatedOrder.lines = validatedLines;

  messageElement.textContent = message.join(" ");
  return validatedOrder;
}

function validateAdvice(response) {
  const validatedAdvice = {};
  const validatedSuggestions = [];

  response.suggestions.forEach((suggestion) => {
    const product = menu.find((product) => product.id === suggestion.id);
    if (!product || !product.available) {
      return;
    } else {
      validatedSuggestions.push(suggestion);
    }
  });

  validatedAdvice.advice = response.advice ? response.advice : "";
  validatedAdvice.suggestions = validatedSuggestions;

  return validatedAdvice;
}
