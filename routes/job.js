const express = require("express");
const JobListing = require("../models/job");

const jobRouter = express.Router();
const authMiddleware = require("../middleware");

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
    console.error(error);
    res.status(400).json({ error: "Bad Request" });
  }
});

jobRouter.get("/", async (req, res) => {
  try {
    const jobListings = await JobListing.find();
    res.json({ jobListings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

jobRouter.get("/:id", authMiddleware, async (req, res) => {
  try {
    const job = await JobListing.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job listing not found" });
    }
    res.json({ job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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
    console.error(error);
    res.status(400).json({ error: "Bad Request" });
  }
});

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
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = jobRouter;
