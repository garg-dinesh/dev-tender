const express = require("express");
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user");

const userRouter = express.Router();

const SAFE_DATA ="firstName lastName age gender about photoUrl";

// Get all the pending connection requests for logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName age gender about photoUrl")
    // }).populate("fromUserId", ["firstName", "lastName", "age", "photoUrl", "about", "gender"])

        res.json({
            message: 'Data fetched successfully!!',
            data: connectionRequests
        })
    } catch(err) {
        res.status(400).json({
            errorMessage: "Error: " + err.message
        })
    }
})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id, status: "accepted"},
                {toUserId: loggedInUser._id, status: "accepted"}
            ]
        })
        .populate("fromUserId", SAFE_DATA)
        .populate("toUserId",SAFE_DATA)

        const _connections = connections.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId
        });

        return res.json({data: _connections})
    } catch(err) {
        res.status(400).json({errorMessage: "Error: " + err.message})
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query?.page) || 1;
        let limit = parseInt(req.query?.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page-1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or: [{fromUserId: loggedInUser._id}, {toUserId: loggedInUser._id}]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((request) => {
            hideUsersFromFeed.add(request.fromUserId.toString());
            hideUsersFromFeed.add(request.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideUsersFromFeed)}},
                {_id: {$ne: loggedInUser._id}}
            ]
        }).select(SAFE_DATA).skip(skip).limit(limit)

        return res.json({data: users});
    } catch(err) {
        err.status(400).json({
            errorMesage: "Error: " + err.message
        })
    }
})

module.exports = userRouter;