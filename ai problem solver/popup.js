document.addEventListener("DOMContentLoaded", function () {
    let apiKeyInput = document.getElementById("apiKey");
    let saveButton = document.getElementById("saveApiKey");
    let statusText = document.getElementById("status");

    // Load saved API Key
    chrome.storage.sync.get(["apiKey"], function (result) {
        if (result.apiKey) {
            apiKeyInput.value = result.apiKey;
        }
    });

    // Save API Key to Chrome storage
    saveButton.addEventListener("click", function () {
        let apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            chrome.storage.sync.set({ apiKey: apiKey }, function () {
                statusText.textContent = "✅ API Key saved successfully!";
                setTimeout(() => statusText.textContent = "", 2000);
            });
        } else {
            statusText.textContent = "❌ Please enter a valid API key.";
        }
    });
});
