const User = require("../models/User");

const updateSteps = async (req, res) => {
  // Corrected function name to be more descriptive - updateSteps (lowercase s) is conventional for function names
  try {
    const userId = "67c328812878b9b80182d205"; // Get userId from route parameters
    const stepsToAdd = parseInt(req.body.stepsToAdd); // Get stepsToAdd from request body, parse to integer
    const parsedStepsToAdd = isNaN(stepsToAdd) ? 1 : stepsToAdd; // Default to 1 if not a valid number

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.user_steps += parsedStepsToAdd; // Increment user steps
    await user.save(); // Save the updated user document

    res.status(200).json({
      message: "User steps updated successfully",
      user: {
        userId: user._id, // Optionally return relevant user data
        steps: user.user_steps,
        name: user.name, // Add more user details if needed
      },
    });
  } catch (error) {
    console.error("Error in updateSteps controller:", error); // More accurate log message -  "updateSteps controller"
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid User ID format" }); // Handle invalid ObjectId
    }
    res
      .status(500)
      .json({ message: "Failed to update user steps", error: error.message });
  }
};

module.exports = {updateSteps}; // Export the function directly as updateSteps
