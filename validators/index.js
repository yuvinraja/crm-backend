// Export all validators
const userValidator = require('./userValidator');
const customerValidator = require('./customerValidator');
const orderValidator = require('./orderValidator');
const campaignValidator = require('./campaignValidator');
const segmentValidator = require('./segmentValidator');
const communicationLogValidator = require('./communicationLogValidator');

module.exports = {
  userValidator,
  customerValidator,
  orderValidator,
  campaignValidator,
  segmentValidator,
  communicationLogValidator,
};
