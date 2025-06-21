import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
	// Check for token in cookie (web) or Authorization header (mobile)
	let token = req.cookies?.token;
	
	// If no cookie token, check Authorization header for mobile
	if (!token) {
		const authHeader = req.headers.authorization;
		if (authHeader && authHeader.startsWith('Bearer ')) {
			token = authHeader.substring(7); // Remove 'Bearer ' prefix
		}
	}
	
	if (!token) {
		return res.status(401).json({ 
			success: false, 
			message: "Unauthorized - no token provided" 
		});
	}
	
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ 
				success: false, 
				message: "Unauthorized - invalid token" 
			});
		}

		req.userId = decoded.userId;
		next();
	} catch (error) {
		console.error("Token verification error:", error);
		return res.status(500).json({ 
			success: false, 
			message: "Server error" 
		});
	}
};