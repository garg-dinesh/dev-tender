const express = require("express");
const {userAuth} = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = re.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];

        if (!allowedStatus.includes(status)) {
            throw new Error("Status value is invalid!!")
        }

        const toUser = await User.findById(toUserId);

        if (!toUser) {
            throw new Error("User not found!")
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        });

        if (existingConnectionRequest) {
            throw new Error("Connection Request already exist!")
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();

        return res.json({
            message: "Connection request sent successfully!",
            data,
        })
    } catch(err) {
        return res.status(400).send("Error: " + err.message)
    }
})

module.exports = requestRouter;