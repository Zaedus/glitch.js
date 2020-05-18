import { User } from "./User"

// User

export interface UserProps {
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
}

export interface Permission {
    userId:         number;
    projectId:      string;
    accessLevel:    number;
    userLastAccess: string;
    createdAt:      Date;
    updatedAt:      Date;
}

// Project

export interface ProjectProps {
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
}

export interface ProjectPermission {
    userId:      number;
    accessLevel: number;
}

export interface ProjectPermission {
    userId:      number;
    projectId:   string;
    accessLevel: number;
    lastAccess:  string;
    createdAt:   string;
    updatedAt:   string;
}
