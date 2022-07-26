module.exports = Object.freeze({
  // models' constants start
  enumGender: ['Female', 'Male', 'Prefer not to say', 'Other'],
  enumNationality: [
    'Afghanistan',
    'Iran',
    'Iraq',
    'Syria',
    'Turkey',
    'Ukraine',
    'Other',
  ],
  enumReportStatus: ['Pending', 'Resolved'],
  enumProvider: ['Local', 'Google', 'Facebook'],
  enumCategory: [
    'Books',
    'Clothing',
    'Electronics',
    'Food',
    'Furniture',
    'Kitchenware',
    'Linens',
    'Toys',
    'Other',
  ],
  enumRequestStatus: ['Requested', 'Confirmed', 'Rejected'],
  enumProductCondition: ['New', 'Underused', 'Overused'],
  enumShippingOptions: [
    'Meet up',
    'Drop off',
    'Free shipping',
    'Paid shipping',
    'To be determined',
  ],
  enumPostType: ['Request', 'Donate'],
  enumPostStatus: ['Published', 'Verified'],
  // models' constants end
});
