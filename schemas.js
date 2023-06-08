const Joi = require('joi');


module.exports.locationSchema = Joi.object({
    foodlocation: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        // image: Joi.string().required(),
        description: Joi.string().required(),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object ({
      rating: Joi.string().required(),
      body: Joi.string().required(),  
    }).required()
})