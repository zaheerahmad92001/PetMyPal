import * as yup from 'yup';
const eventDetails = yup.object().shape({
  EventName: yup
    .string()
    .matches(/^([a-z\s])+([0-9a-z\s]+)$/i, "Only alphanumeric are allowed for this field.")
    .required('Event Name is required.').test(
      "maxDigits",
      "Event name must contain at least 10 characters.",
      (name) => (name != undefined && name.length > 9)
    ),
  EventDescripton: yup
    .string()
    .required('Event Description is required.').test(
      "maxDigits",
      "Event description must contain at least 10 characters.",
      (name) => (name != undefined && name.length > 9)
    ),
  EventLocation: yup.string()
    .required('Location is requried'),
  StartDate: yup.string()
    .required('Start Date is required.'),
  EndDate: yup.string()
    .required('End Date is required.'),
  StartTime: yup.string()
    .required('Start Time is required.'),
  EndTime: yup.string()
    .required('End Time is required.'),
  EventImage: yup.string()
    .required('Please select cover photo.')

})
export { eventDetails };