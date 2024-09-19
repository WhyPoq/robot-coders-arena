import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
	console.log(req.session.user);
	if (req.session.user === undefined) return res.json({ username: null });
	return res.json({ username: req.session.user.username });
});

export default router;
