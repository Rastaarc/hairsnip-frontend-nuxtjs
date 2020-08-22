export const state = () => ({
  formRules: {
    usertypeRules: [(v) => !!v || 'User Type is required'],
    fullNameRules: [
      (v) => !!v || 'Full name is required',
      (v) => v.length <= 60 || 'Maximum length is 50',
    ],
    emailRules: [
      (v) => !!v || 'Email is required',
      (v) => /.+@.+/.test(v) || 'Email must be valid',
    ],
    phoneRules: [
      (v) => !!v || 'Phone number is required',
      (v) => /0[789][01]\d{8}/.test(v) || 'Please enter a valid Nigeria mobile',
      (v) => v.length <= 11 || 'Please enter a valid Nigeria mobile',
    ],
    usernameRules: [
      (v) => !!v || 'Username is required',
      (v) => v.length <= 15 || 'Maximum length is 15',
    ],
    passwordRules: [
      (v) => !!v || 'Password is required',
      (v) => v.length <= 32 || 'Maximum length is 32',
    ],
    passwordRules2: [(v) => v.length <= 32 || 'Maximum length is 32'],
    aboutRules: [(v) => v.length <= 250 || 'Maximum length is 250'],
    snipNameRules: [
      (v) => !!v || 'Name is required',
      (v) => v.length <= 30 || 'Maximum length is 30',
    ],
    snipPriceRules: [
      (v) => !!v || 'Price is required',
      (v) => /\d{3,30}/.test(v) || 'Please enter a valid price',
    ],
    snipDescRules: [
      (v) => !!v || 'Description is required',
      (v) => v.length <= 250 || 'Maximum length is 250',
    ],
  },
})
