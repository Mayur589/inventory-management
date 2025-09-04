// validate.middleware.js
import Joi from 'joi';

const itemSchema = Joi.object({
     item_name: Joi.string().trim().required(),
     default_cost_price: Joi.number().positive().required(),
     default_selling_price: Joi.number().positive().required(),
     items_per_box: Joi.number().integer().min(0).optional()
});


export function validateItem(req, res, next) {
     console.log(req.body, req.validatedBody)
     const { error, value } = itemSchema.validate(req.body, { abortEarly: false });

     if (error) {
          return res.status(400).json({
               status: false,
               message: 'Validation error',
               details: error.details.map(d => d.message)
          });
     }

     // Attach the validated payload
     req.validatedBody = value;
     next();
}

export const transactionSchema = Joi.object({
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
  session: Joi.string().valid("morning", "afternoon").required(),

  items: Joi.array().items(
    Joi.object({
      item_id: Joi.string().required(),
      item_name: Joi.string().required(),
      cost_price: Joi.number().positive().required(),
      sell_price: Joi.number().positive().required(),
      quantity: Joi.number().integer().min(0).default(0)
    })
  ).default([])
});

export function validateTransaction(req, res, next) {
     console.log(req.body, req.validatedBody)
     const { error, value } = transactionSchema.validate(
          req.body,
          {
               abortEarly: false
          }
     );

     if (error) {
          return res.status(400).json({
               status: false,
               message: 'Validation error',
               details: error.details.map(d => d.message)
          });
     }

     req.validatedBody = value;
     next();
}