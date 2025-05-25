import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const AskAI = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('http://localhost:5000/api/ask-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ question })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to get response' }));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to get response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Ask AI Assistant
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            label="Ask your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Button
            type="submit"
            variant="contained"
            endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            disabled={loading || !question.trim()}
            sx={{ mb: 2 }}
          >
            {loading ? 'Getting Response...' : 'Send Question'}
          </Button>
        </form>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {response && (
          <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>
              Response:
            </Typography>
            <Typography whiteSpace="pre-wrap">
              {response}
            </Typography>
          </Paper>
        )}
      </Paper>
    </Box>
  );
};

export default AskAI; 