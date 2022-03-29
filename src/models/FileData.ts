type DriveData = {
    paySlipInDrive: Array<PaySlipInDrive>
}

type PaySlipInDrive = {
    link: string;
    filename: string;
    period: string;
}

export { DriveData, PaySlipInDrive }