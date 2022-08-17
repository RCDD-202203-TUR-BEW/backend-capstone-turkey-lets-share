/* eslint-disable no-useless-escape */
/* eslint-disable prefer-regex-literals */
module.exports = Object.freeze({
  DEFAULT_PROFILE_PHOTO:
    'https://drive.google.com/uc?export=view&id=1fo02qBRCULoA2bnGigdmVKruGoHrfuFe',
  ENUM_GENDER: ['Female', 'Male', 'Prefer not to say', 'Other'],
  ENUM_NATIONALITY: [
    'Afghanistan',
    'Iran',
    'Iraq',
    'Syria',
    'Turkey',
    'Ukraine',
    'Other',
  ],
  ENUM_REPORT_STATUS: ['Pending', 'Resolved'],
  ENUM_PROVIDER: ['Local', 'Google', 'Facebook'],
  ENUM_CATEGORY: [
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
  ENUM_PRODUCT_CONDITION: ['New', 'Underused', 'Overused'],
  ENUM_SHIPPING_OPTION: [
    'Meet up',
    'Drop off',
    'Free shipping',
    'Paid shipping',
    'To be determined',
  ],
  ENUM_POST_TYPE: ['Request', 'Donate'],

  AGE_REGEX: new RegExp(/^[1-9]{1}\d{1}$/),

  ZIP_REGEX: new RegExp(/^\d{5}(?:[-\s]\d{4})?$/),
  PASSWORD_REGEX: new RegExp(
    /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{7,}$/
  ),
  NAME_REGEX: new RegExp(/^$|\s+/),
  EMPTY_PRODUCT_REGEX: new RegExp(/(.|\s)*\S(.|\s)*/),
  EMAIL_REGEX: new RegExp(
    /^[a-zA-Z0-9-_.]+@[a-z]+\.[a-z]{2,15}(\.[a-z]{2,3})?(\.[a-z]{2,3})?$/
  ),
  USERNAME_REGEX: new RegExp(/^[a-zA-Z0-9\-_.]{2,20}$/),
  PHONE_NUMBER_REGEX: new RegExp(/^[+]?[0-9]{1,3}[-\s]?[0-9]{1,3}[0-9]{4,9}$/),

  PASSWORD_ERROR: `<ul>
    <li>At least one upper case letter</li>
    <li>At least one lower case letter</li>
    <li>At least one number</li>
    <li>At least one special character</li>
    <li>Minimum eight characters</li>
    <li>Can not contain spaces</li>
  </ul>`,
  USERNAME_ERROR: `<ul>
    <li>Must be between 2 and 20 characters long</li>
    <li>Can only contain letters, numbers, periods (.), underscores (_), and dashes (-)</li>
  </ul>`,
  PHONE_NUMBER_ERROR: `<ul>
    <li>Please include your country code and enter a valid phone number</li>
    <li>Can include a space or a dash (-) after country code</li>
    <li>Can be in the format "+90 1234567890" or "901234567890"</li>
  </ul>`,

  PUBLIC_AUTH_ROUTES: [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/google',
    '/api/auth/google/callback',
    '/api/auth/facebook',
    '/api/auth/facebook/callback',
  ],
  PUBLIC_ROUTES: [
    { methods: ['GET'], url: '/' },
    { methods: ['GET'], url: '/api/' },
    { methods: ['GET'], url: '/api/product' },
    { methods: ['GET'], url: /^\/api\/product\/(?:([^\/]+?))\/?$/i }, // '/api/product/:id'
    {
      methods: ['GET'],
      url: /^\/api\/user\/(?:([^\/]+?))\/products\/?$/i, // '/api/user/:userId/products'
    },
  ],
  PRIVATE_ROUTES: [
    { methods: ['POST'], url: '/api/product' },
    { methods: ['POST'], url: '/api/auth/logout' },
    { methods: ['PUT'], url: /^\/api\/product\/(?:([^\/]+?))\/?$/i }, // /api/product/:id
    { methods: ['DELETE'], url: /^\/api\/product\/(?:([^\/]+?))\/?$/i }, // /api/product/:id
    { methods: ['GET'], url: '/api/auth/profile' },
    { methods: ['GET'], url: '/api/auth/logout' },
  ],

  VALID_PRODUCT_KEYS: [
    'title',
    'description',
    'photos',
    'category',
    'location',
    'productCondition',
    'shippingOptions',
    'postType',
  ],
  TOKEN_EXPIRATION_DURATION: '14d',
  COOKIE_MAX_AGE: 1000 * 60 * 60 * 24 * 14,
  POST_TYPE_SELECTOR: {
    Donated: { postType: 'Donate' },
    Requested: { postType: 'Request', isTransactionCompleted: false },
    Received: { postType: 'Request', isTransactionCompleted: true },
  },
  SWAGGER_OPTIONS: {
    definition: {
      openapi: '3.0.0',
      info: {
        title: "Let's Share API with Swagger",
        version: '0.1.0',
        description: "Let's Share API documentation with Swagger",
        license: {
          name: 'MIT',
          url: 'https://github.com/RCDD-202203-TUR-BEW/backend-capstone-turkey-lets-share',
        },
      },
      servers: [
        {
          url: process.env.BASE_URL,
        },
      ],
      url: process.env.BASE_URL,
    },
    apis: ['./src/docs/**/*.yaml'],
  },
});
