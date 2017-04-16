// Transparently transpile JSX code to JS
// This must be done in order to create elements via JSX and render them
// server-side. Don't require this in the same place as your JSX code,
// you will get a syntax error because Node is unaware you're writing JSX code.
require("babel-register");

// Start backend
require("./app");
