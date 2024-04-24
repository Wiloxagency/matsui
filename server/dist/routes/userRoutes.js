"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    res.send("Users route!");
});
router.get("/:id", (req, res) => {
    res.send(`User ${req.params.id} route!`);
});
exports.default = router;
