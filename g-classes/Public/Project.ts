import axios from "axios";
import { EventEmitter } from "events";

import { TypeErr } from "../../g-utils/errors";

import { ProjectProps, ProjectPermission, UserProps } from "./PublicInterfaces";
import { User } from "./User";

function updateClass(project: Project, data: ProjectProps) : void {
    function propsToDate(props: string[], path?: string) : void {
        for(let prop of props) {
            if(typeof prop == "string") {
                if(props[path]) project[String(path)][String(prop)] = new Date(project[String(path)][String(prop)]);
                else project[String(prop)] = new Date(project[String(prop)]);
            }
        }
    }
    const emailEntries = Object.entries(data);
    // Set properties of class
    for(let x: number = 0; x < emailEntries.length; x++) {
        project[emailEntries[x][0]] = emailEntries[x][1];
    }

    // Make date strings dates
    propsToDate([
        "createdAt",
        "updatedAt",
        "deletedAt",
        "lastAccess",
        "avatarUpdatedAt",
        "archivedAt"
    ])
}
export class Project extends EventEmitter implements ProjectProps {
    id:               string;
    description:      string;
    domain:           string;
    baseId:           string;
    private:          boolean;
    createdAt:        Date;
    updatedAt:        Date;
    deletedAt:        Date;
    suspendedReason:  string;
    lastAccess:       Date;
    avatarUpdatedAt:  Date;
    showAsGlitchTeam: boolean;
    isEmbedOnly:      boolean;
    notSafeForKids:   boolean;
    archivedAt:       Date;
    users:            User[];
    teams:            any[];

    constructor(data?: ProjectProps) {
        super();
        if(typeof data == "object") updateClass(this, data);
    }

    find(type: "id" | "domain", value: string) {
        return new Promise(async (res, rej) => {
            var id = value;
            if(type == "domain") {
                const nameReq = await axios.get(`https://api.glitch.com/v1/projects/by/domain?domain=${value}&limit=1&orderKey=createdAt&orderDirection=DESC`)
                .catch(e => {
                    rej(e);
                })
                if(!nameReq) return rej("Request failed.");
                if(!nameReq.data[value]) return rej("Invalid domain name.");
                id = nameReq.data[value].id;
            } else if(type != "id" && type != "domain") rej("Invalid id parameter.");
    
            const req = await axios.get<ProjectProps>(`https://api.glitch.com/projects/${id}`).catch(e => {
                rej(e);
            })
            if(!req) return rej("Request failed.");
            var data = req.data;
            for(let a = 0; a < req.data.users.length; a++) {
                data.users[a] = new User(data.users[a]);
            }
            updateClass(this, req.data); 
            this.emit("ready");
            res();
        })
    }
}