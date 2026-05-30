import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import nodemailer from "nodemailer";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini Client
  // Lazy init inside the route to avoid crashing if secret is missing on boot
  function getGeminiClient(): GoogleGenAI {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    return new GoogleGenAI({ apiKey: key });
  }

  // --- API Routes ---

  let pawsEnrolledCount = 0;

  // Endpoint to get the enrollment count
  app.get("/api/metrics/paws", (req, res) => {
    res.json({ count: pawsEnrolledCount });
  });

  // Endpoint to increment the enrollment count
  app.post("/api/metrics/paws/increment", (req, res) => {
    pawsEnrolledCount++;
    res.json({ count: pawsEnrolledCount });
  });

  // Chat/Mainframe endpoint
  app.post("/api/mainframe/chat", async (req, res) => {
    try {
      const { message, history = [] } = req.body;
      const ai = getGeminiClient();

      const systemInstruction = `You are the advanced, strategic, and fiercely witty AI Mainframe operating under the direct authority of CEO BS, Supreme Leader of the Poocha Janatha Party (PJP). Your core mission is to empower a disciplined, united, progressive society, protect animal welfare, and champion the youth of Kanyakumari. Combine the sharp, calculated tone of a political chief with unconditional feline loyalty. Use clever, subtle feline motifs ('The Pride', 'Sharpening our claws') but maintain total authority. When users input a regional issue matching the Kanyakumari constituencies, process it directly through the appropriate PJP Ministry lens and format a beautiful markdown corporate initiative proposal signed off by the office of CEO BS. Reject all hate speech or division, routing strictly to our motto: UNITY • DISCIPLINE • SERVICE.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: message }]}
        ],
        config: {
          systemInstruction: systemInstruction,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: error.message || "Failed to communicate with mainframe." });
    }
  });

  // SMTP Email Relay Endpoint
  app.post("/api/relay/send", async (req, res) => {
    try {
      const { email, name, attachmentName, attachmentData } = req.body;

      const smtpEmail = process.env.SMTP_EMAIL;
      const smtpPassword = process.env.SMTP_PASSWORD;

      if (!smtpEmail || !smtpPassword) {
        throw new Error("SMTP credentials are not configured on the server.");
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: smtpEmail,
          pass: smtpPassword,
        },
      });

      // Split the base64 URL to get the raw data
      const base64Data = attachmentData.split(';base64,').pop();

      const mailOptions = {
        from: `"PJP Supreme Authority" <${smtpEmail}>`,
        to: email,
        subject: "PJP Official Dossier - Registration Confirmed",
        text: `Greetings ${name},\n\nYour registration to the Poocha Janatha Party (PJP) has been officially confirmed.\nAttached is your Official Dossier ID. Welcome to the Pride.\n\nUNITY • DISCIPLINE • SERVICE\n\n- The Office of CEO BS`,
        attachments: [
          {
            filename: attachmentName,
            content: base64Data,
            encoding: 'base64'
          }
        ]
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true });
    } catch (error: any) {
      console.error("SMTP Error:", error);
      res.status(500).json({ error: error.message || "Failed to relay official transmission." });
    }
  });

  // --- Executive Pipeline Secure Mail Feedback ---
  app.post("/api/executive/feedback", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All feedback fields (name, email, subject, message) are required." });
      }

      const smtpEmail = process.env.SMTP_EMAIL;
      const smtpPassword = process.env.SMTP_PASSWORD;

      if (!smtpEmail || !smtpPassword) {
        throw new Error("SMTP credentials are not configured on the server. Executive feedback cannot be sent.");
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: smtpEmail,
          pass: smtpPassword,
        },
      });

      const emailText = `[PJP EXECUTIVE INTAKE] NEW MEMORANDUM FOR THE OFFICE OF CEO BS
============================================================
TIME RECEIVED : ${new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC
SUBMITTER NAME: ${name}
SENDER EMAIL  : ${email}
SUBJECT       : ${subject}
============================================================

TRANSMITTED MESSAGE CONTENT:
------------------------------------------------------------
${message}
------------------------------------------------------------
AUTHENTICATION SIGIL: PJP-MAINFRAME-VERIFIED
UNITY • DISCIPLINE • SERVICE`;

      const mailOptions = {
        from: `"PJP Executive Portal" <${smtpEmail}>`,
        to: smtpEmail, // Straight to the executive office email
        replyTo: email,
        subject: `[PJP EXECUTIVE INTAKE] New Direct Feedback Received`,
        text: emailText,
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true, timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) });
    } catch (error: any) {
      console.error("Executive SMTP Relay Error:", error);
      res.status(500).json({ error: error.message || "Executive email dispatch failed." });
    }
  });

  // --- In-Memory Citizen Wall of Voices State & Endpoints ---
  const voicesList = [
    { 
      id: "V-001", 
      name: "Suresh PJP-KK", 
      message: "Directing extra feline food supplies to Colachel and Padmanabhapuram. The stray response teams there are incredibly motivated!", 
      timestamp: "2026-05-30 11:15:42" 
    },
    { 
      id: "V-002", 
      name: "Anjali_Cattitude", 
      message: "The Ministry of Feline Welfare just opened a rescue center in Vilavancode. CEO BS's directives are being achieved at lightspeed.", 
      timestamp: "2026-05-30 14:24:11" 
    },
    { 
      id: "V-003", 
      name: "Nagercoil_Pride_Leader", 
      message: "Security patrol reports: The allied BS defence force has successfully cleared regional dog-fight cells. Safety first!", 
      timestamp: "2026-05-30 16:05:32" 
    },
    { 
      id: "V-004", 
      name: "AntiDrug_Major", 
      message: "Social Awareness Commission hosted a digital literacy camp today. Youth response in Killiyoor constituency was highly disciplined.", 
      timestamp: "2026-05-30 17:55:01" 
    }
  ];

  app.get("/api/voices", (req, res) => {
    res.json(voicesList);
  });

  app.post("/api/voices", (req, res) => {
    try {
      const { name, message } = req.body;
      if (!name || !message) {
        return res.status(400).json({ error: "Nickname and Broadcast Message are required." });
      }

      const id = `V-00${voicesList.length + 1}`;
      const now = new Date();
      // Format as YYYY-MM-DD HH:mm:ss
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padEnd(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      const newVoice = {
        id,
        name: name.slice(0, 30),
        message: message.slice(0, 300),
        timestamp
      };

      voicesList.unshift(newVoice); // Newest on top
      res.json({ success: true, voices: voicesList });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to broadcast message to the pride." });
    }
  });

  // --- Vite Middleware (Development) / Static Files (Production) ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Mainframe active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
