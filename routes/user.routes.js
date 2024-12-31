const router = require('express').Router()
authController= require('../contollers/auth.controller')
userController= require('../contollers/user.controller')
uploadController= require('../contollers/upload.controller')

const {uploadPDP} = require('../midlleware/multer.middleware')




//Auth
router.post('/register', authController.signUp)
router.get('/confirm/:token', authController.confirmEmail)
router.post('/login',authController.signIn)
router.post('/logout',authController.logout)
// CRUD

router.get('/',userController.getAllUsers)
router.get('/:id', userController.userInfo)
router.put('/:id',userController.updateUser)
router.delete('/:id',userController.deleteUser)
router.post('/uploadProfilePicture',uploadPDP.single('file'), uploadController.uploadProfileImage);




module.exports = router