chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getProblemDetails") {
        importScripts("problem.js"); // Load problem.js dynamically
        let details = getProblemDetails(); // Call function from problem.js
        sendResponse(details);
    }
    return true;
});
