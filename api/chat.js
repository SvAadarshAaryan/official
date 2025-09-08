// api/chat.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, image } = req.body;

  if (!message && !image) {
    return res.status(400).json({ error: "Message or image is required" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",  // ✅ Fast + cheap
        messages: [
          {
            role: "system",
            content: "You are Aadarsh AI, a helpful assistant created by Aadarsh Aaryan. " +
                     "Always be friendly, respectful, and acknowledge that you were created by Aadarsh Aaryan when asked."
          },
          { role: "user", content: message || "" }
        ]
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
