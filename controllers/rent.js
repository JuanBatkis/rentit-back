const Rent = require("../models/Rent")
const mercadopago = require("../config/mercadopago")

exports.getAllUserRents = async (req, res) => {
  const { role } = req.params
  let rents

  if (role === 'renter') {
    rents = await Rent
      .find({$and: [{'renter': req.user._id}, {status: {$ne: 'pending'}}]})
      .populate("product","name images")
      .populate("owner","email firstName lastName storeName phone rating location")
      .populate("renter","email firstName lastName storeName phone rating")
  } else {
    rents = await Rent
      .find({$and: [{'owner': req.user._id}, {status: {$ne: 'pending'}}]})
      .populate("product","name images")
      .populate("owner","email firstName lastName storeName phone rating location")
      .populate("renter","email firstName lastName storeName phone rating")
  }
  res.status(200).json({ rents })
}

exports.getRentById = async (req, res) => {
  const { rentId } = req.params

  const rent = await Rent.findById(rentId)
    .populate("owner","email firstName lastName storeName phone location")
    .populate("product","name images")
  res.status(200).json(rent)
}

exports.getRentPreference = async (req, res) => {
  const { productId, productName, total, time } = req.body

  const title = `${productName} for ${time}`
  const baseUrl = (process.env.ENV === 'development' ? 'http://localhost:3000' : 'https://rentit-project.herokuapp.com')

  let preference = {
    items: [
      {
        id: productId,
        title,
        unit_price: Number(total),
        quantity: 1
      }
    ],
    "payment_methods": {
      "excluded_payment_types": [
          {
              "id": "ticket"
          }
      ],
      "installments": 1
    },
    "statement_descriptor": "RENTIT",
    notification_url: "https://webhook.site/1797d8db-4b84-4e9c-b608-0c12485f61aa",
    back_urls: {
      success: `${baseUrl}/success`,
      failure: `${baseUrl}/failure`,
      pending: `${baseUrl}/pending`
    }
  }

  const response = await mercadopago.preferences.create(preference)

  res.status(201).json({preferenceId: response.body.id})
}

exports.createRent = async (req, res) => {
  const { product, owner, total, rentedFrom, rentedTo, type, preferenceId } = req.body

  const rent = await Rent.create({
    product,
    owner,
    renter: req.user._id,
    total,
    rentedFrom,
    rentedTo,
    type,
    preferenceId
  })

  res.status(201).json(rent)
}

exports.updateRent = async (req, res) => {
  const { preferenceId, status } = req.body

  const rent = await Rent.findOneAndUpdate(
    {preferenceId},
    { $set: { status } },
    { new: true }
  ).populate("product","name")

  res.status(200).json(rent)
}