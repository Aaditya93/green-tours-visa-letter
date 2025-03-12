import User from "./User";
import bcrypt from "bcryptjs";
export async function emailVerified(id: string) {
    try {
  
        const user = await User.findByIdAndUpdate(
            id,
            { emailVerified: new Date() },
            { new: true }
        );
        
        if (!user) {
            throw new Error('User not found');
        }
        
        return user;
    } catch (error) {
        console.error('Error verifying email:', error);
        throw error;
    }
  }
  

  export async function getUserById(id: string) {
    try {
  
      const user = await User.findById(id);
      return user;
    } catch (error) {
      console.error("Error while getting user by ID:", error);
      return null;
    }
  }

  export async function authenticateUser({ email, password }: { email: string; password: string }) {
    try {
      // Check if the user exists
  
      const user = await User.findOne({ email});
      if (!user) {
        return { error: "User does not exist" };
      }
  
  
      // Verify password
      const isPasswordValid = user.password ? await bcrypt.compare(password, user.password) : false;
  
      if (!isPasswordValid) {
        return { error: "Invalid password" };
      }
  
      // Return the user object if authentication is successful
      return user;
    } catch (error) {
      console.error("Error during authentication:", error);
      return { error: "Error while authenticating" };
    }
  }
  