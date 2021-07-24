const express = require('express');

const isAuth = require('../middlewares/is-auth');

const router = express.Router();

const slotController = require('../controllers/slots');

router.post('/slots', slotController.getSlots);

router.post('/addSlot', isAuth, slotController.addSlot);

router.put('/updateSlot', isAuth, slotController.updateSlot);

router.delete('/deleteSlot', isAuth, slotController.deleteSlot);

module.exports = router;