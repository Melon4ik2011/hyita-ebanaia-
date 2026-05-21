import express from "express"
//ytuty
const app = express()

app.use(express.json({

    limit: "1mb"

}))

app.get("/", (_, res) => {

    res.send("Jarvis AI server online")

})

app.post("/mc_ai", async (req, res) => {

    try {

        const {

            apiKey,
            model,
            prompt,
            player,
            message

        } = req.body

        if (!apiKey) {

            return res.json({

                reply:
                    "нет api key"

            })

        }

        if (!message) {

            return res.json({

                reply:
                    "пустое сообщение"

            })

        }

        const response = await fetch(

            "https://openrouter.ai/api/v1/chat/completions",

            {

                method: "POST",

                headers: {

                    "Authorization":
                        `Bearer ${apiKey}`,

                    "Content-Type":
                        "application/json",

                    "HTTP-Referer":
                        "https://hyita-ebanaia-production.up.railway.app",

                    "X-Title":
                        "Jarvis Minecraft AI"

                },

                body: JSON.stringify({

                    model:
                        model ||
                        "openai/gpt-4.1-mini",

                    messages: [

                        {

                            role: "system",

                            content:
                                prompt ||
                                "Ты ИИ помощник Minecraft"

                        },

                        {

                            role: "user",

                            content:
                                `${player || "Player"}: ${message}`

                        }

                    ]

                })

            }

        )

        if (!response.ok) {

            const errorText =
                await response.text()

            console.warn(
                "OPENROUTER ERROR:",
                errorText
            )

            return res.json({

                reply:
                    "ошибка openrouter"

            })

        }

        const data =
            await response.json()

        console.warn(
            "OPENROUTER RESPONSE:",
            JSON.stringify(data, null, 2)
        )

        const reply =
            data
                ?.choices?.[0]
                ?.message?.content

        res.json({

            reply:
                reply ||
                "нет ответа"

        })

    } catch (err) {

        console.warn(
            "RAILWAY ERROR:",
            err
        )

        res.json({

            reply:
                "ошибка railway"

        })

    }

})

const PORT =
    process.env.PORT || 3000

app.listen(PORT, () => {

    console.warn(

        `Server running on ${PORT}`

    )

})