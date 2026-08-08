import User from "../models/User.js";

// view anyones profile
export const getUser = async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching user", error: error.message });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching users", error: error.message });
    }
}

export const updateUser = async (req, res) => {
    const {id} = req.params;
    try{
        if (req.user.userId !== id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "You can only edit your own profile" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({success: false, message:"Invalid User id"});
        }

        // Whitelist editable fields so callers can't sneak in role/password/resetToken
        const { username, email } = req.body;
        if (username !== undefined) user.username = username;
        if (email !== undefined) user.email = email;

        await user.save();
        const { password, resetToken, ...safeUser } = user.toObject();
        res.status(200).json({success: true, data: safeUser})
    }catch(error){
        res.status(500).json({success: false, message:"Server Error"});
    }
}

export const deleteUser = async (req, res) => {
    const {id} = req.params;
    try{
        if (req.user.userId !== id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "You can only delete your own profile" });
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({success: false, message:"Invalid User id"});
        }
        res.status(200).json({success: true, message: "User deleted"})
    }catch(error){
        res.status(500).json({success: false, message:"Error deleting user"});
    }
}
