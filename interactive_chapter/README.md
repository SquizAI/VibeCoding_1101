<div align="center">

# <img src="https://img.shields.io/badge/-INTERACTIVE-e74c3c?style=for-the-badge"/> VIBE CODING EXPERIENCE

<p align="center">
<i>"Learn by doing: The hands-on companion to Vibe Coding 101"</i>
</p>

</div>

---

## 🚀 Overview

The Interactive Vibe Coding Experience is a fully functional web application that demonstrates the principles and techniques described in the book. This immersive learning tool allows you to see Vibe Coding in action, experiment with AI-assisted development, and understand how human-AI collaboration works in practice.

<div align="center">
<img src="https://img.shields.io/badge/Tech_Stack-React_+_TypeScript-blue?style=flat-square"/>
<img src="https://img.shields.io/badge/API-OpenAI-green?style=flat-square"/>
<img src="https://img.shields.io/badge/Deployment-Netlify-lightgrey?style=flat-square"/>
</div>

---

## ✨ Key Features

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>🧠 AI Workflow Demonstration</h3>
      <p>See how AI and humans collaborate in real-time with an interactive workflow demonstration that walks through the entire development process.</p>
      <h3>🎨 Interactive Code Generation</h3>
      <p>Experiment with different prompts and approaches to generate, modify, and refine code with AI assistance.</p>
    </td>
    <td width="50%" valign="top">
      <h3>📊 Performance Visualization</h3>
      <p>Visual representation of the efficiency gains and quality improvements achieved through Vibe Coding techniques.</p>
      <h3>🔍 Case Study Explorer</h3>
      <p>Browse through real-world examples showing how Vibe Coding approaches solved complex development challenges.</p>
    </td>
  </tr>
</table>

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v16.0.0 or higher)
- npm or yarn
- OpenAI API key (free tier is sufficient for basic usage)

### Installation

```bash
# Navigate to the interactive application directory
cd vibe-coding-interactive

# Install dependencies
npm install
# or
yarn install

# Create environment file from example
cp .env.example .env

# Add your OpenAI API key to .env file
# OPENAI_API_KEY=your_api_key_here

# Start the development server
npm run dev
# or
yarn dev
```

Your application will be available at `http://localhost:3000`

---

## 📚 Component Documentation

The application is structured using a modular component-based architecture:

<div align="center">
  <table>
    <tr>
      <td align="center"><b>Component</b></td>
      <td align="center"><b>Purpose</b></td>
      <td align="center"><b>Key Files</b></td>
    </tr>
    <tr>
      <td><code>AIWorkflowDemo</code></td>
      <td>Interactive demonstration of the AI-human collaborative workflow</td>
      <td><code>AIWorkflowDemo.tsx</code>, <code>workflow-styles.ts</code></td>
    </tr>
    <tr>
      <td><code>CodeGenerator</code></td>
      <td>Interface for generating and modifying code with AI</td>
      <td><code>CodeGenerator.tsx</code>, <code>PromptLibrary.ts</code></td>
    </tr>
    <tr>
      <td><code>CaseStudies</code></td>
      <td>Collection of real-world Vibe Coding examples</td>
      <td><code>CaseStudies.tsx</code>, <code>case-data.ts</code></td>
    </tr>
    <tr>
      <td><code>PerformanceMetrics</code></td>
      <td>Visualizations of efficiency and quality metrics</td>
      <td><code>PerformanceMetrics.tsx</code>, <code>chart-config.ts</code></td>
    </tr>
  </table>
</div>

---

## 🌐 Live Demo

Experience the application without installation:

<div align="center">

### [📲 Try the Live Demo](https://vibecoding-101.netlify.app/)

</div>

---

## 🧪 Experimentation Guide

This interactive application is designed to help you experiment with different Vibe Coding approaches:

1. **Prompt Engineering**: Try different ways of communicating with the AI to see how it affects output quality
2. **Iteration Patterns**: Explore how feedback cycles improve the collaboration results
3. **Context Management**: Learn how providing appropriate context enhances AI-generated code
4. **Specialized Use Cases**: Test AI collaboration across different types of development tasks

---

## 🔍 Troubleshooting

<details>
<summary><b>API Connection Issues</b></summary>

If you encounter problems connecting to the OpenAI API:
- Verify your API key is correct in the .env file
- Check that you have sufficient credits in your OpenAI account
- Ensure your network allows connections to OpenAI's servers
</details>

<details>
<summary><b>Performance Problems</b></summary>

If the application is running slowly:
- Reduce the complexity of your prompts
- Limit the number of concurrent API requests
- Consider using a lighter model configuration in the settings
</details>

---

<div align="center">

[<img src="https://img.shields.io/badge/⬅️_Back_to_Main_Contents-blue?style=for-the-badge"/>](../README.md)

</div>
