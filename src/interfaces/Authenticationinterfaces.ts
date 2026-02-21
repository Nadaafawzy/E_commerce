export interface successLogin{
   message: string
   token: string
   user: UserInterface
}

export interface failedLogin{
   message: string
   statusMsg: string
}

export interface UserInterface {
    name: string
    email: string
    role: string
}