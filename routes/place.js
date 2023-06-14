const express = require('express');
const router = express.Router();

//장소등록
router.post('/join', async (req, res) => {
  try {
    const params = {
      userid: req.body.userid,
      category_id: req.body.category_id,
      place_name: req.body.place_name,
      address: req.body.address,
      location: req.body.location,
      open_time: req.body.open_time,
      closing_time: req.body.closing_time,
      closed_days: req.body.closed_days,
    };
  } catch (err) {}
});

module.exports = router;
