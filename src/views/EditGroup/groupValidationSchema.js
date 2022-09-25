import * as yup from 'yup';

const groupDetails = yup.object().shape({
    CommunityName: yup
    .string()
    .matches(/^([a-z\s])+([0-9a-z\s]+)$/i, "Only alphanumeric are allowed for this field.")
    .required('Community Name is required.').test(
      "maxDigits",
      "Community name is required between 5 and 32 characters.",
      (name) => (name != undefined && name.length>5 &&name.length<32)
    ),
  About: yup
  .string().
  test(
    "maxDigits",
    "About must be between 10 and 200 characters.",
    (about) => (about != undefined && about.length>10 &&about.length<200)),
  PetCategory: yup
    .string()
    .required('Pet Category is required.'),

    })


export { groupDetails };