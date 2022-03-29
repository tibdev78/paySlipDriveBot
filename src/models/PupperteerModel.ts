type InputParameters = {
    usernameTag: InputObjectParameters;
    passwordTag: InputObjectParameters;
    buttonTag: InputObjectParameters;
    delay?: number;
    waitSelectorName: string;
}

type InputObjectParameters = {
    name: string;
    value?: string
}

export { InputParameters }