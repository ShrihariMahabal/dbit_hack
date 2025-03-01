const Project = require("../models/Project");
const Investor = require("../models/Investor");
const Founder = require("../models/Founder");
const Meeting = require("../models/Meeting");
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const gemini = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });



const createProject = async (req, res) => {
  try {
    const founder = await Founder.findOne({ name: req.body.founderName });

    if (!founder) {
      return res.status(404).json({ error: "Founder not found" });
    }

    console.log("Founder before project creation:", founder);

    // Default initial progress phase
    const initialProgress = [
      {
        phaseName: "Research & Feasibility",
        tasks: [
          { title: "Assess Water Flow & Potential Sites", status: "completed" },
          { title: "Conduct Environmental Impact Study", status: "completed" },
          { title: "Obtain Government Approvals", status: "in-progress" },
          { title: "Analyze Economic Viability", status: "pending" },
        ],
        reportUri: "https://drive.google.com/file/d/1ABCxyz123/view?usp=sharing",
        meetUri: "https://drive.google.com/file/d/1SV-idaAp-sTlxsaURkO2VtAij3b8Hjib/view?usp=sharing",
        meetLikes: 19,
        meetDislikes: 8,
        satisfaction: 60,
      },
    ];

    // Extract optional fields with default values if not provided
    const {
      shortDescription = "",
      description = "",
      industry = "",
      imageUri = "",
      fundingGoal,
      raisedAmount = 0,
      investors = [],
      sustainability_score = 0,
      trustScore = 0,
      progress = initialProgress, // Default to initial progress phase
    } = req.body;

    // Create the project
    const project = new Project({
      name: req.body.name,
      shortDescription,
      description,
      industry,
      imageUri,
      fundingGoal,
      raisedAmount,
      founder: founder._id,
      investors,
      sustainability_score,
      trustScore,
      progress,
    });

    await project.save(); // Save project explicitly

    // Push new project ID to the founder's `projects` array and save
    founder.projects.push(project._id);
    await founder.save();

    console.log("Founder after project update:", await Founder.findById(founder._id));

    return res.status(201).json({ project, message: "Project created and added to founder" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};



const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({ name: req.params.name });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.status(200).json({ project });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err });
  }
};

const createFounder = async (req, res) => {
  try {
    const founder = await Founder.create(req.body);
    return res.status(201).json({ founder });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ err: err.message || "Internal Server Error" });
  }
};

const getFounder = async (req, res) => {
  try {
    const founder = await Founder.findOne({ name: req.params.name });
    

    if (!founder) {
      return res.status(404).json({ message: "Founder not found" });
    }

    // Fetch full project details
    const projects = await Project.find({ _id: { $in: founder.projects } }).select("-__v -updatedAt");

    // Fetch full meeting details
    const meetings = await Meeting.find({ _id: { $in: founder.meetings } }).select("-__v -updatedAt");

    // Convert founder document to plain object and replace projects & meetings array
    const founderData = founder.toObject();
    founderData.projects = projects;
    founderData.meetings = meetings;

    return res.status(200).json({ founder: founderData });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().select("-__v -updatedAt");
    return res.status(200).json({ projects });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err: err.message || "Internal Server Error" });
  }
};

const createInvestor = async (req, res) => {
  try {
    const investor = await Investor.create(req.body);
    return res.status(201).json({ investor });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ err: err.message || "Internal Server Error" });
  }
};

const getInvestor = async (req, res) => {
  try {
    const investor = await Investor.findOne({ name: req.params.name });
    if (!investor) {
      return res.status(404).json({ message: "Investor not found" });
    }
    return res.status(200).json({ investor });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err });
  }
};

const getInvestorById = async (req, res) => {
  try {
    const investor = await Investor.findById(req.params.id);
    if (!investor) {
      return res.status(404).json({ message: "Investor not found" });
    }
    return res.status(200).json({ investor });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};

const createMeeting = async (req, res) => {
  try {
    const { founderName, investorNames, title, date, startTime, endTime, keyPoints } = req.body;

    // Find the founder
    const founder = await Founder.findOne({ name: founderName });
    if (!founder) {
      return res.status(404).json({ error: "Founder not found" });
    }

    // Find the investors
    const investors = await Investor.find({ name: { $in: investorNames } });
    if (investors.length !== investorNames.length) {
      return res.status(404).json({ error: "One or more investors not found" });
    }

    console.log("Founder before meeting creation:", founder);

    // Create the meeting
    const meeting = new Meeting({
      title,
      date,
      startTime,
      endTime,
      keyPoints,
      founder: founder._id,
      investors: investors.map((inv) => inv._id),
      sentiment: "Neutral" ,// Default value
      summary: "", // Default value
      transcripts: "", // Default value
    });

    await meeting.save(); // Save the meeting explicitly

    // Push the meeting ID to the founder's `meetings` array and save
    if (!founder.meetings) {
      founder.meetings = [];
    }
    founder.meetings.push(meeting._id);
    await founder.save();

    console.log("Founder after meeting update:", await Founder.findById(founder._id));

    return res.status(201).json({ meeting, message: "Meeting created successfully and linked to founder" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Internal Server Error" });
  }
};


const analyzeBills = async (req, res) => {
  try {
    const { imagesBase64, userData } = req.body;

    // Validate input
    if (!imagesBase64 || !Array.isArray(imagesBase64) || imagesBase64.length !== 2) {
      return res.status(400).json({ error: 'Exactly 2 images are required' });
    }

    if (!userData || !userData.family_size || !userData.region) {
      return res.status(400).json({ error: 'Family size and region are required' });
    }

    // Initialize Gemini API
    const gemini = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = gemini.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Construct the updated prompt
    const prompt = `
      Analyze this utility bill image and extract key information.
      The user has ${userData.family_size} family members in ${userData.region}, India.
      
      Return ONLY a valid JSON object with these exact fields:
      {
        "bill_type": "electricity|water|gas",
        "bill_provider": "string",
        "billing_period": "string",
        "consumption": {
          "value": number,
          "unit": "string",
          "previous_value": number or null
        },
        "amount": {
          "value": number,
          "currency": "string"
        },
        "consumption_rating": "excellent|good|average|high|excessive",
        "consumption_per_person": number,
        "regional_average_per_person": number,
        "percentage_diff_from_average": number,
        "seasonal_factor": number between 0.8 and 1.2,
        "sustainability_score": number between 0 and 100,
        "key_insights": [
          "string", "string"
        ],
        "recommendations": [
          "string", "string"
        ],
        "estimated_savings_potential": {
          "value": number,
          "unit": "string"
        }
      }
      
      Do not include any additional text or explanations. Only return the JSON object.
      
      Make sure your assessment is accurate and based on typical usage patterns in India.
      For electricity bills: Consider 75 kWh/month/person as average in India.
      For water bills: Consider 4000 liters/month/person as average in India.
      For gas bills: Consider 1 cylinder/month for a family of 4 as average in India.
      
      Adjust for seasonal factors appropriately (e.g., higher electricity use in summer is expected).
    `;

    // Function to extract JSON from the response
    const extractJSON = (text) => {
      const jsonMatch = text.match(/\{[\s\S]*\}/); // Match the first JSON object in the response
      if (jsonMatch) {
        return jsonMatch[0];
      }
      throw new Error('No JSON found in the response');
    };

    // Analyze both bills
    const analysisResults = await Promise.all(
      imagesBase64.map(async (imageBase64) => {
        // Prepare the image for Gemini API
        const image = {
          inlineData: {
            data: imageBase64,
            mimeType: 'image/jpeg', // Adjust based on the image type
          },
        };

        // Generate content
        const result = await model.generateContent([prompt, image]);
        const response = await result.response;
        const text = response.text();

        // Log the raw response for debugging
        console.log('Raw Gemini Response:', text);

        // Parse the JSON response
        try {
          const jsonText = extractJSON(text); // Extract JSON from the response
          return JSON.parse(jsonText);
        } catch (error) {
          console.error('Failed to parse JSON:', text);
          throw new Error('Failed to parse Gemini response as JSON');
        }
      })
    );
    
    // try {
    //   const user = await User.findById("67c328812878b9b80182d205");
    //   if (!user) {
    //     return res.status(404).json({ error: 'User not found' });
    //   }
    //   user.analysisResults.push(...analysisResults); // Append new results to the existing array
    //   await user.save(); // Save the updated user document
    //   console.log('User document updated successfully');
    // } catch (error) {
    //   console.error('Error saving user document:', error);
    //   return res.status(500).json({ error: 'Failed to save analysis results', details: error.message });
    // } finally {
    //   console.log('completed');
    // }
    

    // Return the results as an array of objects
    res.json(analysisResults);
  } catch (error) {
    console.error('Error analyzing bills:', error);
    res.status(500).json({ error: 'Failed to analyze bills', details: error.message });
  }


};

module.exports = {
  createProject,
  getProject,
  createFounder,
  getFounder,
  createInvestor,
  getInvestor,
  createMeeting,
  getAllProjects,
  getInvestorById,
  analyzeBills
};
