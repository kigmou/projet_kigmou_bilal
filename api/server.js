const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = process.env.PORT || 3000;
const sequelize = new Sequelize({ dialect: 'sqlite', storage: process.env.DB_PATH || 'ecosignal.sqlite', logging: false });

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false, validate: { len: [6, 255] } }
});
const Pollution = sequelize.define('Pollution', {
  title: { type: DataTypes.STRING, allowNull: false }, type: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false }, observationDate: { type: DataTypes.DATEONLY, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false }, latitude: { type: DataTypes.FLOAT, allowNull: false },
  longitude: { type: DataTypes.FLOAT, allowNull: false }, photoUrl: { type: DataTypes.STRING, allowNull: false, defaultValue: '' }
});

app.use(cors());
app.use(express.json());
const cleanUser = ({ id, name, email, createdAt }) => ({ id, name, email, createdAt });
const handle = (fn) => (req, res) => Promise.resolve(fn(req, res)).catch((error) => res.status(400).json({ error: error.message }));

app.post('/api/users', handle(async (req, res) => res.status(201).json(cleanUser(await User.create(req.body)))));
app.get('/api/users', handle(async (_req, res) => res.json((await User.findAll({ order: [['createdAt', 'DESC']] })).map(cleanUser))));
app.delete('/api/users/:id', handle(async (req, res) => { const count = await User.destroy({ where: { id: req.params.id } }); return count ? res.status(204).send() : res.status(404).json({ error: 'Utilisateur introuvable' }); }));
app.get('/api/pollutions', handle(async (_req, res) => res.json(await Pollution.findAll({ order: [['createdAt', 'DESC']] }))));
app.get('/api/pollutions/:id', handle(async (req, res) => { const item = await Pollution.findByPk(req.params.id); return item ? res.json(item) : res.status(404).json({ error: 'Pollution introuvable' }); }));
app.post('/api/pollutions', handle(async (req, res) => res.status(201).json(await Pollution.create(req.body))));
app.put('/api/pollutions/:id', handle(async (req, res) => { const item = await Pollution.findByPk(req.params.id); if (!item) return res.status(404).json({ error: 'Pollution introuvable' }); return res.json(await item.update(req.body)); }));
app.delete('/api/pollutions/:id', handle(async (req, res) => { const count = await Pollution.destroy({ where: { id: req.params.id } }); return count ? res.status(204).send() : res.status(404).json({ error: 'Pollution introuvable' }); }));

sequelize.sync().then(() => app.listen(port, () => console.log(`ÉcoSignal API listening on ${port}`))).catch((error) => { console.error(error); process.exit(1); });
