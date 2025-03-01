const Project = require("../models/Project");
const Investor = require("../models/Investor");
const Founder = require("../models/Founder");
const Meeting = require("../models/Meeting");

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


module.exports = {
  createProject,
  getProject,
  createFounder,
  getFounder,
  createInvestor,
  getInvestor,
  createMeeting,
  getAllProjects,
  getInvestorById
};
