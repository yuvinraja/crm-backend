// Batch delivery updater for communication logs
const CommunicationLog = require('../models/CommunicationLog');

// In-memory queue for batch updates
const deliveryQueue = [];

// Add delivery update to queue
function queueDeliveryUpdate({ logId, deliveryStatus, vendorResponse }) {
  deliveryQueue.push({ logId, deliveryStatus, vendorResponse });
}

// Process queue in batches every 5 seconds
setInterval(async () => {
  if (deliveryQueue.length === 0) return;
  const batch = deliveryQueue.splice(0, deliveryQueue.length);
  const bulkOps = batch.map(({ logId, deliveryStatus, vendorResponse }) => ({
    updateOne: {
      filter: { _id: logId },
      update: {
        deliveryStatus,
        vendorResponse,
        deliveredAt: deliveryStatus === 'SENT' ? new Date() : undefined,
      },
    },
  }));
  if (bulkOps.length > 0) {
    await CommunicationLog.bulkWrite(bulkOps);
  }
}, 5000);

module.exports = { queueDeliveryUpdate };
