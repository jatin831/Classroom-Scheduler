const express = require('express');

const router = express.Router();

const slotController = require('../controllers/slots');

router.post('/slots', slotController.getSlots);

router.post('/addSlot', slotController.addSlot);

router.put('/updateSlot', slotController.updateSlot);

router.delete('/deleteSlot', slotController.deleteSlot);

module.exports = router;