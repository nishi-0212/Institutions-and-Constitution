// Function to send a hardcoded response
function sendMessage(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.toLowerCase().trim(); // Convert message to lowercase and trim whitespace

    // Display the user's message
    const userMessage = document.createElement("li");
    userMessage.textContent = `You: ${messageInput.value}`;
    userMessage.classList.add('you');
    document.getElementById("messages").appendChild(userMessage);

    // Predefined response for the fundamental rights question
    let answer;
    if (message === "what are my fundamental rights?") {
        answer = "You have 6 fundamental rights: Right to Equality, Right to Freedom, Right against Exploitation, Right to Freedom of Religion, Cultural and Educational Rights, and Right to Constitutional Remedies.";
    } else {
        answer = "I'm not sure about that. Please ask me another question.";
    }

    // Create and append the chatbot message
    const chatbotMessage = document.createElement("li");
    chatbotMessage.textContent = `Chatbot: ${answer}`;
    chatbotMessage.classList.add('chatbot');
    document.getElementById("messages").appendChild(chatbotMessage);

    // Clear the input field
    messageInput.value = "";
}

// Attach event listener to the send button
document.getElementById("sendMessage").addEventListener("click", sendMessage);
