export const createEventState={
    name: '',
    location: '',
    description: '',
    showStartDateModel: false,
    showEndDateModel: false,
    showEndTimeModel: false,
    start_date: false,
    StartDate:'',
    showStartTimeModel: false,
    end_date: false,
    EndDate:'',

    start_time: '',
    selectedStartTime:'',
    end_time: '',
    selectedEndTime:'',
    user: "",
    first_name: "",
    last_name: "",
    email: "",
    dob: "",
    gender: "",
    about: "",
    token: '',
    avatarImage: {},
    coverImage: {},
    show: false,
    submit: false,
    loading: false,
    eventNameError:false,
    locationError:false,
    startDateError:false,
    startTimeError:false,
    endDateError:false,
    endTimeError:false,
    descriptionError:false,
    imageError:false,
 
    newdate: new Date(new Date().getTime() - 410240376000),
    date: new Date(new Date().getTime() - 410240376000),
}