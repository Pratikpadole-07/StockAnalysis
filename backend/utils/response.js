exports.success = (res, msg, data=null) => res.json({ success: true, msg, data });
exports.error = (res, msg, status=400) => res.status(status).json({ success: false, msg });
