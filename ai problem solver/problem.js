
function extractProblemDetails() {
    const problemDetails = {};

    // Extract Problem Name
    const problemHeadingElement = document.querySelector('.problem_heading.fs-4');
    problemDetails.problemName = problemHeadingElement ? problemHeadingElement.innerText.trim() : "Unknown Problem";

    // Extract Description
    const descriptionElement = document.querySelector('.coding_desc__pltWY .markdown-renderer');
    problemDetails.description = descriptionElement ? descriptionElement.innerText.trim() : "No description available.";

    // Extract Input Format
    const inputFormatElement = document.querySelector('.coding_input_format__pv9fS .markdown-renderer');
    problemDetails.inputFormat = inputFormatElement ? inputFormatElement.innerText.trim() : "No input format specified.";

    // Extract Output Format
    const outputFormatElement = document.querySelector('.coding_output_format__XXXX .markdown-renderer'); // Update with correct class
    problemDetails.outputFormat = outputFormatElement ? outputFormatElement.innerText.trim() : "No output format specified.";

    // Extract Constraints
    const constraintsElement = document.querySelector('.coding_constraints__XXXX .markdown-renderer'); // Update with correct class
    problemDetails.constraints = constraintsElement ? constraintsElement.innerText.trim() : "No constraints provided.";

    // Extract Sample Inputs & Outputs
    problemDetails.sampleInputs = [];
    problemDetails.sampleOutputs = [];

    const sampleContainers = document.querySelectorAll('.border_blue.border_radius_8');
    sampleContainers.forEach(container => {
        const inputElement = container.querySelector('.coding_input_format_container__iYezu:first-child .coding_input_format__pv9fS');
        const outputElement = container.querySelector('.coding_input_format_container__iYezu:last-child .coding_input_format__pv9fS');

        if (inputElement) {
            problemDetails.sampleInputs.push(inputElement.innerText.trim());
        }
        if (outputElement) {
            problemDetails.sampleOutputs.push(outputElement.innerText.trim());
        }
    });

    // Extract Note (if available)
    const noteElement = document.querySelector('.coding_input_format__pv9fS:last-child .markdown-renderer');
    problemDetails.note = noteElement ? noteElement.innerText.trim() : "No additional notes.";

    // Extract Selected Language
    const languageElement = document.querySelector('.ant-select-selection-item div.text-blue-dark');
    problemDetails.language = languageElement ? languageElement.innerText.trim() : "Unknown language";

    // Extract Current Code
    const codeElement = document.querySelector('.view-lines.monaco-mouse-cursor-text');
    problemDetails.code = codeElement ? codeElement.innerText.trim() : "// No code available";

    return problemDetails;
}

  function generateAIPrompt(problemDetails) {
    let prompt = `
    You are an AI assistant that strictly answers questions based on the problem statement provided. 
    DO NOT answer questions outside the given problem.

    Here is the problem:

    **Problem:** ${problemDetails.problemName}

    **Description:** 
    ${problemDetails.description}

    **Input Format:** 
    ${problemDetails.inputFormat}

    **Output Format:** 
    ${problemDetails.outputFormat}

    **Constraints:** 
    ${problemDetails.constraints || "None"}

    **Sample Inputs & Outputs:**
    ${problemDetails.sampleInputs.map((input, index) => `Sample ${index + 1} Input:\n${input}\nSample ${index + 1} Output:\n${problemDetails.sampleOutputs[index]}`).join('\n\n')}

    **Note:** ${problemDetails.note || "None"}

    **Selected Language:** ${problemDetails.language}

    **User's Current Code:**
    ${problemDetails.code}

    🔴 **Rules for AI Response:**
    - If the user asks a question unrelated to the problem, respond: "I am designed to answer questions based on the problem."
    - If the user's code has an issue, point it out based on the constraints and sample cases.
    - Suggest optimizations ONLY IF necessary.
    - Return a correct solution **ONLY in the selected language (${problemDetails.language})**.

    🚨 **REMEMBER:** You are NOT allowed to answer unrelated queries.
    `;

    return prompt;
}

  console.log("problemDetails", problemDetails);

  document.getElementById('ai-help-button').addEventListener('click', () => {
    const problemDetails = extractProblemDetails();
    const aiPrompt = generateAIPrompt(problemDetails);
  
    // Send the prompt to your AI backend
    fetch('YOUR_AI_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: aiPrompt }),
    })
      .then(response => response.json())
      .then(data => {
        // Handle the AI response and display it in your dialog box
        const aiResponse = data.response; // Adjust based on your backend's response structure
        alert(aiResponse); // Replace with your dialog box display
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to get AI suggestion. Please try again.');
      });
  });


