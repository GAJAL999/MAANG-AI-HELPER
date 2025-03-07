function exec() {
    // Ensure we don't add duplicate buttons
    if (document.getElementById("ai-help-button")) {
        console.log("ℹ️ AI Help button already exists. Skipping addition.");
        return;
    }

    // Find the "Ask Doubt" button
    const askDoubtButton = document.querySelector(".ant-btn.css-19gw05y.ant-btn-default.Button_gradient_light_button__ZDAR_.coding_ask_doubt_button__FjwXJ.gap-1.py-2.px-3.overflow-hidden");
    if (!askDoubtButton) {
        console.warn("⚠️ 'Ask Doubt' button not found. AI Help button not added.");
        return;
    }

    const parent = askDoubtButton.parentElement;

    // Create the AI Help button
    const helpButton = document.createElement("button");
    helpButton.className = "ant-btn css-19gw05y ant-btn-default Button_gradient_light_button__ZDAR_ coding_ask_doubt_button__FjwXJ gap-1 py-2 px-3 overflow-hidden";
    helpButton.id = "ai-help-button";

    // Create the help icon image
    const img = document.createElement("img");
    img.src = chrome.runtime.getURL("help_icon.png");
    img.alt = "AI Help";
    img.style.width = "16px";
    img.style.height = "16px";

    // Create the text span
    const span = document.createElement("span");
    span.textContent = "AI Help";
    span.className = "coding_ask_doubt_gradient_text__FX_hZ";

    // Append the image and text to the button
    helpButton.appendChild(img);
    helpButton.appendChild(span);
    parent.style.display = "flex";
    parent.style.gap = "2px"; 

    // Apply styles
    Object.assign(helpButton.style, {
        backgroundColor: "rgba(0, 0, 0, 0)",
        color: "rgb(53, 104, 175)",
        padding: "8px 16px",
        border: "0px none rgb(53, 104, 175)",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        overflow: "hidden",
        fontFamily: '"DM Sans"',
        fontSize: "16px",
        fontWeight: "550",
        cursor: "pointer",
        marginLeft: "0px"
    });

    // Insert AI Help button **right after** the "Ask Doubt" button
    askDoubtButton.insertAdjacentElement("afterend", helpButton);

    console.log("✅ AI Help button added next to the 'Ask Doubt' button.");

    // Create AI help dialog box
    let dialogBox = document.createElement("div");
    dialogBox.id = "ai-dialog-box";
    dialogBox.style.display = "none";
    dialogBox.style.position = "fixed";
    dialogBox.style.bottom = "100px";
    dialogBox.style.left = "70px";
    dialogBox.style.width = "700px";
    dialogBox.style.backgroundColor = "#fff";
    dialogBox.style.border = "1px solid #ccc";
    dialogBox.style.padding = "10px";
    dialogBox.style.boxShadow = "0px 0px 10px rgba(8, 2, 2, 0.2)";
    dialogBox.style.zIndex = "1001";
    dialogBox.innerHTML = `
        <h2 style="font-size: 16px; margin: 0;">AI Help Section</h2>
        <p style="font-size: 12px;">Ask AI for hints or explanations:</p>
        <textarea id="ai-question" placeholder="Type your question..." style="width: 100%; height: 50px;"></textarea>
        <button id="ai-submit" style="margin-top: 5px; width: 100%;">Get Help</button>
        <div id="ai-response" style="margin-top: 10px; font-size: 14px;"></div>
        <button id="ai-close" style="margin-top: 5px; width: 100%; background-color: red; color: white;">Close</button>
    `;

    document.body.appendChild(dialogBox);

    // Show/hide dialog box
    helpButton.addEventListener("click", () => {
        dialogBox.style.display = "block";
    });

    document.getElementById("ai-close").addEventListener("click", () => {
        dialogBox.style.display = "none";
    });

    // Handle AI request
    document.getElementById("ai-submit").addEventListener("click", async () => {
        let question = document.getElementById("ai-question").value.trim();
        if (!question) {
            alert("Please enter a question.");
            return;
        }

        let responseContainer = document.getElementById("ai-response");
        responseContainer.innerHTML = "Generating response...";

        // Extract problem details before sending to AI
        const problemDetails = extractProblemDetails();
        console.log("Extracted Problem Details:", problemDetails);

        // Generate strict AI prompt
        const aiPrompt = generateAIPrompt(problemDetails);
        console.log("Generated AI Prompt:", aiPrompt);

        //Get AI Response
        let aiResponse = await askGemini(question);
        responseContainer.innerHTML = aiResponse;
    });

    console.log("✅ AI Help button setup complete.");
}

// ✅ AI Request Function with Debugging & Error Handling
async function askGemini(question) {
    const apiKey = await getAPIKey();
    if (!apiKey) {
        return "❌ API Key is missing. Please enter it in the extension popup.";
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const requestBody = { contents: [{ parts: [{ text: question }] }] };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const responseData = await response.json();
        console.log("🔍 Full API Response:", responseData);

        if (responseData.error) {
            return `❌ API Error: ${responseData.error.message}`;
        }

        return responseData?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response from AI.";
    } catch (error) {
        console.error("❌ Error fetching response:", error);
        return "❌ Error fetching response.";
    }
}

// Fetch API key from storage
async function getAPIKey() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(["apiKey"], (result) => {
            resolve(result.apiKey || null);
        });
    });
}
function closeAIPopupOnPageChange() {
    let dialogBox = document.getElementById("ai-dialog-box");
    if (dialogBox) {
        dialogBox.style.display = "none";
        console.log("📌 AI Help popup closed due to page change.");
    }
}

// Ensure script execution
exec();

// Load `problem.js` properly before requesting problem details
let script = document.createElement("script");
script.src = chrome.runtime.getURL("problem.js");
script.onload = () => {
    console.log("✅ problem.js loaded successfully.");
    //exec();
};
document.documentElement.appendChild(script);
