const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    nik: {
        type: DataTypes.STRING(16),
        allowNull: true,
        unique: true,
        validate: {
            len: [16, 16],
            isNumeric: true
        }
    },
    telp: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            is: /^(\+62|62|0)[8-9][0-9]{7,11}$/
        }
    },
    role: {
        type: DataTypes.ENUM('Atlet', 'Pelatih', 'Official', 'Admin'),
        allowNull: true,
        defaultValue: 'Atlet'
    },
    cabor: {
        type: DataTypes.STRING,
        allowNull: true
    },
    provinsi: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Aktif', 'Inactive'),
        allowNull: false,
        defaultValue: 'Pending'
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '👤'
    },
    emailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    verificationToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetTokenHash: DataTypes.STRING,
    resetTokenExpiry: DataTypes.DATE
}, {
    timestamps: true
})

module.exports = User