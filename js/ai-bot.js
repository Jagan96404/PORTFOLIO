/* ==========================================================================
   AI CONVERSATIONAL ASSISTANT (Interactive Storytelling Bot)
   ========================================================================== */

const BOT_KNOWLEDGE = {
  'background': "I'm JAGAN M, a technology enthusiast and developer focused on software development, full-stack engineering, Python/Java applications, data science, and cybersecurity.",
  'tech stack': "My technical stack includes Full-Stack Web (HTML, CSS, JS, UI/UX), Python (Scapy, automation, data processing), Java (Java Swing, desktop systems), SQL & SQLite databases, and Git/GitHub.",
  'philosophy': "My problem-solving philosophy is: Understand → Break Down → Build → Test → Improve. I focus on clean code, user-focused design, security-conscious development, and performance.",
  'projects': "My featured projects include BrewVerse (luxury coffee web app with AI Sommelier), Network Traffic Analyzer & Live Cyber Dashboard (Python packet monitoring with Scapy), and a Cybersecurity Projects Suite.",
  'exploring': "I am currently expanding my knowledge in advanced full-stack development, backend microservice architecture, cybersecurity engineering, data science, machine learning, and cloud integrations.",
  'availability': "I am open to full-time software developer opportunities, freelance projects, open-source collaboration, hackathons, and cybersecurity/web engineering collaborations!"
};

function initAIBot() {
  const container = document.getElementById('ai-messages-area');
  const chips = document.querySelectorAll('.prompt-chip');

  if (!container) return;

  function appendMsg(text, sender = 'bot') {
    const msg = document.createElement('div');
    msg.className = `ai-msg ${sender}`;
    msg.textContent = text;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;

    if (sender === 'bot' && window.soundEngine) {
      window.soundEngine.playClick();
    }
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const topic = chip.dataset.topic;
      const questionText = chip.textContent;

      appendMsg(questionText, 'user');

      setTimeout(() => {
        const answer = BOT_KNOWLEDGE[topic] || "I'm passionate about building cutting-edge web experiences. Feel free to explore my projects or reach out directly!";
        appendMsg(answer, 'bot');
      }, 500);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initAIBot();
});
