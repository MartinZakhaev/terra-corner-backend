const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.js");

const app = express();
const PORT = process.env.PORT || 5000;

require("dotenv").config();

const accountSid = process.env.TWILLIO_ACCOUNT_SID;
const authToken = process.env.TWILLIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILLIO_MESSAGING_SERVICE_SID;
const twillioClient = require("twilio")(accountSid, authToken);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.post("/", (req, res) => {
  const { message, user: sender, type, members } = req.body;
  if (type === "message.new") {
    members
      .filter((member) => member.user_id !== sender.id)
      .forEach(({ user }) => {
        if (!user.online) {
          twillioClient.messages
            .create({
              body: `You have a new message from ${message.user.name} - ${message.text}`,
              messagingServiceSid: messagingServiceSid,
              to: user.phoneNumber,
            })
            .then(() => console.log("Message sent!"))
            .catch((err) => console.log(err));
        }
      });

    return res.status(200).send("Message sent!");
  }
  return res.status(200).send("Not a new message request");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
