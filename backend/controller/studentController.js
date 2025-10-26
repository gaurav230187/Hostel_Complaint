const User = require('../models/User');

exports.getStudentByid = async(req, res)=> {
    try {
        const {student_id} = req.params;
        // Find a user who is a 'student' and matches the _id
        const student = await User.findOne({
            _id: student_id,
            type: 'student'
        })
        .populate('block_id', 'block_name') // Also get their block name
        .select('-password'); // Don't send password

        if (!student) {
            return res.status(404).json({ msg: "Student not found" });
        }
        res.json(student)
      } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
};