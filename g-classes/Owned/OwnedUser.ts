import axios from "axios";
import { EventEmitter } from 'events';

import { TypeErr } from "../../g-utils/errors"

import { OwnedUserProps, Feature, UpdateParams, ProjectUpdate } from "./OwnedInterfaces"
import { OwnedProject } from "./OwnedProject"

function updateClass(user: OwnedUser, data: OwnedUserProps) : void {
    const emailEntries = Object.entries(data);
    
    // Set properties of class
    for(let x: number = 0; x < emailEntries.length; x++) {
        user[emailEntries[x][0]] = emailEntries[x][1];
    }

    // Make date strings dates
    if(typeof user.createdAt == "string") user.createdAt = new Date(user.createdAt);
    if(typeof user.updatedAt == "string") user.updatedAt = new Date(user.updatedAt);

    for(let i: number = 0; i < user.features.length; i++) {
        if(typeof user.features[i].expiresAt == "string") user.features[i].expiresAt = new Date(user.features[i].expiresAt);
    }
}
export class OwnedUser extends EventEmitter implements OwnedUserProps {
    isSupport:            boolean;
    isInfrastructureUser: boolean;
    id:                   number;
    githubId:             number;
    githubToken:          string;
    facebookId:           string;
    facebookToken:        string;
    googleId:             string;
    googleToken:          string;
    slackId:              string;
    slackToken:           string;
    slackTeamId:          string;
    persistentToken:      string;
    avatarUrl:            string;
    avatarThumbnailUrl:   string;
    login:                string;
    name:                 string;
    location:             null;
    color:                string;
    description:          string;
    hasCoverImage:        boolean;
    coverColor:           string;
    thanksCount:          number;
    utcOffset:            number;
    featuredProjectId:    string;
    createdAt:            Date;
    updatedAt:            Date;
    twoFactorEnabled:     boolean;
    accountLocked:        boolean;
    loginAttempts:        number;
    passwordEnabled:      boolean;
    features:             Feature[];
    constructor(object?: OwnedUserProps) {
        super()
        if(object) updateClass(this, object);
    }
    update(options: null | UpdateParams = null) : Promise<OwnedUser> {
        return new Promise((res, rej) => {
            if(typeof options != "object") rej(TypeErr("options", "object", typeof options));
            if(Object.keys(options).length == 0) rej(new Error(`Argument "options" object empty.`));
            if(typeof options.avatarUrl == "string" && typeof options.color != "string") options.color = this.color;
            axios.patch(`https://api.glitch.com/v1/users/${this.id}`, options,
            {
                headers: { Authorization: this.persistentToken }
            })
            .catch(e => {
                throw e;
            })
            .then(req => {
                if(!req) return rej("Request failed!");
                updateClass(this, req.data);
                res(this);
            })
        })
    }
    setName(arg: string) {
        return new Promise((res, rej) => {
            if(typeof arg != "string") rej(TypeErr("arg", "string", typeof arg));
            this.update({name: arg})
            .catch(e => rej(e))
            .then(d => res(d))
        })
    }
    
    setDescription(arg: string) {
        return new Promise((res, rej) => {
            if(typeof arg != "string") rej(TypeErr("arg", "string", typeof arg));
            this.update({description: arg})
            .catch(e => rej(e))
            .then(d => res(d))
        })
    }

    setLogin(arg: string) {
        return new Promise((res, rej) => {
            if(typeof arg != "string") rej(TypeErr("arg", "string", typeof arg));
            this.update({login: arg})
            .catch(e => rej(e))
            .then(d => res(d))
        })
    }

    setAvatar(arg: string) {
        return new Promise((res, rej) => {
            if(typeof arg != "string") rej(TypeErr("arg", "string", typeof arg));
            this.update({avatarUrl: arg})
            .catch(e => rej(e))
            .then(d => res(d))
        })
    }
    setColor(arg: string) {
        return new Promise((res, rej) => {
            if(typeof arg != "string") rej(TypeErr("arg", "string", typeof arg));
            this.update({color: arg})
            .catch(e => rej(e))
            .then(d => res(d))
        })
    }
    signin(tempcode: string) {
        return new Promise((res, rej) => {
            if(typeof tempcode != "string") throw TypeErr("tempcode", "string", typeof tempcode);
            axios.post(`https://api.glitch.com/v1/auth/email/${tempcode}`).then(login => {
                const email: OwnedUserProps = login.data.user;
                updateClass(this, email);
                res();
                // Let them know that the code is done running
                this.emit("ready");
            })
            .catch(e => {
                if(!e.response) rej(new Error("Request failed."))
                if(e.response.status == 404) rej(new Error("Invalid login code."));
                rej(e);
            })
        })
    }
    remix(base: string, options?: ProjectUpdate) : Promise<OwnedProject> {
        return new Promise<OwnedProject>((res, rej) => {
            axios.post(`https://api.glitch.com/v1/projects/by/domain/${base}/remix`, {
                base, 
                env: {}
            }, {
                headers: { Authorization: this.persistentToken }
            })
            .catch(e => {
                rej(e);
            })
            .then(req => {
                if(!req) return rej("Request failed.");
                try {
                    const Proj = new OwnedProject(this);
                    Proj.on("ready", async () => {
                        if(typeof options == "object" && options != undefined && options != null) await Proj.update(options);
                        res(Proj)
                    });
                    Proj.find(req.data.id);
                } catch (err) {
                    rej(err);
                }
            })
        })
    }
    getProjects(amount?: number) : Promise<OwnedProject[]> {
        return new Promise<OwnedProject[]>(async (res, rej) => {
            if(!amount) amount = 50;
            const projects: OwnedProject[] = [];
    
            let url = `https://api.glitch.com/v1/users/by/id/projects?id=${this.id}&limit=${amount > 100 ? 100 : amount}&orderKey=createdAt&orderDirection=DESC`
    
            for(let a = 0; a < Math.ceil(amount / 100); a++) {
                if(url == null) continue;
                const req = await axios.get(url, {
                    headers: { Authorization: this.persistentToken }
                }).catch(e => {
                    rej(e);
                });
                if(!req) return rej("Request Failed.");
                for(let project of req.data.items) {
                    projects.push(new OwnedProject(this, project));
                }
                if(req.data.hasMore) {
                    url = `https://api.glitch.com${req.data.nextPage}`
                } else url = null;
                amount -= 100;
            }
            res(projects);
        })
    }
    /*async import(github: string, options: ProjectUpdate) {
        const proj = await this.remix("empty-glitch", options);
        const req = await axios.post(`https://api.glitch.com/project/githubImport?projectId=${proj.id}&repo=${github}`)
        .catch(e => {
            throw e.response.data;
        })
        console.log(req);
    }*/
}