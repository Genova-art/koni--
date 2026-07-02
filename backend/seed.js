require('dotenv').config()
const sequelize = require('./config/db')
const User = require('./models/User')
const { hashPassword } = require('./utils/hash')

const seedUsers = [
  {
    name: 'Admin KONI',
    email: 'admin@koni.or.id',
    password: 'AdminKoni2026!',
    nik: '3201234567890000',
    telp: '081234567890',
    role: 'Admin',
    cabor: 'Manajemen',
    provinsi: 'DKI Jakarta',
    status: 'Aktif',
    emailVerified: true,
    avatar: '👨'
  },
  {
    name: 'Budi Santoso',
    email: 'atlet@koni.or.id',
    password: 'Koni2026!',
    nik: '3201234567890001',
    telp: '081298765432',
    role: 'Atlet',
    cabor: 'Bulutangkis',
    provinsi: 'Jawa Barat',
    status: 'Aktif',
    emailVerified: true,
    avatar: '👤'
  },
  {
    name: 'Siti Rahayu',
    email: 'official@koni.or.id',
    password: 'Koni2026!',
    nik: '3201234567890002',
    telp: '081212345678',
    role: 'Official',
    cabor: 'Renang',
    provinsi: 'Jawa Timur',
    status: 'Aktif',
    emailVerified: true,
    avatar: '👩'
  }
]

async function runSeed() {
  try {
    await sequelize.sync({ alter: true })
    console.log('Database synced. Seeding users...')

    for (const userData of seedUsers) {
      const hashedPassword = await hashPassword(userData.password)
      const [user, created] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: {
          ...userData,
          password: hashedPassword
        }
      })

      if (!created) {
        await user.update({
          ...userData,
          password: hashedPassword
        })
        console.log(`Updated existing user: ${user.email}`)
      } else {
        console.log(`Created user: ${user.email}`)
      }
    }

    console.log('Seeding complete.')
  } catch (error) {
    console.error('Seed failed:', error)
    process.exit(1)
  } finally {
    await sequelize.close()
  }
}

runSeed()