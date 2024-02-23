const mongoose = require("mongoose");
const jobListingSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  usersApplied: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const JobListing = mongoose.model("JobListing", jobListingSchema);

module.exports = JobListing;
