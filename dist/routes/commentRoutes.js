"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commentController_1 = require("../controllers/commentController");
const router = (0, express_1.Router)();
// Envolver cada controlador en una función anónima
router.post('/', (req, res) => {
    (0, commentController_1.createComment)(req, res);
});
router.get('/', (req, res) => {
    (0, commentController_1.getCommentsByPostId)(req, res);
});
router.delete('/:commentId', (req, res) => {
    (0, commentController_1.deleteComment)(req, res);
});
exports.default = router;
