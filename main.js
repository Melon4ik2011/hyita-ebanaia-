import express from "express"
import fetch from "node-fetch"

const app = express()
app.use(express.json())

// =========================
// MEMORY (200 сообщений)
// =========================

const memory = {}
const MAX_MESSAGES = 200

// =========================
// ROOT
// =========================

app.get("/", (_, res) => {
    res.send("Jarvis AI server online")
})

// =========================
// AI ENDPOINT
// =========================

app.post("/mc_ai", async (req, res) => {
    try {
        const {
            apiKey,
            model,
            prompt,
            player,
            message
        } = req.body

        if (!message) {
            return res.json({
                reply: "пустое сообщение"
            })
        }

        // =========================
        // INIT PLAYER MEMORY
        // =========================

        if (!memory[player]) {
            memory[player] = []
        }

        // =========================
        // ADD USER MESSAGE
        // =========================

        memory[player].push({
            role: "user",
            content: `${player}: ${message}`
        })

        // =========================
        // TRIM MEMORY (200)
        // =========================

        if (memory[player].length > MAX_MESSAGES) {
            memory[player] = memory[player].slice(-MAX_MESSAGES)
        }

        // =========================
        // BUILD MESSAGES FOR AI
        // =========================

        const messages = [
            {
                role: "system",
                content: prompt + "\nТы видишь чат игроков Minecraft. Отвечай естественно."
            },
            ...memory[player]
        ]

        // =========================
        // REQUEST OPENROUTER
        // =========================

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://railway.app",
                    "X-Title": "Minecraft Jarvis AI"
                },
                body: JSON.stringify({
                    model,
                    messages
                })
            }
        )

        const data = await response.json()

        const reply =
            data?.choices?.[0]?.message?.content ||
            "нет ответа"

        // =========================
        // SAVE AI RESPONSE
        // =========================

        memory[player].push({
            role: "assistant",
            content: `Jarvis: ${reply}`
        })

        // =========================
        // TRIM AGAIN
        // =========================

        if (memory[player].length > MAX_MESSAGES) {
            memory[player] = memory[player].slice(-MAX_MESSAGES)
        }

        // =========================
        // RESPONSE TO MINECRAFT
        // =========================

        res.json({
            reply
        })

    } catch (err) {
        console.error(err)
        res.json({
            reply: "ошибка railway"
        })
    }
})

// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})
