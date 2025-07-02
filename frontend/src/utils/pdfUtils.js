import { jsPDF } from 'jspdf';

/**
 * Export chat conversation as PDF
 * @param {Array} chatMessages - Array of chat messages
 * @param {string} username - The username to display for user messages
 */
export function exportChatToPDF(chatMessages, username = 'User') {
  const doc = new jsPDF();
  let y = 20;

  // Title: bold, centered
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Chat Conversation', 105, y, { align: 'center' });
  y += 10;

  // Date and time: centered
  const now = new Date();
  const dateTimeStr = now.toLocaleString();
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(dateTimeStr, 105, y, { align: 'center' });
  y += 12;

  // Messages
  chatMessages
    .filter(msg => msg.sender === 'user' || msg.sender === 'bot')
    .forEach((msg, idx) => {
      let isUser = msg.sender === 'user';
      let label = isUser ? `${username}:` : 'Bot:';
      let message = msg.text || '';
      let lines = doc.splitTextToSize(message, 120);

      // Label
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      if (isUser) {
        doc.text(label, 200, y, { align: 'right' });
      } else {
        doc.text(label, 10, y, { align: 'left' });
      }
      y += 7;

      // Message
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      lines.forEach(line => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        if (isUser) {
          doc.text(line, 200, y, { align: 'right' });
        } else {
          doc.text(line, 10, y, { align: 'left' });
        }
        y += 6;
      });
      y += 6; // Extra space between messages
    });

  doc.save('chat_conversation.pdf');
} 