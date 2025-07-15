// pages/api/places-autocomplete.js
// Google Places Autocomplete API Route for Next.js

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { input } = req.body;
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error('Google Maps API key not found');
      res.status(500).json({ error: 'Google Maps API key not configured' });
      return;
    }

    if (!input || input.length < 3) {
      res.status(400).json({ error: 'Input must be at least 3 characters' });
      return;
    }

    // Call Google Places Autocomplete API
    const googleUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=address&components=country:us&key=${apiKey}`;
    
    console.log('Calling Google Places API for:', input);
    
    const response = await fetch(googleUrl);
    const data = await response.json();

    if (!response.ok) {
      console.error('Google API Error:', data);
      res.status(response.status).json({ error: data.error_message || 'Google API error' });
      return;
    }

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google API Status Error:', data.status, data.error_message);
      res.status(400).json({ error: data.error_message || `Google API status: ${data.status}` });
      return;
    }

    // Return the predictions
    res.status(200).json({
      predictions: data.predictions || [],
      status: data.status
    });

  } catch (error) {
    console.error('API Route Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}