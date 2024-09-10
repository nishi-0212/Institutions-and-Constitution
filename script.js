// Define your OpenAI API key
const apiKey = "your-openai-api-key-here";

// Function to ask a question and handle rate limits
async function askQuestion(prompt) {
    const maxRetries = 5;
    let retryDelay = 1000; // Initial retry delay in milliseconds

    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 1024,
                    temperature: 0.5
                })
            });

            const data = await response.json();

            // Check if the response contains the expected data
            if (data.choices && data.choices.length > 0) {
                return data.choices[0].message.content;
            } else {
                throw new Error("Unexpected API response structure: " + JSON.stringify(data));
            }
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.error("Rate limit exceeded. Retrying in", retryDelay / 1000, "seconds...");
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                retryDelay *= 2;
            } else {
                // If there's any other error, throw it so that the catch block in `sendMessage` handles it.
                throw error;
            }
        }
    }

    throw new Error("Failed after 5 retries due to rate limit.");
}

// Function to send a message and receive a response
async function sendMessage() {
    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value;

    if (!message) {
        alert("Please enter a message.");
        return;
    }

    // Create a new message element for user
    const newMessage = document.createElement("li");
    newMessage.textContent = `You: ${message}`;
    newMessage.classList.add('you');
    document.getElementById("messages").appendChild(newMessage);

    try {
        const answer = await askQuestion(message);

        // Create a new message element for chatbot response
        const chatbotMessage = document.createElement("li");
        chatbotMessage.textContent = `Chatbot: ${answer}`;
        chatbotMessage.classList.add('chatbot');
        document.getElementById("messages").appendChild(chatbotMessage);
    } catch (error) {
        // Display a custom error message for rate limit errors
        if (error.message.includes("rate limit")) {
            alert("Error: Rate limit exceeded, please try again later.");
        } else {
            console.error("Error occurred:", error); // Log other errors to the console
            alert("Error: Something went wrong, please try again later."); // General error message
        }
    }

    messageInput.value = "";
    scrollToBottom();
}

function scrollToBottom() {
    const messages = document.getElementById("messages");
    messages.scrollTop = messages.scrollHeight;
}

// Attach event listener to the send button
document.getElementById("sendMessage").addEventListener("click", sendMessage);

