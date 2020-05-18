import { TypeErr } from "./g-utils/errors"

export { OwnedUser as Me} from "./g-classes/Owned/OwnedUser"
import { Project } from "./g-classes/Public/Project"

import axios from "axios"
import { User } from "./g-classes/Public/User"

interface AnonResponse {
    persistentToken: string;
}
interface EmailResponse {
    status: number,
    message: string
}
export function emailTempCode(email: string): Promise<EmailResponse> {
    return new Promise<EmailResponse>(async (res, rej) => { 
        if(typeof email != "string") throw TypeErr("email", "string", typeof email);
        axios.post<AnonResponse>("https://api.glitch.com/v1/users/anon").then(anon => {
            axios.post("https://api.glitch.com/email/sendLoginEmail", {
                emailAddress: email
            }, {
                headers: {
                    Authorization: anon.data.persistentToken
                }
            })
            .then(d => res({
                status: d.status,
                message: d.statusText
            }))
            .catch(d => rej({
                status: d.response.status,
                message: d.response.statusText
            }))
        }).catch(d => rej({
            status: d.response.status,
            message: d.response.statusText
        }));
    })
}

export function getProject(type: "id" | "domain", value: string) {
    return new Promise<Project>((res, rej) => {
        const proj = new Project();

        proj.on("ready", () => {
            res(proj);
        });
        proj.find(type, value).catch(rej);
    })
}

export function getUser(type: "id" | "login", value: string) {
    return new Promise<User>((res, rej) => {
        const usr = new User();

        usr.on("ready", () => {
            res(usr);
        })
        usr.find(type, value).catch(rej);
    })
}

