import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

async function startServer() {
  const app = reportExpressSetup();
  const PORT = 3000;

  // --- Helper to verify Express framework compatibility ---
  function reportExpressSetup() {
    return express();
  }

  // --- Initialize Supabase Client ---
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  let supabase: any = null;
  if (supabaseUrl && supabaseKey) {
    try {
      supabase = createClient(supabaseUrl, supabaseKey);
      console.log("Supabase Client initialized successfully.");
    } catch (err: any) {
      console.error("Failed to initialize Supabase client:", err.message || err);
    }
  } else {
    console.log("Supabase credentials missing. Falling back to in-memory cache / static mock states.");
  }

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
  app.get("/api/metrics/paws", async (req, res) => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("pjp_metrics")
          .select("paws_enrolled")
          .eq("id", 1)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (data) {
          pawsEnrolledCount = data.paws_enrolled || 0;
        }
      } catch (err: any) {
        console.error("Supabase select metrics error (falling back to temporary state):", err.message || err);
      }
    }
    res.json({ count: pawsEnrolledCount });
  });

  // Endpoint to increment the enrollment count
  app.post("/api/metrics/paws/increment", async (req, res) => {
    pawsEnrolledCount++;
    if (supabase) {
      try {
        const { data: selectData, error: selectError } = await supabase
          .from("pjp_metrics")
          .select("paws_enrolled")
          .eq("id", 1)
          .maybeSingle();

        if (selectError) {
          throw selectError;
        }

        let currentPaws = selectData ? (selectData.paws_enrolled || 0) : 0;
        const nextPaws = currentPaws + 1;

        const { error: upsertError } = await supabase
          .from("pjp_metrics")
          .upsert({ id: 1, paws_enrolled: nextPaws });

        if (upsertError) {
          // If upsert fails, try a direct update query
          const { error: updateError } = await supabase
            .from("pjp_metrics")
            .update({ paws_enrolled: nextPaws })
            .eq("id", 1);
          if (updateError) throw updateError;
        }

        pawsEnrolledCount = nextPaws;
      } catch (err: any) {
        console.error("Supabase metrics increment error (falling back to temporary state):", err.message || err);
      }
    }
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

  // --- Citizen Wall of Voices State & Endpoints ---
  // In-memory fallback dataset for when client is unconfigured or encounters connection errors
  const voicesListFallback = [
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

  // Helper to format timestamps to standard YYYY-MM-DD HH:mm:ss representation
  function formatTimestamp(rawDate: string | null | undefined): string {
    if (!rawDate) return "N/A";
    try {
      const dateObj = new Date(rawDate);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      const seconds = String(dateObj.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } catch {
      return String(rawDate);
    }
  }

  app.get("/api/voices", async (req, res) => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("wall_of_voices")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          const formatted = data.map((v: any) => ({
            id: v.id ? String(v.id) : `V-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            name: v.name || "Anonymous",
            message: v.message || "",
            timestamp: formatTimestamp(v.created_at)
          }));
          return res.json(formatted);
        }
      } catch (err: any) {
        console.error("Supabase wall_of_voices SELECT query error (falling back to static state):", err.message || err);
      }
    }
    // Fallback gracefully
    res.json(voicesListFallback);
  });

  app.post("/api/voices", async (req, res) => {
    try {
      const { name, message } = req.body;
      if (!name || !message) {
        return res.status(400).json({ error: "Nickname and Broadcast Message are required." });
      }

      const cleanName = name.slice(0, 30);
      const cleanMessage = message.slice(0, 300);

      if (supabase) {
        try {
          // Perform an asynchronous insert into 'wall_of_voices'
          const { error: insertError } = await supabase
            .from("wall_of_voices")
            .insert([{ name: cleanName, message: cleanMessage }]);

          if (insertError) {
            throw insertError;
          }

          // Fetch updated rows ordered by created_at DESC
          const { data, error: fetchError } = await supabase
            .from("wall_of_voices")
            .select("*")
            .order("created_at", { ascending: false });

          if (fetchError) {
            throw fetchError;
          }

          if (data) {
            const formatted = data.map((v: any) => ({
              id: v.id ? String(v.id) : `V-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
              name: v.name || "Anonymous",
              message: v.message || "",
              timestamp: formatTimestamp(v.created_at)
            }));
            return res.json({ success: true, voices: formatted });
          }
        } catch (err: any) {
          console.error("Supabase wall_of_voices error (falling back to in-memory):", err.message || err);
        }
      }

      // If Supabase fails or isn't connected, manage via the transient fallback array
      const now = new Date();
      const timestampStr = formatTimestamp(now.toISOString());
      const newVoiceLocal = {
        id: `V-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        name: cleanName,
        message: cleanMessage,
        timestamp: timestampStr
      };
      
      voicesListFallback.unshift(newVoiceLocal);
      res.json({ success: true, voices: voicesListFallback });
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
