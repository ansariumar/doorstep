const Service = require('../models/Service');
const Worker = require('../models/Worker');
const mongoose = require('mongoose');


exports.addService = async (req, res) => {
    const session = await mongoose.startSession(); // Start a transaction
    session.startTransaction();

    try {
        let {serviceName, description, price, duration, available } = req.body;

        // Validate input
        if (!serviceName || !description || price === undefined) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        if (typeof price !== 'number') price = parseFloat(price);
        if (typeof duration !== 'number') duration = parseInt(duration);

        // Check if worker exists
        const worker = await Worker.findById(req.worker._id).session(session);
        if (!worker) {
            return res.status(404).json({ success: false, message: 'Worker not found.' });
        }

        // Create new service
        const newService = new Service({
            serviceName,
            description,
            price,
            duration,
            available
        });

        // Save service
        const savedService = await newService.save({ session });

        // Update worker's service list
        worker.services.push(savedService._id);
        await worker.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            success: true,
            message: 'Service added successfully!',
            service: savedService,
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error(error);
        return res.status(500).json({success: false, message: 'Error adding service.', error: error.message });
    }
};

exports.updateService = async (req, res) => {
    try {
        if (!req.worker) return res.status(403).json({ success: false, message: 'Your are not authorized' });

        const serviceID = req.params.id;
        const workerID = req.worker._id;

        if ( !req.worker.services.includes(serviceID) ) return res.status(403).json({ success: false, message: 'You are not authorized to update this service.' });
        
        let {serviceName, description, price, duration, available } = req.body;
        
        const service = await Service.findById(serviceID);
        if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });

        service.serviceName = serviceName ?? service.serviceName;
        service.description = description ?? service.description;
        service.price = price ?? service.price;
        service.duration = duration ?? service.duration;
        service.available = available ?? service.available;

        const updatedService = await service.save();

        return res.status(200).json({
            success: true,
            message: 'Service updated successfully!',
            updatedService
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: 'Error updating service.', error: error.message });
        
    }
}

exports.myServices = async (req, res) =>  {
    try {
        const workerID = req.worker._id;

        const worker = await Worker.findById(workerID).populate('services');
        if (!worker) return res.status(404).json({ success: false, message: 'Services not found.' });

        return res.status(200).json({
            success: true,
            serviceCount: worker.services.length,
            services: worker.services,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: 'Error fetching services.', error: error.message });      
    }
}

exports.deleteService = async (req, res) => {
    try {
        if (!req.worker) return res.status(403).json({ success: false, message: 'Your are not authorized' });

        const serviceID = req.params.id;
        const workerID = req.worker._id;
        //If the service doesn't belong to the worker or the user is not an admin, they will not be able to delete the service.
        if ( !req.worker.services.includes(serviceID) || !req.user.role === 'admin'  ) return res.status(403).json({ success: false, message: 'You are not authorized to delete this service.' });
        
        const service = await Service.findById(serviceID);
        if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });

        await service.deleteOne();

        return res.status(200).json({
            success: true,
            message: 'Service deleted successfully!',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: 'Error deleting service.', error: error.message });
        
    }
}

exports.getService = async (req, res) => {
    try {
        const allServices = await Service.find();
        if (!allServices) return res.status(404).json({ success: false, message: 'Service not found.' });

        return res.status(200).json({
            success: true,
            services: allServices
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: 'Error fetching service.', error: error.message });
    }
}

