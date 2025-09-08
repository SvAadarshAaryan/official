export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, image } = req.body;

  if (!message && !image) {
    return res.status(400).json({ error: "Message or image is required" });
  }

  try {
    // Build messages array
    let messages = [
      { role: "system", content: "You are Aadarsh AI, a helpful chatbot created by Aadarsh Aaryan. Be friendly and clear." }
    ];

    // If text included
    if (message) {
      messages.push({ role: "user", content: message });
    }

    // If image included
    if (image) {
      messages.push({
        role: "user",
        content: [
          { type: "text", text: message || "Please analyze this image." },
          { type: "image_url", image_url: { url: image } }
        ]
      });
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: image ? "gpt-4o-mini" : "gpt-4o-mini", // same model, supports vision
        messages
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.choices?.[0]?.message?.content?.trim() || "No reply.";
    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
}
