const mongoose = require('mongoose');
const reports = require('../models/Reports');

exports.reports = async(req,res) => {
    try{
        const {reportedPropertyId, report_description} = req.body;
        const existingReport = await reports.findOne({reportedPropertyId: reportedPropertyId});
        if(existingReport) {
            existingReport.reportedUserId = existingReport.reportedUserId.concat(req.userId);
            const uniqueElements = new Set(existingReport.reportedUserId);
            // Check if the size of the Set is different from the original array
            if (uniqueElements.size !== existingReport.reportedUserId.length) {
                res.status(200).json({message2: 'You have already reported this property'});   
            }
            else {
                await reports.updateOne({reportedPropertyId: reportedPropertyId},{$push: { reportedUserId: req.userId , description: report_description, date: new Date() }});
                res.status(200).json({message: 'Property Reported Successfully'});
            }
        }
        else {
            const new_report = new reports({
                reportedPropertyId: reportedPropertyId,
                reportedUserId: req.userId,
                description: report_description
            });
            await new_report.save();
            res.status(200).json({message: 'Property Reported Successfully'});
        }
    }
    catch(error) {
        console.log(error);
        res.status(401).json({error: 'Something went wrong'});
    }
}