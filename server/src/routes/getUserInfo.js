"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    if (req.session.user === undefined)
        return res.json({ username: null });
    return res.json({ username: req.session.user.username });
});
exports.default = router;
//# sourceMappingURL=getUserInfo.js.map