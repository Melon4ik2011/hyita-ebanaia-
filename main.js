import express from "express"
import fetch from "node-fetch"

const app = express()

app.use(express.json())

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

        if (!message) {

            return res.json({

                reply:
                    "пустое сообщение"

            })

        }

        const response =
            await fetch(
"https://openrouter.ai/api/v1/chat/completions",
{
    method: "POST",

    headers: {

        "Authorization":
Bearer `${apiKey}`,

        "Content-Type":
"application/json",

        "HTTP-Referer":
"https://railway.app",

        "X-Title":
"Jarvis Minecraft AI"

    },

    body: JSON.stringify({

        model,

        messages: [

            {

                role: "system",

                content:
                    prompt

            },

            {

                role: "user",

                content:
`${player}: ${message}`

            }

        ]

    })

})

        const data =
            await response.json()

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

        console.error(err)

        res.json({

            reply:
                "ошибка railway"

        })

    }

})

const PORT =
    process.env.PORT || 3000

app.listen(PORT, () => {

    console.log(
`Server running on ${PORT}`
    )

})