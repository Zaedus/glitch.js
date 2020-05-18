import { UserProps, Permission } from "./PublicInterfaces"

import { EventEmitter } from "events";
import axios from "axios";
import { Project } from "./Project";

function updateClass(project: User, data: UserProps) : void {
    function propsToDate(props: string[], path?: string) : void {
        for(let prop of props) {
            if(typeof prop == "string") {
                if(props[path]) project[String(path)][String(prop)] = new Date(project[String(path)][String(prop)]);
                else project[String(prop)] = new Date(project[String(prop)]);
            }
        }
    }
    if(!(data instanceof Object)) throw new Error("Reload failed.")
    const emailEntries = Object.entries(data);
    // Set properties of class
    for(let x: number = 0; x < emailEntries.length; x++) {
        project[emailEntries[x][0]] = emailEntries[x][1];
    }

    // Make date strings dates
    propsToDate([
        "createdAt",
        "updatedAt"
    ])
}


export class User extends EventEmitter implements UserProps {
    isSupport:            boolean;
    isInfrastructureUser: boolean;
    id:                   number;
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
    features:             any[];
    permission:           Permission;

    constructor(data?: UserProps) {
        super();
        if(typeof data == "object") updateClass(this, data);
    }
    find(type: "id" | "login", value: string) {
        return new Promise((res, rej) => {
            if(type != "id" && type != "login") rej(new Error("Invalid value for argument 'type'."));

            axios.get(`https://api.glitch.com/v1/users/by/${type}?${type}=${value}`).catch(e => {
                rej(e);
            }).then(login => {
                if(!login) return rej("Request failed.");
                updateClass(this, login.data[value]);
                this.emit("ready");
                res();
            });
            
        })
        
    }
    getProjects(amount?: number) : Promise<Project[]> {
        return new Promise(async (res, rej) => {
            if(!amount) amount = 50;
            const projects: Project[] = [];
    
            let url = `https://api.glitch.com/v1/users/by/id/projects?id=${this.id}&limit=${amount > 100 ? 100 : amount}&orderKey=createdAt&orderDirection=DESC`
    
            for(let a = 0; a < Math.ceil(amount / 100); a++) {
                if(url == null) continue;
                const req = await axios.get(url).catch(e => {
                    rej(e);
                });
                if(!req) {
                    rej("Request failed.");
                    continue;
                }  
                for(let project of req.data.items) {
                    projects.push(new Project(project));
                }
                if(req.data.hasMore) {
                    url = `https://api.glitch.com${req.data.nextPage}`
                } else url = null;
                amount -= 100;
            }
            res(projects)
        })
    }
}