import {handlePremiumUpdate}  from 'src/app/api/write2Json.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  const { formData, premium } = req.body;
  try {
    await handlePremiumUpdate(formData, premium);
    res.status(200).json({ message: 'Premium updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update premium' });
  }
}
