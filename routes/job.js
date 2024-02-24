const express = require("express");
const JobListing = require("../models/job");

const jobRouter = express.Router();
const authMiddleware = require("../middleware");

// create a job
jobRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const { date, link, title, usersApplied } = req.body;
    const newJobListing = new JobListing({
      date,
      link,
      title,
      usersApplied,
    });
    const savedJobListing = await newJobListing.save();
    res.status(201).json({
      message: "Job listing created successfully",
      jobListing: savedJobListing,
    });
  } catch (error) {
    res.status(400).json({ error: "Bad Request" });
  }
});

// find all jobs
jobRouter.get("/", async (req, res) => {
  try {
    const jobListings = await JobListing.find();
    res.json({ jobListings });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// find a job
jobRouter.get("/:id", authMiddleware, async (req, res) => {
  try {
    const job = await JobListing.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job listing not found" });
    }
    res.json({ job });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// update a job
jobRouter.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { date, link, title, usersApplied } = req.body;
    const updatedJobListing = await JobListing.findByIdAndUpdate(
      req.params.id,
      { date, link, title, usersApplied },
      { new: true }
    );
    if (!updatedJobListing) {
      return res.status(404).json({ message: "Job listing not found" });
    }
    res.json({
      message: "Job listing updated successfully",
      jobListing: updatedJobListing,
    });
  } catch (error) {
    res.status(400).json({ error: "Bad Request" });
  }
});

// delete a job
jobRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedJobListing = await JobListing.findByIdAndDelete(req.params.id);
    if (!deletedJobListing) {
      return res.status(404).json({ message: "Job listing not found" });
    }
    res.json({
      message: "Job listing deleted successfully",
      jobListing: deletedJobListing,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// add user to a job
jobRouter.post("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "User Id required" });
    }
    const jobListing = await JobListing.findById(id);
    if (!jobListing) {
      return res.status(404).json({ error: "Job listing not found" });
    }
    if (jobListing.usersApplied.includes(userId)) {
      return res
        .status(400)
        .json({ error: "User already applied for this job" });
    }
    jobListing.usersApplied.push(userId);
    await jobListing.save();
    res.json({
      message: "User added to the list of applicants successfully",
      jobListing,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = jobRouter;
