// models/propertyReport.js
const mongoose = require('mongoose');

// Define the schema for PropertyReport
const propertyReportSchema = new mongoose.Schema({
    reportedPropertyId: {
        type: String,
        required: true
    },
    reportedUserId: {
        type: [String],
        required: true
    },
    date: {
        type: [Date],
        default: new Date()
    },
    description: {
        type: [String],
        required: true
    }
});

// Create and export the PropertyReport model
const PropertyReport = mongoose.model('PropertyReport', propertyReportSchema);

module.exports = PropertyReport;
