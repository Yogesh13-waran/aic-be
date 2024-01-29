const express = require('express');
const router = express.Router();
const logIn=require('../controller/login')
const calendarView=require('../controller/calendarOp')
const imageUpload=require('../middleware/imageupload')
router.post('/login',logIn.logIn)
router.post('/register',logIn.Register)
router.get('/calendarcheck',calendarView.checkCalendar)
router.get('/usercalendar',calendarView.checkCalendarForUser)
router.get('/slotinfo',calendarView.getSlots)
router.get('/slotview',calendarView.slotStatus)
router.get('/openslot',calendarView.openedSlots)
router.get('/allcontent',calendarView.showAllPosts)
router.post('/calendarpost',calendarView.calendarOperations)
router.post('/postcontent',calendarView.contentUpload)
// router.post('/upload/:id/:image_name', aws.upload.single('photos'),async function (req, res, next) {
//     const imageUrl = req.file.location; // Get the S3 object URL from the uploaded file
  
//    await res.send({ isError: false, message: "Image uploaded successfully!", image_url: `${imageUrl}` });
//   })
router.post('/upload',imageUpload.uploads.single('image'),calendarView.imagePath)
module.exports=router