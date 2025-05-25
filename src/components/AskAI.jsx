import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './AskAI.css';

const AskAI = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAnswer('');
    setError('');

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: question }],
              },
            ],
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        setAnswer(data.candidates[0].content.parts[0].text);
      } else {
        setError('AI could not generate an answer. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="askai-container">
        <h2>💬 Ask AI About Anything</h2>
        <form onSubmit={handleAsk} className="askai-form">
          <input
            type="text"
            placeholder="Type your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Asking...' : 'Ask AI'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}
        {answer && (
          <div className="ai-answer">
            <h3>🧠 AI Answer:</h3>
            <p>{answer}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AskAI;
