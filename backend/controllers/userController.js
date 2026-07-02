const User = require('../models/User')

exports.createUser = async (req, res) => {
    const { name, email } = req.body
    try {
        const user = await User.create({ name, email })
        res.status(201).json(user)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll()
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}