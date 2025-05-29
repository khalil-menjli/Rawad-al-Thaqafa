export const verifyAdmin = (req, res, next) => {
    if (req.role !== 'admin') {
        return res.status(403).json({ 
            success: false, 
            message: "Forbidden - admin access required" 
        });
    }
    next();
};

export const verifyUser = (req, res, next) => {
    if (req.role !== 'user') {
        return res.status(403).json({ 
            success: false, 
            message: "Forbidden - user access required" 
        });
    }
    next();
};

export const verifyPartner = (req, res, next) => {
    if (req.role !== 'partner') {
        return res.status(403).json({ 
            success: false, 
            message: "Forbidden - partner access required" 
        });
    }
    next();
};